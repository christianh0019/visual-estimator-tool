
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Sidebar } from './components/Sidebar';
import { GridCanvas } from './components/GridCanvas';
import { usePlanStore } from './store/planStore';
import { useState } from 'react';
import { Download, Menu } from 'lucide-react';

function App() {
  const addBlock = usePlanStore(state => state.addBlock);
  const totalCost = usePlanStore(state => state.totalCost);
  const totalSqFt = usePlanStore(state => state.totalSqFt);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    // ... existing drag logic ...
    const { active, over } = event;

    const blockData = active.data.current?.block;
    if (!blockData) return;

    // Calculate position relative to the droppable area (the grid)
    const droppableRect = over?.rect;
    const activeRect = active.rect.current.translated;

    if (!droppableRect || !activeRect) return;

    const relativeX = activeRect.left - droppableRect.left;
    const relativeY = activeRect.top - droppableRect.top;

    // Convert to grid units (40px)
    const x = Math.max(0, Math.floor(relativeX / 40));
    const y = Math.max(0, Math.floor(relativeY / 40));

    addBlock(blockData, x, y);
    setIsSidebarOpen(false); // Close sidebar on drop (mobile convenience)
  }


  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden">

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* HUD / Header */}
        <div className="fixed top-4 left-4 right-4 md:top-6 md:right-6 md:left-auto z-40 flex flex-col md:flex-row items-end gap-4 pointer-events-none">

          {/* Mobile Menu Button - Pointer events auto to allow clicking */}
          <div className="w-full flex justify-between md:hidden pointer-events-auto">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-slate-700 active:scale-95 transition-transform"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="bg-white/90 backdrop-blur border border-slate-200 p-3 md:p-4 rounded-xl shadow-lg flex gap-4 md:gap-8">
              <div>
                <div className="text-[10px] md:text-xs text-slate-400 uppercase font-bold tracking-wider">Est. Budget</div>
                <div className="text-lg md:text-2xl font-bold text-slate-800">${totalCost.toLocaleString()}</div>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div>
                <div className="text-[10px] md:text-xs text-slate-400 uppercase font-bold tracking-wider">Total Size</div>
                <div className="text-lg md:text-2xl font-bold text-slate-800">{totalSqFt.toLocaleString()} <span className="text-sm font-normal text-slate-400">sqft</span></div>
              </div>
            </div>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 md:px-6 md:py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 transition-transform active:scale-95">
              <Download size={20} />
              <span className="hidden md:inline">Save Plan</span>
            </button>
          </div>
        </div>

        <GridCanvas />
      </div>
    </DndContext>
  );
}

export default App;
