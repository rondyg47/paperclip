import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <LoginForm />
    </div>
  );
}
