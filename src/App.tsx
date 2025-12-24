
import { Sidebar } from './components/Sidebar';
import { Scene } from './components/3D/Scene';
import { HeadsUpDisplay } from './components/3D/HeadsUpDisplay';
import { RoomNameModal } from './components/RoomNameModal';
import { usePlanStore } from './store/planStore';
import { useState } from 'react';
import { Download, Menu, Edit3 } from 'lucide-react';

function App() {
  const totalSqFt = usePlanStore(state => state.totalSqFt);
  const totalCostLow = usePlanStore(state => state.totalCostLow);
  const totalCostHigh = usePlanStore(state => state.totalCostHigh);
  const isDrawing = usePlanStore(state => state.isDrawing);
  const setIsDrawing = usePlanStore(state => state.setIsDrawing);
  const isNamingRoom = usePlanStore(state => state.isNamingRoom);
  const setNamingRoom = usePlanStore(state => state.setNamingRoom);
  const submitRoom = usePlanStore(state => state.submitRoom);
  const activeFloor = usePlanStore(state => state.activeFloor);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'ISO' | 'TOP'>('ISO');

  const formatCost = (val: number) => {
    // Just a rough k formatting
    return `$${Math.round(val / 1000)}k`;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden">

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* HUD / Header */}
      <div className="fixed top-4 left-4 right-4 md:top-6 md:right-6 md:left-auto z-40 flex flex-col md:flex-row items-end gap-4 pointer-events-none">

        {/* Cost HUD & Save Plan Buttons are here */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur border border-slate-200 p-3 md:p-4 rounded-xl shadow-lg flex gap-4 md:gap-8 min-w-[200px]">
            <div>
              <div className="text-[10px] md:text-xs text-slate-400 uppercase font-bold tracking-wider">Est. Budget</div>
              <div className="text-lg md:text-2xl font-bold text-slate-800">
                {formatCost(totalCostLow)} - {formatCost(totalCostHigh)}
              </div>
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

      {/* Mobile Menu Button + Draw Toggle */}
      <div className="w-full flex justify-between md:hidden pointer-events-auto absolute top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-slate-700 active:scale-95 transition-transform"
        >
          <Menu size={24} />
        </button>

        <button
          onClick={() => setIsDrawing(!isDrawing)}
          className={`p-3 rounded-xl shadow-lg border border-slate-200 active:scale-95 transition-transform mr-8 ${isDrawing ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}
        >
          <Edit3 size={24} />
        </button>
      </div>

      {/* Desktop Draw Toggle (Bottom Center or similar, but putting in header for now) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto md:flex hidden">
        <button
          onClick={() => setIsDrawing(!isDrawing)}
          className={`px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${isDrawing ? 'bg-blue-600 text-white ring-4 ring-blue-200' : 'bg-white text-slate-800 hover:bg-slate-50'}`}
        >
          <Edit3 size={18} />
          {isDrawing ? 'Finish Drawing' : 'Draw Walls'}
        </button>
      </div>

      <HeadsUpDisplay currentView={currentView} onViewChange={setCurrentView} />
      <Scene currentView={currentView} />

      <RoomNameModal
        isOpen={isNamingRoom}
        onClose={() => setNamingRoom(false)}
        onSubmit={(name) => submitRoom(name, activeFloor)}
      />
    </div>
  );
}

export default App;
