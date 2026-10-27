import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';

import state from '../store';
import { CAMERA_VIEWS } from '../config/constants';

const CameraRig = ({ children }) => {
  const group = useRef();
  const autoAngleRef = useRef(0);
  const snap = useSnapshot(state);

  useFrame((r3fState, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    const viewPreset = CAMERA_VIEWS.find((v) => v.id === snap.cameraView) || CAMERA_VIEWS[0];

    let targetPosition = [-0.4, 0, 2];
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];
      autoAngleRef.current = 0;
    } else {
      if (isMobile) {
        targetPosition = [
          viewPreset.camPos[0],
          viewPreset.camPos[1],
          viewPreset.camPos[2] + 0.45,
        ];
      } else {
        targetPosition = [...viewPreset.camPos];
      }
    }

    // Smooth camera position damping
    easing.damp3(r3fState.camera.position, targetPosition, 0.25, delta);

    if (!group.current) return;

    if (!snap.intro && snap.autoRotate) {
      autoAngleRef.current += delta * (snap.rotateSpeed || 1.4);
      easing.dampE(
        group.current.rotation,
        [r3fState.pointer.y / 14, autoAngleRef.current, 0],
        0.2,
        delta
      );
    } else {
      const baseRotX = snap.intro ? 0 : viewPreset.angle[0];
      const baseRotY = snap.intro ? 0 : viewPreset.angle[1];
      autoAngleRef.current = baseRotY;

      easing.dampE(
        group.current.rotation,
        [
          baseRotX + r3fState.pointer.y / 9,
          baseRotY - r3fState.pointer.x / 4.5,
          0,
        ],
        0.25,
        delta
      );
    }
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
