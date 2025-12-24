
export interface RoomBlock {
    id: string; // unique identifier for the type
    category: 'living' | 'sleeping' | 'utility' | 'outdoor';
    label: string;
    baseCost: number; // Estimated material/labor cost
    dimensions: { w: number; h: number }; // Grid units (e.g. 1 unit = 2ft)
    color: string; // Tailwind class or hex
}

export const ROOM_BLOCKS: RoomBlock[] = [
    // SLEEPING
    {
        id: 'master_suite_luxury',
        category: 'sleeping',
        label: 'Luxury Master Suite',
        baseCost: 45000,
        dimensions: { w: 8, h: 8 }, // 16x16ft approx
        color: 'bg-indigo-100 border-indigo-300'
    },
    {
        id: 'bedroom_standard',
        category: 'sleeping',
        label: 'Standard Bedroom',
        baseCost: 15000,
        dimensions: { w: 6, h: 6 }, // 12x12
        color: 'bg-blue-100 border-blue-300'
    },

    // LIVING
    {
        id: 'living_greatroom',
        category: 'living',
        label: 'Great Room',
        baseCost: 30000,
        dimensions: { w: 10, h: 8 },
        color: 'bg-emerald-100 border-emerald-300'
    },
    {
        id: 'kitchen_chef',
        category: 'living',
        label: 'Chef\'s Kitchen',
        baseCost: 60000,
        dimensions: { w: 8, h: 6 },
        color: 'bg-orange-100 border-orange-300'
    },

    // UTILITY
    {
        id: 'garage_2car',
        category: 'utility',
        label: '2-Car Garage',
        baseCost: 25000,
        dimensions: { w: 12, h: 12 },
        color: 'bg-slate-200 border-slate-400'
    },
    {
        id: 'bath_full',
        category: 'utility',
        label: 'Full Bath',
        baseCost: 20000,
        dimensions: { w: 4, h: 5 },
        color: 'bg-cyan-100 border-cyan-300'
    }
];
