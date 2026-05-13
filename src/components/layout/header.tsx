import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/ui/theme";
import { useTheme } from "@/contexts";

const Header = () => {
  const { setTheme, themeMode } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Glass morphism background */}
      <div className="absolute inset-0 border-border/40 border-b bg-background/70 backdrop-blur-xl" />

      {/* Subtle gradient glow at the top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
      />

      {/* Decorative accent line at bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent"
      />

      <div className="container relative lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            to="/"
            className="font-bold text-xl transition-colors hover:text-primary"
          >
            Quiz App
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/result"
              className="flex items-center gap-2 text-sm transition-colors hover:text-primary"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Lịch Sử Bài Thi</span>
            </Link>

            <Suspense>
              <ThemeToggle setTheme={setTheme} themeMode={themeMode} />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
