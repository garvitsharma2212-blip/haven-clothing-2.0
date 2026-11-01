import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdown, setCollectionsDropdown] = useState(false);

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setCollectionsDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1D1B19] text-[#FAF9F5] border-b border-[#2D2A27] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo matching reference design */}
          <div 
            className="flex flex-col cursor-pointer select-none" 
            onClick={() => handleNavClick('home')}
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-medium text-[#FAF9F5] uppercase leading-none">
              HAVEN
            </span>
            <span className="text-[9px] uppercase tracking-[0.45em] text-[#B0A79A] font-sans mt-0.5">
              CLOTHING
            </span>
          </div>

          {/* Center: Desktop Navigation Links matching reference */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#C5A880] ${
                currentPage === 'home' ? 'text-[#FAF9F5] font-semibold border-b border-[#C5A880] pb-0.5' : 'text-[#D0C9BE]'
              }`}
            >
              Home
            </button>

            {/* Collection Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCollectionsDropdown(true)}
              onMouseLeave={() => setCollectionsDropdown(false)}
            >
              <button
                onClick={() => handleNavClick('shop')}
                className={`flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#C5A880] py-2 ${
                  currentPage.includes('category') || currentPage === 'shop'
                    ? 'text-[#FAF9F5] font-semibold border-b border-[#C5A880] pb-0.5'
                    : 'text-[#D0C9BE]'
                }`}
              >
                <span>Collection</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#A89F90] transition-transform duration-200" />
              </button>

              {collectionsDropdown && (
                <div className="absolute top-full left-0 w-60 bg-[#1F1D1B] border border-[#35322F] shadow-2xl py-2 animate-in fade-in z-50">
                  <button
                    onClick={() => handleNavClick('shop')}
                    className="w-full text-left px-4 py-2.5 text-xs tracking-wider text-[#DCD4C7] hover:bg-[#2D2A26] hover:text-[#FAF9F5] uppercase transition-colors"
                  >
                    All Collections
                  </button>
                  <button
                    onClick={() => handleNavClick('category-oversized')}
                    className="w-full text-left px-4 py-2.5 text-xs tracking-wider text-[#DCD4C7] hover:bg-[#2D2A26] hover:text-[#FAF9F5] uppercase transition-colors"
                  >
                    Oversized T-Shirts
                  </button>
                  <button
                    onClick={() => handleNavClick('category-waffle')}
                    className="w-full text-left px-4 py-2.5 text-xs tracking-wider text-[#DCD4C7] hover:bg-[#2D2A26] hover:text-[#FAF9F5] uppercase transition-colors"
                  >
                    Waffle Collection
                  </button>
                  <button
                    onClick={() => handleNavClick('category-sweatshirts')}
                    className="w-full text-left px-4 py-2.5 text-xs tracking-wider text-[#DCD4C7] hover:bg-[#2D2A26] hover:text-[#FAF9F5] uppercase transition-colors"
                  >
                    Sweatshirts
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('about')}
              className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#C5A880] ${
                currentPage === 'about' ? 'text-[#FAF9F5] font-semibold border-b border-[#C5A880] pb-0.5' : 'text-[#D0C9BE]'
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#C5A880] ${
                currentPage === 'contact' ? 'text-[#FAF9F5] font-semibold border-b border-[#C5A880] pb-0.5' : 'text-[#D0C9BE]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right: Search, Cart Icon & Admin Badge */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="text-[#D0C9BE] hover:text-[#FAF9F5] p-1.5 transition-colors"
              aria-label="Search Collection"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Bag with Badge */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-1.5 text-[#D0C9BE] hover:text-[#FAF9F5] transition-colors flex items-center"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#FAF9F5] text-[#1D1B19] text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            </button>

            {/* Admin Dashboard Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-1.5 transition-colors flex items-center gap-1 text-[11px] uppercase tracking-wider ${
                isAdmin ? 'text-[#C5A880] bg-[#2A2724] px-2 py-1' : 'text-[#7D766C] hover:text-[#FAF9F5]'
              }`}
              title="Admin & Operations Panel"
            >
              <Shield className="w-4 h-4" />
              {isAdmin && <span className="hidden sm:inline font-semibold">Admin</span>}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#FAF9F5] p-1.5 hover:text-[#C5A880] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1D1B19] border-b border-[#302D2A] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 pb-4 border-b border-[#2E2B28]">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left text-sm uppercase tracking-widest text-[#FAF9F5] py-1 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="text-left text-sm uppercase tracking-widest text-[#FAF9F5] py-1 font-medium"
            >
              Collection
            </button>
            <button
              onClick={() => handleNavClick('category-oversized')}
              className="text-left text-xs uppercase tracking-wider text-[#AFA799] pl-3 py-0.5"
            >
              — Oversized T-Shirts
            </button>
            <button
              onClick={() => handleNavClick('category-waffle')}
              className="text-left text-xs uppercase tracking-wider text-[#AFA799] pl-3 py-0.5"
            >
              — Waffle Collection
            </button>
            <button
              onClick={() => handleNavClick('category-sweatshirts')}
              className="text-left text-xs uppercase tracking-wider text-[#AFA799] pl-3 py-0.5"
            >
              — Sweatshirts
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left text-sm uppercase tracking-widest text-[#FAF9F5] py-1 font-medium"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left text-sm uppercase tracking-widest text-[#FAF9F5] py-1 font-medium"
            >
              Contact
            </button>
          </div>

          <div className="pt-2 flex flex-col space-y-2 text-xs text-[#8C8477]">
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A880]"
            >
              <Shield className="w-4 h-4" />
              <span>Admin &amp; Founders Portal</span>
            </button>
            <p>Customer Support: havenclothingindia@gmail.com</p>
          </div>
        </div>
      )}
    </header>
  );
};
