import { useCallback, useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { useDropzone } from "react-dropzone";
import { cn } from "./lib/utils";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Frown, Printer, RotateCcw, X } from "lucide-react";
import { Separator } from "./components/ui/separator";

interface ImageFile {
  id: string;
  preview: string;
  file: File;
}

function App() {
  const [images, setImages] = useState<ImageFile[]>([]);

  useEffect(() => {
    console.log(images);
  }, [images]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      id: URL.createObjectURL(file), // Temporary ID for preview
      preview: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "image/*": [] }, // Allow only images
    });

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const resetAll = () => {
    setImages([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="app">
      <div className="max-w-5xl mx-auto px-4 py-4 print:hidden">
        <div className="text-center mb-4 font-extrabold text-2xl">PRINTIFY</div>
        <div className="space-y-4">
          {/* Dropzone area */}
          <div
            {...getRootProps()}
            className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed p-2 md:p-4 lg:p-6 rounded-lg cursor-pointer transition-all mb-4",
              "bg-gray-50 border-gray-300", // Default
              isDragActive && "border-blue-500 bg-blue-100", // Dragging state
              isDragReject && "border-red-500 bg-red-100" // Invalid file state
            )}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600 text-sm md:text-base text-center">
              {isDragActive
                ? "Drop the images here..."
                : "Drag & drop some images here, or click to select images"}
            </p>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <div className="font-medium">
                  Selected images
                  <Badge className="ml-1 ">{images.length}</Badge>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <RotateCcw />
                      Reset All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove all uploaded images. This action cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={resetAll}>
                          Yes, Reset
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {images.map((img) => (
              <Card key={img.id} className="relative group">
                <CardContent className="p-2 flex items-center justify-center">
                  <img
                    src={img.preview}
                    alt="Preview"
                    className="w-full object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {images.length > 0 && (
            <div className="flex justify-center">
              <PrintButton onPrint={handlePrint} />
            </div>
          )}
        </div>
      </div>
      {/* 🖨️ Print Layout - Only Visible in Print Mode */}
      <div className="hidden print:block">
        {Array.from(
          { length: Math.ceil(images.length / 4) },
          (_, pageIndex) => (
            <div key={pageIndex} className="print-page">
              {images.slice(pageIndex * 4, (pageIndex + 1) * 4).map((img) => (
                <div key={img.id} className="print-item">
                  <img
                    src={img.preview}
                    alt="Print Preview"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          )
        )}
        {images.length <= 0 && (
          <div className="flex items-center justify-center p-4">
            <p className="text-3xl flex items-center gap-2">
              <Frown size={40}/>
              There is nothing to print
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

function PrintButton({ onPrint }: { onPrint: () => void }) {
  return (
    <Button onClick={onPrint}>
      <Printer /> Print
    </Button>
  );
}
