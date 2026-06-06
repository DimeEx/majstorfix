import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md items-center justify-center px-4 py-12">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-medium">Најавете се</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            За да објавите работа или да понудите услуги
          </p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Немате профил?{" "}
          <Link
            href="/auth/register"
            className="text-foreground hover:text-primary font-medium underline underline-offset-4 transition-colors"
          >
            Регистрирајте се
          </Link>
        </p>
      </div>
    </div>
  );
}
