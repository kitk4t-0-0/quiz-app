import { useRouter } from '@tanstack/react-router';

interface DefaultCatchBoundaryProps {
  error: unknown;
  reset?: () => void;
}

export function DefaultCatchBoundary({
  error,
  reset,
}: DefaultCatchBoundaryProps) {
  const router = useRouter();
  const message = error instanceof Error ? error.message : 'Unexpected error';
  const isDev = import.meta.env.DEV;

  return (
    <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 py-10 text-center">
      <h1 className="font-semibold text-3xl">Something went wrong</h1>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {reset ? (
          <button
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 font-medium text-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={reset}
            type="button"
          >
            Try again
          </button>
        ) : null}
        <button
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 font-medium text-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={() => router.navigate({ to: '/' })}
          type="button"
        >
          Go home
        </button>
      </div>

      {isDev ? (
        <pre className="mt-4 max-w-2xl overflow-auto rounded-md border border-destructive/40 bg-destructive/5 p-3 text-left text-destructive text-xs">
          {message}
        </pre>
      ) : null}
    </main>
  );
}
