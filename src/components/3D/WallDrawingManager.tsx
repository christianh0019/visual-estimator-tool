
import { useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { usePlanStore } from '../../store/planStore';
import * as THREE from 'three';
import { Line, Sphere } from '@react-three/drei';

export const WallDrawingManager = () => {
    const { camera, raycaster, pointer } = useThree();
    const isDrawing = usePlanStore(state => state.isDrawing);
    const activePoints = usePlanStore(state => state.activePoints);
    const addPoint = usePlanStore(state => state.addPoint);
    const undoLastPoint = usePlanStore(state => state.undoLastPoint);
    const activeFloor = usePlanStore(state => state.activeFloor);
    const setNamingRoom = usePlanStore(state => state.setNamingRoom);

    const [cursorPos, setCursorPos] = useState<[number, number, number] | null>(null);
    const [hoverStart, setHoverStart] = useState(false);

    // Plane for raycasting (Y = FloorHeight)
    const floorHeight = activeFloor * 1.2; // 1.2 is constant height
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -floorHeight);

    useFrame(() => {
        if (!isDrawing) return;

        raycaster.setFromCamera(pointer, camera);
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, target);

        if (target) {
            // Snap to Grid (0.5 unit = 1ft precision)
            const snap = 0.5;
            const x = Math.round(target.x / snap) * snap;
            const z = Math.round(target.z / snap) * snap;

            setCursorPos([x, floorHeight, z]);

            // Check if hovering start point
            if (activePoints.length > 2) {
                const start = activePoints[0];
                const dx = Math.abs(x - start.x);
                const dz = Math.abs(z - start.y); // Z is Y in data

                // Snap to start if close
                if (dx < 0.5 && dz < 0.5) {
                    setHoverStart(true);
                    setCursorPos([start.x, floorHeight, start.y]);
                    return;
                }
            }
            setHoverStart(false);
        }
    });

    const handleClick = (e: any) => {
        if (!isDrawing || !cursorPos) return;
        e.stopPropagation();

        const [x, , z] = cursorPos;

        // If hovering start and valid polygon -> Close Loop
        if (hoverStart && activePoints.length >= 3) {
            // Trigger naming modal via store
            setNamingRoom(true);
            return;
        }

        // Add Point
        addPoint(x, z);
    };

    // Keyboard Shortcuts (Undo / Cancel)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isDrawing) return;
            if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
                undoLastPoint();
            }
            if (e.key === 'Escape') {
                // Cancel?
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDrawing, undoLastPoint]);

    if (!isDrawing) return null;

    return (
        <group onClick={handleClick}>
            {/* Visual Cursor */}
            {cursorPos && (
                <Sphere position={cursorPos} args={[0.15, 16, 16]}>
                    <meshBasicMaterial color={hoverStart ? "#ef4444" : "#3b82f6"} depthTest={false} opacity={0.8} transparent />
                </Sphere>
            )}

            {/* Existing Lines */}
            {activePoints.map((p, i) => {
                if (i === 0) return null;
                const prev = activePoints[i - 1];
                return (
                    <Line
                        key={p.id}
                        points={[[prev.x, floorHeight, prev.y], [p.x, floorHeight, p.y]]}
                        color="#3b82f6"
                        lineWidth={3}
                    />
                );
            })}

            {/* Start Point Indicator */}
            {activePoints.length > 0 && (
                <Sphere position={[activePoints[0].x, floorHeight, activePoints[0].y]} args={[0.2, 16, 16]}>
                    <meshBasicMaterial color="#ef4444" />
                </Sphere>
            )}

            {/* Ghost Line (Cursor to Last Point) */}
            {activePoints.length > 0 && cursorPos && (
                <Line
                    points={[[activePoints[activePoints.length - 1].x, floorHeight, activePoints[activePoints.length - 1].y], cursorPos]}
                    color={hoverStart ? "#ef4444" : "#93c5fd"}
                    lineWidth={2}
                    dashed
                />
            )}
        </group>
    );
};
