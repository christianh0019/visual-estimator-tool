
import { usePlanStore } from '../../store/planStore';
import { Layers } from 'lucide-react';

export const HeadsUpDisplay = () => {
    const activeFloor = usePlanStore(state => state.activeFloor);
    const setActiveFloor = usePlanStore(state => state.setActiveFloor);

    return (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:top-32 bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg border border-slate-200 flex flex-col gap-2 z-30">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider text-center mb-1">Floor Level</div>
            <div className="flex gap-1">
                <button
                    onClick={() => setActiveFloor(0)}
                    className={`p-2 rounded flex items-center gap-2 text-sm font-bold transition-colors ${activeFloor === 0
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <Layers size={16} /> Level 1
                </button>
                <button
                    onClick={() => setActiveFloor(1)}
                    className={`p-2 rounded flex items-center gap-2 text-sm font-bold transition-colors ${activeFloor === 1
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <Layers size={16} /> Level 2
                </button>
            </div>
        </div>
    );
};
