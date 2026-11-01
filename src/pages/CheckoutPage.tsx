import React, { useState } from 'react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createCODOrder } from '../services/orderService';
import { Order } from '../types';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Chandigarh', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToCart, onOrderSuccess }) => {
  const { cart, subtotal, shippingFee, discount, total, clearCart } = useCart();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [pincode, setPincode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please provide a valid 10-digit mobile number for COD confirmation.');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setFormError('Please enter your complete doorstep address.');
      return;
    }

    if (!city.trim()) {
      setFormError('Please enter your city.');
      return;
    }

    const cleanPin = pincode.replace(/[^0-9]/g, '');
    if (cleanPin.length !== 6) {
      setFormError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    if (cart.length === 0) {
      setFormError('Your cart is empty.');
      return;
    }

    setLoading(true);

    try {
      const orderItems = cart.map((c) => ({
        productId: c.productId,
        name: c.name,
        price: c.discountedPrice || c.price,
        size: c.size,
        color: c.color,
        quantity: c.quantity,
        image: c.image
      }));

      const newOrder = await createCODOrder({
        customerName,
        phone: cleanPhone,
        email: email.trim(),
        address,
        city,
        state,
        pincode: cleanPin,
        orderNotes,
        items: orderItems,
        subtotal,
        shippingFee,
        discountAmount: discount,
        totalAmount: total
      });

      // Clear shopping bag after successful placement
      clearCart();
      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error('Error placing order:', err);
      setFormError(err.message || 'An error occurred while placing your order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Header */}
      <div className="border-b border-[#E3DDD1] pb-6 mb-10 flex items-center justify-between">
        <div>
          <button
            onClick={onBackToCart}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#736C62] hover:text-[#1A1918] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Bag</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1918]">
            Cash On Delivery Checkout
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#3B6E47] bg-[#EBF2EC] px-3.5 py-1.5 font-medium border border-[#D5E5D8]">
          <ShieldCheck className="w-4 h-4" />
          <span>Pay at Doorstep Upon Delivery</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Form: Delivery Address & Details */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Customer Details */}
          <div className="bg-[#FAF9F5] border border-[#E3DDCF] p-6 space-y-5">
            <div className="border-b border-[#EAE4D8] pb-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8C8375] font-semibold">
                Step 1 of 2
              </span>
              <h2 className="text-xl font-serif text-[#1A1918]">Customer Contact</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garvit Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
                  Mobile Number (For Delivery SMS &amp; COD) <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="px-3 py-2.5 bg-[#EFECE5] border border-r-0 border-[#DDD5C6] text-xs font-semibold text-[#544E44] select-none flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
                Email Address <span className="text-[#8C8478] font-normal lowercase">(optional for tracking copy)</span>
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-[#FAF9F5] border border-[#E3DDCF] p-6 space-y-5">
            <div className="border-b border-[#EAE4D8] pb-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8C8375] font-semibold">
                Step 2 of 2
              </span>
              <h2 className="text-xl font-serif text-[#1A1918]">Doorstep Delivery Address</h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
                Street Address, Flat / House No., Landmark <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="House / Apartment number, building name, street, nearby landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="302001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
                Order Notes / Delivery Instructions <span className="text-[#8C8478] font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Please call before delivery, deliver in afternoon"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
              />
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="bg-[#FAF9F5] border-2 border-[#1A1918] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#1A1918] text-[#FAF9F5] flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1918]">Cash On Delivery (COD)</p>
                <p className="text-xs text-[#70695E]">Pay cash directly to the delivery partner when your package arrives.</p>
              </div>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3B6E47] bg-[#EBF2EC] px-2.5 py-1">
              Active
            </span>
          </div>

          {formError && (
            <div className="p-4 bg-[#FBEBEB] border border-[#F3C5C5] text-[#C53030] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}
        </div>

        {/* Right Summary: Items + Place Order Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#F5F2EB] border border-[#E3DDD1] p-6 space-y-6">
            <h2 className="text-lg font-serif text-[#1A1918] pb-3 border-b border-[#E3DDD1]">
              Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Items scroll */}
            <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-[#EAE4D8] pr-2">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 object-cover bg-[#EAE5DC] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-[#1A1918] truncate">{item.name}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#736C61] mt-0.5">
                      <span>Size: {item.size}</span>
                      <span>•</span>
                      <span className="truncate">{item.color}</span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#1A1918] text-right">
                    ₹{((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-[#6B645A] pt-4 border-t border-[#E3DDD1]">
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
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-[#3B6E47]">FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-semibold text-[#1A1918]">Cash On Delivery</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#1A1918] pt-3 border-t border-[#E3DDD1]">
                <span>Total Amount to Pay</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1A1918] hover:bg-[#33312E] disabled:bg-[#7D776E] text-[#FAF9F5] text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
                  <span>Generating Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                  <span>Confirm &amp; Place COD Order</span>
                </>
              )}
            </button>

            <div className="space-y-2 text-[11px] text-[#7A7367] pt-2">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>Dispatches from Delhi/Jaipur atelier within 24 hours.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>An order notification will be dispatched to havenclothingindia@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
