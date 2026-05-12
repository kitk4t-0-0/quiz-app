import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DownloadResultButtonProps {
  targetId: string;
  fileName?: string;
}

export function DownloadResultButton({
  targetId,
  fileName = "ket-qua-bai-thi.png",
}: DownloadResultButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error("Element not found");
        return;
      }

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error("Error downloading result:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      size="lg"
      className="w-full md:w-auto"
    >
      <Download className="mr-2 h-5 w-5" />
      {isDownloading ? "Đang tải xuống..." : "Tải Xuống Kết Quả"}
    </Button>
  );
}
