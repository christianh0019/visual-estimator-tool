
import { useDroppable } from '@dnd-kit/core';
import { usePlanStore } from '../store/planStore';
import { X } from 'lucide-react';

/* 
 * 1 grid unit = 40px visual size 
 */
const GRID_SIZE = 40;

const PlacedItem = ({ instanceId, x, y, label, dimensions, color }: any) => {
    const removeBlock = usePlanStore(state => state.removeBlock);

    return (
        <div
            className={`absolute flex flex-col items-center justify-center text-center shadow-lg rounded border border-black/10 group ${color} hover:ring-2 ring-indigo-500 z-10`}
            style={{
                width: dimensions.w * GRID_SIZE,
                height: dimensions.h * GRID_SIZE,
                left: x * GRID_SIZE,
                top: y * GRID_SIZE,
                transition: 'all 0.2s ease-out'
            }}
        >
            <span className="text-xs font-bold text-slate-700/80 pointer-events-none">{label}</span>
            <span className="text-[10px] text-slate-500 pointer-events-none">{dimensions.w * 2}x{dimensions.h * 2}ft</span>

            <button
                onClick={(e) => { e.stopPropagation(); removeBlock(instanceId); }}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-red-500"
            >
                <X size={12} />
            </button>
        </div>
    )
}

export const GridCanvas = () => {
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });
    const placedBlocks = usePlanStore(state => state.placedBlocks);

    return (
        <div className="min-h-screen bg-slate-50 p-20 pl-[22rem] overflow-auto">
            <div ref={setNodeRef} className="relative w-[1600px] h-[1200px] bg-white shadow-sm border border-slate-200 grid-pattern rounded-lg">
                {/* Render Placed Blocks */}
                {placedBlocks.map(block => (
                    <PlacedItem
                        key={block.instanceId}
                        {...block}
                    />
                ))}
            </div>
        </div>
    );
};
