
import { Product, Order, User, Category } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const PRODUCTS_KEY = 'eclat_products_v3'; 
const ORDERS_KEY = 'eclat_orders_v3';
const USER_KEY = 'eclat_current_user_v3';

export const mockBackend = {
  getProducts: (): Product[] => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (!stored) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  },

  updateProduct: (product: Product) => {
    const products = mockBackend.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  deleteProduct: (id: string) => {
    const products = mockBackend.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  },

  createOrder: (order: Order) => {
    const orders = mockBackend.getOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    
    // Mise à jour automatique du stock lors de la vente
    const products = mockBackend.getProducts();
    order.items.forEach(item => {
      const p = products.find(prod => prod.id === item.product.id);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    });
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  getOrders: (): Order[] => {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  updateOrderStatus: (orderId: string, status: Order['status']) => {
    const orders = mockBackend.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  login: (email: string, password?: string, isAdmin: boolean = false): User | null => {
    // Simulation d'une vérification d'identifiants admin
    if (isAdmin) {
      if (email === 'admin@eclat.ma' && password === 'admin123') {
        const admin: User = {
          id: 'admin-id',
          name: 'Administrateur',
          email: 'admin@eclat.ma',
          role: 'admin',
          wishlist: []
        };
        localStorage.setItem(USER_KEY, JSON.stringify(admin));
        return admin;
      }
      return null; // Échec de connexion admin
    }

    // Connexion client simple (mock)
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email,
      role: 'customer',
      wishlist: []
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(USER_KEY);
  }
};
