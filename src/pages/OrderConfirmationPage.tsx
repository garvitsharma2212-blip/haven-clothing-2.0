import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Truck, Package, Printer, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationPageProps {
  order: Order;
  onTrackOrder: (orderNumber: string) => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onTrackOrder,
  onContinueShopping
}) => {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1A1918', '#C5A880', '#EAE5DB', '#7D8677']
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      
      {/* Celebration Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#EBF2EC] text-[#3B6E47] flex items-center justify-center shadow-xs">
          <CheckCircle className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-[0.3em] text-[#8C8375] font-semibold block">
          THANK YOU FOR CHOOSING HAVEN
        </span>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#1A1918]">
          Your Order Has Been Placed
        </h1>

        <p className="text-sm text-[#666055] max-w-lg mx-auto leading-relaxed">
          We have registered your Cash On Delivery order. An official dispatch confirmation email has been dispatched to{' '}
          <strong className="text-[#1A1918]">havenclothingindia@gmail.com</strong>.
        </p>

        {/* Order ID Pill */}
        <div className="inline-flex items-center gap-2 bg-[#1A1918] text-[#FAF9F5] px-5 py-2.5 shadow-md">
          <span className="text-xs uppercase tracking-widest text-[#C5A880]">Order ID:</span>
          <span className="font-mono font-semibold tracking-wider text-sm">{order.orderNumber}</span>
        </div>

        {/* Email Dispatched Alert Banner */}
        <div className="max-w-xl mx-auto bg-[#EBF2EC] border border-[#CDE0D1] p-4 text-left text-xs text-[#2B5336] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-sm text-[#1B3D23] flex items-center gap-1.5">
              <span>✓</span>
              <span>Order Details Sent to havenclothingindia@gmail.com</span>
            </p>
            <p className="text-xs text-[#3E6548] mt-0.5">
              Founders Garvit Sharma &amp; Ankit Meena have been notified of your COD order.
            </p>
          </div>
          <a
            href={`https://wa.me/919829012345?text=Hello%20HAVEN,%20I%20have%20placed%20COD%20Order%20${encodeURIComponent(order.orderNumber)}%20for%20₹${order.totalAmount}.%20Customer:%20${encodeURIComponent(order.customerName)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold uppercase tracking-wider shrink-0"
          >
            <span>WhatsApp Confirmation</span>
          </a>
        </div>
      </div>

      {/* Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FAF9F5] border border-[#E3DDCF] p-5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#8C8375] font-semibold">Payment Method</span>
          <p className="font-serif text-lg text-[#1A1918]">Cash On Delivery</p>
          <p className="text-xs text-[#3B6E47] font-medium">Status: Pending (Pay on Arrival)</p>
        </div>

        <div className="bg-[#FAF9F5] border border-[#E3DDCF] p-5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#8C8375] font-semibold">Order Status</span>
          <p className="font-serif text-lg text-[#1A1918]">NEW / Processing</p>
          <p className="text-xs text-[#7A7367]">Atelier dispatch in 24 hours</p>
        </div>

        <div className="bg-[#FAF9F5] border border-[#E3DDCF] p-5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#8C8375] font-semibold">Estimated Delivery</span>
          <p className="font-serif text-lg text-[#1A1918]">3 – 5 Days</p>
          <p className="text-xs text-[#7A7367]">Express courier across India</p>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-[#F5F2EB] border border-[#E3DDD1] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E3DDD1]">
          <h2 className="text-xl font-serif text-[#1A1918]">Purchased Essentials</h2>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#736C61] hover:text-[#1A1918] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Item Rows */}
        <div className="space-y-4 divide-y divide-[#EAE4D8]">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-4 first:pt-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover bg-[#EAE5DC] shrink-0"
                />
                <div>
                  <h4 className="text-sm font-serif font-medium text-[#1A1918]">{item.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-[#736C61] mt-0.5">
                    <span className="bg-[#EFEBE4] px-2 py-0.5 font-medium">Size: {item.size}</span>
                    <span>•</span>
                    <span>{item.color}</span>
                    <span>•</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm font-semibold text-[#1A1918]">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 text-xs text-[#6B645A] pt-4 border-t border-[#E3DDD1]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
          </div>
          {order.discountAmount ? (
            <div className="flex justify-between text-[#3B6E47]">
              <span>Discount</span>
              <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
            </div>
          ) : null}
          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span>{order.shippingFee === 0 ? <strong className="text-[#3B6E47]">FREE</strong> : `₹${order.shippingFee}`}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-[#1A1918] pt-3 border-t border-[#E3DDD1]">
            <span>Total Cash to Collect on Delivery</span>
            <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Delivery Address Box */}
        <div className="pt-4 border-t border-[#E3DDD1] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#6B645A]">
          <div>
            <span className="font-semibold uppercase tracking-wider text-[#1A1918] block mb-1">
              Delivery Address
            </span>
            <p className="text-[#1A1918] font-medium">{order.customerName}</p>
            <p className="mt-0.5 leading-relaxed">{order.address}</p>
            <p>{order.city}, {order.state} - {order.pincode}</p>
            <p className="mt-1">Mobile: +91 {order.phone}</p>
          </div>

          <div>
            <span className="font-semibold uppercase tracking-wider text-[#1A1918] block mb-1">
              Founder Note
            </span>
            <p className="italic text-[#7A7367] leading-relaxed">
              "Thank you for welcoming HAVEN into your wardrobe. We inspect every seam, collar, and hem before it leaves our atelier."
            </p>
            <p className="mt-2 text-[#1A1918] font-medium">— Garvit Sharma &amp; Ankit Meena, Founders</p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => onTrackOrder(order.orderNumber)}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1918] hover:bg-[#33312E] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          <Truck className="w-4 h-4 text-[#C5A880]" />
          <span>Track Order Status</span>
        </button>

        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[#1A1918] text-[#1A1918] hover:bg-[#EAE4D8] text-xs uppercase tracking-widest font-semibold transition-colors"
        >
          Continue Shopping
        </button>
      </div>

    </div>
  );
};
