import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state, { FABRIC_TYPES } from '../store';
import { generateFabricBumpCanvas } from '../config/proceduralGenerator';

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');

  const logoTexture = useTexture(snap.logoDecal);
  const backTexture = useTexture(snap.backDecal);
  const fullTexture = useTexture(snap.fullDecal);

  // Configure anisotropy & repeat wrapping for full pattern texture
  useEffect(() => {
    if (logoTexture) {
      logoTexture.anisotropy = 16;
      logoTexture.needsUpdate = true;
    }
  }, [logoTexture]);

  useEffect(() => {
    if (backTexture) {
      backTexture.anisotropy = 16;
      backTexture.needsUpdate = true;
    }
  }, [backTexture]);

  useEffect(() => {
    if (fullTexture) {
      fullTexture.wrapS = THREE.RepeatWrapping;
      fullTexture.wrapT = THREE.RepeatWrapping;
      fullTexture.repeat.set(snap.textureRepeat || 1, snap.textureRepeat || 1);
      fullTexture.anisotropy = 16;
      fullTexture.needsUpdate = true;
    }
  }, [fullTexture, snap.textureRepeat]);

  // Generate procedural PBR bump texture based on selected fabric
  const fabricBumpMap = useMemo(() => {
    const bumpCanvas = generateFabricBumpCanvas(snap.fabric);
    const tex = new THREE.CanvasTexture(bumpCanvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(24, 24);
    tex.needsUpdate = true;
    return tex;
  }, [snap.fabric]);

  // Update PBR material properties smoothly
  useEffect(() => {
    const mat = materials.lambert1;
    if (!mat) return;
    const fabricSpec = FABRIC_TYPES[snap.fabric] || FABRIC_TYPES.cotton;
    mat.roughness = fabricSpec.roughness;
    if ('metalness' in mat) {
      mat.metalness = fabricSpec.metalness;
    }
    mat.bumpMap = fabricBumpMap;
    mat.bumpScale = fabricSpec.bumpScale;
    mat.wireframe = Boolean(snap.wireframe);
    mat.needsUpdate = true;
  }, [materials.lambert1, snap.fabric, snap.wireframe, fabricBumpMap]);

  useFrame((_, delta) => {
    easing.dampC(materials.lambert1.color, snap.color, 0.22, delta);
  });

  const stateKey = JSON.stringify({
    isLogo: snap.isLogoTexture,
    isBack: snap.isBackTexture,
    isFull: snap.isFullTexture,
    logoDecal: snap.logoDecal,
    backDecal: snap.backDecal,
    fullDecal: snap.fullDecal,
    logoPos: snap.logoPosition,
    logoScale: snap.logoScale,
    logoRot: snap.logoRotation,
    backPos: snap.backPosition,
    backScale: snap.backScale,
    backRot: snap.backRotation,
    repeat: snap.textureRepeat,
  });

  return (
    <group key={stateKey}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={snap.fullScale || 1}
            map={fullTexture}
          />
        )}

        {snap.isLogoTexture && (
          <Decal
            position={snap.logoPosition}
            rotation={[0, 0, snap.logoRotation || 0]}
            scale={snap.logoScale}
            map={logoTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {snap.isBackTexture && (
          <Decal
            position={snap.backPosition}
            rotation={[0, Math.PI, snap.backRotation || 0]}
            scale={snap.backScale}
            map={backTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
