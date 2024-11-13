import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import GLOBE from 'vanta/dist/vanta.globe.min';
import { useTheme } from '@mui/material/styles';

interface VantaBackgroundProps {
}

const VantaBackground: React.FC<VantaBackgroundProps> = () => {
    const vantaRef = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const theme = useTheme();

    useEffect(() => {
        if (!vantaEffect && vantaRef.current) {
            setVantaEffect(
                GLOBE({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    color: 0xF5686B,
                    backgroundColor: 0x1A1A1A,
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect, theme]);

    return (
        <div
            ref={vantaRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
            }}
        />
    );
};

export default VantaBackground;
