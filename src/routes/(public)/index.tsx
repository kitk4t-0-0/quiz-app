import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(public)/')({
  component: Home,
});

function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="font-bold text-4xl">Hello, World!</h1>
    </div>
  );
}
