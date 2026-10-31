import { login } from "@/actions/auth";
import { LoginForm } from "@/components/admin/forms";

export const metadata = { title: "Admin login | BookVerse" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="mb-6 text-2xl font-bold">Admin login</h1>
      <LoginForm action={login} />
    </div>
  );
}
