
import { useDraggable } from '@dnd-kit/core';
import { ROOM_BLOCKS, type RoomBlock } from '../config/blocks';
import { Plus } from 'lucide-react';

const DraggableBlock = ({ block }: { block: RoomBlock }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${block.id}`,
        data: { block } // Pass block data to drag event
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`p-3 rounded-md border-2 cursor-grab shadow-sm mb-3 bg-white hover:border-slate-400 touch-none flex items-center justify-between group transition-all`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded ${block.color} opacity-70`}></div>
                <div>
                    <div className="text-sm font-bold text-slate-700">{block.label}</div>
                    <div className="text-xs text-slate-400">{block.dimensions.w * 2}x{block.dimensions.h * 2}ft</div>
                </div>
            </div>
            <Plus size={16} className="text-slate-300 group-hover:text-slate-600" />
        </div>
    );
};

export const Sidebar = () => {
    const categories = ['living', 'sleeping', 'utility'];

    return (
        <div className="w-80 bg-white border-r border-slate-200 h-screen overflow-y-auto p-6 fixed left-0 top-0 z-10 shadow-xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Builder<span className="text-indigo-600">Block</span></h1>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Estimation Tool</p>
            </div>

            <div className="space-y-8">
                {categories.map(cat => (
                    <div key={cat}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">{cat}</h3>
                        {ROOM_BLOCKS.filter(b => b.category === cat).map(block => (
                            <DraggableBlock key={block.id} block={block} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
