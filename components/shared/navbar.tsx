"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Wrench, LogOut, User, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sidebar-border/50 bg-sidebar/80 backdrop-blur-xl supports-[backdrop-filter]:bg-sidebar/60">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Wrench className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg tracking-tight">MajstorFix</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/jobs"
            className={`inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium shadow-sm transition-all active:translate-y-px ${
              pathname === "/jobs" || pathname.startsWith("/jobs/")
                ? "bg-sidebar-foreground text-sidebar"
                : "bg-sidebar-foreground/10 text-sidebar-foreground hover:bg-sidebar-foreground/15"
            }`}
          >
            Работи
          </Link>
          <Link
            href="/post-job"
            className={`inline-flex h-9 items-center justify-center rounded-lg px-5 text-sm font-medium shadow-sm transition-all active:translate-y-px ${
              pathname === "/post-job"
                ? "bg-sidebar-foreground text-sidebar"
                : "bg-sidebar-foreground/10 text-sidebar-foreground hover:bg-sidebar-foreground/15"
            }`}
          >
            Објави работа
          </Link>
          {loading ? (
            <div className="flex h-8 w-8 items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-1">
              <Link
                href="/dashboard"
                className={`inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium shadow-sm transition-all active:translate-y-px ${
                  pathname === "/dashboard"
                    ? "bg-sidebar-foreground text-sidebar"
                    : "bg-sidebar-foreground/10 text-sidebar-foreground hover:bg-sidebar-foreground/15"
                }`}
              >
                Моите
              </Link>
              <Link
                href="/profile"
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-all active:translate-y-px ${
                  pathname === "/profile"
                    ? "bg-sidebar-foreground text-sidebar"
                    : "bg-sidebar-foreground/10 text-sidebar-foreground hover:bg-sidebar-foreground/15"
                }`}
              >
                <User className="h-4 w-4" />
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-all active:translate-y-px bg-sidebar-foreground/10 text-sidebar-foreground hover:bg-sidebar-foreground/15"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className={`inline-flex h-9 items-center justify-center rounded-lg border px-4 text-sm font-medium shadow-sm transition-all active:translate-y-px ${
                pathname === "/auth/login"
                  ? "border-sidebar-foreground/30 bg-sidebar-foreground text-sidebar"
                  : "border-sidebar-foreground/10 bg-sidebar-foreground/10 text-sidebar-foreground hover:bg-sidebar-foreground/15"
              }`}
            >
              Најави се
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
