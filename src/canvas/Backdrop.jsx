import React, { useRef } from 'react';
import { useSnapshot } from 'valtio';
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import state from '../store';

const Backdrop = () => {
  const shadows = useRef();
  const snap = useSnapshot(state);

  // Hide backdrop plane when inspecting the back of the garment or rotating 360°
  if (snap.cameraView === 'back' || snap.autoRotate) {
    return null;
  }

  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.82}
      scale={10}
      color={snap.color}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.24]}
    >
      <RandomizedLight
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
};

export default Backdrop;
