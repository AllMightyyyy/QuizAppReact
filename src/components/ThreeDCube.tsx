import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial } from '@react-three/drei';

const ThreeDCube: React.FC = () => {
    return (
        <Canvas
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
            }}
            camera={{ position: [0, 0, 5], fov: 60 }}
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <MeshDistortMaterial color="#801BEC" distort={0.5} speed={2} />
            </mesh>
            <OrbitControls enableZoom={false} />
        </Canvas>
    );
};

export default ThreeDCube;
