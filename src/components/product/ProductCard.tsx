import React, { useState } from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const discountPercentage = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const currentImage = product.images[currentImageIndex] || product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85';
  const hasSecondaryImage = product.images.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[1] || product.sizes[0] || 'M';
    const defaultColor = product.colors[selectedColorIndex]?.name || product.colors[0]?.name || 'Charcoal';
    addToCart(product, defaultSize, defaultColor, 1);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group cursor-pointer flex flex-col transition-all duration-300"
    >
      {/* Image container with hover switch */}
      <div
        className="relative aspect-3/4 w-full bg-[#EAE5DC] overflow-hidden select-none"
        onMouseEnter={() => hasSecondaryImage && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isBestseller && (
            <span className="bg-[#1A1918] text-[#FAF9F5] text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 shadow-xs">
              Bestseller
            </span>
          )}
          {product.isFeatured && !product.isBestseller && (
            <span className="bg-[#FAF9F5] text-[#1A1918] text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 border border-[#DDD6C8] shadow-xs">
              Featured
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-[#B94B3C] text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick Add overlay button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 z-10">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2.5 bg-[#FAF9F5]/95 hover:bg-[#FAF9F5] backdrop-blur-sm text-[#1A1918] text-[11px] font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="p-2.5 bg-[#FAF9F5]/95 hover:bg-[#FAF9F5] backdrop-blur-sm text-[#1A1918] shadow-md transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product metadata */}
      <div className="pt-3.5 pb-2 flex flex-col flex-1">
        {/* Colors Preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIndex(idx);
                }}
                className={`w-3 h-3 rounded-full border transition-all ${
                  selectedColorIndex === idx
                    ? 'ring-1 ring-[#1A1918] ring-offset-1 border-[#1A1918]'
                    : 'border-[#CCC5B8]'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            <span className="text-[10px] text-[#8C8478] ml-1">
              {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
            </span>
          </div>
        )}

        <h3 className="font-serif text-base text-[#1A1918] group-hover:text-[#6E5739] transition-colors leading-snug">
          {product.name}
        </h3>

        <p className="text-xs text-[#7B7469] line-clamp-1 mt-0.5">
          {product.categoryName || product.category.replace('-', ' ')}
        </p>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-[#1A1918]">
            ₹{(product.discountedPrice || product.price).toLocaleString('en-IN')}
          </span>
          {product.discountedPrice && (
            <span className="text-xs text-[#999285] line-through font-normal">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
