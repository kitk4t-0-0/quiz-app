import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { DocxToHtmlConverter } from "@/components/DocxToHtmlConverter";
import Header from "@/components/layout/header";
import { useLayout } from "@/contexts";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/(public)/docxtohtml/")({
  component: DocxToHtmlPage,
  head: () => {
    const seoData = seo({
      title: "DOCX to HTML Converter",
      description: "Upload a document file and convert it to HTML",
    });

    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

function DocxToHtmlPage() {
  const { setHeader, setFooter } = useLayout();

  useEffect(() => {
    setHeader(<Header />);
    setFooter(null);

    return () => {
      setHeader(null);
      setFooter(null);
    };
  }, [setHeader, setFooter]);

  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-bold text-4xl tracking-tight">
            DOCX to HTML Converter
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload a document file (.docx) and convert it to HTML format.
          </p>
        </div>
        <DocxToHtmlConverter />
      </div>
    </div>
  );
}
