
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
        dimensions: { w: 8, h: 8 }, // 16x16ft
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
    {
        id: 'guest_suite',
        category: 'sleeping',
        label: 'Guest Suite',
        baseCost: 25000,
        dimensions: { w: 7, h: 7 }, // 14x14
        color: 'bg-indigo-50 border-indigo-200'
    },
    {
        id: 'bunk_room',
        category: 'sleeping',
        label: 'Bunk Room',
        baseCost: 18000,
        dimensions: { w: 6, h: 8 }, // 12x16
        color: 'bg-blue-50 border-blue-200'
    },

    // LIVING
    {
        id: 'living_greatroom',
        category: 'living',
        label: 'Great Room',
        baseCost: 30000,
        dimensions: { w: 10, h: 8 }, // 20x16
        color: 'bg-emerald-100 border-emerald-300'
    },
    {
        id: 'kitchen_chef',
        category: 'living',
        label: 'Chef\'s Kitchen',
        baseCost: 60000,
        dimensions: { w: 8, h: 6 }, // 16x12
        color: 'bg-orange-100 border-orange-300'
    },
    {
        id: 'home_office',
        category: 'living',
        label: 'Home Office',
        baseCost: 12000,
        dimensions: { w: 5, h: 6 }, // 10x12
        color: 'bg-emerald-50 border-emerald-200'
    },
    {
        id: 'scullery',
        category: 'living',
        label: 'Scullery / Pantry',
        baseCost: 15000,
        dimensions: { w: 4, h: 5 }, // 8x10
        color: 'bg-orange-50 border-orange-200'
    },

    // UTILITY
    {
        id: 'garage_2car',
        category: 'utility',
        label: '2-Car Garage',
        baseCost: 25000,
        dimensions: { w: 11, h: 11 }, // 22x22 (Adjusted for standard size)
        color: 'bg-slate-200 border-slate-400'
    },
    {
        id: 'garage_3car',
        category: 'utility',
        label: '3-Car Garage',
        baseCost: 35000,
        dimensions: { w: 16, h: 11 }, // 32x22
        color: 'bg-slate-300 border-slate-500'
    },
    {
        id: 'bath_full',
        category: 'utility',
        label: 'Full Bath',
        baseCost: 20000,
        dimensions: { w: 4, h: 5 }, // 8x10
        color: 'bg-cyan-100 border-cyan-300'
    },
    {
        id: 'laundry_room',
        category: 'utility',
        label: 'Laundry Room',
        baseCost: 8000,
        dimensions: { w: 4, h: 4 }, // 8x8
        color: 'bg-cyan-50 border-cyan-200'
    },

    // OUTDOOR
    {
        id: 'porch_covered',
        category: 'outdoor',
        label: 'Covered Porch',
        baseCost: 15000,
        dimensions: { w: 10, h: 6 }, // 20x12
        color: 'bg-amber-100 border-amber-300'
    },
    {
        id: 'deck',
        category: 'outdoor',
        label: 'Deck',
        baseCost: 12000,
        dimensions: { w: 8, h: 6 }, // 16x12
        color: 'bg-amber-50 border-amber-200'
    },
    {
        id: 'patio',
        category: 'outdoor',
        label: 'Concrete Patio',
        baseCost: 8000,
        dimensions: { w: 8, h: 6 }, // 16x12
        color: 'bg-stone-200 border-stone-400'
    }
];
