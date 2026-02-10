
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, CartItem } from '../types';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, cartCount, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#F5F1EC]/90 backdrop-blur-md border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-3xl font-serif tracking-widest text-[#2D2D2D]">
              ÉCLAT <span className="text-[#D4AF37]">BIJOUX</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors">Accueil</Link>
            <Link to="/shop" className="text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors">Bijoux</Link>
            <Link to="/about" className="text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors">À propos</Link>
            <Link to="/contact" className="text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors">Contact</Link>
          </div>

          {/* Icons/Action Section */}
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-xs uppercase font-bold text-[#D4AF37] border border-[#D4AF37] px-3 py-1 rounded hover:bg-[#D4AF37] hover:text-white transition-all">
                    Admin
                  </Link>
                )}
                <button onClick={onLogout} className="text-sm text-gray-500 hover:text-black">
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest py-2">Accueil</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest py-2">Bijoux</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest py-2">À propos</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest py-2">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
