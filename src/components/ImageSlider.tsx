import { useRef } from "react";
import useImageSlider from "../hooks/useImageSlider";

interface ImageSliderProps {
  images: string[];
  canvasWidth: number;
  canvasHeight: number;
}

const ImageSlider = ({
  images,
  canvasWidth,
  canvasHeight,
}: ImageSliderProps) => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hooks
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isLoading,
    error,
    isDragging,
  } = useImageSlider({
    images,
    canvasRef,
    canvasWidth,
    canvasHeight,
  });

  if (error) {
    return <div>Error loading images: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading images...</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      width={canvasWidth}
      height={canvasHeight}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    />
  );
};

export default ImageSlider;
