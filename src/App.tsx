import "./App.css";
import ImageSlider from "./components/ImageSlider";

function App() {
  // Constants
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 400;

  const images = [
    "/slider-images/image1.jpg",
    "/slider-images/image2.png",
    "/slider-images/image3.png",
    "/slider-images/image4.png",
    "/slider-images/image5.jpg",
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Slider</h1>
        <ImageSlider
          images={images}
          canvasWidth={CANVAS_WIDTH}
          canvasHeight={CANVAS_HEIGHT}
        />
        <aside>Drag to change image</aside>
      </header>
    </div>
  );
}

export default App;
