
import { usePlanStore } from '../../store/planStore';
import { Layers, Box, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { LeadCaptureModal } from '../LeadCaptureModal';

interface HeadsUpDisplayProps {
    currentView: 'ISO' | 'TOP';
    onViewChange: (view: 'ISO' | 'TOP') => void;
}

export const HeadsUpDisplay = ({ currentView, onViewChange }: HeadsUpDisplayProps) => {
    // We display range: Low to High
    const totalCostLow = usePlanStore(state => state.totalCostLow);
    const totalCostHigh = usePlanStore(state => state.totalCostHigh);

    // totalCost is deprecated for display, but safe to keep in store 
    // const totalCost = usePlanStore(state => state.totalCost); 

    const totalSqFt = usePlanStore(state => state.totalSqFt);
    const activeFloor = usePlanStore(state => state.activeFloor);
    const setActiveFloor = usePlanStore(state => state.setActiveFloor);

    // Modal state
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    // formatCurrency removed (unused)

    const formatRange = (low: number, high: number) => {
        if (low === 0) return '$0';
        // Compact format: $150k - $220k
        const toK = (num: number) => `$${Math.round(num / 1000)}k`;
        return `${toK(low)} - ${toK(high)}`;
    }

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-40 p-4 pointer-events-none">
                <div className="max-w-4xl mx-auto flex justify-between items-start">

                    {/* Stats Card */}
                    <div className="bg-white/90 backdrop-blur shadow-lg rounded-2xl p-4 border border-white/20 pointer-events-auto flex flex-col gap-2 min-w-[200px]">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-2 mb-1">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Box size={20} />
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Cost</div>
                                <div className="text-xl font-bold text-slate-800">
                                    {formatRange(totalCostLow, totalCostHigh)}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm px-1">
                            <div className="text-slate-500">Total Area</div>
                            <div className="font-bold text-slate-700">{totalSqFt} sq.ft</div>
                        </div>

                        <button
                            onClick={() => setIsLeadModalOpen(true)}
                            className="mt-2 w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                        >
                            Get Full Quote <ArrowRight size={14} />
                        </button>
                    </div>

                    {/* View Controls */}
                    <div className="bg-white/90 backdrop-blur shadow-lg rounded-xl p-1 border border-white/20 pointer-events-auto flex gap-1">
                        <button
                            onClick={() => onViewChange('ISO')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentView === 'ISO' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            3D VIEW
                        </button>
                        <button
                            onClick={() => onViewChange('TOP')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentView === 'TOP' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            BLUEPRINT
                        </button>
                    </div>

                    {/* Floor Selector - Right Side */}
                    <div className="bg-white/90 backdrop-blur shadow-lg rounded-2xl p-2 border border-white/20 pointer-events-auto flex flex-col gap-2">
                        <button
                            onClick={() => setActiveFloor(1)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeFloor === 1 ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                            <span className="font-bold">2</span>
                        </button>
                        <button
                            onClick={() => setActiveFloor(0)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeFloor === 0 ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                            <span className="font-bold">1</span>
                        </button>
                        <div className="w-10 flex justify-center">
                            <Layers size={16} className="text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <LeadCaptureModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
            />
        </>
    );
};
