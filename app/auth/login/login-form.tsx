"use client";

import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/app/auth/actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return signIn(formData);
    },
    null
  );

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Регистрацијата е успешна. Проверете го вашиот email за потврда.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Е-пошта</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="вашиот@email.com"
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Лозинка</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Најавување...
          </>
        ) : (
          "Најавете се"
        )}
      </Button>
    </form>
  );
}
