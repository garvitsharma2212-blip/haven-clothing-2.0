import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Sparkles, Diamond, Headphones } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  products, 
  onSelectProduct, 
  onNavigate 
}) => {
  return (
    <div className="bg-[#181615] text-[#FAF9F5] min-h-screen pb-20 space-y-12 sm:space-y-16">
      
      {/* 1. Hero Presentation matching the user uploaded reference design */}
      <section className="relative w-full bg-[#1A1817] overflow-hidden border-b border-[#2B2825]">
        
        {/* Desktop & Tablet Hero Image with Integrated Typography */}
        <div className="relative max-w-7xl mx-auto">
          {/* Main Hero Visual from user's uploaded mockup */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[1214/790] w-full overflow-hidden select-none">
            <img
              src="/hero-crop.jpg"
              alt="HAVEN CLOTHING • Wear The Vibe"
              className="w-full h-full object-cover object-top sm:object-center"
            />

            {/* Interactive overlay link over the 'Shop Now →' button */}
            <div className="absolute inset-0 pointer-events-none flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
                <div className="max-w-sm sm:max-w-md pt-28 sm:pt-40 lg:pt-48 pointer-events-auto">
                  <button
                    onClick={() => onNavigate('shop')}
                    className="group px-7 py-3 sm:px-8 sm:py-3.5 bg-[#191716]/90 hover:bg-[#121110] border border-[#FAF9F5]/30 hover:border-[#FAF9F5] text-[#FAF9F5] text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-2.5 shadow-2xl backdrop-blur-xs"
                    aria-label="Shop Haven Collection"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Spotlight Collection Cards directly from uploaded design */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Card 1: Oversized T-Shirts */}
          <div
            onClick={() => onNavigate('category-oversized')}
            className="group cursor-pointer relative aspect-[380/230] rounded-xl overflow-hidden border border-[#332F2B] hover:border-[#C5A880] transition-all duration-300 shadow-xl bg-[#221F1D]"
          >
            <img
              src="/card-oversized.jpg"
              alt="Oversized T-Shirts"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <h3 className="font-serif text-2xl text-[#FAF9F5] leading-tight">
                Oversized<br />T-Shirts
              </h3>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-[#D8CEBE] group-hover:text-[#FAF9F5] font-medium tracking-wide">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Card 2: Waffle Collection */}
          <div
            onClick={() => onNavigate('category-waffle')}
            className="group cursor-pointer relative aspect-[380/230] rounded-xl overflow-hidden border border-[#332F2B] hover:border-[#C5A880] transition-all duration-300 shadow-xl bg-[#221F1D]"
          >
            <img
              src="/card-waffle.jpg"
              alt="Waffle Collection"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <h3 className="font-serif text-2xl text-[#FAF9F5] leading-tight">
                Waffle<br />Collection
              </h3>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-[#D8CEBE] group-hover:text-[#FAF9F5] font-medium tracking-wide">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Card 3: Sweatshirts */}
          <div
            onClick={() => onNavigate('category-sweatshirts')}
            className="group cursor-pointer relative aspect-[380/230] rounded-xl overflow-hidden border border-[#332F2B] hover:border-[#C5A880] transition-all duration-300 shadow-xl bg-[#221F1D]"
          >
            <img
              src="/card-sweatshirts.jpg"
              alt="Sweatshirts"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <h3 className="font-serif text-2xl text-[#FAF9F5] leading-tight">
                Sweatshirts
              </h3>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-[#D8CEBE] group-hover:text-[#FAF9F5] font-medium tracking-wide">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

        </div>

        {/* 3. Feature Trust Bar directly below cards */}
        <div className="mt-10 pt-6 pb-2 border-t border-[#2D2A27] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#C5BDB0]">
          <div className="flex items-center gap-2.5 justify-center md:justify-start">
            <Diamond className="w-4 h-4 text-[#C5A880]" />
            <span className="font-medium tracking-wider uppercase text-[#E8E2D6]">Premium Quality</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center md:justify-start">
            <Truck className="w-4 h-4 text-[#C5A880]" />
            <span className="font-medium tracking-wider uppercase text-[#E8E2D6]">Fast Shipping</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center md:justify-start">
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <span className="font-medium tracking-wider uppercase text-[#E8E2D6]">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center md:justify-start">
            <Headphones className="w-4 h-4 text-[#C5A880]" />
            <span className="font-medium tracking-wider uppercase text-[#E8E2D6]">Dedicated Support</span>
          </div>
        </div>
      </section>

      {/* 4. Products Section (Only displays REAL products added by Admin; mock products removed) */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-[#2E2B28] pb-4 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                CURRENT CATALOG
              </p>
              <h2 className="text-3xl font-serif text-[#FAF9F5] mt-1">
                Latest Available Drops
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs uppercase tracking-widest font-semibold text-[#E8E2D6] hover:text-[#C5A880] flex items-center gap-1.5 transition-colors"
            >
              <span>View All ({products.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Founders Manifesto Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#1F1D1B] border border-[#332F2B] p-8 sm:p-12 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C5A880] font-semibold block">
              THE HAVEN PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#FAF9F5]">
              Founded by Garvit Sharma &amp; Ankit Meena
            </h2>
          </div>

          <blockquote className="text-lg sm:text-xl font-serif text-[#EBE6DC] italic max-w-2xl mx-auto leading-relaxed border-y border-[#35312D] py-6">
            "Our vision is to create timeless everyday essentials that combine comfort, simplicity and confidence."
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto text-left text-xs text-[#BDB5A8]">
            <div className="bg-[#262320] p-5 border border-[#3B3732] space-y-1.5">
              <h4 className="font-serif text-base font-semibold text-[#FAF9F5]">Garvit Sharma</h4>
              <p className="text-[10px] uppercase tracking-wider text-[#C5A880]">Co-Founder &amp; Creative Direction</p>
              <p className="text-[#A39B8E] pt-1 leading-relaxed">
                Spearheading architectural oversized draping, color restraint, and modern streetwear silhouettes.
              </p>
            </div>

            <div className="bg-[#262320] p-5 border border-[#3B3732] space-y-1.5">
              <h4 className="font-serif text-base font-semibold text-[#FAF9F5]">Ankit Meena</h4>
              <p className="text-[10px] uppercase tracking-wider text-[#C5A880]">Co-Founder &amp; Operations</p>
              <p className="text-[#A39B8E] pt-1 leading-relaxed">
                Directing yarn sourcing, 240–400 GSM knitting standards, pre-shrunk testing, and express Pan-India COD fulfillment.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-3.5 bg-[#FAF9F5] text-[#181615] hover:bg-[#EAE4D8] text-xs uppercase tracking-widest font-semibold transition-colors shadow-md"
            >
              Explore Collections
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="px-8 py-3.5 bg-transparent border border-[#FAF9F5]/30 hover:border-[#FAF9F5] text-[#FAF9F5] text-xs uppercase tracking-widest font-medium transition-colors"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
