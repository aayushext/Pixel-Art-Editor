// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef();

  var canvas;
  var canvasHeight;
  var canvasWidth;
  var canvasColor;
  var ctx;
  let editorContainer;

  var loadCanvas = () => {
    editorContainer = document.getElementById("editor");
    canvasHeight = document.getElementById("height").value;
    canvasWidth = document.getElementById("width").value;
    canvasColor = document.getElementById("color").value;

    var element = document.getElementById("myCanvas");
    if (typeof element != "undefined" && element != null) {
      editorContainer.removeChild(editorContainer.childNodes[0]);
    }

    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "myCanvas");
    canvas.setAttribute("width", canvasWidth);
    canvas.setAttribute("height", canvasHeight);
    canvas.setAttribute("ref", canvasRef);
    canvas.style.backgroundColor = canvasColor;

    ctx = canvas.getContext("2d");
    editorContainer.appendChild(canvas);
  };

  var getClickPosition = (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleFactor = canvas.width / rect.width;
    const x = (event.clientX - rect.left) * scaleFactor;
    const y = (event.clientY - rect.top) * scaleFactor;
    return { x, y };
  };

  var click = (event) => {
    const pos = getClickPosition(event);
    var imageData = ctx.getImageData(pos.x, pos.y, 1, 1);
    var data = imageData.data;
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    data[0] = r;
    data[1] = g;
    data[2] = b;
    data[3] = 255;
    ctx.putImageData(imageData, pos.x, pos.y);
  };

  useEffect(() => {
    window.onclick = (event) => {
      if (
        event.target === canvasRef.current ||
        canvasRef.current.contains(event.target)
      ) {
        click(event);
      }
    };
  }, []);

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
            <p>Color:</p>
            <input
              id="color"
              title="Color"
              type="color"
              placeholder="Color"
              // value={"#ffffff"}
            ></input>
          </div>
        </div>
        <button onClick={loadCanvas}>Save</button>
        <div id="editor" ref={canvasRef}></div>
      </div>
    </>
  );
}

export default App;
