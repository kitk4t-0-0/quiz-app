import { createContext, type ReactNode, useContext, useState } from "react";

interface LayoutContextType {
  header: ReactNode | null;
  footer: ReactNode | null;
  setHeader: (header: ReactNode | null) => void;
  setFooter: (footer: ReactNode | null) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<ReactNode | null>(null);
  const [footer, setFooter] = useState<ReactNode | null>(null);

  return (
    <LayoutContext.Provider value={{ header, footer, setHeader, setFooter }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within LayoutProvider");
  }
  return context;
}
