import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  Check, 
  Ruler,
  Clock
} from 'lucide-react';
import { Product, ProductSize } from '../types';
import { useCart } from '../context/CartContext';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { ProductCard } from '../components/product/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onNavigateToCheckout
}) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[1] || product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Charcoal');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Accordion toggle states
  const [openAccordion, setOpenAccordion] = useState<string | null>('fabric');

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const discountPercentage = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNowCOD = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onNavigateToCheckout();
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category && p.isActive)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#80796E]">
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:text-[#1A1918] transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collection</span>
        </button>
        <span>/</span>
        <span className="capitalize">{product.category.replace('-', ' ')}</span>
        <span>/</span>
        <span className="text-[#1A1918] font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left: Gallery (Thumbnails + Main View) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 object-cover overflow-hidden border transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#1A1918] ring-1 ring-[#1A1918]'
                      : 'border-[#DDD6C8] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Primary View */}
          <div className="flex-1 relative aspect-3/4 bg-[#EBE5DB] overflow-hidden">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.isBestseller && (
              <span className="absolute top-4 left-4 bg-[#1A1918] text-[#FAF9F5] text-xs uppercase font-semibold tracking-widest px-3 py-1 shadow-md">
                Bestseller
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="absolute top-4 right-4 bg-[#B94B3C] text-white text-xs uppercase font-bold tracking-widest px-2.5 py-1 shadow-md">
                Save {discountPercentage}%
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C8375] font-semibold block mb-1">
              HAVEN CLOTHING ESSENTIAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#1A1918] leading-tight">
              {product.name}
            </h1>
            
            {/* Price section */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-serif font-bold text-[#1A1918]">
                ₹{(product.discountedPrice || product.price).toLocaleString('en-IN')}
              </span>
              {product.discountedPrice && (
                <span className="text-base text-[#9C9486] line-through font-normal">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-[#3B6E47] font-semibold bg-[#EBF2EC] px-2 py-0.5">
                Inclusive of all taxes
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#666055] leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#E8E2D6]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B6459] uppercase tracking-wider font-semibold">
                  Color: <strong className="text-[#1A1918] font-medium">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`relative w-8 h-8 rounded-full border transition-all ${
                      selectedColor === c.name
                        ? 'ring-2 ring-[#1A1918] ring-offset-2 border-[#1A1918] scale-105'
                        : 'border-[#CCC4B6] hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check className={`w-3.5 h-3.5 ${['#F4F2EB', '#FAF7EE', '#F5F2EB', '#DCD4C6'].includes(c.hex) ? 'text-[#1A1918]' : 'text-white'}`} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="space-y-2.5 pt-2 border-t border-[#E8E2D6]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#6B6459] uppercase tracking-wider font-semibold">
                Select Size: <strong className="text-[#1A1918] font-medium">{selectedSize}</strong>
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="flex items-center gap-1 text-[#8C6D45] hover:underline uppercase tracking-wider font-semibold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((s) => {
                const isAvailable = product.sizes.includes(s as ProductSize);
                const isSelected = selectedSize === s;

                return (
                  <button
                    key={s}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(s as ProductSize)}
                    className={`py-3 text-xs font-semibold uppercase tracking-wider border transition-all ${
                      isSelected
                        ? 'bg-[#1A1918] text-[#FAF9F5] border-[#1A1918]'
                        : isAvailable
                        ? 'bg-white text-[#1A1918] border-[#DDD5C6] hover:bg-[#F2ECE1]'
                        : 'bg-[#ECE7DC] text-[#A69E90] border-[#E0D9CB] cursor-not-allowed line-through'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Stock indicator */}
            {product.stock <= 10 && product.stock > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-[#B94B3C] font-medium pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Only {product.stock} units remaining in stock. Order now.</span>
              </div>
            )}
          </div>

          {/* Quantity Selector & Purchase CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#DDD5C6] bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-3 text-[#5E574D] hover:bg-[#F2ECE1] transition-colors"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold text-[#1A1918] select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="px-3 py-3 text-[#5E574D] hover:bg-[#F2ECE1] transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-[#FAF9F5] border-2 border-[#1A1918] text-[#1A1918] hover:bg-[#EAE4D8] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedAnimation ? 'Added to Bag ✓' : 'Add to Bag'}</span>
              </button>
            </div>

            {/* Direct COD Instant Checkout Button */}
            <button
              onClick={handleBuyNowCOD}
              className="w-full py-4 bg-[#1A1918] hover:bg-[#33312E] text-[#FAF9F5] text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span>Buy with Cash On Delivery (COD)</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#EAE4D8] text-xs text-[#6B6458]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>3-5 Days Pan-India Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>Cash on Delivery Available</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>7-Day Doorstep Exchange</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>100% Pre-Shrunk Combed Cotton</span>
            </div>
          </div>

          {/* Accordion Sections: Fabric, Fit, Delivery */}
          <div className="border-t border-[#E0D9CB] divide-y divide-[#EAE4D8] pt-2">
            
            {/* Fabric Details */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('fabric')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#1A1918] py-1"
              >
                <span>Fabric &amp; Craftsmanship</span>
                {openAccordion === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'fabric' && (
                <div className="pt-2 text-xs text-[#666055] space-y-2 leading-relaxed animate-in fade-in duration-200">
                  <p>{product.fabricDetails || 'High-density 100% combed cotton, bio-washed and silicone softened for enduring tactile comfort.'}</p>
                  <p>{product.careInstructions || 'Machine wash cold with like colors. Hang dry inside out. Do not tumble dry.'}</p>
                </div>
              )}
            </div>

            {/* Fit Advice */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('fit')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#1A1918] py-1"
              >
                <span>Fit &amp; Sizing Advice</span>
                {openAccordion === 'fit' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'fit' && (
                <div className="pt-2 text-xs text-[#666055] space-y-2 leading-relaxed animate-in fade-in duration-200">
                  <p>{product.fitDetails || 'Relaxed oversized silhouette. Generous room through chest with lowered shoulder seam for clean drape.'}</p>
                  <p>Male model is 6\'1" wearing size L for an exaggerated oversized look. For regular fit, size down.</p>
                </div>
              )}
            </div>

            {/* Shipping & COD Policy */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#1A1918] py-1"
              >
                <span>Pan-India COD &amp; Delivery</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="pt-2 text-xs text-[#666055] space-y-2 leading-relaxed animate-in fade-in duration-200">
                  <p>We dispatch all orders within 24 hours. Free delivery applies automatically to all orders above ₹1,999.</p>
                  <p>Cash On Delivery is accepted at your doorstep. You will receive an SMS and email tracking link upon dispatch.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Related Drops */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#E3DDD1] space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif text-[#1A1918]">Complete The Look</h3>
            <span className="text-xs uppercase tracking-widest text-[#8C8375]">More from this drop</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />
    </div>
  );
};
