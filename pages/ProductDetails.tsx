
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, Category } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ProductDetailsProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ products, onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  
  // Zoom states
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
      setAdvice(null);
      setActiveImg(0);
    }
  }, [id, product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const getStylingAdvice = async () => {
    if (!product) return;
    setLoadingAdvice(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `En tant qu'expert en joaillerie de luxe à Marrakech, donne des conseils de style pour ce bijou : "${product.name}" (${product.category} en ${product.material}). Recommande des tenues (ex: Caftan, tenue de soirée moderne) ou des occasions à Marrakech (Gueliz, Hivernage). Garde un ton élégant. Max 80 mots.`,
      });
      setAdvice(response.text || "Nos experts sont à votre disposition en boutique.");
    } catch (err) {
      setAdvice("Une erreur est survenue, veuillez réessayer.");
    } finally {
      setLoadingAdvice(false);
    }
  };

  if (!product) return <div className="py-20 text-center">Produit introuvable</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fadeIn">
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Gallery */}
        <div className="flex-1 space-y-4">
          <div 
            ref={containerRef}
            className="aspect-square bg-white overflow-hidden relative cursor-zoom-in group"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              src={product.images[activeImg]} 
              className={`w-full h-full object-cover transition-transform duration-200 ease-out ${isZoomed ? 'scale-[2.5]' : 'scale-100'}`} 
              style={{
                transformOrigin: isZoomed ? `${zoomPos.x}% ${zoomPos.y}%` : 'center',
              }}
              alt={product.name} 
            />
            {!isZoomed && (
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 text-[8px] uppercase tracking-widest font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Survolez pour zoomer
              </div>
            )}
          </div>
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImg(idx)}
                className={`w-24 h-24 border-2 transition-all overflow-hidden ${activeImg === idx ? 'border-[#D4AF37]' : 'border-transparent'}`}
              >
                <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-[0.3em] text-gray-400">{product.category} | {product.material}</span>
              {product.stock <= 3 && product.stock > 0 && (
                <span className="text-[9px] text-[#D4AF37] border border-[#D4AF37] px-2 py-0.5 uppercase font-bold tracking-widest">Édition Limitée</span>
              )}
            </div>
            <h1 className="text-4xl font-serif mt-2 mb-4">{product.name}</h1>
            <p className="text-3xl font-light text-[#D4AF37]">{product.price.toLocaleString()} DH</p>
          </div>

          <div className="space-y-8">
            <div className="text-gray-600 leading-relaxed border-y border-gray-100 py-8 text-sm font-light">
              <p>{product.description}</p>
            </div>

            {/* Video Section - Rendered below description if URL exists */}
            {product.videoUrl && (
              <div className="animate-fadeIn space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">L'Éclat en Mouvement</h4>
                <div className="aspect-video w-full bg-gray-50 border border-[#D4AF37]/10 overflow-hidden shadow-sm">
                  {product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') ? (
                    <iframe 
                      className="w-full h-full"
                      src={product.videoUrl} 
                      title={`${product.name} Video Showcase`}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video className="w-full h-full object-cover" controls>
                      <source src={product.videoUrl} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center border border-gray-200 bg-white">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gray-50 transition-colors">-</button>
                <span className="px-6 py-3 text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-3 hover:bg-gray-50 transition-colors">+</button>
              </div>
              <button 
                disabled={product.stock === 0}
                onClick={() => onAddToCart(product, quantity)}
                className={`flex-1 ${product.stock > 0 ? 'bg-black hover:bg-[#D4AF37]' : 'bg-gray-300 cursor-not-allowed'} text-white py-4 px-8 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 shadow-xl`}
              >
                {product.stock > 0 ? 'Ajouter à l\'Écrin' : 'Rupture'}
              </button>
            </div>
            <div className="flex items-center space-x-4">
               <div className="flex -space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
               </div>
               <span className="text-[10px] text-gray-400 uppercase tracking-widest">Excellence certifiée</span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-gray-400">
              Expédition sécurisée sous 48h partout au Maroc.
            </p>
          </div>

          {/* AI Styling Assistant */}
          <div className="bg-[#F5F1EC] p-8 border border-[#D4AF37]/10 shadow-sm transition-all hover:shadow-md">
            <h4 className="font-serif text-xl mb-4 flex items-center">
              <span className="mr-3">✨</span> L'Oeil de l'Expert
            </h4>
            {advice ? (
              <p className="text-xs text-gray-600 leading-relaxed italic animate-fadeIn">"{advice}"</p>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Conseils personnalisés pour ce bijou</p>
                <button 
                  onClick={getStylingAdvice}
                  disabled={loadingAdvice}
                  className="group relative text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37] overflow-hidden inline-block"
                >
                  <span className="relative z-10">{loadingAdvice ? 'Consultation...' : 'Consulter notre styliste'}</span>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
