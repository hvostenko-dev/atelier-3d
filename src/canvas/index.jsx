import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center, ContactShadows } from '@react-three/drei';
import { useSnapshot } from 'valtio';

import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';
import state from '../store';

const CanvasModel = () => {
  const snap = useSnapshot(state);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={snap.lightIntensity || 0.6} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={(snap.lightIntensity || 0.6) * 1.1}
        castShadow
      />
      <directionalLight
        position={[-4, 3, -4]}
        intensity={(snap.lightIntensity || 0.6) * 0.7}
      />

      <Suspense fallback={null}>
        <Environment preset={snap.envPreset || 'city'} />

        <CameraRig>
          <Backdrop />
          <Center>
            <Shirt />
          </Center>
        </CameraRig>

        <ContactShadows
          position={[0, -0.42, 0]}
          opacity={0.45}
          scale={3.2}
          blur={2.4}
          far={1.5}
        />
      </Suspense>
    </Canvas>
  );
};

export default CanvasModel;
