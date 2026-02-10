
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem, Order } from '../types';
import { mockBackend } from '../services/mockBackend';

interface CartProps {
  items: CartItem[];
  user: any;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

const Cart: React.FC<CartProps> = ({ items, user, onUpdateQuantity, onRemove, onClear }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  
  // Shipping states
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Marrakech');
  const [address, setAddress] = useState('');

  // Payment states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 50;
  const total = subtotal + shipping;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) {
      setExpiry(value.substring(0, 2) + '/' + value.substring(2));
    } else {
      setExpiry(value);
    }
  };

  const handleProcessPayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;
    
    setLoading(true);

    // Simulation d'une transaction Stripe réelle (2.5 secondes de délai)
    setTimeout(() => {
      const order: Order = {
        id: Math.random().toString(36).substr(2, 9),
        items: [...items],
        total: total,
        status: 'En attente',
        customerEmail: email,
        createdAt: new Date().toISOString(),
      };

      mockBackend.createOrder(order);
      setLastOrder(order);
      setLoading(false);
      setShowConfirmation(true);
    }, 2500);
  };

  const finalizeOrder = () => {
    setShowConfirmation(false);
    onClear();
    navigate('/shop');
  };

  if (items.length === 0 && !showConfirmation) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-serif">Votre écrin est vide</h1>
        <p className="text-gray-400 font-light italic">Laissez-vous tenter par l'une de nos créations signature.</p>
        <Link to="/shop" className="inline-block bg-black text-white px-10 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-all">
          Découvrir nos bijoux
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-fadeIn relative">
      <div className="flex flex-col lg:flex-row gap-20">
        
        {/* Left Side: Cart Items or Forms */}
        <div className="flex-1 space-y-12">
          {/* Progress Header */}
          <div className="flex items-center space-x-8 mb-12">
            <button onClick={() => setStep('cart')} className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${step === 'cart' ? 'text-black border-b-2 border-[#D4AF37] pb-2' : 'text-gray-300'}`}>01. Panier</button>
            <div className="h-px w-8 bg-gray-200"></div>
            <button onClick={() => setStep('shipping')} className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${step === 'shipping' ? 'text-black border-b-2 border-[#D4AF37] pb-2' : 'text-gray-300'}`} disabled={step === 'cart'}>02. Livraison</button>
            <div className="h-px w-8 bg-gray-200"></div>
            <span className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${step === 'payment' ? 'text-black border-b-2 border-[#D4AF37] pb-2' : 'text-gray-300'}`}>03. Paiement</span>
          </div>

          {step === 'cart' && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-serif">Votre Écrin</h2>
              <div className="bg-white p-8 border border-gray-50 shadow-sm space-y-8">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-8 pb-8 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-24 h-32 bg-[#F9F7F5] flex-shrink-0">
                      <img src={item.product.images[0]} className="w-full h-full object-cover" alt={item.product.name} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-xl">{item.product.name}</h3>
                        <button onClick={() => onRemove(item.product.id)} className="text-gray-300 hover:text-red-400 transition-colors text-xl">×</button>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-6">{item.product.category}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-gray-200">
                          <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="px-3 py-1 hover:bg-gray-50">-</button>
                          <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="px-3 py-1 hover:bg-gray-50">+</button>
                        </div>
                        <p className="font-bold text-[#D4AF37] tracking-wider">{(item.product.price * item.quantity).toLocaleString()} DH</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'shipping' && (
            <div className="space-y-10 animate-fadeIn">
              <h2 className="text-3xl font-serif">Adresse de Livraison</h2>
              <div className="bg-white p-8 border border-gray-50 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Email pour le suivi</label>
                  <input 
                    type="email" required className="w-full p-4 bg-[#F9F7F5] border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                    value={email} onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Téléphone de contact</label>
                  <input 
                    type="tel" required placeholder="06..." className="w-full p-4 bg-[#F9F7F5] border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                    value={phone} onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Ville de destination</label>
                  <select 
                    className="w-full p-4 bg-[#F9F7F5] border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm appearance-none cursor-pointer"
                    value={city} onChange={e => setCity(e.target.value)}
                  >
                    <option value="Marrakech">Marrakech</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Tanger">Tanger</option>
                    <option value="Agadir">Agadir</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Adresse complète au Maroc</label>
                  {/* Fixed: Use an event handler instead of direct state setter for onChange */}
                  <textarea 
                    required className="w-full p-4 bg-[#F9F7F5] border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm min-h-[120px]"
                    placeholder="Quartier, Rue, N° d'appartement..."
                    value={address} onChange={e => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-10 animate-fadeIn">
              <h2 className="text-3xl font-serif">Paiement Sécurisé</h2>
              <form id="payment-form" onSubmit={handleProcessPayment} className="bg-white border border-gray-100 p-8 shadow-sm space-y-8">
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Règlement par Carte Bancaire</span>
                  <div className="flex space-x-3 grayscale opacity-50">
                    <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6" alt="Visa" />
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6" alt="Mastercard" />
                    <img src="https://img.icons8.com/color/48/000000/stripe.png" className="h-6" alt="Stripe" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Nom du titulaire</label>
                    <input 
                      type="text" required placeholder="M. OU MME NOM" className="w-full p-4 bg-[#F9F7F5] border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                      value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Numéro de carte</label>
                    <input 
                      type="text" required placeholder="0000 0000 0000 0000" className="w-full p-4 bg-[#F9F7F5] border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                      value={cardNumber} onChange={handleCardNumberChange}
                    />
                    <div className="absolute right-4 top-10 flex space-x-1">
                       <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Expiration</label>
                      <input 
                        type="text" required placeholder="MM/AA" className="w-full p-4 bg-[#F9F7F5] border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                        value={expiry} onChange={handleExpiryChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Cryptogramme (CVC)</label>
                      <input 
                        type="password" required placeholder="***" className="w-full p-4 bg-[#F9F7F5] border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                        value={cvc} onChange={e => setCvc(e.target.value.substring(0, 3))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-green-50/50 p-4 border border-green-100/50 rounded-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-[10px] text-green-700 font-medium">Connexion 256-bit cryptée. Vos informations transitent de manière anonymisée via Stripe.</p>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white border border-gray-100 p-8 space-y-8 sticky top-32 shadow-xl">
            <h3 className="font-serif text-2xl border-b border-[#D4AF37]/20 pb-4">Résumé de l'Écrin</h3>
            
            <div className="space-y-6 text-sm font-light">
              <div className="flex justify-between">
                <span className="text-gray-400">Articles ({items.length})</span>
                <span className="font-medium">{subtotal.toLocaleString()} DH</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Livraison Sécurisée</span>
                  <div className="group relative">
                    <svg className="w-3 h-3 text-gray-300 cursor-help" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none uppercase tracking-widest text-center">Livraison suivie et assurée par notre partenaire logistique à Marrakech.</div>
                  </div>
                </div>
                <span className={shipping === 0 ? 'text-green-600 font-bold uppercase tracking-widest' : 'font-medium'}>{shipping === 0 ? 'Gratuite' : `${shipping} DH`}</span>
              </div>
              <div className="flex justify-between font-bold text-2xl pt-6 border-t border-gray-100 text-black">
                <span className="font-serif">Total</span>
                <span className="text-[#D4AF37]">{total.toLocaleString()} DH</span>
              </div>
            </div>

            <div className="space-y-4">
              {step === 'cart' && (
                <button 
                  onClick={() => setStep('shipping')}
                  className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-all duration-500 shadow-xl"
                >
                  Procéder à la Livraison
                </button>
              )}

              {step === 'shipping' && (
                <button 
                  disabled={!email || !address || !phone}
                  onClick={() => setStep('payment')}
                  className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] disabled:bg-gray-200 disabled:cursor-not-allowed transition-all duration-500 shadow-xl"
                >
                  Procéder au Paiement
                </button>
              )}

              {step === 'payment' && (
                <button 
                  type="submit"
                  form="payment-form"
                  disabled={loading || !cardName || cardNumber.length < 19}
                  className="w-full bg-[#D4AF37] text-white py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-black disabled:bg-gray-200 disabled:cursor-not-allowed transition-all duration-500 shadow-xl flex items-center justify-center space-x-3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sécurisation Stripe...</span>
                    </>
                  ) : (
                    <span>Confirmer {total.toLocaleString()} DH</span>
                  )}
                </button>
              )}
              
              <div className="flex justify-center items-center space-x-4 pt-4 border-t border-gray-50 opacity-40 grayscale">
                 <img src="https://img.icons8.com/color/48/000000/ssl.png" className="h-8" alt="SSL" />
                 <img src="https://img.icons8.com/color/48/000000/pci-dss.png" className="h-8" alt="PCI DSS" />
              </div>
            </div>

            <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest pt-4 font-light">
              Maison Éclat Marrakech - Service Client Guéliz<br/>+212 (0) 5 24 44 55 66
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && lastOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl shadow-2xl relative overflow-hidden border border-[#D4AF37]/20 flex flex-col md:flex-row">
            
            {/* Visual Side */}
            <div className="hidden md:block w-1/3 bg-[#F5F1EC] relative">
              <img 
                src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop" 
                className="w-full h-full object-cover filter brightness-90 grayscale" 
                alt="Confirmation" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#D4AF37] text-white p-4 shadow-xl">
                  <p className="text-[10px] uppercase font-bold tracking-[0.3em] vertical-rl">Maison Éclat</p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="flex-1 p-8 md:p-12 space-y-8 max-h-[90vh] overflow-y-auto">
              <div className="space-y-2">
                <div className="w-12 h-1 bg-[#D4AF37] mb-6"></div>
                <h2 className="text-4xl font-serif">Merci pour votre confiance</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Commande #{lastOrder.id.toUpperCase()}</p>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Votre sélection a été validée. Nos artisans de l'atelier de <span className="text-black font-medium">Guéliz</span> préparent dès maintenant votre écrin avec le plus grand soin.
                </p>

                <div className="border-t border-b border-gray-100 py-6 space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Détails de l'expédition</h4>
                  <div className="text-xs space-y-1">
                    <p className="font-bold">{lastOrder.customerEmail}</p>
                    <p className="text-gray-500">{address}, {city}</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Récapitulatif de l'ouvrage</h4>
                   <div className="space-y-3">
                     {lastOrder.items.map((item, idx) => (
                       <div key={idx} className="flex justify-between items-center text-xs">
                         <span className="text-gray-500">{item.quantity}x {item.product.name}</span>
                         <span className="font-bold">{(item.product.price * item.quantity).toLocaleString()} DH</span>
                       </div>
                     ))}
                     <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-50 font-bold">
                       <span className="font-serif">Total TTC</span>
                       <span className="text-[#D4AF37]">{lastOrder.total.toLocaleString()} DH</span>
                     </div>
                   </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={finalizeOrder}
                  className="flex-1 bg-black text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-all shadow-xl"
                >
                  Continuer mes achats
                </button>
                <button 
                  onClick={() => { setShowConfirmation(false); onClear(); navigate('/admin'); }}
                  className="flex-1 border border-gray-200 text-gray-400 py-4 text-[10px] uppercase tracking-widest font-bold hover:text-black hover:border-black transition-all"
                >
                  Suivre ma commande
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
