
import { useMemo } from 'react';
import * as THREE from 'three';
import { Extrude, Text } from '@react-three/drei';
import { usePlanStore, type RoomPolygon } from '../../store/planStore';

interface ProceduralRoomProps {
    room: RoomPolygon;
}

export const ProceduralRoom = ({ room }: ProceduralRoomProps) => {
    const removeRoom = usePlanStore(state => state.removeRoom);

    // Geometry Generation
    const { shape, center } = useMemo(() => {
        const shape = new THREE.Shape();
        if (room.points.length < 3) return { shape, center: [0, 0, 0] };

        // Move to first point
        shape.moveTo(room.points[0].x, room.points[0].y);

        // Line to subsequent points
        for (let i = 1; i < room.points.length; i++) {
            shape.lineTo(room.points[i].x, room.points[i].y);
        }
        // Close shape
        shape.lineTo(room.points[0].x, room.points[0].y);

        // Calculate centroid for text
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        room.points.forEach(p => {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        });
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        return { shape, center: [centerX, room.floor * 1.2, centerY] };
    }, [room.points, room.floor]);

    // Wall Height extrude
    const wallHeight = 1.2;

    // We actually need to stroke the shape for walls, or use separate geometry.
    // For MVP, let's extrude the Floor Shape UPWARD to make a volume (Solid Block Style)
    // Or, more professionally: Floor is a plane, Walls are 'LineLoop' extruded. 
    // Let's stick to "Solid Volume" style matching the blocks for now.

    return (
        <group>
            {/* Floor Mesh */}
            <group rotation={[-Math.PI / 2, 0, 0]} position={[0, room.floor * 1.2 + 0.05, 0]}>
                <Extrude args={[shape, { depth: wallHeight, bevelEnabled: false }]}>
                    <meshStandardMaterial color="white" transparent opacity={0.9} side={THREE.DoubleSide} />
                </Extrude>
            </group>

            {/* Room Name Label */}
            <Text
                position={[center[0], center[1] + wallHeight + 0.2, center[2]]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.4}
                color="#1e293b"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                {room.name}
            </Text>
            <Text
                position={[center[0], center[1] + wallHeight + 0.2, center[2] + 0.4]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.2}
                color="#64748b"
                anchorX="center"
                anchorY="middle"
            >
                {room.sqFt} sq.ft
            </Text>

            {/* Remove Handle (Clickable Sphere in center) */}
            <mesh
                position={[center[0], center[1] + wallHeight + 0.5, center[2]]}
                onClick={(e) => { e.stopPropagation(); removeRoom(room.id); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <sphereGeometry args={[0.2]} />
                <meshStandardMaterial color="#ef4444" transparent opacity={0.0} /> {/* Invisible click target */}
            </mesh>
        </group>
    );
};
