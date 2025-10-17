import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CanvasPage from './components/CanvasPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/canvas/:canvasId" element={<CanvasPage />} />
      </Routes>
    </Router>
  );
};

export default App;
