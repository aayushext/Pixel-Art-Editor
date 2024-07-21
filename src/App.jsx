import { useState, useRef, useEffect } from "react";
// import { Modal } from "./components/Modal";
import { hex2rgb } from "./components/Utils";
import "./App.css";
import Modal from "./components/Modal/Modal";

function App() {
  const canvasRef = useRef(null);
  const setUpModal = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(16);
  const [canvasWidth, setCanvasWidth] = useState(16);
  const [drawColor, setDrawColor] = useState("#ffffff");
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  const [canvasTransparency, setCanvasTransparency] = useState(null);
  const [canvasData, setCanvasData] = useState(null);
  const [imageData, setImageData] = useState(new Image());

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.backgroundSize = `calc(200% / ${canvasWidth}) calc(200% / ${canvasHeight})`;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;

    if (canvasData) {
      handleLoadCanvas();
      imageData.onload = () => {
        ctx.drawImage(imageData, 0, 0);
      };
      imageData.src = canvasData;
    }

    const handleClick = (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleFactor = canvasRef.current.width / rect.width;
      const x =
        ((event.clientX || event.touches[0].clientX) - rect.left) * scaleFactor;
      const y =
        ((event.clientY || event.touches[0].clientY) - rect.top) * scaleFactor;
      const ctx = canvasRef.current.getContext("2d");
      const imageData = ctx.getImageData(x, y, 1, 1);
      const data = imageData.data;
      const color = hex2rgb(drawColor);
      data[0] = color.r;
      data[1] = color.g;
      data[2] = color.b;
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
      setDrawColor(document.getElementById("color").value);
      if (isDragging) {
        handleClick(event);
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    canvas.addEventListener("touchstart", handleMouseDown);
    canvas.addEventListener("touchend", handleMouseUp);
    canvas.addEventListener("touchmove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);

      canvas.removeEventListener("touchstart", handleMouseDown);
      canvas.removeEventListener("touchend", handleMouseUp);
      canvas.removeEventListener("touchmove", handleMouseMove);
    };
  }, [
    imageData,
    canvasWidth,
    canvasHeight,
    drawColor,
    canvasColor,
    canvasData,
    isDragging,
    canvasTransparency,
  ]);

  const handleLoadCanvas = () => {
    setDrawColor(document.getElementById("color").value);
    setCanvasTransparency(document.getElementById("transparency").value);
  };

  const newCanvas = () => {
    setImageData(new Image());
    setCanvasData(null);
    setCanvasHeight(parseInt(document.getElementById("height").value, 10));
    setCanvasWidth(parseInt(document.getElementById("width").value, 10));
    handleLoadCanvas();
  };

  const saveCanvas = () => {
    const link = document.createElement("a");
    link.href = canvasData;
    link.download = "canvas.png";
    link.click();
  };

  return (
    <>
      <div className="container">
        <div className="canvas-setup">
          <div>
            <p>Color:</p>
            <input
              id="color"
              title="Color"
              type="color"
              placeholder="Color"
              defaultValue={drawColor}
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
          <button
            onClick={() => {
              setUpModal.current.open();
            }}
          >
            New
          </button>
          <button onClick={handleLoadCanvas}>Resize</button>
          <button onClick={saveCanvas}>Save</button>
          <Modal ref={setUpModal}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <p>Height:</p>
                <input
                  id="height"
                  title="Height"
                  type="number"
                  placeholder="Height"
                  defaultValue={16}
                  style={{ marginLeft: "10px" }}
                ></input>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <p>Width:</p>
                <input
                  id="width"
                  title="Width"
                  type="number"
                  placeholder="Width"
                  defaultValue={16}
                  style={{ marginLeft: "10px" }}
                ></input>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <p>Canvas Color: </p>
                <input
                  id="color"
                  title="Color"
                  type="color"
                  placeholder="Color"
                  defaultValue={canvasColor}
                  onChange={(e) => {
                    setCanvasColor(e.target.value);
                  }}
                  style={{ marginLeft: "10px" }}
                ></input>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "20px",
                }}
              >
                <button
                  onClick={() => {
                    newCanvas();
                    setUpModal.current.close();
                  }}
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setUpModal.current.close();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        </div>
        <div id="editor">
          <canvas id="myCanvas" ref={canvasRef} />
        </div>
      </div>
    </>
  );
}

export default App;
