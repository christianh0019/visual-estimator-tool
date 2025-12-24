
import { useRef, useState } from 'react';
import { RoundedBox, Text, PivotControls } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { usePlanStore, type PlacedBlock } from '../../store/planStore';
import * as THREE from 'three';

interface RoomMeshProps {
    block: PlacedBlock;
    isInteractive: boolean;
}

export const RoomMesh = ({ block, isInteractive }: RoomMeshProps) => {
    const [hovered, setHover] = useState(false);
    const removeBlock = usePlanStore(state => state.removeBlock);
    const rotateBlock = usePlanStore(state => state.rotateBlock);
    const moveBlock = usePlanStore(state => state.moveBlock);

    // Store latest drag matrix to commit on release
    const dragMatrixRef = useRef<THREE.Matrix4>(new THREE.Matrix4());

    // Grid unit size
    const UNIT = 1;
    const HEIGHT = 1.2;

    // Animate position and scale
    const { scale } = useSpring({
        scale: hovered ? 1.02 : 1,
        config: { mass: 1, tension: 170, friction: 26 }
    });

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

    // Initial position for the block
    const position: [number, number, number] = [
        block.x * UNIT + (block.dimensions.w * UNIT) / 2,
        block.floor * HEIGHT + (HEIGHT / 2),
        block.y * UNIT + (block.dimensions.h * UNIT) / 2
    ];

    return (
        <group>
            {isInteractive ? (
                <PivotControls
                    visible={hovered}
                    scale={1.2}
                    lineWidth={2.5}
                    depthTest={false}
                    axisColors={['#ef4444', '#22c55e', '#3b82f6']}
                    fixed={true}
                    disableAxes={false}
                    disableSliders={true}
                    disableRotations={true}
                    activeAxes={[true, false, true]} // Allow X and Z movement
                    offset={[block.dimensions.w * UNIT / 2, 0, block.dimensions.h * UNIT / 2]} // Pivot at center
                    onDrag={(matrix) => {
                        dragMatrixRef.current.copy(matrix);
                    }}
                    onDragEnd={() => {
                        const matrix = dragMatrixRef.current;
                        // Extract translation from matrix
                        const elements = matrix.elements;
                        // Translation components are at indices 12, 13, 14
                        const dx = elements[12];
                        const dz = elements[14];

                        // Calculate new grid coordinates
                        const currentX = block.x * UNIT;
                        const currentY = block.y * UNIT; // Y in store is Z in 3D

                        const newWorldX = currentX + dx;
                        const newWorldY = currentY + dz;

                        const newGridX = Math.max(0, Math.round(newWorldX / UNIT));
                        const newGridY = Math.max(0, Math.round(newWorldY / UNIT));

                        if (newGridX !== block.x || newGridY !== block.y) {
                            moveBlock(block.instanceId, newGridX, newGridY);
                        }
                    }}
                    autoTransform={false}
                >
                    <RoomGroup
                        position={position}
                        scale={scale as any}
                        block={block}
                        baseColor={baseColor}
                        rotateBlock={rotateBlock}
                        removeBlock={removeBlock}
                        setHover={setHover}
                        hovered={hovered}
                    />
                </PivotControls>
            ) : (
                <RoomGroup
                    position={position}
                    scale={scale as any}
                    block={block}
                    baseColor={baseColor}
                    rotateBlock={rotateBlock}
                    removeBlock={removeBlock}
                    setHover={setHover}
                    hovered={hovered}
                />
            )}
        </group>
    );
};

// Extracted inner component to avoid spring / ref conflict complexity in the render loop
const RoomGroup = ({ position, scale, block, baseColor, rotateBlock, removeBlock, setHover, hovered }: any) => {
    // Dimensions
    const UNIT = 1;
    const HEIGHT = 1.2;

    return (
        <animated.mesh
            position={position}
            scale={scale}
            onClick={(e: any) => {
                e.stopPropagation();
                // Check if we dragged? PivotControls handles drag interception mostly.
                // If we clicked without dragging:
                rotateBlock(block.instanceId);
            }}
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

            {hovered && (
                <mesh position={[block.dimensions.w * UNIT / 2 - 0.4, HEIGHT / 2 + 0.1, -block.dimensions.h * UNIT / 2 + 0.4]} onClick={(e) => {
                    e.stopPropagation();
                    removeBlock(block.instanceId);
                }}>
                    <sphereGeometry args={[0.15]} />
                    <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
                </mesh>
            )}
        </animated.mesh>
    )
}
