// import { useState, useRef, useEffect } from "react";
// import { Modal } from "./components/Modal";
// import { hex2rgb } from "./components/Utils";
import { useRef } from "react";
import "./App.css";
import { useEffect, useState } from "react";
// import Modal from "./components/Modal/Modal";

function App() {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [colorInput, setColorInput] = useState("#009578aa");

  useEffect(() => {
    const canvas = canvasRef.current;
    const clearButton = document.getElementById("clearButton");
    const drawingContext = canvas.getContext("2d", {
      // alpha: true,
    });

    const cellPixelLength = 1;
    const colorHistory = {};

    // Set default color
    // colorInput.value = "#009578";

    // Initialize the canvas background
    // drawingContext.fillStyle = "#ffffff";
    // drawingContext.fillRect(0, 0, canvas.width, canvas.height);

    function handleCanvasMousedown(e) {
      // Ensure user is using their primary mouse button
      if (e.button !== 0) {
        return;
      }

      const canvasBoundingRect = canvas.getBoundingClientRect();
      const scaleFactor = canvas.width / canvasBoundingRect.width;
      const x = (e.clientX - canvasBoundingRect.left) * scaleFactor;
      const y = (e.clientY - canvasBoundingRect.top) * scaleFactor;
      const cellX = Math.floor(x / cellPixelLength);
      const cellY = Math.floor(y / cellPixelLength);
      const currentColor = colorHistory[`${cellX}_${cellY}`];

      if (e.ctrlKey) {
        if (currentColor) {
          setColorInput(currentColor);
        }
      } else {
        fillCell(cellX, cellY);
      }
    }

    function handleClearButtonClick() {
      const yes = confirm("Are you sure you wish to clear the canvas?");

      if (!yes) return;

      drawingContext.fillStyle = "#ffffff";
      drawingContext.fillRect(0, 0, canvas.width, canvas.height);
    }

    function fillCell(cellX, cellY) {
      const startX = cellX * cellPixelLength;
      const startY = cellY * cellPixelLength;

      drawingContext.fillStyle = colorInput;
      console.log(drawingContext);
      drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
      colorHistory[`${cellX}_${cellY}`] = colorInput;
    }

    const handleMouseDown = (event) => {
      setIsDragging(true);
      handleCanvasMousedown(event);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        handleCanvasMousedown(event);
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    // canvas.addEventListener("mousedown", handleCanvasMousedown);
    clearButton.addEventListener("click", handleClearButtonClick);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, colorInput]);

  return (
    <>
      <div style={{ backgroundColor: "#ffaaff" }}>
        <div id="guide"></div>
        <canvas width="8" height="8" id="canvas" ref={canvasRef}></canvas>
      </div>
      <div>
        <label htmlFor="colorInput">Set Color: </label>
        <input
          type="color"
          id="colorInput"
          onChange={(e) => setColorInput(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="toggleGuide">Show Guide: </label>
        {/* <input type="checkbox" id="toggleGuide" checked /> */}
      </div>
      <div>
        <button type="button" id="clearButton">
          Clear
        </button>
      </div>
    </>
  );
}

export default App;
