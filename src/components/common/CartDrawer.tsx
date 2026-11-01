import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onNavigateToShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateToCheckout, onNavigateToShop }) => {
  const {
    cart,
    isDrawerOpen,
    setIsDrawerOpen,
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

  const [couponInput, setCouponInput] = React.useState('');
  const [couponMsg, setCouponMsg] = React.useState<{ text: string; isError?: boolean } | null>(null);

  if (!isDrawerOpen) return null;

  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-[#E3DDD1] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE5DB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1A1918]" />
              <h2 className="text-xl font-serif text-[#1A1918]">Your Wardrobe Bag</h2>
              <span className="text-xs px-2 py-0.5 bg-[#EAE4D8] text-[#4A463F] font-medium">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-[#6D6860] hover:text-[#1A1918] p-1 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping meter */}
          <div className="bg-[#F3EFE7] px-6 py-3 border-b border-[#E5DFD4]">
            {freeShippingRemaining > 0 ? (
              <p className="text-xs text-[#524E47]">
                Add <strong className="text-[#1A1918]">₹{freeShippingRemaining.toLocaleString('en-IN')}</strong> more for{' '}
                <span className="text-[#967746] font-semibold">Free Express Shipping</span>
              </p>
            ) : (
              <p className="text-xs font-semibold text-[#3B6E47] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3B6E47]" />
                You unlocked Complimentary Express Shipping across India!
              </p>
            )}
            <div className="w-full bg-[#E0D9CB] h-1.5 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1A1918] h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-[#EFECE5]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-[#C0B9AC] stroke-[1.2] mb-3" />
                <h3 className="font-serif text-xl text-[#1A1918]">Your bag is empty</h3>
                <p className="text-sm text-[#736C62] max-w-xs mt-1 mb-6">
                  Experience timeless luxury essentials crafted with heavyweight combed cotton.
                </p>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onNavigateToShop();
                  }}
                  className="px-6 py-3 bg-[#1A1918] text-[#FAF9F5] text-xs uppercase tracking-widest hover:bg-[#33312E] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover bg-[#ECE7DC] shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-[#1A1918] truncate pr-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#968E82] hover:text-[#C53030] transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#7A7368]">
                        <span className="font-medium bg-[#EFECE5] px-1.5 py-0.5">Size: {item.size}</span>
                        <span>•</span>
                        <span className="truncate">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#DDD6C8] bg-[#FAF9F5]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#5E584F] hover:text-[#1A1918] hover:bg-[#EFECE5] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-medium text-[#1A1918] select-none min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#5E584F] hover:text-[#1A1918] hover:bg-[#EFECE5] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold text-[#1A1918]">
                          ₹{((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.discountedPrice && (
                          <div className="text-[11px] text-[#8F877B] line-through">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#EAE4D8] bg-[#FAF9F5] space-y-4">
              {/* Promo code */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. HAVEN10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 text-xs uppercase tracking-wider px-3 py-2 border border-[#DDD5C6] bg-white placeholder-[#9C9487] focus:outline-none focus:border-[#1A1918]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E9E3D6] hover:bg-[#DDD5C6] text-[#1A1918] text-xs font-semibold tracking-wider transition-colors uppercase"
                >
                  Apply
                </button>
              </form>
              {couponMsg && (
                <p className={`text-[11px] ${couponMsg.isError ? 'text-[#C53030]' : 'text-[#3B6E47]'}`}>
                  {couponMsg.text}
                </p>
              )}
              {couponCode && (
                <div className="flex items-center justify-between text-xs bg-[#F0EDE4] px-3 py-1.5 border border-[#DDD6C8]">
                  <span className="text-[#595349] font-medium">Coupon '{couponCode}' applied</span>
                  <button
                    onClick={removeCoupon}
                    className="text-[#968E82] hover:text-[#C53030] text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6B645A] pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1A1918]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#3B6E47]">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-[#3B6E47]">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#1A1918] pt-2 border-t border-[#EAE4D8]">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Primary COD Button */}
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onNavigateToCheckout();
                }}
                className="w-full py-3.5 bg-[#1A1918] hover:bg-[#302E2B] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Proceed to COD Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#787166] text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Cash On Delivery • 7 Days Easy Return / Exchange</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
