import { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

interface ImageData {
  id: string;
  src: string;
  width: number;
  height: number;
  rotation: number;
}

function App() {
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

  return (
    <div id="app">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="space-y-2">
          <Input
            className="p-0 pe-3 file:me-3 file:border-0 file:border-e"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <div>
            <Button>Button</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
