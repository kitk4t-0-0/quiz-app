import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(public)/$$")({
  component: NotFoundPage,
});

function NotFoundPage() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-4xl">404 - Page Not Found</h1>
      <p className="text-gray-600 text-lg">
        The page you are looking for does not exist.
      </p>

      <Button onClick={handleGoBack} variant="outline">
        Go Back
      </Button>
    </div>
  );
}
