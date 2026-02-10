
import { Category, Material, Product } from './types';

export const COLORS = {
  beige: '#F5F1EC',
  white: '#FFFFFF',
  gold: '#D4AF37',
  dark: '#2D2D2D',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bague Solaire Dorée',
    description: 'Une bague fine et martelée en acier inoxydable doré à l\'or fin. Un design solaire iconique pour illuminer vos mains.',
    price: 350,
    category: Category.BAGUE,
    material: Material.PLAQUE,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    stock: 15,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Collier Multi-rangs Nacre',
    description: 'Collier délicat composé de trois chaînes superposées ornées de pastilles de nacre véritable. Le style bohème chic par excellence.',
    price: 590,
    category: Category.COLLIER,
    material: Material.PERLES,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 10,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Bracelet Jonc Tressé',
    description: 'Un jonc ajustable en acier chirurgical 316L, arborant un motif tressé sophistiqué. Durable et éclatant.',
    price: 420,
    category: Category.BRACELET,
    material: Material.PLAQUE,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1520a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 20,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Boucles d\'oreilles Cascade',
    description: 'Boucles pendantes légères avec de fines chaînettes dorées. Un mouvement gracieux à chaque pas.',
    price: 480,
    category: Category.BOUCLES,
    material: Material.OR,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 12,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Bague Chevalière Étoilée',
    description: 'Une petite chevalière moderne sertie d\'un oxyde de zirconium étincelant au centre d\'une étoile gravée.',
    price: 390,
    category: Category.BAGUE,
    material: Material.PLAQUE,
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 5,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Collier Médaille Antique',
    description: 'Une médaille martelée suspendue à une maille gourmette fine. L\'élégance intemporelle revisitée.',
    price: 520,
    category: Category.COLLIER,
    material: Material.PLAQUE,
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b1a6a2e24a?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 18,
    featured: false,
    createdAt: new Date().toISOString(),
  }
];
