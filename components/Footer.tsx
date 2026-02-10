
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-serif text-2xl mb-6">Éclat Bijoux</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              L'excellence de la haute joaillerie marocaine. Des pièces d'exception façonnées à la main dans notre atelier de <span className="text-black font-medium">Guéliz, Marrakech</span>.
            </p>
            <div className="flex space-x-4">
              <span className="text-[#D4AF37] hover:scale-110 transition-transform cursor-pointer">Instagram</span>
              <span className="text-[#D4AF37] hover:scale-110 transition-transform cursor-pointer">Pinterest</span>
              <span className="text-[#D4AF37] hover:scale-110 transition-transform cursor-pointer">Facebook</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Nos Adresses</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="font-medium text-black">Showroom Guéliz</li>
              <li>Angle Avenue Mohammed V</li>
              <li>40000 Marrakech, Maroc</li>
              <li className="pt-2 italic text-[11px]">Bientôt à Casablanca</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-[#D4AF37]">Guide des tailles</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Livraison Sécurisée</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Entretien à Marrakech</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Contactez-nous</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Newsletter</h4>
            <p className="text-xs text-gray-400 mb-4">Recevez les actualités de notre atelier de Guéliz.</p>
            <div className="flex border-b border-[#D4AF37]/50 pb-2">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-300" 
              />
              <button className="text-[#D4AF37] text-xs uppercase tracking-widest font-bold ml-2">S'inscrire</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-gray-400">
          <p>© 2024 Éclat Bijoux Marrakech. Maison fondée à Guéliz.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#D4AF37]">Politique de confidentialité</a>
            <a href="#" className="hover:text-[#D4AF37]">CGV Maroc</a>
            <a href="#" className="hover:text-[#D4AF37]">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
