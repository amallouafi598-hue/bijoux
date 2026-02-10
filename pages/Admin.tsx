
import React, { useState, useMemo, useRef } from 'react';
import { Product, Order, Category, Material } from '../types';
import { mockBackend } from '../services/mockBackend';

interface AdminProps {
  products: Product[];
  orders: Order[];
  onRefresh: () => void;
}

const Admin: React.FC<AdminProps> = ({ products, orders, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'sales' | 'dashboard'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ANALYTIQUE ---
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    return {
      totalRevenue,
      orderCount: orders.length,
      productCount: products.length,
      lowStockCount: products.filter(p => p.stock <= 5).length
    };
  }, [orders, products]);

  // --- GESTION DES IMAGES ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [...(editingProduct?.images || [])];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        newImages.push(base64String);
        setEditingProduct(prev => ({ ...prev, images: [...newImages] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const images = [...(editingProduct?.images || [])];
    images.splice(index, 1);
    setEditingProduct({ ...editingProduct, images });
  };

  // --- GESTION CRUD PRODUITS ---
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct?.name && editingProduct?.price !== undefined) {
      const p: Product = {
        id: editingProduct.id || Math.random().toString(36).substr(2, 9),
        name: editingProduct.name,
        description: editingProduct.description || '',
        price: Number(editingProduct.price),
        category: editingProduct.category as Category || Category.COLLIER,
        material: editingProduct.material as Material || Material.OR,
        images: editingProduct.images && editingProduct.images.length > 0 
          ? editingProduct.images 
          : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop'],
        videoUrl: editingProduct.videoUrl,
        stock: Number(editingProduct.stock || 0),
        featured: editingProduct.featured || false,
        createdAt: editingProduct.createdAt || new Date().toISOString(),
      };
      mockBackend.updateProduct(p);
      setIsAdding(false);
      setEditingProduct(null);
      onRefresh();
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce bijou du catalogue ?')) {
      mockBackend.deleteProduct(id);
      onRefresh();
    }
  };

  const handleUpdateStock = (id: string, delta: number) => {
    const p = products.find(prod => prod.id === id);
    if (p) {
      mockBackend.updateProduct({ ...p, stock: Math.max(0, p.stock + delta) });
      onRefresh();
    }
  };

  const handleDirectStockEdit = (id: string, newValue: string) => {
    const val = parseInt(newValue, 10);
    if (isNaN(val)) return;
    const p = products.find(prod => prod.id === id);
    if (p) {
      mockBackend.updateProduct({ ...p, stock: Math.max(0, val) });
      onRefresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h1 className="text-3xl font-serif font-bold">Tableau de Bord Administratif</h1>
          <div className="flex bg-white p-1 rounded-sm shadow-sm border border-gray-100">
            {[
              { id: 'dashboard', label: 'Vue d\'ensemble' },
              { id: 'inventory', label: 'Gestion Stock (CRUD)' },
              { id: 'sales', label: 'Journal des Ventes' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
                  activeTab === tab.id ? 'bg-[#D4AF37] text-white' : 'text-gray-400 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- DASHBOARD VIEW --- */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
            <div className="bg-white p-8 border-b-4 border-[#D4AF37] shadow-sm text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Chiffre d'Affaires</p>
              <p className="text-3xl font-serif">{stats.totalRevenue.toLocaleString()} DH</p>
            </div>
            <div className="bg-white p-8 border-b-4 border-black shadow-sm text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Ventes Totales</p>
              <p className="text-3xl font-serif">{stats.orderCount}</p>
            </div>
            <div className="bg-white p-8 border-b-4 border-gray-200 shadow-sm text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Produits en Ligne</p>
              <p className="text-3xl font-serif">{stats.productCount}</p>
            </div>
            <div className="bg-white p-8 border-b-4 border-red-200 shadow-sm text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Stocks Faibles</p>
              <p className="text-3xl font-serif text-red-500">{stats.lowStockCount}</p>
            </div>
          </div>
        )}

        {/* --- INVENTORY (CRUD) VIEW --- */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl">Gestion du Catalogue</h2>
              <button 
                onClick={() => { setIsAdding(true); setEditingProduct({ images: [] }); }}
                className="bg-black text-white px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-all shadow-lg"
              >
                + Ajouter un bijou
              </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-100">
                    <th className="p-6">Produit</th>
                    <th className="p-6">Catégorie</th>
                    <th className="p-6">Prix</th>
                    <th className="p-6">Quantité en Stock</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-6 flex items-center space-x-4">
                        <img src={p.images[0]} className="w-12 h-12 object-cover rounded-sm border border-gray-100" alt="" />
                        <span className="font-bold text-gray-800">{p.name}</span>
                      </td>
                      <td className="p-6 text-xs text-gray-500">{p.category}</td>
                      <td className="p-6 font-bold">{p.price.toLocaleString()} DH</td>
                      <td className="p-6">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleUpdateStock(p.id, -1)} 
                            className="w-8 h-8 flex items-center justify-center border border-gray-100 hover:bg-white hover:border-[#D4AF37] text-gray-400 hover:text-[#D4AF37] transition-all rounded-sm"
                          >-</button>
                          <input 
                            type="number"
                            value={p.stock}
                            onChange={(e) => handleDirectStockEdit(p.id, e.target.value)}
                            className={`w-14 text-center text-xs font-bold bg-[#F9F7F5] border-none focus:ring-1 focus:ring-[#D4AF37] p-2 rounded-sm ${p.stock <= 5 ? 'text-red-500' : 'text-gray-800'}`}
                          />
                          <button 
                            onClick={() => handleUpdateStock(p.id, 1)} 
                            className="w-8 h-8 flex items-center justify-center border border-gray-100 hover:bg-white hover:border-[#D4AF37] text-gray-400 hover:text-[#D4AF37] transition-all rounded-sm"
                          >+</button>
                        </div>
                      </td>
                      <td className="p-6 text-right space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingProduct(p)} className="text-[#D4AF37] text-[10px] uppercase font-bold hover:underline">Modifier</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 text-[10px] uppercase font-bold hover:underline">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- SALES VIEW --- */}
        {activeTab === 'sales' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif text-2xl">Journal de toutes les ventes</h2>
            {orders.length === 0 ? (
              <div className="bg-white p-20 text-center border border-gray-100">
                <p className="text-gray-400 italic">Aucune vente enregistrée pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice().reverse().map(order => (
                  <div key={order.id} className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-b border-gray-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">ID Commande</span>
                        <span className="text-xs font-mono font-bold">#{order.id.toUpperCase()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Statut</span>
                        <select 
                          value={order.status}
                          onChange={(e) => { mockBackend.updateOrderStatus(order.id, e.target.value as any); onRefresh(); }}
                          className="text-[10px] uppercase font-bold border-none bg-transparent text-[#D4AF37] focus:ring-0 cursor-pointer"
                        >
                          <option value="En attente">En attente</option>
                          <option value="En préparation">En préparation</option>
                          <option value="Expédiée">Expédiée</option>
                          <option value="Livrée">Livrée</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Client</p>
                        <p className="text-sm font-medium">{order.customerEmail}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Panier</p>
                        <p className="text-sm font-medium">{order.items.length} article(s)</p>
                        <button 
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                          className="text-[10px] text-[#D4AF37] uppercase font-bold mt-1 hover:underline"
                        >
                          {expandedOrderId === order.id ? 'Masquer détails' : 'Afficher détails'}
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Total TTC</p>
                        <p className="text-2xl font-serif font-bold text-black">{order.total.toLocaleString()} DH</p>
                      </div>
                    </div>
                    {expandedOrderId === order.id && (
                      <div className="px-8 pb-8 animate-slideDown">
                        <div className="bg-[#F9F7F5] p-6 space-y-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                              <span className="text-gray-600">{item.quantity}x {item.product.name}</span>
                              <span className="font-bold">{(item.product.price * item.quantity).toLocaleString()} DH</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL CRUD (Add / Edit) */}
        {(isAdding || editingProduct?.id) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <form onSubmit={handleSaveProduct} className="bg-white w-full max-w-2xl p-8 md:p-10 shadow-2xl space-y-6 animate-fadeIn my-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif text-3xl">{editingProduct?.id ? 'Modifier le Bijou' : 'Nouvelle Création'}</h3>
                <button type="button" onClick={() => { setIsAdding(false); setEditingProduct(null); }} className="text-gray-400 hover:text-black text-2xl">×</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Nom du bijou</label>
                  <input 
                    type="text" required className="w-full p-3 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                    value={editingProduct?.name || ''}
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Prix (DH)</label>
                  <input 
                    type="number" required className="w-full p-3 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                    value={editingProduct?.price || ''}
                    onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Catégorie</label>
                  <select 
                    className="w-full p-3 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                    value={editingProduct?.category || Category.COLLIER}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})}
                  >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Stock Initial</label>
                  <input 
                    type="number" required className="w-full p-3 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                    value={editingProduct?.stock || 0}
                    onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">URL Vidéo (YouTube embed ou MP4)</label>
                  <input 
                    type="url" className="w-full p-3 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                    placeholder="https://www.youtube.com/embed/..."
                    value={editingProduct?.videoUrl || ''}
                    onChange={e => setEditingProduct({...editingProduct, videoUrl: e.target.value})}
                  />
                </div>
              </div>

              {/* IMAGE UPLOADER */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Photographies du bijou</label>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                  {(editingProduct?.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-square group border border-gray-100 rounded-sm overflow-hidden">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all rounded-sm"
                  >
                    <span className="text-xl">+</span>
                    <span className="text-[8px] uppercase font-bold">Upload</span>
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Description</label>
                <textarea 
                  className="w-full p-3 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-[#D4AF37] min-h-[100px] text-sm"
                  value={editingProduct?.description || ''}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                ></textarea>
              </div>

              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  id="admin-feat"
                  checked={editingProduct?.featured || false}
                  onChange={(e) => setEditingProduct({...editingProduct, featured: e.target.checked})}
                  className="text-[#D4AF37] focus:ring-[#D4AF37] rounded-sm"
                />
                <label htmlFor="admin-feat" className="text-xs text-gray-500 cursor-pointer font-medium uppercase tracking-widest">Mettre en avant sur l'accueil</label>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => { setIsAdding(false); setEditingProduct(null); }}
                  className="text-gray-400 text-[10px] uppercase tracking-widest font-bold px-6 py-4 hover:text-black transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="bg-black text-white px-10 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-all shadow-xl"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
