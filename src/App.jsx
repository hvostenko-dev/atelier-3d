import React, { useEffect } from 'react';
import Canvas from './canvas';
import Customizer from './pages/Customizer.jsx';
import Home from './pages/Home.jsx';
import state from './store';
import { generateProceduralArt } from './config/proceduralGenerator';

function App() {
  // Initialize with a sharp custom procedural crest on first mount so it looks bespoke immediately
  useEffect(() => {
    const initialCrest = generateProceduralArt('Cyberpunk Neon Sun Studio', 'logo', state.color);
    state.logoDecal = initialCrest;
  }, []);

  return (
    <main className="app transition-all ease-in">
      <Home />
      <Canvas />
      <Customizer />
    </main>
  );
}

export default App;
