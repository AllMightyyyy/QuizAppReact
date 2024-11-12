// src/components/Background/Text3D.tsx

import React, { useRef, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface Text3DProps {
    text: string;
    onComplete: () => void;
}

const Text3D: React.FC<Text3DProps> = ({ text, onComplete }) => {
    const textRef = useRef<Mesh>(null!);
    const speed = 0.02; // Speed at which text moves deep

    useEffect(() => {
        // Reset position and scale when text changes
        if (textRef.current) {
            textRef.current.position.z = 0;
            textRef.current.scale.set(0.5, 0.5, 0.5); // Start small
        }
    }, [text]);

    useFrame(() => {
        if (textRef.current) {
            textRef.current.position.z -= speed; // Move along Z-axis
            textRef.current.scale.x += 0.001; // Optionally scale up
            textRef.current.scale.y += 0.001;
            textRef.current.scale.z += 0.001;

            if (textRef.current.position.z < -10) { // Threshold to remove text
                onComplete();
            }
        }
    });

    return (
        <Text
            ref={textRef}
            position={[0, 0, 0]}
            font="/fonts/Roboto-Medium.ttf" // URL to a font
            fontSize={1}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
        >
            {text}
        </Text>
    );
};

export default Text3D;
