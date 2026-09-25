import React, { useState, useEffect } from 'react';
import spideyImg from './assets/spiderman.jpg'; // Vite Bundler image import
import './App.css';

function App() {
  const [showFrontPage, setShowFrontPage] = useState(true);
  const [theme, setTheme] = useState('classic');
  const [waterCount, setWaterCount] = useState(() => {
    return parseInt(localStorage.getItem('waterCount')) || 0;
  });
  const [intervalMins, setIntervalMins] = useState(30);

  // Sound Effect
  const playWebSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.log('Audio error');
    }
  };

  useEffect(() => {
    localStorage.setItem('waterCount', waterCount);
  }, [waterCount]);

  const handleAddGlass = () => {
    playWebSound();
    setWaterCount((prev) => prev + 1);
  };

  const handleReset = () => {
    setWaterCount(0);
  };

  // Window Control Handlers
  const handleMinimize = () => window.electronAPI?.minimize();
  const handleMaximize = () => window.electronAPI?.maximize();
  const handleClose = () => window.electronAPI ? window.electronAPI.close() : window.close();

  return (
    <div className="app-container">
      <div className={`main-card theme-${theme}`}>
        
        {/* Titlebar */}
        <div className="titlebar">
          <div className="mac-dots">
            <span className="dot dot-red" onClick={() => setTheme('classic')} title="Classic"></span>
            <span className="dot dot-yellow" onClick={() => setTheme('miles')} title="Miles"></span>
            <span className="dot dot-green" onClick={() => setTheme('venom')} title="Venom"></span>
          </div>

          <div className="window-controls">
            <button className="win-btn" onClick={handleMinimize}>&#8722;</button>
            <button className="win-btn" onClick={handleMaximize}>&#9633;</button>
            <button className="win-btn close-btn" onClick={handleClose}>&#10005;</button>
          </div>
        </div>

        <h1 className="spidey-title">SPIDER-MAN</h1>
        <p className="spidey-subtitle">Hydration Protocol</p>

        {/* Fixed Image using imported module */}
        <div className="hero-frame">
          <img src={spideyImg} alt="Spider-Man" className="hero-img" />
        </div>

        {showFrontPage ? (
          <button className="start-reminder-btn" onClick={() => setShowFrontPage(false)}>
            START REMINDER 💧
          </button>
        ) : (
          <>
            <div className="interval-row">
              <label htmlFor="interval-select">Interval:</label>
              <select 
                id="interval-select" 
                value={intervalMins} 
                onChange={(e) => setIntervalMins(Number(e.target.value))}
                className="interval-dropdown"
              >
                <option value={30}>30 Mins</option>
                <option value={45}>45 Mins</option>
                <option value={60}>60 Mins</option>
              </select>
            </div>

            <div className="reminder-banner">
              REMINDER ACTIVE 💧
            </div>

            <div className="counter-text">
              Glasses Drank: <span>{waterCount}</span>
            </div>

            <div className="btn-row">
              <button className="add-glass-btn" onClick={handleAddGlass}>
                +1 Glass
              </button>
              <button className="reset-glass-btn" onClick={handleReset}>
                Reset
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default App;