import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid, ContactShadows, Environment } from '@react-three/drei';
import { useDroppable } from '@dnd-kit/core';
import { usePlanStore } from '../../store/planStore';
import { WallDrawingManager } from './WallDrawingManager';
import { ProceduralRoom } from './ProceduralRoom';
import { RoomMesh } from './RoomMesh';
import { useRef, useEffect } from 'react';

interface SceneProps {
    currentView: 'ISO' | 'TOP';
}

// Component to handle resolving 2D drops to 3D grid
// DropResolver removed (replaced by Wall Drawing System)

export const Scene = ({ currentView }: SceneProps) => {
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });
    const placedBlocks = usePlanStore(state => state.placedBlocks);
    const rooms = usePlanStore(state => state.rooms);
    const isDrawing = usePlanStore(state => state.isDrawing);
    const activeFloor = usePlanStore(state => state.activeFloor);
    const cameraControlsRef = useRef<CameraControls>(null);

    // Filter blocks based on visibility preference?
    // For now, let's show all blocks, but maybe fade out upper floors if we are on level 0?
    // Or just show everything. The user prompt implied "3d blocks so they can do a second floor".
    // Showing everything is better for 3D context.

    // Update camera when view changes
    useEffect(() => {
        if (!cameraControlsRef.current) return;

        if (currentView === 'ISO') {
            cameraControlsRef.current.setLookAt(20, 20, 20, 0, 0, 0, true);
        } else if (currentView === 'TOP') {
            cameraControlsRef.current.setLookAt(0, 40, 0, 0, 0, 0, true);
        }
    }, [currentView]);

    return (
        <div ref={setNodeRef} className="w-full h-screen bg-slate-100">
            <Canvas shadows camera={{ position: [20, 20, 20], fov: 45 }}>
                {/* DropResolver Removed */}
                <WallDrawingManager />
                <color attach="background" args={['#f8fafc']} />

                {/* Lighting */}
                <ambientLight intensity={0.7} />
                <directionalLight
                    castShadow
                    position={[15, 25, 15]}
                    intensity={1.2}
                    shadow-mapSize={[2048, 2048]}
                    shadow-bias={-0.0001}
                >
                    <orthographicCamera attach="shadow-camera" args={[-30, 30, 30, -30]} />
                </directionalLight>

                <Environment preset="studio" />
                <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={60} blur={2.5} far={4} color="#0f172a" />

                {/* Controls - LOCKED */}
                <CameraControls
                    ref={cameraControlsRef}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={0}
                    mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }} // Disable mouse interaction
                    touches={{ one: 0, two: 0, three: 0 }} // Disable touch interaction
                />

                {/* Grid - More subtle */}
                <Grid
                    infiniteGrid
                    fadeDistance={60}
                    sectionSize={1}
                    cellSize={1}
                    sectionColor="#cbd5e1"
                    cellColor="#e2e8f0"
                    sectionThickness={1}
                    cellThickness={0.5}
                />

                {/* Generated Rooms */}
                {rooms.map(room => (
                    <ProceduralRoom key={room.id} room={room} />
                ))}

                {/* Legacy Blocks (Keep for now if needed) */}
                {placedBlocks.map(block => (
                    <RoomMesh key={block.instanceId} block={block} isInteractive={!isDrawing} />
                ))}

                {/* Active Floor Indicator */}
                {activeFloor === 1 && (
                    <gridHelper position={[0, 1.2, 0]} args={[50, 50, 0x0000ff, 0x0000ff]} rotation={[0, 0, 0]} visible={false} />
                )}

            </Canvas>
        </div>
    );
};
