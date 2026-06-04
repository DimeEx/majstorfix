import Link from "next/link";
import { Wrench, Search, Star, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-20 text-center sm:py-28 overflow-hidden">
        {/* Decorative background illustration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <svg
            className="w-full max-w-[800px] h-auto opacity-[0.04] dark:opacity-[0.06]"
            viewBox="0 0 800 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="currentColor" strokeWidth="1" fill="none">
              <circle cx="150" cy="180" r="60" />
              <circle cx="150" cy="180" r="40" />
              <circle cx="150" cy="180" r="20" />
              <line x1="150" y1="120" x2="150" y2="80" />
              <line x1="150" y1="240" x2="150" y2="280" />
              <line x1="90" y1="180" x2="50" y2="180" />
              <line x1="210" y1="180" x2="250" y2="180" />
              <rect x="580" y="120" width="120" height="80" rx="8" />
              <rect x="600" y="140" width="80" height="40" rx="4" />
              <circle cx="640" cy="160" r="10" />
              <line x1="640" y1="200" x2="640" y2="250" />
              <line x1="620" y1="220" x2="600" y2="250" />
              <line x1="660" y1="220" x2="680" y2="250" />
              <path d="M300 400 L350 350 L400 400 L450 350 L500 400" />
              <path d="M320 420 L350 380 L380 420" />
              <path d="M420 420 L450 380 L480 420" />
              <circle cx="680" cy="400" r="50" />
              <circle cx="680" cy="400" r="30" />
              <line x1="680" y1="350" x2="680" y2="300" />
              <line x1="680" y1="450" x2="680" y2="500" />
              <line x1="630" y1="400" x2="580" y2="400" />
              <line x1="730" y1="400" x2="780" y2="400" />
              <line x1="50" y1="420" x2="200" y2="420" />
              <line x1="50" y1="440" x2="200" y2="440" />
              <line x1="50" y1="460" x2="200" y2="460" />
              <rect x="50" y="460" width="150" height="3" />
              <circle cx="100" cy="500" r="8" />
              <circle cx="140" cy="500" r="8" />
              <circle cx="180" cy="500" r="8" />
            </g>
          </svg>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_60%)] opacity-[0.07] pointer-events-none" />
        <h1 className="relative max-w-2xl font-heading text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Најди го вистинскиот мајстор
          <br />
          <span className="text-primary">за твојата поправка</span>
        </h1>
        <p className="relative mt-5 max-w-lg text-lg text-muted-foreground">
          Објави ја твојата поправка, добиј понуди од локални мајстори и избери ја најдобрата.
        </p>
        <div className="relative mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/post-job"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-8 text-base font-medium text-background shadow-lg shadow-foreground/10 transition-all hover:bg-foreground/90 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-px"
          >
            Објави работа
            <Wrench className="h-4 w-4" />
          </Link>
          <Link
            href="/jobs"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-border/50 bg-card px-8 text-base font-medium shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-px"
          >
            <Search className="h-4 w-4" />
            Прегледај работи
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20">
        <h2 className="text-center font-heading text-2xl tracking-tight sm:text-3xl">
          Како функционира?
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: <Wrench className="h-6 w-6" />,
              title: "Објави работа",
              desc: "Опиши го проблемот, додај слики и постави буџет. Бесплатно е.",
            },
            {
              icon: <Search className="h-6 w-6" />,
              title: "Добиј понуди",
              desc: "Локални мајстори ќе ти испратат понуди во рок од неколку часа.",
            },
            {
              icon: <Star className="h-6 w-6" />,
              title: "Избери најдобро",
              desc: "Спореди понуди, провери рејтинзи и избери го вистинскиот мајстор.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                {item.icon}
              </div>
              <h3 className="font-heading text-lg">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16 sm:py-20 border-t border-border/50">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 font-heading text-2xl tracking-tight sm:text-3xl">
            Сигурност и доверба
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Сите мајстори поминуваат низ верификација. Имаш можност да оцениш и да оставиш коментар за завршената работа.
          </p>
        </div>
      </section>
    </div>
  );
}
