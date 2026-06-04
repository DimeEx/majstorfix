import Link from "next/link";
import { Wrench } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
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
            className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Работи
          </Link>
          <Link
            href="/post-job"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-medium text-background shadow-sm hover:bg-foreground/90 transition-all hover:shadow-md active:translate-y-px"
          >
            Објави работа
          </Link>
        </nav>
      </div>
    </header>
  );
}
