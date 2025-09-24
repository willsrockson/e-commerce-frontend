export interface Category {
    id: string;
    name: string;
    icon: string;
    count: number ;
}

export const categoryList: Category[] = [
    { id: 'mobilephones', name: 'Phones', icon: '📱', count: 0 },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗', count: 0 },
    // { id: 'land', name: 'Land', icon: '🏞️', count: 0 },
    // { id: 'clothing', name: 'Clothing', icon: '👕', count: 0 },
    // { id: 'computers', name: 'Computers', icon: '💻', count: 0 },
    // { id: 'furniture', name: 'Furniture', icon: '🛋️', count: 0 },
    // { id: 'jewelry', name: 'Jewelry', icon: '💍', count: 0 },
];


