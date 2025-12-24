
import { useRef, useState } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { usePlanStore, type PlacedBlock } from '../../store/planStore';
import * as THREE from 'three';

interface RoomMeshProps {
    block: PlacedBlock;
    isInteractive: boolean;
}

export const RoomMesh = ({ block, isInteractive }: RoomMeshProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    const removeBlock = usePlanStore(state => state.removeBlock);
    const rotateBlock = usePlanStore(state => state.rotateBlock);

    // Grid unit size
    const UNIT = 1; // logical units in Scene (mapped to 40px blocks usually, but we scale here)
    const HEIGHT = 1.2; // Floor height

    // Animate position and scale
    const { position, scale } = useSpring({
        position: [
            block.x * UNIT + (block.dimensions.w * UNIT) / 2,
            block.floor * HEIGHT + (HEIGHT / 2),
            block.y * UNIT + (block.dimensions.h * UNIT) / 2
        ],
        scale: hovered ? 1.02 : 1,
        config: { mass: 1, tension: 170, friction: 26 }
    });

    // Map tailwind class to rough hex approximation (MVP)
    const getColor = (className: string) => {
        if (className.includes('indigo')) return '#e0e7ff';
        if (className.includes('blue')) return '#dbeafe';
        if (className.includes('emerald')) return '#d1fae5';
        if (className.includes('orange')) return '#ffedd5';
        if (className.includes('slate')) return '#f1f5f9';
        if (className.includes('cyan')) return '#cffafe';
        if (className.includes('amber')) return '#fef3c7';
        if (className.includes('stone')) return '#e7e5e4';
        return '#ffffff';
    }

    const baseColor = getColor(block.color);

    return (
        <group>
            {/* The Room Volume */}
            <animated.mesh
                ref={meshRef}
                position={position as any}
                scale={scale}
                onClick={(e: any) => {
                    if (!isInteractive) return;
                    e.stopPropagation();
                    // Simple rotation on click
                    rotateBlock(block.instanceId);
                }}
                onPointerOver={(e: any) => {
                    if (!isInteractive) return;
                    e.stopPropagation();
                    setHover(true);
                }}
                onPointerOut={() => {
                    if (!isInteractive) return;
                    setHover(false);
                }}
                castShadow
                receiveShadow
            >
                {/* Visual Box */}
                <RoundedBox
                    args={[block.dimensions.w * UNIT - 0.1, HEIGHT - 0.1, block.dimensions.h * UNIT - 0.1]} // With gap
                    radius={0.05}
                    smoothness={4}
                >
                    <meshStandardMaterial color={baseColor} />
                </RoundedBox>

                {/* Label Text Floating Above */}
                <Text
                    position={[0, HEIGHT / 2 + 0.1, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.3}
                    color="#1e293b"
                    anchorX="center"
                    anchorY="middle"
                >
                    {block.label}
                </Text>

                {/* Delete Button (Pseudo) - Right click to delete? */}
                {hovered && (
                    <mesh position={[block.dimensions.w / 2 - 0.5, HEIGHT / 2 + 0.2, -block.dimensions.h / 2 + 0.5]} onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.instanceId);
                    }}>
                        <sphereGeometry args={[0.2]} />
                        <meshBasicMaterial color="#ef4444" />
                    </mesh>
                )}
            </animated.mesh>
        </group>
    );
};
