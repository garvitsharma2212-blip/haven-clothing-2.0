import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, products, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.isActive &&
          (p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF9F5] border border-[#E3DDCF] shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-[#EAE4D8] gap-3">
          <Search className="w-5 h-5 text-[#8C8375] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search oversized tees, waffle knits, sweatshirts..."
            className="w-full bg-transparent text-base sm:text-lg text-[#1A1918] placeholder-[#9E978C] focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="text-[#7A7368] hover:text-[#1A1918] transition-colors p-1"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results or Quick Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8F887E] mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Heavyweight Oversized', 'Waffle Knit Thermal', 'French Terry Sweatshirt', 'Vintage Charcoal', 'Boxy Drop Shoulder'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-[#EFEBE3] hover:bg-[#E3DDD1] text-xs text-[#403C36] transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-serif text-lg text-[#1A1918]">No products matching "{query}"</p>
              <p className="text-xs text-[#7A7368] mt-1">Try searching for 'oversized', 'waffle', or 'sweatshirt'</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-[#8F887E]">
                {filtered.length} {filtered.length === 1 ? 'Product Found' : 'Products Found'}
              </p>
              {filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-2.5 hover:bg-[#F2ECE1] cursor-pointer transition-colors border border-transparent hover:border-[#E0D9CB]"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-16 object-cover bg-[#E8E2D6] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[#1A1918] truncate">{product.name}</h4>
                    <p className="text-xs text-[#787165] capitalize">{product.category.replace('-', ' ')}</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-[#1A1918]">
                        ₹{(product.discountedPrice || product.price).toLocaleString('en-IN')}
                      </span>
                      {product.discountedPrice && (
                        <span className="text-[10px] text-[#9E978C] line-through">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C8375]" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
