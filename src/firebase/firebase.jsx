import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as fabric from 'fabric';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '/src/firebase/config.jsx';
import "../styles/CanvasPage.css";

const CanvasPage = () => {
  const { canvasId } = useParams();
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight - 150,
      backgroundColor: '#f5f5f5',
    });

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

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, [canvasId]);

  const loadCanvasData = async () => {
    try {
      console.log('Loading canvas:', canvasId);
      const docRef = doc(db, 'canvases', canvasId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.objects) {
          const savedData = JSON.parse(data.objects);
          fabricCanvasRef.current.loadFromJSON(savedData, () => {
            fabricCanvasRef.current.renderAll();
            console.log('Canvas loaded successfully');
          });
        }
      }
    } catch (error) {
      console.error("Error loading canvas:", error);
    }
  };

  const saveCanvas = async () => {
    try {
      console.log('Saving canvas:', canvasId);
      const canvasData = fabricCanvasRef.current.toJSON();
      const docRef = doc(db, 'canvases', canvasId);

      await setDoc(docRef, {
        objects: JSON.stringify(canvasData),
        lastModified: new Date().toISOString(),
        createdBy: 'arya-thakkar',
      });

      console.log('Canvas saved successfully!');
      alert('Canvas saved successfully!');
    } catch (error) {
      console.error("Error saving canvas:", error);
      alert('Error saving canvas');
    }
  };

  const addRectangle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const rect = new fabric.Rect({
      left: 150,
      top: 100,
      width: 120,
      height: 80,
      fill: 'white',
      stroke: "black",
      selectable: true,
      hasControls: true,
      hasBorders: true,
    });

    canvas.add(rect);
    canvas.renderAll();
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  const testFirebaseConnection = async () => {
    try {
      const testRef = doc(db, 'test_connection', 'test_doc');
      await setDoc(testRef, {
        timestamp: new Date().toISOString(),
        user: 'arya-thakkar',
        status: 'test_successful'
      });
      
      const docSnap = await getDoc(testRef);
      if (docSnap.exists()) {
        console.log('Firebase connection test successful!');
        console.log('Test data:', docSnap.data());
        alert('Firebase connection is working!');
      }
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      alert('Firebase connection test failed. Check console.');
    }
  };

  return (
    <div className="container1">
      <div className="button-row">
        <button onClick={addRectangle}>Add Rectangle</button>
        <button onClick={deleteSelected} className="delete-btn">Delete</button>
        <button onClick={saveCanvas} className="save-btn">Save Canvas</button>
        <button onClick={testFirebaseConnection} className="test-btn">
          Test Firebase
        </button>
      </div>

      <div className="container2">
        <canvas ref={canvasRef} id={canvasId} className="canvas-element" />
      </div>
    </div>
  );
};

export default CanvasPage;
