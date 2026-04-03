import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login - AI Compare",
  description: "Sign in to AI Compare to write articles and join the conversation.",
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/profile");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your AI Compare account.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
