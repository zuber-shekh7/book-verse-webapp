"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
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

  await createSession({ userId: user.id, role: user.role });
  redirect("/admin/books");
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
  if (user.role !== "reader") return { error: "Admins sign in at /admin/login" };

  await createSession({ userId: user.id, role: user.role });
  redirect("/dashboard");
}

export async function readerLogout() {
  await deleteSession();
  redirect("/");
}
