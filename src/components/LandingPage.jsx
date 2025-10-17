import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../styles/LandingPage.css';
import DarkVeil from './background';

const LandingPage = () => {
  const navigate = useNavigate();

  const createNewCanvas = () => {
    const canvasId = `canvas${uuidv4()}`;
    navigate(`/canvas/${canvasId}`);
  };

  return (
    <div className="landing-container">
      <div className="background">
        <DarkVeil />
      </div>

      <div className="landing-content">
        <h1>Welcome to Canvas Creator</h1>
        <p>Create and save your canvas designs</p>
        <button className="create-button" onClick={createNewCanvas}>
          Create New Canvas
        </button>
      </div>
    </div>

  );
};

export default LandingPage;
