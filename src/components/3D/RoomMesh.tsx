
import { useState } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { useThree } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { usePlanStore, type PlacedBlock } from '../../store/planStore';
import * as THREE from 'three';

interface RoomMeshProps {
    block: PlacedBlock;
    isInteractive: boolean;
}

export const RoomMesh = ({ block, isInteractive }: RoomMeshProps) => {
    const [hovered, setHover] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const removeBlock = usePlanStore(state => state.removeBlock);
    const rotateBlock = usePlanStore(state => state.rotateBlock);
    const moveBlock = usePlanStore(state => state.moveBlock);

    const { camera, raycaster } = useThree();

    // Grid unit size
    const UNIT = 1;
    const HEIGHT = 1.2;

    // Calculate target position based on block state
    const targetPosition: [number, number, number] = [
        block.x * UNIT + (block.dimensions.w * UNIT) / 2,
        block.floor * HEIGHT + (HEIGHT / 2),
        block.y * UNIT + (block.dimensions.h * UNIT) / 2
    ];

    // Spring for smooth animation
    const [{ position, scale }, api] = useSpring(() => ({
        position: targetPosition,
        scale: 1,
        config: { mass: 1, tension: 170, friction: 26 }
    }), [block.x, block.y, block.floor]);

    // Update spring when block prop changes (unless dragging)
    if (!isDragging) {
        api.start({
            position: targetPosition,
            scale: hovered ? 1.02 : 1
        });
    }

    // Map tailwind class to rough hex approximation
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

    // Drag Logic
    const bind = useDrag(({ active, xy: [sx, sy], event, tap }) => {
        if (!isInteractive) return;

        // Propagate tap to click handler for rotation
        if (tap) {
            rotateBlock(block.instanceId);
            return;
        }

        event.stopPropagation();
        setIsDragging(active);

        if (active) {
            // Raycast to floor
            const x = (sx / window.innerWidth) * 2 - 1;
            const y = -(sy / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera({ x, y } as any, camera);

            const planeY = block.floor * HEIGHT;
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -planeY);
            const target = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, target);

            if (target) {
                // Snap to valid grid for visual feedback
                const rawGridX = Math.round(target.x - block.dimensions.w * UNIT / 2);
                const rawGridY = Math.round(target.z - block.dimensions.h * UNIT / 2);

                const gridX = Math.max(0, rawGridX);
                const gridY = Math.max(0, rawGridY);

                const newX = gridX * UNIT + (block.dimensions.w * UNIT) / 2;
                const newZ = gridY * UNIT + (block.dimensions.h * UNIT) / 2;
                const newY = block.floor * HEIGHT + (HEIGHT / 2);

                // Update visual position immediately
                api.start({ position: [newX, newY, newZ], scale: 1.05, immediate: true });
            }
        } else {
            // Drag End - Commit
            const currentSpringPos = position.get();
            // Reverse calculate grid from world pos
            const currentWorldX = currentSpringPos[0];
            const currentWorldZ = currentSpringPos[2]; // Y in spring is Z

            const gridX = Math.round((currentWorldX - (block.dimensions.w * UNIT) / 2) / UNIT);
            const gridY = Math.round((currentWorldZ - (block.dimensions.h * UNIT) / 2) / UNIT);

            if (gridX !== block.x || gridY !== block.y) {
                moveBlock(block.instanceId, gridX, gridY);
            } else {
                // Reset if no move
                api.start({ position: targetPosition, scale: 1 });
            }
        }
    }, { filterTaps: true, threshold: 5 }); // Slight threshold to distinguish click/drag

    return (
        <animated.mesh
            {...(bind() as any)}
            position={position as any}
            scale={scale}
            onPointerOver={(e: any) => {
                e.stopPropagation();
                setHover(true);
            }}
            onPointerOut={() => {
                setHover(false);
            }}
            castShadow
            receiveShadow
        >
            <RoundedBox
                args={[block.dimensions.w * UNIT - 0.05, HEIGHT - 0.05, block.dimensions.h * UNIT - 0.05]}
                radius={0.05}
                smoothness={4}
            >
                <meshStandardMaterial color={baseColor} roughness={0.3} metalness={0.1} />
            </RoundedBox>

            <Text
                position={[0, HEIGHT / 2 + 0.06, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.25}
                color="#334155"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                {block.label}
            </Text>

            {hovered && !isDragging && (
                <mesh position={[block.dimensions.w * UNIT / 2 - 0.4, HEIGHT / 2 + 0.1, -block.dimensions.h * UNIT / 2 + 0.4]} onClick={(e) => {
                    e.stopPropagation();
                    removeBlock(block.instanceId);
                }}>
                    <sphereGeometry args={[0.15]} />
                    <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
                </mesh>
            )}
        </animated.mesh>
    );
};
