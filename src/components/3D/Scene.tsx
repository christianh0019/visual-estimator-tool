import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid, ContactShadows, Environment } from '@react-three/drei';
import { useDroppable } from '@dnd-kit/core';
import { usePlanStore } from '../../store/planStore';
import { RoomMesh } from './RoomMesh';
import { useRef, useEffect } from 'react';

interface SceneProps {
    currentView: 'ISO' | 'TOP';
}

export const Scene = ({ currentView }: SceneProps) => {
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });
    const placedBlocks = usePlanStore(state => state.placedBlocks);
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

                {/* Controls - Fixed Views Only */}
                <CameraControls ref={cameraControlsRef} maxPolarAngle={Math.PI / 2} minPolarAngle={0} />

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

                {/* Render Blocks */}
                <group>
                    {placedBlocks.map(block => (
                        <RoomMesh
                            key={block.instanceId}
                            block={block}
                            isInteractive={true}
                        />
                    ))}
                </group>

                {/* Active Floor Indicator */}
                {activeFloor === 1 && (
                    <gridHelper position={[0, 1.2, 0]} args={[50, 50, 0x0000ff, 0x0000ff]} rotation={[0, 0, 0]} visible={false} />
                )}

            </Canvas>
        </div>
    );
};
