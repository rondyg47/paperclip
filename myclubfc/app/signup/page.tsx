import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "Criar conta" };

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <SignupForm />
    </div>
  );
}
