
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product, Category, Material } from '../types';

interface ShopProps {
  products: Product[];
}

const Shop: React.FC<ShopProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest');

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => 
        (searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory === 'all' || p.category === selectedCategory) &&
        (selectedMaterial === 'all' || p.material === selectedMaterial)
      )
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, searchTerm, selectedCategory, selectedMaterial, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <div className="mb-12 text-center space-y-4">
        <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] font-bold">Collections</span>
        <h1 className="text-5xl font-serif">L'Atelier en Ligne</h1>
        <p className="text-gray-500 max-w-lg mx-auto font-light leading-relaxed">Chaque pièce est une invitation au voyage, disponible dans notre showroom de Guéliz et partout au Maroc.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 space-y-12">
          <div className="bg-white p-8 border border-gray-50 shadow-sm space-y-10">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-[#D4AF37]">Rechercher</h4>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Bague Atlas..." 
                  className="w-full bg-[#F9F7F5] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none rounded-sm placeholder:text-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-[#D4AF37]">Catégories</h4>
              <div className="space-y-4">
                <button onClick={() => setSelectedCategory('all')} className={`flex items-center space-x-3 w-full text-xs uppercase tracking-widest transition-all ${selectedCategory === 'all' ? 'text-black font-bold' : 'text-gray-400 hover:text-black'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedCategory === 'all' ? 'bg-[#D4AF37]' : 'bg-transparent border border-gray-200'}`}></span>
                  <span>Toutes les créations</span>
                </button>
                {Object.values(Category).map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`flex items-center space-x-3 w-full text-xs uppercase tracking-widest transition-all ${selectedCategory === cat ? 'text-black font-bold' : 'text-gray-400 hover:text-black'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedCategory === cat ? 'bg-[#D4AF37]' : 'bg-transparent border border-gray-200'}`}></span>
                    <span>{cat}s</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-[#D4AF37]">Matériaux</h4>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setSelectedMaterial('all')}
                  className={`px-3 py-2 text-[8px] uppercase tracking-widest font-bold border rounded-sm transition-all ${selectedMaterial === 'all' ? 'bg-black text-white border-black' : 'border-gray-100 text-gray-400 hover:border-black'}`}
                >
                  Tous
                </button>
                {Object.values(Material).map(mat => (
                  <button 
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`px-3 py-2 text-[8px] uppercase tracking-widest font-bold border rounded-sm transition-all ${selectedMaterial === mat ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'border-gray-100 text-gray-400 hover:border-[#D4AF37]'}`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-[#D4AF37]">Trier par</h4>
              <select 
                className="w-full bg-[#F9F7F5] border-none p-4 text-xs uppercase tracking-widest font-bold focus:ring-1 focus:ring-[#D4AF37] outline-none rounded-sm appearance-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Nouveautés</option>
                <option value="priceAsc">Prix croissant</option>
                <option value="priceDesc">Prix décroissant</option>
              </select>
            </div>
          </div>
          
          <div className="p-8 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-sm">
             <h5 className="font-serif text-lg mb-2">Besoin d'aide ?</h5>
             <p className="text-[10px] text-gray-500 font-light leading-relaxed mb-4">Nos conseillers de Guéliz sont disponibles pour vous guider dans votre choix.</p>
             <Link to="/contact" className="text-[9px] uppercase tracking-widest font-bold text-[#D4AF37] border-b border-[#D4AF37] pb-1">Nous contacter</Link>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-10 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-100 pb-4">
             <span>Affichage de {filteredProducts.length} bijoux d'exception</span>
             <span>Marrakech - Guéliz Shop</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group animate-fadeIn">
                <Link to={`/product/${product.id}`} className="block relative aspect-square mb-5 bg-[#F9F7F5] overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Status Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {product.stock <= 3 && product.stock > 0 && (
                      <span className="block bg-orange-100 text-orange-600 text-[8px] px-2 py-1 uppercase font-bold tracking-widest">Dernières pièces</span>
                    )}
                    {product.featured && (
                      <span className="block bg-[#D4AF37] text-white text-[8px] px-2 py-1 uppercase font-bold tracking-widest">Éclat Signature</span>
                    )}
                  </div>

                  {/* Add to cart hover overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white text-black px-6 py-3 text-[10px] uppercase tracking-widest font-bold shadow-2xl hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                      Découvrir l'ouvrage
                    </button>
                  </div>
                </Link>
                <div className="text-center px-4">
                  <h3 className="text-xs uppercase tracking-[0.2em] mb-1 group-hover:text-[#D4AF37] transition-colors font-bold text-gray-800">{product.name}</h3>
                  <p className="text-gray-400 text-[9px] mb-3 uppercase tracking-widest font-light">{product.category} | {product.material}</p>
                  <p className="font-bold text-[#D4AF37] tracking-wider text-sm">{product.price.toLocaleString()} DH</p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-24 text-center">
              <h3 className="font-serif text-2xl text-gray-300">Aucun bijou ne correspond à votre recherche</h3>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedMaterial('all'); }} className="mt-6 text-[#D4AF37] uppercase tracking-widest text-[10px] font-bold border-b border-[#D4AF37]">Réinitialiser les filtres</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
