import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';

import state from '../store';
import { CAMERA_VIEWS } from '../config/constants';

const CameraRig = ({ children }) => {
  const group = useRef();
  const autoAngleRef = useRef(0);
  const snap = useSnapshot(state);
  const { gl } = useThree();

  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const dragRotation = useRef({ x: 0, y: 0 });
  const lastCameraView = useRef(snap.cameraView);

  // When camera preset changes, reset manual rotation offset
  useEffect(() => {
    if (lastCameraView.current !== snap.cameraView) {
      lastCameraView.current = snap.cameraView;
      dragRotation.current = { x: 0, y: 0 };
    }
  }, [snap.cameraView]);

  useEffect(() => {
    const dom = gl?.domElement;
    if (!dom) return;

    const handlePointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      isDragging.current = true;
      prevPointer.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - prevPointer.current.x;
      const deltaY = e.clientY - prevPointer.current.y;
      prevPointer.current = { x: e.clientX, y: e.clientY };

      // Horizontal swipe rotates 360 degrees smoothly
      dragRotation.current.y += deltaX * 0.009;
      // Vertical swipe tilts model up/down slightly
      dragRotation.current.x = Math.max(
        -0.45,
        Math.min(0.45, dragRotation.current.x + deltaY * 0.007)
      );
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [gl?.domElement]);

  useFrame((r3fState, delta) => {
    const isDesktopLayout = window.innerWidth >= 1024;
    const isMobile = window.innerWidth < 768;

    const viewPreset = CAMERA_VIEWS.find((v) => v.id === snap.cameraView) || CAMERA_VIEWS[0];

    let targetPosition;
    if (snap.intro) {
      if (isMobile) {
        targetPosition = [0, 0.24, 2.55];
      } else if (!isDesktopLayout) {
        targetPosition = [-0.15, 0.16, 2.35];
      } else {
        targetPosition = [-0.36, 0, 2];
      }
      autoAngleRef.current = 0;
    } else {
      if (isMobile) {
        targetPosition = [
          viewPreset.camPos[0],
          viewPreset.camPos[1] + 0.06,
          viewPreset.camPos[2] + 0.48,
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
        [
          r3fState.pointer.y / 14 + dragRotation.current.x,
          autoAngleRef.current + dragRotation.current.y,
          0,
        ],
        0.2,
        delta
      );
    } else {
      const baseRotX = snap.intro ? 0 : viewPreset.angle[0];
      const baseRotY = snap.intro ? 0 : viewPreset.angle[1];
      autoAngleRef.current = baseRotY + dragRotation.current.y;

      const pointerHoverX = isMobile ? 0 : r3fState.pointer.y / 10;
      const pointerHoverY = isMobile ? 0 : -r3fState.pointer.x / 5;

      easing.dampE(
        group.current.rotation,
        [
          baseRotX + dragRotation.current.x + pointerHoverX,
          baseRotY + dragRotation.current.y + pointerHoverY,
          0,
        ],
        0.22,
        delta
      );
    }
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
