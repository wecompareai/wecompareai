import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register - AI Compare",
  description: "Create an account on AI Compare to write articles and join the conversation.",
};

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/profile");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join AI Compare to write articles and comment.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
