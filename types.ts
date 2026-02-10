
export enum Category {
  COLLIER = 'Collier',
  BAGUE = 'Bague',
  BRACELET = 'Bracelet',
  BOUCLES = 'Boucles d\'oreilles'
}

export enum Material {
  OR = 'Or',
  ARGENT = 'Argent',
  PLAQUE = 'Plaqué Or',
  PERLES = 'Perles'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  material: Material;
  images: string[];
  videoUrl?: string;
  stock: number;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'En attente' | 'En préparation' | 'Expédiée' | 'Livrée';
  customerEmail: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  wishlist: string[];
}
