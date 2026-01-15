import { 
    Smartphone, 
    Laptop, 
    Tablet, 
    CarFront, 
    Cog, 
    KeyRound, 
    Footprints, 
    Armchair, 
    LucideIcon 
} from "lucide-react";

export interface Category {
    id: string;
    name: string;
    icon: LucideIcon;
    count: number;
}

export const categoryList: Category[] = [
    // 1. The Heavy Hitters (Electronics)
    { id: 'mobile-phones', name: 'Mobile Phones', icon: Smartphone, count: 0 },
    { id: 'laptops', name: 'Laptops & Computers', icon: Laptop, count: 0 },
    { id: 'tablets', name: 'Tablets', icon: Tablet, count: 0 },

    // 2. The Big Ticket Items (Vehicles)
    { id: 'cars', name: 'Cars', icon: CarFront, count: 0 },
    { id: 'auto-parts', name: 'Vehicle Parts', icon: Cog, count: 0 },

    // 3. Housing
    { id: 'apartments-rent', name: 'Apartments for Rent', icon: KeyRound, count: 0 },

    // 4. Lifestyle
    { id: 'shoes', name: 'Shoes & Sneakers', icon: Footprints, count: 0 },
    { id: 'furniture', name: 'Home Furniture', icon: Armchair, count: 0 },

];