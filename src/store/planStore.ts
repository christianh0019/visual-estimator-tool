
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RoomBlock } from '../config/blocks';

// --- New Vector Data Models ---
export interface WallNode {
    id: string;
    x: number;
    y: number;
}

export interface RoomPolygon {
    id: string;
    name: string;
    points: WallNode[]; // Ordered list of corners
    floor: number;
    sqFt: number;
    cost: number;
    color: string; // Hex for floor color
}

// --- Legacy / Hybrid Models ---
export interface PlacedBlock extends RoomBlock {
    instanceId: string;
    x: number;
    y: number;
    floor: number;
    rotation: number;
}

interface PlanState {
    // Drawing State
    isDrawing: boolean;
    activePoints: WallNode[]; // Points currently being drawn (not yet a room)

    // Persisted Data
    rooms: RoomPolygon[];

    // Legacy / Hybrid
    placedBlocks: PlacedBlock[];

    // Global Stats
    totalCostLow: number;
    totalCostHigh: number;
    totalSqFt: number;
    activeFloor: number;

    // Naming State
    isNamingRoom: boolean;

    // Actions
    setIsDrawing: (isDrawing: boolean) => void;
    setNamingRoom: (isNaming: boolean) => void;

    addPoint: (x: number, y: number) => void; // Adds a point to activePoints
    undoLastPoint: () => void;
    resetDrawing: () => void; // Cancels current drawing
    submitRoom: (name: string, floorIndex: number) => void; // Finalizes activePoints into a Room
    removeRoom: (id: string) => void;

    setActiveFloor: (floor: number) => void;

    // Legacy Actions (kept for safety during transition)
    addBlock: (block: RoomBlock, x: number, y: number) => void;
    removeBlock: (instanceId: string) => void;
    moveBlock: (instanceId: string, x: number, y: number) => void;
    rotateBlock: (instanceId: string) => void;
    resetPlan: () => void;
}

const COST_PER_SQFT = 150; // Base cost

// Helper to calculate polygon area (Shoelace Formula)
const calculateArea = (points: WallNode[]) => {
    if (points.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
};

// Helper: 1 unit = 2ft. Area(units) * 4 = Area(sqft)
const UNIT_TO_SQFT = 4;

const calculateTotals = (rooms: RoomPolygon[], blocks: PlacedBlock[]) => {
    const roomSqFt = rooms.reduce((acc, r) => acc + r.sqFt, 0);
    const blockSqFt = blocks.reduce((acc, b) => acc + (b.dimensions.w * 2 * b.dimensions.h * 2), 0);

    const totalSqFt = roomSqFt + blockSqFt;

    const baseTotal = (roomSqFt * COST_PER_SQFT) + blocks.reduce((acc, b) => acc + b.baseCost, 0);

    const totalCostLow = baseTotal;
    const totalCostHigh = Math.round(baseTotal * 1.45);

    return { totalCostLow, totalCostHigh, totalSqFt };
};

export const usePlanStore = create<PlanState>()(
    persist(
        (set) => ({
            isDrawing: false,
            isNamingRoom: false,
            activePoints: [],
            rooms: [],
            placedBlocks: [],
            totalCostLow: 0,
            totalCostHigh: 0,
            totalSqFt: 0,
            activeFloor: 0,

            setIsDrawing: (isDrawing) => set({ isDrawing, activePoints: [] }),
            setNamingRoom: (isNaming) => set({ isNamingRoom: isNaming }),

            addPoint: (x, y) => set(state => {
                // Prevent duplicates (double clicks)
                const last = state.activePoints[state.activePoints.length - 1];
                if (last && last.x === x && last.y === y) return state;

                return { activePoints: [...state.activePoints, { id: Math.random().toString(36).substr(2, 9), x, y }] };
            }),

            undoLastPoint: () => set(state => ({
                activePoints: state.activePoints.slice(0, -1)
            })),

            resetDrawing: () => set({ activePoints: [] }),

            submitRoom: (name, floorIndex) => set(state => {
                const points = state.activePoints;
                if (points.length < 3) return state; // Invalid

                // Calculate Area
                // NOTE: Our Grid is X/Y. 
                // X = width, Y = depth (which maps to Z in 3D).
                const areaUnits = calculateArea(points);
                const sqFt = Math.round(areaUnits * UNIT_TO_SQFT);
                const cost = sqFt * COST_PER_SQFT;

                const newRoom: RoomPolygon = {
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    points,
                    floor: floorIndex,
                    sqFt,
                    cost,
                    color: '#e2e8f0' // Default Slate-200
                };

                const newRooms = [...state.rooms, newRoom];
                const totals = calculateTotals(newRooms, state.placedBlocks);

                return {
                    rooms: newRooms,
                    activePoints: [], // Reset drawing
                    isNamingRoom: false,
                    ...totals
                };
            }),

            removeRoom: (id) => set(state => {
                const newRooms = state.rooms.filter(r => r.id !== id);
                const totals = calculateTotals(newRooms, state.placedBlocks);
                return { rooms: newRooms, ...totals };
            }),

            setActiveFloor: (floor) => set({ activeFloor: floor, activePoints: [] }), // Clear drawing if switching floors

            // --- LEGACY ADAPTERS ---
            // Keeping these functioning so the build doesn't break, 
            // but the UI will eventually stop calling them.
            addBlock: (block, x, y) => set((state) => {
                const newBlock: PlacedBlock = {
                    ...block,
                    instanceId: Math.random().toString(36).substr(2, 9),
                    x, y, floor: state.activeFloor, rotation: 0
                };
                const newBlocks = [...state.placedBlocks, newBlock];
                return { placedBlocks: newBlocks, ...calculateTotals(state.rooms, newBlocks) };
            }),

            removeBlock: (instanceId) => set((state) => {
                const newBlocks = state.placedBlocks.filter(b => b.instanceId !== instanceId);
                return { placedBlocks: newBlocks, ...calculateTotals(state.rooms, newBlocks) };
            }),

            moveBlock: (instanceId, x, y) => set((state) => {
                const newBlocks = state.placedBlocks.map(b => b.instanceId === instanceId ? { ...b, x, y } : b);
                return { placedBlocks: newBlocks, ...calculateTotals(state.rooms, newBlocks) };
            }),

            rotateBlock: (instanceId) => set((state) => {
                const newBlocks = state.placedBlocks.map(b => b.instanceId === instanceId ? { ...b, rotation: (b.rotation + 90) % 360 } : b);
                return { placedBlocks: newBlocks, ...calculateTotals(state.rooms, newBlocks) };
            }),

            resetPlan: () => set({ placedBlocks: [], rooms: [], activePoints: [], totalCostLow: 0, totalCostHigh: 0, totalSqFt: 0 })
        }),
        {
            name: 'builder-plan-storage',
        }
    )
);
