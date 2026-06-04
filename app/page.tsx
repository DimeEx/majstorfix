import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Најди го вистинскиот мајстор за твојата поправка
      </h1>
      <p className="mt-4 max-w-lg text-lg text-muted-foreground">
        Објави ја твојата поправка, добиј понуди од локални мајстори и избери ја најдобрата.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/post-job"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-foreground px-8 text-base font-medium text-background shadow hover:bg-foreground/90 transition-colors"
        >
          Објави работа
        </Link>
        <Link
          href="/jobs"
          className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-base font-medium shadow-sm hover:bg-accent transition-colors"
        >
          Прегледај работи
        </Link>
      </div>
    </div>
  );
}
