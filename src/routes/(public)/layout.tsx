import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useLayout } from '@/contexts';

export const Route = createFileRoute('/(public)')({
  component: LayoutComponent,
});

function LayoutComponent() {
  const { header, footer } = useLayout();

  return (
    <>
      {/* Dynamic Header */}
      {header}

      {/* Main Content */}
      <main
        className="container mx-auto flex-1 py-4 sm:py-6 md:py-10 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
        id="main-content"
      >
        <Outlet />
      </main>

      {/* Dynamic Footer */}
      {footer}
    </>
  );
}
