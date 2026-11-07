"use server";

import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireReader } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import PasswordReset from "@/models/PasswordReset";
import User from "@/models/User";

const LoginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export async function login(_prev, formData) {
  const parsed = LoginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await connectDB();
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
  const valid = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!valid) return { error: "Invalid email or password" };
  if (user.isActive === false) return { error: "Your account has been deactivated." };

  await createSession({ userId: user.id, role: user.role });
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

const SignupSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(60, "Name is too long"),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Readers sign themselves up. The role is fixed here and never read from the form.
export async function signup(_prev, formData) {
  const parsed = SignupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, email, password } = parsed.data;
  await connectDB();
  let user;
  try {
    user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      role: "reader",
    });
  } catch (e) {
    if (e.code === 11000) return { error: "An account with that email already exists" };
    throw e;
  }

  await createSession({ userId: user.id, role: "reader" });
  redirect("/dashboard");
}

export async function readerLogin(_prev, formData) {
  const parsed = LoginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await connectDB();
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
  const valid = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!valid) return { error: "Invalid email or password" };
  if (user.isActive === false) return { error: "Your account has been deactivated." };
  if (user.role !== "reader") return { error: "Admins sign in at /admin/login" };

  await createSession({ userId: user.id, role: user.role });
  redirect("/dashboard");
}

// The client does a full page load afterwards (see LogoutButton), so no redirect here.
export async function readerLogout() {
  await deleteSession();
}

// ---- Account settings and password recovery (readers only) ----

const NewPassword = z.string().min(8, "Password must be at least 8 characters").max(72, "Password is too long");
const matches = (v) => v.password === v.confirmPassword;
const mismatch = { path: ["confirmPassword"], message: "Passwords do not match" };

const ProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60, "Name is too long"),
});

const ChangePasswordSchema = z
  .object({ currentPassword: z.string().min(1, "Current password is required"), password: NewPassword, confirmPassword: z.string() })
  .refine(matches, mismatch);

const ResetPasswordSchema = z.object({ password: NewPassword, confirmPassword: z.string() }).refine(matches, mismatch);

const ForgotSchema = z.object({ email: z.email("Enter a valid email") });

const RESET_TTL_MS = 30 * 60 * 1000;
const hashToken = (token) => createHash("sha256").update(token).digest("hex");

export async function updateProfile(_prev, formData) {
  const { userId } = await requireReader();
  const parsed = ProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await connectDB();
  await User.findByIdAndUpdate(userId, { name: parsed.data.name });
  revalidatePath("/dashboard", "layout"); // dashboard and settings both show the name
  return { success: "Profile updated" };
}

export async function changePassword(_prev, formData) {
  const { userId } = await requireReader();
  const parsed = ChangePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await connectDB();
  const user = await User.findById(userId);
  if (!user || !(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) {
    return { error: "Current password is incorrect" };
  }
  user.passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await user.save();
  return { success: "Password changed" };
}

export async function requestPasswordReset(_prev, formData) {
  const parsed = ForgotSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await connectDB();
  const user = await User.findOne({ email: parsed.data.email.toLowerCase(), role: "reader", isActive: { $ne: false } });
  if (user) {
    const token = randomBytes(32).toString("base64url");
    await PasswordReset.deleteMany({ userId: user._id });
    await PasswordReset.create({
      userId: user._id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + RESET_TTL_MS),
    });
    if (process.env.NODE_ENV === "production") {
      console.warn("Password reset requested but no mail provider is configured.");
    } else {
      // Dev only: there is no mail provider yet, so print the link instead of emailing it.
      const base = process.env.APP_URL || "http://localhost:3000";
      console.log(`[password reset] ${user.email}: ${base}/reset-password/${token}`);
    }
  }
  // Same response either way so the form cannot be used to discover accounts.
  return { success: "If an account exists for that email, a reset link has been sent." };
}

export async function resetPassword(token, _prev, formData) {
  const parsed = ResetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await connectDB();
  const reset = await PasswordReset.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } });
  if (!reset) return { error: "This reset link is invalid or has expired" };

  const res = await User.updateOne(
    { _id: reset.userId, isActive: { $ne: false } },
    { passwordHash: await bcrypt.hash(parsed.data.password, 12) },
  );
  await PasswordReset.deleteMany({ userId: reset.userId });
  if (!res.matchedCount) return { error: "This account has been deactivated" };
  redirect("/login?reset=1");
}
