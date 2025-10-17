import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as fabric from 'fabric';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config.jsx';
import "../styles/CanvasPage.css";

const CanvasPage = () => {
  const { canvasId } = useParams();
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight - 150,
    });
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 3;
    canvas.freeDrawingBrush.color = '#ffffff';

    fabricCanvasRef.current = canvas;
    loadCanvasData();

    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };

    canvas.on('path:created', (e) => {
      const path = e.path;
      path.selectable = true;
      path.evented = true;
      canvas.setActiveObject(path);
      canvas.renderAll();
    });

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, [canvasId]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.freeDrawingBrush.color = selectedColor;
    }
  }, [selectedColor]);

  const disablePenIfActive = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas.isDrawingMode) {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.forEachObject(o => (o.selectable = true));
    }
  };

  const loadCanvasData = async () => {
    try {
      const docRef = doc(db, 'canvases', canvasId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        fabricCanvasRef.current.loadFromJSON(data.canvas, () => {
          fabricCanvasRef.current.renderAll();
        });
      }
    } catch (error) {
      console.error("Error loading canvas:", error);
    }
  };

  const saveCanvas = async () => {
    try {
      const canvasData = fabricCanvasRef.current.toObject();
      const docRef = doc(db, 'canvases', canvasId);
      await setDoc(docRef, {
        canvas: canvasData,
        lastModified: new Date().toISOString(),
        createdBy: 'arya-thakkar'
      });
      alert('Canvas saved successfully!');
    } catch (error) {
      alert('Error saving canvas');
      console.error("Error saving canvas:", error);
    }
  };

  const addRectangle = () => {
    disablePenIfActive();
    const canvas = fabricCanvasRef.current;
    const rect = new fabric.Rect({
      left: 150,
      top: 100,
      width: 120,
      height: 80,
      fill: 'white',
      stroke: selectedColor,
    });
    canvas.add(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    disablePenIfActive();
    const canvas = fabricCanvasRef.current;
    const circle = new fabric.Circle({
      left: 200,
      top: 150,
      radius: 50,
      fill: 'white',
      stroke: selectedColor,
    });
    canvas.add(circle);
    canvas.renderAll();
  };

  const addLine = () => {
    disablePenIfActive();
    const canvas = fabricCanvasRef.current;
    const line = new fabric.Line([50, 50, 200, 50], {
      stroke: selectedColor,
      strokeWidth: 2,
    });
    canvas.add(line);
    canvas.renderAll();
  };

  const addText = () => {
    disablePenIfActive();
    const canvas = fabricCanvasRef.current;
    const text = new fabric.IText('Double-click to edit', {
      left: 250,
      top: 200,
      fontSize: 28,
      fill: '#ffffff',
      fontFamily: 'Comic Neue, Patrick Hand, cursive',
      fontWeight: 'bold',
      shadow: '2px 2px 5px rgba(255,255,255,0.3)',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const enablePen = () => {
    const canvas = fabricCanvasRef.current;
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
      canvas.selection = false;
      canvas.forEachObject(o => (o.selectable = false));
      canvas.freeDrawingBrush.color = selectedColor;
      canvas.freeDrawingBrush.width = 3;
    } else {
      canvas.selection = true;
      canvas.forEachObject(o => (o.selectable = true));
    }
  };

  const changeColor = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      if (activeObject.type === 'path') {
        activeObject.set({ stroke: color });
      } else if (activeObject.type === 'text' || activeObject.type === 'i-text') {
        activeObject.set({ fill: color });
      } else {
        activeObject.set({ fill: color, stroke: color });
      }
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  return (
    <div className="container1">
      <p>Canvas Creator</p>
      <div className="button-row">
        <button onClick={addRectangle}>▭</button>
        <button onClick={addCircle}>◯</button>
        <button onClick={addLine}>／</button>
        <button onClick={addText}>A</button>
        <button onClick={enablePen}>✏️</button>
        <input type="color" value={selectedColor} onChange={changeColor} />
        <button onClick={deleteSelected} className="delete-btn">🗑️</button>
        <button onClick={saveCanvas} className="save-btn">💾</button>
      </div>
      <div className="container2">
        <canvas ref={canvasRef} id={canvasId} className="canvas-element" />
      </div>
    </div>
  );
};

export default CanvasPage;
