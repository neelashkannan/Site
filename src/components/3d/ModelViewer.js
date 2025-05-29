import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment, Stage } from '@react-three/drei';
import styled from 'styled-components';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

const ViewerContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  position: relative;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  canvas {
    outline: none;
  }
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;
  color: white;
  font-family: 'Orbitron', sans-serif;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s ease-in-out infinite;
    margin-right: 15px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ControlsOverlay = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  z-index: 5;
`;

const ControlButton = styled.button`
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.6);
  }
  
  svg {
    width: 18px;
    height: 18px;
    fill: white;
  }
`;

const EmptyMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--text-secondary);
  width: 80%;
  
  h3 {
    margin-bottom: 10px;
    font-family: 'Orbitron', sans-serif;
  }
  
  p {
    font-size: 0.9rem;
  }
  
  svg {
    width: 50px;
    height: 50px;
    margin-bottom: 15px;
    fill: var(--primary-color);
    opacity: 0.6;
  }
`;

const Model = ({ file, fileType }) => {
  const { camera } = useThree();
  
  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  // Load different model types
  if (fileType === 'stl') {
    const geometry = useLoader(STLLoader, file);
    return (
      <mesh>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial color="#3498db" roughness={0.5} metalness={0.2} />
      </mesh>
    );
  } else if (fileType === 'obj') {
    const obj = useLoader(OBJLoader, file);
    return <primitive object={obj} />;
  } else if (fileType === 'gltf' || fileType === 'glb') {
    const { scene } = useGLTF(file);
    return <primitive object={scene} />;
  }
  
  return null;
};

const ModelViewer = ({ file, fileType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const controlsRef = useRef();
  
  useEffect(() => {
    if (file) {
      setIsLoading(true);
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [file]);
  
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };
  
  const renderModelViewer = () => {
    if (!file) {
      return (
        <EmptyMessage>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
          </svg>
          <h3>No Model Loaded</h3>
          <p>Upload a 3D model file (STL, OBJ, GLTF, GLB) to view it here</p>
        </EmptyMessage>
      );
    }
    
    return (
      <>
        {isLoading && (
          <LoadingOverlay>
            <div className="spinner"></div>
            <span>Loading Model...</span>
          </LoadingOverlay>
        )}
        
        <Canvas shadows dpr={[1, 2]}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <Stage environment="city" intensity={0.5}>
              {file && fileType && <Model file={file} fileType={fileType} />}
            </Stage>
            <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} enableRotate={true} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
        
        <ControlsOverlay>
          <ControlButton onClick={resetCamera} title="Reset Camera">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
          </ControlButton>
        </ControlsOverlay>
      </>
    );
  };
  
  return (
    <ViewerContainer>
      {renderModelViewer()}
    </ViewerContainer>
  );
};

export default ModelViewer; 