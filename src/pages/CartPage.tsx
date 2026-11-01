import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigateToCheckout: () => void;
  onNavigateToShop: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigateToCheckout, onNavigateToShop }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    discount,
    total,
    freeShippingThreshold,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  const freeRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freePercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#EFECE5] flex items-center justify-center text-[#736C62]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif text-[#1A1918]">Your Wardrobe Bag is Empty</h1>
        <p className="text-sm text-[#736C62] max-w-md mx-auto">
          Explore our premium heavy-cotton oversized tees, textured waffle knits, and comfortable everyday sweatshirts.
        </p>
        <button
          onClick={onNavigateToShop}
          className="px-8 py-3.5 bg-[#1A1918] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold hover:bg-[#33312E] transition-colors"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Title */}
      <div className="border-b border-[#E3DDD1] pb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C8375] font-semibold">
            YOUR SELECTION
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1918] mt-1">
            Shopping Bag ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={onNavigateToShop}
          className="text-xs uppercase tracking-widest font-semibold text-[#8C6D45] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Free Shipping Tracker */}
      <div className="bg-[#F3EFE7] p-4 sm:p-5 border border-[#E5DFD4]">
        {freeRemaining > 0 ? (
          <p className="text-xs text-[#524E47]">
            Add <strong className="text-[#1A1918]">₹{freeRemaining.toLocaleString('en-IN')}</strong> more to your order to unlock{' '}
            <span className="text-[#967746] font-semibold">Free Express Shipping</span> across India.
          </p>
        ) : (
          <p className="text-xs font-semibold text-[#3B6E47] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#3B6E47]" />
            Congratulations! You have qualified for Complimentary Express Shipping.
          </p>
        )}
        <div className="w-full bg-[#DFD8CA] h-1.5 mt-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#1A1918] h-full transition-all duration-300"
            style={{ width: `${freePercent}%` }}
          />
        </div>
      </div>

      {/* Grid: Cart items & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Items Table */}
        <div className="lg:col-span-8 space-y-4 divide-y divide-[#EAE4D8]">
          {cart.map((item) => (
            <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center justify-between">
              <div className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 sm:w-24 sm:h-28 object-cover bg-[#EAE5DC] shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-serif font-medium text-[#1A1918]">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#7A7367]">
                    <span className="bg-[#EFEBE4] px-2 py-0.5 font-medium">Size: {item.size}</span>
                    <span>•</span>
                    <span>{item.color}</span>
                  </div>
                  <div className="text-xs text-[#7A7367] pt-1">
                    Unit Price: ₹{(item.discountedPrice || item.price).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0">
                {/* Stepper */}
                <div className="flex items-center border border-[#DDD6C8] bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1.5 text-[#5E584F] hover:bg-[#F2ECE1]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#1A1918]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1.5 text-[#5E584F] hover:bg-[#F2ECE1]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="text-sm font-semibold text-[#1A1918]">
                    ₹{((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                  {item.discountedPrice && (
                    <div className="text-[11px] text-[#999285] line-through">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-[#968E82] hover:text-[#C53030] p-1 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary Card */}
        <div className="lg:col-span-4 bg-[#F5F2EB] border border-[#E3DDD1] p-6 space-y-6 h-fit">
          <h2 className="text-lg font-serif text-[#1A1918] pb-3 border-b border-[#E3DDD1]">
            Order Summary
          </h2>

          {/* Coupon */}
          <form onSubmit={handleCouponSubmit} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code (e.g. HAVEN10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1A1918] text-[#FAF9F5] text-xs font-medium uppercase tracking-wider hover:bg-[#33312E]"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <p className={`text-[11px] ${couponMsg.isError ? 'text-[#C53030]' : 'text-[#3B6E47]'}`}>
                {couponMsg.text}
              </p>
            )}
            {couponCode && (
              <div className="flex items-center justify-between text-xs bg-[#EAE5DA] px-2.5 py-1">
                <span>Code '{couponCode}' applied</span>
                <button onClick={removeCoupon} className="text-[#999184] hover:text-[#C53030] text-[10px] underline">
                  Remove
                </button>
              </div>
            )}
          </form>

          {/* Totals Breakdown */}
          <div className="space-y-2.5 text-xs text-[#6B645A] pt-2 border-t border-[#E3DDD1]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1A1918]">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#3B6E47] font-medium">
                <span>Discount</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>{shippingFee === 0 ? <strong className="text-[#3B6E47]">FREE</strong> : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-[#1A1918] pt-3 border-t border-[#E3DDD1]">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-[#8C8478] text-right">Includes all taxes &amp; duties</p>
          </div>

          <button
            onClick={onNavigateToCheckout}
            className="w-full py-4 bg-[#1A1918] hover:bg-[#33312E] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <span>Proceed to COD Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-[11px] text-[#7A7367] text-center space-y-1">
            <p className="flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Cash on Delivery Supported Pan-India</span>
            </p>
            <p>Doorstep payment upon delivery • No advance needed</p>
          </div>
        </div>

      </div>
    </div>
  );
};
