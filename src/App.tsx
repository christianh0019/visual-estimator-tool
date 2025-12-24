
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Sidebar } from './components/Sidebar';
import { GridCanvas } from './components/GridCanvas';
import { usePlanStore } from './store/planStore';
import { Download } from 'lucide-react';

function App() {
  const addBlock = usePlanStore(state => state.addBlock);
  const totalCost = usePlanStore(state => state.totalCost);
  const totalSqFt = usePlanStore(state => state.totalSqFt);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const blockData = active.data.current?.block;
    if (!blockData) return;

    // Calculate position relative to the droppable area (the grid)
    // active.rect.current.translated = { top, left, ... } of the dragged item
    // over.rect = { top, left, ... } of the droppable container
    const droppableRect = over?.rect;
    const activeRect = active.rect.current.translated;

    if (!droppableRect || !activeRect) return;

    const relativeX = activeRect.left - droppableRect.left;
    const relativeY = activeRect.top - droppableRect.top;

    // Convert to grid units (40px)
    // Math.max to prevent negative coordinates
    const x = Math.max(0, Math.floor(relativeX / 40));
    const y = Math.max(0, Math.floor(relativeY / 40));

    addBlock(blockData, x, y);
  }


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
