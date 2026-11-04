"use client";

import { Field, FormShell } from "@/components/form-shell";
import { Input } from "@/components/ui/input";

export function SignupForm({ action }) {
  return (
    <FormShell action={action} submitLabel="Create account" pendingLabel="Creating account...">
      <Field label="Name" name="name">
        <Input id="name" name="name" autoComplete="name" maxLength={60} required />
      </Field>
      <Field label="Email" name="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" name="password">
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <Field label="Confirm password" name="confirmPassword">
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
      </Field>
    </FormShell>
  );
}

export function ReaderLoginForm({ action }) {
  return (
    <FormShell action={action} submitLabel="Log in" pendingLabel="Logging in...">
      <Field label="Email" name="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" name="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
    </FormShell>
  );
}

export function ProfileForm({ action, name }) {
  return (
    <FormShell action={action} submitLabel="Save profile">
      <Field label="Name" name="name">
        <Input id="name" name="name" defaultValue={name} autoComplete="name" maxLength={60} required />
      </Field>
    </FormShell>
  );
}

export function ChangePasswordForm({ action }) {
  return (
    <FormShell action={action} submitLabel="Change password" pendingLabel="Changing...">
      <Field label="Current password" name="currentPassword">
        <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
      </Field>
      <Field label="New password" name="password">
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <Field label="Confirm new password" name="confirmPassword">
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
      </Field>
    </FormShell>
  );
}

export function ForgotPasswordForm({ action }) {
  return (
    <FormShell action={action} submitLabel="Send reset link" pendingLabel="Sending...">
      <Field label="Email" name="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
    </FormShell>
  );
}

export function ResetPasswordForm({ action }) {
  return (
    <FormShell action={action} submitLabel="Set new password" pendingLabel="Saving...">
      <Field label="New password" name="password">
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <Field label="Confirm new password" name="confirmPassword">
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
      </Field>
    </FormShell>
  );
}
