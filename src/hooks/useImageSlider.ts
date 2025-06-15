import { useCallback, useEffect, useState } from "react";
interface ImageSliderHookProps {
  images: string[];
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasWidth: number;
  canvasHeight: number;
}

type ImageDimensions = {
  width: number;
  height: number;
};

type DrawPosition = {
  x: number;
  y: number;
};

const useImageSlider = ({
  images,
  canvasRef,
  canvasWidth,
  canvasHeight,
}: ImageSliderHookProps) => {
  // Constants
  const TOTAL_WIDTH = images.length * canvasWidth;
  const BACKGROUND_COLOR = "rgb(242, 242, 242)";

  // States
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Hooks
  const calculateImageDimensions = useCallback(
    (img: HTMLImageElement): ImageDimensions => {
      if (img.width > canvasWidth || img.height > canvasHeight) {
        const scale = Math.min(
          canvasWidth / img.width,
          canvasHeight / img.height
        );
        return {
          width: img.width * scale,
          height: img.height * scale,
        };
      }
      // Use original dimensions for smaller images
      return {
        width: img.width,
        height: img.height,
      };
    },
    [canvasWidth, canvasHeight]
  );

  const calculateVisibleRange = useCallback(
    (currentOffset: number) => {
      const startIndex = Math.floor(currentOffset / canvasWidth);
      const endIndex = Math.ceil((currentOffset + canvasWidth) / canvasWidth);
      return { startIndex, endIndex };
    },
    [canvasWidth]
  );

  const calculateDrawPosition = useCallback(
    (dimensions: ImageDimensions, x: number): DrawPosition => {
      return {
        x: x + (canvasWidth - dimensions.width) / 2,
        y: (canvasHeight - dimensions.height) / 2,
      };
    },
    [canvasWidth, canvasHeight]
  );

  useEffect(() => {
    // Load all images
    const loadImages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const imageElements = await Promise.all(
          images.map(
            (src) =>
              new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () =>
                  reject(new Error(`Failed to load image: ${src}`));
                img.src = src;
              })
          )
        );
        setLoadedImages(imageElements);
      } catch (error) {
        setError(error as Error);
        console.error("Error loading images:", error);
      } finally {
        setIsLoading(false);
      }
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
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate which images to show
      const { startIndex, endIndex } = calculateVisibleRange(offset);

      // Draw visible images
      for (let i = startIndex; i <= endIndex; i++) {
        if (i >= 0 && i < loadedImages.length) {
          const img = loadedImages[i];
          const x = i * canvasWidth - offset;

          // Only scale down if image is larger than canvas
          const dimensions = calculateImageDimensions(img);
          // Center the image
          const position = calculateDrawPosition(dimensions, x);

          // Draw the image
          ctx.drawImage(
            img,
            position.x,
            position.y,
            dimensions.width,
            dimensions.height
          );
        }
      }
    };

    drawImages();
  }, [
    offset,
    loadedImages,
    canvasWidth,
    canvasHeight,
    canvasRef,
    calculateImageDimensions,
    calculateVisibleRange,
    calculateDrawPosition,
  ]);

  // Mouse Handlers
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

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = startX - e.touches[0].clientX;
    const newOffset = offset + deltaX;

    const constrainedOffset = Math.max(
      0,
      Math.min(newOffset, TOTAL_WIDTH - canvasWidth)
    );
    setOffset(constrainedOffset);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isLoading,
    error,
    isDragging,
  };
};

export default useImageSlider;
