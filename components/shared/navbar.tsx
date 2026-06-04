import Link from "next/link";
import { Wrench } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Wrench className="h-5 w-5" />
          <span>MajstorFix</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">
            Работи
          </Link>
          <Link
            href="/post-job"
            className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background shadow hover:bg-foreground/90 transition-colors"
          >
            Објави работа
          </Link>
        </nav>
      </div>
    </header>
  );
}
