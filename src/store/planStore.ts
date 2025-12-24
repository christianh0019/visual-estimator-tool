
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RoomBlock } from '../config/blocks';

export interface PlacedBlock extends RoomBlock {
    instanceId: string; // Unique ID for this specific placed block
    x: number; // Grid X coordinate
    y: number; // Grid Y coordinate
    floor: number; // 0 for ground, 1 for second floor
    rotation: number; // 0, 90, 180, 270
}

interface PlanState {
    placedBlocks: PlacedBlock[];
    totalCost: number;
    totalSqFt: number;
    activeFloor: number;

    setActiveFloor: (floor: number) => void;
    addBlock: (block: RoomBlock, x: number, y: number) => void;
    removeBlock: (instanceId: string) => void;
    moveBlock: (instanceId: string, x: number, y: number) => void;
    rotateBlock: (instanceId: string) => void;
    resetPlan: () => void;
}

export const usePlanStore = create<PlanState>()(persist((set) => ({
    placedBlocks: [],
    totalCost: 0,
    totalSqFt: 0,
    activeFloor: 0,

    setActiveFloor: (floor) => set({ activeFloor: floor }),

    addBlock: (block, x, y) => set((state) => {
        const newBlock: PlacedBlock = {
            ...block,
            instanceId: Math.random().toString(36).substr(2, 9),
            x,
            y,
            floor: state.activeFloor,
            rotation: 0
        };
        const newBlocks = [...state.placedBlocks, newBlock];
        return calculateTotals(newBlocks);
    }),

    removeBlock: (instanceId) => set((state) => {
        const newBlocks = state.placedBlocks.filter(b => b.instanceId !== instanceId);
        return calculateTotals(newBlocks);
    }),

    moveBlock: (instanceId, x, y) => set((state) => {
        const newBlocks = state.placedBlocks.map(b =>
            b.instanceId === instanceId ? { ...b, x, y } : b
        );
        return calculateTotals(newBlocks);
    }),

    rotateBlock: (instanceId) => set((state) => {
        const newBlocks = state.placedBlocks.map(b =>
            b.instanceId === instanceId ? { ...b, rotation: (b.rotation + 90) % 360 } : b
        );
        return calculateTotals(newBlocks);
    }),

    resetPlan: () => set({ placedBlocks: [], totalCost: 0, totalSqFt: 0 })
}), {
    name: 'builder-plan-storage',
}));

// Helper to recalculate totals
const calculateTotals = (blocks: PlacedBlock[]) => {
    const totalCost = blocks.reduce((acc, b) => acc + b.baseCost, 0);
    // Assuming 1 grid unit = 2ft, so 1x1 unit = 4 sqft
    const totalSqFt = blocks.reduce((acc, b) => acc + (b.dimensions.w * 2 * b.dimensions.h * 2), 0);

    return {
        placedBlocks: blocks,
        totalCost,
        totalSqFt
    };
};
