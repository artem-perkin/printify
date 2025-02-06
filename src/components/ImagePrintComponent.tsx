import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ImageData {
  id: string;
  src: string;
  width: number;
  height: number;
  rotation: number;
}

const A4_WIDTH = 794; // px at 96 DPI
const A4_HEIGHT = 1123; // px at 96 DPI

export default function ImagePrintComponent() {
  const [images, setImages] = useState<ImageData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map((file) => {
        const id = URL.createObjectURL(file);
        return {
          id,
          src: id,
          width: 200,
          height: 200,
          rotation: 0,
        };
      });
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSizeChange = (id: string, delta: number) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, width: img.width + delta, height: img.height + delta } : img
      )
    );
  };

  const handleRotate = (id: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, rotation: img.rotation + 90 } : img))
    );
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Images</title>
          <style>
            .a4-page {
              width: ${A4_WIDTH}px;
              height: ${A4_HEIGHT}px;
              page-break-after: always;
              display: flex;
              flex-wrap: wrap;
              align-content: flex-start;
            }
            img {
              margin: 5px;
            }
          </style>
        </head>
        <body>
    `);

    let currentHeight = 0;
    let pageStarted = false;

    images.forEach((img, _) => {
      if (currentHeight + img.height > A4_HEIGHT || !pageStarted) {
        if (pageStarted) printWindow.document.write('</div>');
        printWindow.document.write('<div class="a4-page">');
        pageStarted = true;
        currentHeight = 0;
      }
      printWindow.document.write(
        `<img src="${img.src}" width="${img.width}" height="${img.height}" style="transform: rotate(${img.rotation}deg);" />`
      );
      currentHeight += img.height;
    });

    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-4">
      <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <div className="flex flex-wrap gap-4 mt-4">
        {images.map((img) => (
          <Card key={img.id} className="p-2">
            <CardContent className="flex flex-col items-center">
              <img
                src={img.src}
                width={img.width}
                height={img.height}
                className="border rounded shadow-sm"
                style={{ transform: `rotate(${img.rotation}deg)` }}
                alt="Preview"
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => handleSizeChange(img.id, 10)}>➕</Button>
                <Button size="sm" onClick={() => handleSizeChange(img.id, -10)}>➖</Button>
                <Button size="sm" onClick={() => handleRotate(img.id)}>🔄</Button>
                <Button size="sm" variant="destructive" onClick={() => handleRemove(img.id)}>❌</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {images.length > 0 && (
        <Button className="mt-4" onClick={handlePrint}>🖨️ Print</Button>
      )}
    </div>
  );
}
