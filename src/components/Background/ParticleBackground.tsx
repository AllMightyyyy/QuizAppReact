// src/components/Background/ParticleBackground.tsx

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Text3D from './Text3D';

interface ParticleBackgroundProps {
    threeDText: string;
}

const particlesCount = window.innerWidth < 768 ? 500 : 1000;

const Particles: React.FC = () => {
    const pointsRef = useRef<THREE.Points>(null!);

    // Generate random positions for particles (stars)
    const particles = React.useMemo(() => {
        const temp = [];
        for (let i = 0; i < particlesCount; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 200;
            temp.push(x, y, z);
        }
        return new Float32Array(temp);
    }, [particlesCount]);

    // Animate particles rotation
    useFrame(() => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.0005;
        }
    });

    return (
        <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.5}
                sizeAttenuation
                depthWrite={false}
                opacity={0.8}
            />
        </Points>
    );
};

const cloudCount = window.innerWidth < 768 ? 200 : 400;

const Clouds: React.FC = () => {
    const pointsRef = useRef<THREE.Points>(null!);

    // Generate random positions for clouds
    const clouds = React.useMemo(() => {
        const temp = [];
        for (let i = 0; i < cloudCount; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 200;
            temp.push(x, y, z);
        }
        return new Float32Array(temp);
    }, [cloudCount]);

    // Animate clouds rotation
    useFrame(() => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y -= 0.0003; // Slower rotation for clouds
        }
    });

    return (
        <Points ref={pointsRef} positions={clouds} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#AAAAAA"
                size={1.5}
                sizeAttenuation
                depthWrite={false}
                opacity={0.3}
            />
        </Points>
    );
};

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ threeDText }) => {
    const [activeText, setActiveText] = useState<string>('');

    useEffect(() => {
        if (threeDText) {
            setActiveText(threeDText);
        }
    }, [threeDText]);

    const handleTextComplete = () => {
        setActiveText('');
    };

    return (
        <Canvas
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
            }}
            camera={{ position: [0, 0, 100], fov: 75 }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 0, 1]} />
            <Particles /> {/* Stars */}
            <Clouds /> {/* Clouds */}
            {activeText && <Text3D text={activeText} onComplete={handleTextComplete} />} {/* 3D Text */}
            <OrbitControls enableZoom={false} />
        </Canvas>
    );
};

export default ParticleBackground;
