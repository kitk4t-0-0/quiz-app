import { Download, FileText, Upload, X } from "lucide-react";
import mammoth from "mammoth";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DocxToHtmlConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check if file is a DOCX file
      if (
        !selectedFile.name.endsWith(".docx") &&
        !selectedFile.type.includes("wordprocessingml")
      ) {
        toast.error("Please select a valid DOCX file");
        return;
      }
      setFile(selectedFile);
      setHtmlContent("");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      if (
        !droppedFile.name.endsWith(".docx") &&
        !droppedFile.type.includes("wordprocessingml")
      ) {
        toast.error("Please select a valid DOCX file");
        return;
      }
      setFile(droppedFile);
      setHtmlContent("");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const convertToHtml = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsConverting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          styleMap: [
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
            "p[style-name='Heading 4'] => h4:fresh",
            "p[style-name='Heading 5'] => h5:fresh",
            "p[style-name='Heading 6'] => h6:fresh",
          ],
        },
      );

      setHtmlContent(result.value);

      if (result.messages.length > 0) {
        console.warn("Conversion warnings:", result.messages);
      }

      toast.success("Document converted successfully!");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert document. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadHtml = () => {
    if (!htmlContent) {
      toast.error("No HTML content to download");
      return;
    }

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".docx", "") || "converted"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("HTML file downloaded!");
  };

  const copyToClipboard = () => {
    if (!htmlContent) {
      toast.error("No HTML content to copy");
      return;
    }

    navigator.clipboard.writeText(htmlContent);
    toast.success("HTML copied to clipboard!");
  };

  const clearFile = () => {
    setFile(null);
    setHtmlContent("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Select or drag and drop a DOCX file to convert
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* biome-ignore lint/a11y/useSemanticElements: div required for drag-and-drop file upload functionality */}
          <div
            role="button"
            tabIndex={0}
            className="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-primary/50"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileSelect}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-muted-foreground text-sm">DOCX files only</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={convertToHtml}
              disabled={!file || isConverting}
              className="flex-1"
            >
              {isConverting ? "Converting..." : "Convert to HTML"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {htmlContent && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>HTML Preview</CardTitle>
              <CardDescription>
                Preview of the converted HTML content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm dark:prose-invert max-h-96 max-w-none overflow-auto rounded-lg border bg-background p-6"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: User-uploaded DOCX converted to HTML for preview *
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HTML Source Code</CardTitle>
              <CardDescription>Raw HTML code ready to use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="max-h-96 overflow-auto rounded-lg border bg-muted p-4 text-sm">
                  <code>{htmlContent}</code>
                </pre>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={copyToClipboard} variant="outline">
                  Copy HTML
                </Button>
                <Button onClick={downloadHtml} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download HTML
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
