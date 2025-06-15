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
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useImageSlider({
    images,
    canvasRef,
    canvasWidth,
    canvasHeight,
  });

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      width={canvasWidth}
      height={canvasHeight}
      style={{ cursor: "grab" }}
    />
  );
};

export default ImageSlider;
