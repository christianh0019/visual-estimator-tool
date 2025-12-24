
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Sidebar } from './components/Sidebar';
import { GridCanvas } from './components/GridCanvas';
import { usePlanStore } from './store/planStore';
import { Download } from 'lucide-react';

function App() {
  const addBlock = usePlanStore(state => state.addBlock);
  const { totalCost, totalSqFt } = usePlanStore(state => ({
    totalCost: state.totalCost,
    totalSqFt: state.totalSqFt
  }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === 'canvas') {
      // Logic to snap to grid
      const blockData = active.data.current?.block;
      if (!blockData) return;

      // In a real app, calculate X/Y based on mouse position relative to canvas
      // For MVP, just placing at a pseudo-random or fixed spot, 
      // OR better: we need the delta. 
      // Since getting drop coordinates is tricky without `useDraggable` positioning context, 
      // we'll simulate a simple stack or "next available" logic if specific coords aren't passed,
      // BUT for a true drag and drop we need pointer coordinates.

      // Temporary cheat: Place at (5, 5) + random offset to avoid exact stacking
      // Ideally we use modifiers or calculate local coordinates.
      const x = Math.floor(Math.random() * 10) + 1;
      const y = Math.floor(Math.random() * 10) + 1;

      addBlock(blockData, x, y);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Sidebar />

        {/* HUD / Header */}
        <div className="fixed top-6 right-6 z-20 flex items-center gap-4">
          <div className="bg-white/90 backdrop-blur border border-slate-200 p-4 rounded-xl shadow-lg flex gap-8">
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Est. Budget</div>
              <div className="text-2xl font-bold text-slate-800">${totalCost.toLocaleString()}</div>
            </div>
            <div className="w-px bg-slate-200"></div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Size</div>
              <div className="text-2xl font-bold text-slate-800">{totalSqFt.toLocaleString()} <span className="text-sm font-normal text-slate-400">sqft</span></div>
            </div>
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 transition-transform active:scale-95">
            <Download size={20} />
            Save Plan
          </button>
        </div>

        <GridCanvas />
      </div>
    </DndContext>
  );
}

export default App;
