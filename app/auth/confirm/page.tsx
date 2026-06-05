export default function ConfirmPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md items-center justify-center px-4 py-12">
      <div className="w-full text-center">
        <h1 className="font-heading text-2xl font-medium">
          Проверете го вашиот email
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Ви испративме линк за потврда на вашата email адреса.
          <br />
          Кликнете на линкот за да го активирате вашиот профил.
        </p>
      </div>
    </div>
  );
}
