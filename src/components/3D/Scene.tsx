
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, Environment } from '@react-three/drei';
import { useDroppable } from '@dnd-kit/core';
import { usePlanStore } from '../../store/planStore';
import { RoomMesh } from './RoomMesh';

export const Scene = () => {
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });
    const placedBlocks = usePlanStore(state => state.placedBlocks);
    const activeFloor = usePlanStore(state => state.activeFloor);

    // Filter blocks based on visibility preference?
    // For now, let's show all blocks, but maybe fade out upper floors if we are on level 0?
    // Or just show everything. The user prompt implied "3d blocks so they can do a second floor".
    // Showing everything is better for 3D context.

    return (
        <div ref={setNodeRef} className="w-full h-screen bg-slate-100">
            <Canvas shadows camera={{ position: [15, 15, 15], fov: 50 }}>
                <color attach="background" args={['#f1f5f9']} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    castShadow
                    position={[10, 20, 10]}
                    intensity={1.5}
                    shadow-mapSize={[1024, 1024]}
                >
                    <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
                </directionalLight>

                <Environment preset="city" />
                <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={50} blur={2} far={4} />

                {/* Controls */}
                <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} />

                {/* Grid */}
                <Grid
                    infiniteGrid
                    fadeDistance={50}
                    sectionSize={1}
                    cellSize={1}
                    sectionColor="#cbd5e1"
                    cellColor="#e2e8f0"
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

                {/* Active Floor Indicator (Optional - Ghost Grid at level 1?) */}
                {activeFloor === 1 && (
                    <gridHelper position={[0, 1.2, 0]} args={[50, 50, 0x0000ff, 0x0000ff]} rotation={[0, 0, 0]} visible={false} /> // Hidden helper
                )}

            </Canvas>
        </div>
    );
};
