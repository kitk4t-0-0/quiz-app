import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import { LayoutProvider, ThemeProvider } from '@/contexts';
import appCss from '@/styles/global.css?url';

export const Route = createRootRouteWithContext<Record<string, never>>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#ffffff',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
        as: 'style',
        type: 'text/css',
      },
    ],
  }),
  staleTime: Number.POSITIVE_INFINITY,
  shellComponent: ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider>
        <LayoutProvider>
          <ShellComponent>{children}</ShellComponent>
        </LayoutProvider>
      </ThemeProvider>
    );
  },
});

function ShellComponent({ children }: { children: React.ReactNode }) {
  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}

        <Scripts />
      </body>
    </html>
  );
}
