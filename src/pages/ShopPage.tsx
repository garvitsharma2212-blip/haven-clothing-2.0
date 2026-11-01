import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Product, ProductCategory, ProductSize } from '../types';
import { ProductCard } from '../components/product/ProductCard';

interface ShopPageProps {
  products: Product[];
  selectedCategory?: string;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  selectedCategory = 'all',
  onSelectProduct,
  onSelectCategory
}) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize | 'all'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const categories = [
    { id: 'all', label: 'All Essentials' },
    { id: 'oversized-t-shirts', label: 'Oversized T-Shirts' },
    { id: 'waffle-t-shirts', label: 'Waffle T-Shirts' },
    { id: 'sweatshirts', label: 'Sweatshirts' },
  ];

  const sizes: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;
      if (selectedCategory !== 'all') {
        const catKey = selectedCategory.replace('category-', '');
        if (catKey === 'oversized' && p.category !== 'oversized-t-shirts') return false;
        if (catKey === 'waffle' && p.category !== 'waffle-t-shirts') return false;
        if (catKey === 'sweatshirts' && p.category !== 'sweatshirts') return false;
        if (catKey !== 'oversized' && catKey !== 'waffle' && catKey !== 'sweatshirts' && p.category !== selectedCategory) return false;
      }
      if (selectedSize !== 'all' && !p.sizes.includes(selectedSize)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.discountedPrice || a.price;
      const priceB = b.discountedPrice || b.price;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'newest') return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
      // Default: featured first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedSize, sortBy]);

  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedSize !== 'all' ? 1 : 0);

  const clearAllFilters = () => {
    onSelectCategory('all');
    setSelectedSize('all');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div className="border-b border-[#E3DDD1] pb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C8375] font-semibold">
          HAVEN CLOTHING • WARDROBE
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1918]">
            {selectedCategory === 'all'
              ? 'The Complete Collection'
              : selectedCategory.replace('category-', '').replace('-', ' ').toUpperCase()}
          </h1>
          <p className="text-xs text-[#7A7367]">
            Showing {filteredProducts.length} crafted pieces
          </p>
        </div>
      </div>

      {/* Category Pills & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE7DD] pb-6">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id || 
              (cat.id === 'oversized-t-shirts' && selectedCategory === 'category-oversized') ||
              (cat.id === 'waffle-t-shirts' && selectedCategory === 'category-waffle') ||
              (cat.id === 'sweatshirts' && selectedCategory === 'category-sweatshirts');

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-[#1A1918] text-[#FAF9F5] border-[#1A1918]'
                    : 'bg-[#FAF9F5] text-[#595349] border-[#DDD7CB] hover:bg-[#F2ECE1]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-4 justify-between sm:justify-end">
          {/* Size Filter Pills (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#6B645A]">
            <span className="uppercase tracking-wider font-semibold mr-1">Size:</span>
            <button
              onClick={() => setSelectedSize('all')}
              className={`px-2.5 py-1 uppercase tracking-wider transition-colors border ${
                selectedSize === 'all'
                  ? 'bg-[#1A1918] text-[#FAF9F5] border-[#1A1918]'
                  : 'bg-white border-[#DDD7CB] hover:bg-[#F2ECE1]'
              }`}
            >
              All
            </button>
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`w-7 h-7 flex items-center justify-center font-medium transition-colors border ${
                  selectedSize === s
                    ? 'bg-[#1A1918] text-[#FAF9F5] border-[#1A1918]'
                    : 'bg-white border-[#DDD7CB] hover:bg-[#F2ECE1]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#7A7367] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs uppercase tracking-wider bg-white border border-[#DDD7CB] px-3 py-2 text-[#1A1918] focus:outline-none focus:border-[#1A1918]"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="lg:hidden p-2 border border-[#DDD7CB] bg-white text-[#1A1918] flex items-center gap-1 text-xs uppercase"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Sizes</span>
          </button>
        </div>
      </div>

      {/* Mobile Size Filter Drawer / Row */}
      {showFiltersMobile && (
        <div className="lg:hidden p-4 bg-[#F2EDE4] border border-[#DDD6C8] flex items-center gap-2 flex-wrap animate-in fade-in">
          <span className="text-xs font-semibold uppercase text-[#544E45] w-full mb-1">Filter by Size:</span>
          <button
            onClick={() => setSelectedSize('all')}
            className={`px-3 py-1.5 text-xs uppercase transition-colors border ${
              selectedSize === 'all' ? 'bg-[#1A1918] text-white' : 'bg-white'
            }`}
          >
            All Sizes
          </button>
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`w-8 h-8 text-xs font-semibold uppercase transition-colors border ${
                selectedSize === s ? 'bg-[#1A1918] text-white' : 'bg-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#857D71] uppercase tracking-wider">Active:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EBE5DB] text-[#1A1918]">
              <span>Category: {selectedCategory.replace('category-', '')}</span>
              <button onClick={() => onSelectCategory('all')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedSize !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EBE5DB] text-[#1A1918]">
              <span>Size: {selectedSize}</span>
              <button onClick={() => setSelectedSize('all')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#8C6D45] hover:underline uppercase tracking-wider ml-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-xl mx-auto bg-[#FAF9F5] border border-[#DDD5C6] p-8">
          <h3 className="font-serif text-2xl text-[#1A1918]">
            {products.length === 0 ? 'Curating The Next Drop' : 'No pieces match your filter'}
          </h3>
          <p className="text-sm text-[#7A7367] leading-relaxed">
            {products.length === 0
              ? 'Founders Garvit Sharma & Ankit Meena are curating the signature apparel drop. You can add and publish pieces anytime from the Admin Panel.'
              : 'Try clearing your category or size filters to view all available pieces.'}
          </p>
          {products.length > 0 ? (
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-[#1A1918] text-[#FAF9F5] text-xs uppercase tracking-widest hover:bg-[#33312E]"
            >
              Clear All Filters
            </button>
          ) : (
            <button
              onClick={() => onSelectCategory('all')}
              className="px-6 py-3 bg-[#1A1918] text-[#FAF9F5] text-xs uppercase tracking-widest hover:bg-[#33312E]"
            >
              Refresh Collection
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
