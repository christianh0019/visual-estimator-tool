
import { useState, useEffect } from 'react';
import { Type } from 'lucide-react';

interface RoomNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
}

export const RoomNameModal = ({ isOpen, onClose, onSubmit }: RoomNameModalProps) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(''); // Reset on open
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit(name);
        onClose();
    };

    const suggestions = [
        "Living Room", "Kitchen", "Master Bedroom",
        "Bedroom 2", "Bathroom", "Garage", "Office", "Patio"
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <form onSubmit={handleSubmit} className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Type size={18} className="text-blue-500" />
                        Name this Room
                    </h3>

                    <input
                        autoFocus
                        type="text"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium mb-4"
                        placeholder="e.g. Master Suite"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    <div className="flex flex-wrap gap-2 mb-6">
                        {suggestions.map(s => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setName(s)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 rounded-md transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm"
                        >
                            Save Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
