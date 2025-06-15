import { useEffect, useState } from "react";

interface ImageSliderHookProps {
  images: string[];
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasWidth: number;
  canvasHeight: number;
}

const useImageSlider = ({
  images,
  canvasRef,
  canvasWidth,
  canvasHeight,
}: ImageSliderHookProps) => {
  // Constants
  const TOTAL_WIDTH = images.length * canvasWidth;

  // States
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offset, setOffset] = useState(0);

  // Hooks
  useEffect(() => {
    // Load all images
    const loadImages = async () => {
      const imageElements = await Promise.all(
        images.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.src = src;
            })
        )
      );
      setLoadedImages(imageElements);
    };

    loadImages();
  }, [images]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || loadedImages.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawImages = () => {
      // Fill background with grey color
      ctx.fillStyle = "rgb(242, 242, 242)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate which images to show
      const startIndex = Math.floor(offset / canvasWidth);
      const endIndex = Math.ceil((offset + canvasWidth) / canvasWidth);

      // Draw visible images
      for (let i = startIndex; i <= endIndex; i++) {
        if (i >= 0 && i < loadedImages.length) {
          const img = loadedImages[i];
          const x = i * canvasWidth - offset;

          let drawWidth, drawHeight;

          // Only scale down if image is larger than canvas
          if (img.width > canvasWidth || img.height > canvasHeight) {
            const scale = Math.min(
              canvasWidth / img.width,
              canvasHeight / img.height
            );
            drawWidth = img.width * scale;
            drawHeight = img.height * scale;
          } else {
            // Use original dimensions for smaller images
            drawWidth = img.width;
            drawHeight = img.height;
          }

          // Center the image
          const centerX = (canvasWidth - drawWidth) / 2;
          const centerY = (canvasHeight - drawHeight) / 2;

          ctx.drawImage(img, x + centerX, centerY, drawWidth, drawHeight);
        }
      }
    };

    drawImages();
  }, [offset, loadedImages, canvasWidth, canvasHeight, canvasRef]);

  // Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = startX - e.clientX;
    const newOffset = offset + deltaX;

    // Constrain offset to valid range
    const constrainedOffset = Math.max(
      0,
      Math.min(newOffset, TOTAL_WIDTH - canvasWidth)
    );
    setOffset(constrainedOffset);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

export default useImageSlider;
