import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(16);
  const [canvasWidth, setCanvasWidth] = useState(16);
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  const [canvasTransparency, setCanvasTransparency] = useState(null);
  const [canvasData, setCanvasData] = useState(null);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;
    // ctx.fillStyle = "#fff";
    // ctx.globalAlpha = canvasTransparency / 255;
    // ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (canvasData) {
      handleLoadCanvas();
      imageData.onload = () => {
        ctx.drawImage(imageData, 0, 0);
      };
      imageData.src = canvasData;
    }

    const handleClick = (event) => {
      // console.log("Handled Click");
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleFactor = canvasRef.current.width / rect.width;
      const x = (event.clientX - rect.left) * scaleFactor;
      const y = (event.clientY - rect.top) * scaleFactor;
      const ctx = canvasRef.current.getContext("2d");
      const imageData = ctx.getImageData(x, y, 1, 1);
      const data = imageData.data;
      // const r = Math.floor(Math.random() * 256);
      // const g = Math.floor(Math.random() * 256);
      // const b = Math.floor(Math.random() * 256);
      const color = hex2rgb(canvasColor);
      data[0] = color.r;
      data[1] = color.g;
      data[2] = color.b;
      data[3] = canvasTransparency;
      ctx.putImageData(imageData, x, y);
      setCanvasData(canvasRef.current.toDataURL());
      // console.log("Set Canvas Data");
    };

    const handleMouseDown = (event) => {
      setIsDragging(true);
      handleClick(event);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (event) => {
      setCanvasColor(document.getElementById("color").value);
      if (isDragging) {
        handleClick(event);
      }
    };

    const hex2rgb = (hex) => {
      const rgbChar = ["r", "g", "b"];

      const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
      if (normal) {
        return normal.slice(1).reduce((a, e, i) => {
          a[rgbChar[i]] = parseInt(e, 16);
          return a;
        }, {});
      }

      const shorthand = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
      if (shorthand) {
        return shorthand.slice(1).reduce((a, e, i) => {
          a[rgbChar[i]] = 0x11 * parseInt(e, 16);
          return a;
        }, {});
      }

      return null;
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
    imageData,
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

  const newCanvas = () => {
    setImageData(new Image());
    setCanvasData(null);
    handleLoadCanvas();
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
              defaultValue={16}
            ></input>
          </div>
          <div>
            <p>Width:</p>
            <input
              id="width"
              title="Width"
              type="number"
              placeholder="Width"
              defaultValue={16}
            ></input>
          </div>
          <div>
            <p>Canvas Color:</p>
            <input
              id="color"
              title="Color"
              type="color"
              placeholder="Color"
              defaultValue={canvasColor}
            ></input>
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
              defaultValue={255}
            ></input>
          </div>
        </div>
        <div>
          <button onClick={newCanvas}>New</button>
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
