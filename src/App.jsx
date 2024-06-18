import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(16);
  const [canvasWidth, setCanvasWidth] = useState(16);
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  const [canvasTransparency, setCanvasTransparency] = useState(16);
  const [canvasData, setCanvasData] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (canvasData) {
      handleLoadCanvas();
      const imageData = new Image();
      imageData.onload = () => {
        ctx.drawImage(imageData, 0, 0);
      };
      imageData.src = canvasData;
    }

    const handleClick = (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleFactor = canvasRef.current.width / rect.width;
      const x = (event.clientX - rect.left) * scaleFactor;
      const y = (event.clientY - rect.top) * scaleFactor;
      const ctx = canvasRef.current.getContext("2d");
      const imageData = ctx.getImageData(x, y, 1, 1);
      const data = imageData.data;
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      data[0] = r;
      data[1] = g;
      data[2] = b;
      data[3] = canvasTransparency;
      ctx.putImageData(imageData, x, y);
      setCanvasData(canvasRef.current.toDataURL());
    };

    const handleMouseDown = (event) => {
      setIsDragging(true);
      handleClick(event);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        handleClick(event);
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    canvasWidth,
    canvasHeight,
    canvasColor,
    canvasData,
    isDragging,
    canvasTransparency,
  ]);

  const handleLoadCanvas = () => {
    setCanvasHeight(parseInt(document.getElementById("height").value, 10));
    setCanvasWidth(parseInt(document.getElementById("width").value, 10));
    setCanvasColor(document.getElementById("color").value);
    setCanvasTransparency(document.getElementById("transparency").value);
  };

  return (
    <>
      <div className="container">
        <div className="canvas-setup">
          <div>
            <p>Height:</p>
            <input
              id="height"
              title="Height"
              type="number"
              placeholder="Height"
              defaultValue={16}></input>
          </div>
          <div>
            <p>Width:</p>
            <input
              id="width"
              title="Width"
              type="number"
              placeholder="Width"
              defaultValue={16}></input>
          </div>
          <div>
            <p>Canvas Color:</p>
            <input
              id="color"
              title="Color"
              type="color"
              placeholder="Color"
              defaultValue={canvasColor}></input>
          </div>
          <div>
            <p>Transparency:</p>
            <input
              id="transparency"
              title="Transparency"
              type="number"
              placeholder="Transparency"
              max={255}
              min={0}
              defaultValue={255}></input>
          </div>
        </div>
        <div>
          <button onClick={setCanvasData}>New</button>
          <button onClick={handleLoadCanvas}>Resize</button>
        </div>
        <div id="editor">
          <canvas id="myCanvas" ref={canvasRef} />
        </div>
      </div>
    </>
  );
}

export default App;
