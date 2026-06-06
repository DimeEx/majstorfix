import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md items-center justify-center px-4 py-12">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-medium">
            Регистрирајте се
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Креирајте профил за да објавувате работи или да наддавате
          </p>
        </div>
        <RegisterForm />
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Веќе имате профил?{" "}
          <Link
            href="/auth/login"
            className="text-foreground hover:text-primary font-medium underline underline-offset-4 transition-colors"
          >
            Најавете се
          </Link>
        </p>
      </div>
    </div>
  );
}
