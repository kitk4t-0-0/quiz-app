import { useRouter } from "@tanstack/react-router";

interface NotFoundProps {
  error?: unknown;
}

export function NotFound({ error }: NotFoundProps) {
  const router = useRouter();
  const message =
    error instanceof Error
      ? error.message
      : "The page you are looking for does not exist.";

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
      return;
    }

    router.navigate({ to: "/" });
  };

  return (
    <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 py-10 text-center">
      <h1 className="font-bold text-4xl">404 - Page Not Found</h1>
      <p className="text-muted-foreground text-sm">{message}</p>

      <button
        className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 font-medium text-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        onClick={handleGoBack}
        type="button"
      >
        Go back
      </button>
    </main>
  );
}
