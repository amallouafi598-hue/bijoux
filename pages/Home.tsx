
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface HomeProps {
  featuredProducts: Product[];
}

const Home: React.FC<HomeProps> = ({ featuredProducts }) => {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920&auto=format&fit=crop" 
            alt="Joaillerie fine et élégante" 
            className="w-full h-full object-cover filter brightness-75 scale-105"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="max-w-3xl mx-auto text-white">
            <span className="inline-block text-xs uppercase tracking-[0.5em] mb-6 font-bold text-[#D4AF37] animate-slideDown">Créations Parisiennes & Artisanat</span>
            <h1 className="text-5xl md:text-8xl font-serif mb-8 leading-tight animate-fadeIn">L'Art de l'Accumulation</h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 font-light leading-relaxed max-w-2xl mx-auto animate-slideUp">
              Des bijoux en acier doré à l'or fin conçus pour être portés, aimés et accumulés chaque jour. L'élégance sans compromis.
            </p>
            <Link 
              to="/shop" 
              className="inline-block bg-[#D4AF37] text-white px-12 py-5 text-sm uppercase tracking-widest hover:bg-white hover:text-[#D4AF37] transition-all duration-500 shadow-2xl rounded-sm animate-fadeIn"
            >
              Découvrir la Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2 group">
              <div className="text-[#D4AF37] mb-4 flex justify-center group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Livraison Suivie</h4>
              <p className="text-xs text-gray-400 font-light">Partout au Maroc en 48h-72h</p>
            </div>
            <div className="text-center space-y-2 group">
              <div className="text-[#D4AF37] mb-4 flex justify-center group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Acier Inoxydable</h4>
              <p className="text-xs text-gray-400 font-light">Hypoallergénique et résistant à l'eau</p>
            </div>
            <div className="text-center space-y-2 group">
              <div className="text-[#D4AF37] mb-4 flex justify-center group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Conseils de Style</h4>
              <p className="text-xs text-gray-400 font-light">Assistance personnalisée via WhatsApp</p>
            </div>
            <div className="text-center space-y-2 group">
              <div className="text-[#D4AF37] mb-4 flex justify-center group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7-7-7M19 10v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Écrin Cadeau</h4>
              <p className="text-xs text-gray-400 font-light">Packaging soigné offert pour chaque pièce</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-[#F5F1EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/shop" className="group relative h-[500px] overflow-hidden cursor-pointer block">
              <img src="https://images.unsplash.com/photo-1627225924765-552d440604bc?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10 text-white group-hover:bg-black/20 transition-all duration-500">
                <h3 className="text-3xl font-serif mb-2">Les Bagues</h3>
                <span className="text-xs uppercase tracking-widest border-b border-white w-fit opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">Explorer</span>
              </div>
            </Link>
            <Link to="/shop" className="group relative h-[500px] overflow-hidden cursor-pointer block">
              <img src="https://images.unsplash.com/photo-1611085583191-a3b1a6a2e24a?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10 text-white group-hover:bg-black/20 transition-all duration-500">
                <h3 className="text-3xl font-serif mb-2">Les Colliers</h3>
                <span className="text-xs uppercase tracking-widest border-b border-white w-fit opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">Explorer</span>
              </div>
            </Link>
            <Link to="/shop" className="group relative h-[500px] overflow-hidden cursor-pointer block">
              <img src="https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10 text-white group-hover:bg-black/20 transition-all duration-500">
                <h3 className="text-3xl font-serif mb-2">Les Boucles</h3>
                <span className="text-xs uppercase tracking-widest border-b border-white w-fit opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">Explorer</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] font-bold">Sélection du moment</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 mb-20">Nos Best-Sellers</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group text-left">
                <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[4/5] mb-6 bg-[#F9F7F5]">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button className="w-full bg-white text-black py-3 text-[10px] uppercase tracking-widest font-bold shadow-xl hover:bg-black hover:text-white transition-colors">
                      Voir le bijou
                    </button>
                  </div>
                </Link>
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-sm uppercase tracking-widest mb-1 font-medium group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                  <p className="text-gray-400 text-xs font-light mb-3">{product.category}</p>
                  <p className="font-bold text-[#D4AF37] tracking-wider">{product.price.toLocaleString()} DH</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
