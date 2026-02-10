
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Product, CartItem, User, Order } from './types';
import { mockBackend } from './services/mockBackend';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Admin from './pages/Admin';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isAdmin && !password) {
      setError('Le mot de passe est requis pour le compte administrateur.');
      return;
    }

    const user = mockBackend.login(email || (isAdmin ? 'admin@eclat.ma' : 'client@test.ma'), password, isAdmin);
    
    if (user) {
      onLogin();
      navigate(isAdmin ? '/admin' : '/');
    } else {
      setError('Identifiants invalides. (Admin: admin@eclat.ma / admin123)');
    }
  };

  return (
    <div className="max-w-md mx-auto py-32 px-4 space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-serif">Maison Éclat</h1>
        <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px] font-bold">
          {isAdmin ? 'Espace Administration' : 'Espace Client'}
        </p>
      </div>
      
      <form onSubmit={handleLogin} className="bg-white p-10 shadow-2xl border border-gray-50 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 text-[10px] uppercase tracking-widest font-bold p-4 border-l-4 border-red-500">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Email</label>
          <input 
            type="email" 
            placeholder={isAdmin ? "admin@eclat.ma" : "votre@email.ma"}
            required
            className="w-full p-4 bg-[#F9F7F5] border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {isAdmin && (
          <div className="space-y-2 animate-slideDown">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              className="w-full p-4 bg-[#F9F7F5] border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center space-x-3 py-2 border-t border-gray-50 pt-6">
          <input 
            type="checkbox" 
            id="admin-check"
            checked={isAdmin}
            onChange={(e) => {
              setIsAdmin(e.target.checked);
              setError('');
              if (e.target.checked) setEmail('admin@eclat.ma');
              else setEmail('');
            }}
            className="text-[#D4AF37] focus:ring-[#D4AF37] rounded-sm h-4 w-4"
          />
          <label htmlFor="admin-check" className="text-[11px] text-gray-500 cursor-pointer font-bold uppercase tracking-widest">Accès administration</label>
        </div>

        <button 
          type="submit"
          className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-all duration-500 shadow-xl"
        >
          {isAdmin ? 'S\'authentifier' : 'Se connecter'}
        </button>

        {!isAdmin && (
          <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
            Pas encore de compte ? L'inscription est automatique à la première commande.
          </p>
        )}
      </form>

      {isAdmin && (
        <div className="text-center text-[9px] text-gray-300 uppercase tracking-widest italic">
          Identifiants de test : admin@eclat.ma / admin123
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const refreshData = useCallback(() => {
    setProducts(mockBackend.getProducts());
    setOrders(mockBackend.getOrders());
    setUser(mockBackend.getCurrentUser());
  }, []);

  useEffect(() => {
    refreshData();
    const savedCart = localStorage.getItem('eclat_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, [refreshData]);

  useEffect(() => {
    localStorage.setItem('eclat_cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      return [...prev, { product, quantity }];
    });
    alert(`${product.name} a été ajouté à votre écrin.`);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId 
      ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
      : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    refreshData();
  };

  const handleLogout = () => {
    mockBackend.logout();
    refreshData();
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} cartCount={cartCount} onLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home featuredProducts={products.filter(p => p.featured)} />} />
            <Route path="/shop" element={<Shop products={products} />} />
            <Route path="/product/:id" element={<ProductDetails products={products} onAddToCart={handleAddToCart} />} />
            <Route path="/cart" element={<Cart items={cart} user={user} onUpdateQuantity={handleUpdateCartQty} onRemove={handleRemoveFromCart} onClear={handleClearCart} />} />
            <Route path="/login" element={<Login onLogin={refreshData} />} />
            <Route path="/admin" element={
              user?.role === 'admin' ? <Admin products={products} orders={orders} onRefresh={refreshData} /> : <Navigate to="/login" />
            } />
            
            <Route path="/about" element={
              <div className="max-w-4xl mx-auto py-24 px-4 space-y-16 animate-fadeIn">
                <div className="text-center space-y-4">
                  <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] font-bold">L'Héritage Marrakech - Guéliz</span>
                  <h1 className="text-5xl font-serif">Notre Maison à Marrakech</h1>
                </div>
                <img src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200&auto=format&fit=crop" className="w-full h-[500px] object-cover rounded-sm grayscale" />
                <div className="prose prose-lg mx-auto text-gray-600 font-light leading-loose space-y-8">
                  <p>Située au cœur du quartier vibrant de <span className="font-bold text-black">Guéliz à Marrakech</span>, la Maison Éclat Bijoux célèbre l'union parfaite entre l'artisanat ancestral marocain et le design contemporain de la joaillerie de luxe.</p>
                  <p>Notre atelier, niché à quelques pas de la célèbre Avenue Mohammed V, est le lieu où la magie opère. Chaque pièce qui sort de nos mains est le fruit d'une passion inébranlable pour la perfection. Nous sélectionnons les matériaux les plus nobles — or 18 carats, argent sterling et pierres précieuses certifiées — pour créer des bijoux qui racontent l'histoire de la Ville Ocre.</p>
                  <p>En choisissant Éclat Bijoux, vous emportez avec vous un fragment de l'élégance du <span className="text-[#D4AF37] font-medium italic">Marrakech moderne</span>.</p>
                </div>
              </div>
            } />

            <Route path="/contact" element={
              <div className="max-w-7xl mx-auto py-24 px-4 space-y-24 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] font-bold">Boutique & Atelier Guéliz</span>
                      <h1 className="text-5xl font-serif">Nous Visiter à Marrakech</h1>
                      <p className="text-gray-500 font-light leading-relaxed">Notre équipe vous accueille dans l'intimité de notre showroom de <span className="font-medium text-black">Guéliz</span> pour vous présenter nos collections exclusives et vous conseiller.</p>
                    </div>
                    
                    <div className="space-y-6 text-sm">
                      <div className="flex items-start">
                        <span className="text-[#D4AF37] font-bold w-24 flex-shrink-0 uppercase tracking-widest text-[10px]">ADRESSE</span>
                        <span className="text-gray-600 font-light">Angle Avenue Mohammed V & Rue de la Liberté, <span className="font-medium text-black">Quartier Guéliz, 40000 Marrakech</span>, Maroc</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-[#D4AF37] font-bold w-24 flex-shrink-0 uppercase tracking-widest text-[10px]">CONTACT</span>
                        <span className="text-gray-600 font-light">+212 (0) 5 24 44 55 66<br/>contact@eclatbijoux.ma</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-[#D4AF37] font-bold w-24 flex-shrink-0 uppercase tracking-widest text-[10px]">HORAIRES</span>
                        <span className="text-gray-600 font-light">Lundi - Samedi: 10h00 - 19h30 (Guéliz Shop)</span>
                      </div>
                    </div>
                  </div>

                  <form className="bg-white p-12 shadow-2xl border border-gray-50 space-y-6">
                    <h2 className="font-serif text-2xl mb-8">Nous écrire de partout au Maroc</h2>
                    <input type="text" placeholder="Nom complet" className="w-full p-4 bg-[#F9F7F5] outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm" />
                    <input type="email" placeholder="Email" className="w-full p-4 bg-[#F9F7F5] outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm" />
                    <textarea placeholder="Votre message pour notre équipe de Marrakech..." className="w-full p-4 bg-[#F9F7F5] outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm min-h-[150px]"></textarea>
                    <button type="button" className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-all duration-500 shadow-xl">Envoyer à l'atelier</button>
                  </form>
                </div>

                {/* Simulated Map Section */}
                <div className="relative h-[450px] w-full bg-[#F5F1EC] flex items-center justify-center overflow-hidden grayscale">
                   <div className="absolute inset-0 z-0">
                      <img src="https://images.unsplash.com/photo-1548013146-72479768b921?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-30" alt="Marrakech Map Texture" />
                   </div>
                   <div className="relative z-10 bg-white p-8 shadow-2xl text-center max-w-sm">
                      <h4 className="font-serif text-xl mb-4">Éclat Bijoux Guéliz</h4>
                      <p className="text-xs text-gray-500 mb-6 font-light uppercase tracking-widest">Le cœur de la Ville Nouvelle - Marrakech</p>
                      <button 
                        onClick={() => window.open('https://www.google.com/maps/search/Gueliz+Marrakech', '_blank')}
                        className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] border-b border-[#D4AF37] pb-1"
                      >
                        Ouvrir dans Google Maps
                      </button>
                   </div>
                </div>
              </div>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
