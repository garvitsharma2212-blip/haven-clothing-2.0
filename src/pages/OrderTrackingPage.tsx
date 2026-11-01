import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, ExternalLink, AlertCircle, Phone } from 'lucide-react';
import { getOrderByIdOrNumber } from '../services/orderService';
import { Order, OrderStatus } from '../types';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ initialOrderNumber = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialOrderNumber) {
      handleSearch(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearch = async (queryToSearch = searchQuery) => {
    if (!queryToSearch.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setSearched(true);

    try {
      const found = await getOrderByIdOrNumber(queryToSearch.trim());
      setOrder(found);
      if (!found) {
        setErrorMsg(`No order found matching "${queryToSearch}". Please verify your Order Number or 10-digit mobile number.`);
      }
    } catch (err) {
      setErrorMsg('Failed to fetch tracking data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepStatus: OrderStatus, currentStatus: OrderStatus): 'completed' | 'current' | 'upcoming' => {
    const sequence: OrderStatus[] = ['NEW', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    if (currentStatus === 'CANCELLED') return 'upcoming';

    const currentIndex = sequence.indexOf(currentStatus);
    const stepIndex = sequence.indexOf(stepStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const steps: { key: OrderStatus; title: string; desc: string }[] = [
    { key: 'NEW', title: 'Order Placed', desc: 'Registered with Cash on Delivery' },
    { key: 'CONFIRMED', title: 'Confirmed', desc: 'Verified by atelier dispatch team' },
    { key: 'SHIPPED', title: 'Shipped', desc: 'Handed to express logistics partner' },
    { key: 'DELIVERED', title: 'Delivered', desc: 'Delivered to your doorstep' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C8375] font-semibold">
          LIVE SHIPMENT STATUS
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1918]">
          Track Your HAVEN Order
        </h1>
        <p className="text-xs sm:text-sm text-[#736C62] max-w-md mx-auto">
          Enter your unique Order Number (e.g. HVN-26-XXXXX) or your 10-digit registered mobile number.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto bg-[#FAF9F5] border border-[#DDD6C8] p-2 flex gap-2 shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Order Number (e.g. HVN-26-...) or Mobile"
          className="flex-1 px-4 py-3 text-sm bg-transparent focus:outline-none placeholder-[#A69F93] font-sans"
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading || !searchQuery.trim()}
          className="px-6 py-3 bg-[#1A1918] hover:bg-[#33312E] disabled:bg-[#8C857B] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? 'Searching...' : 'Track'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="max-w-xl mx-auto p-4 bg-[#FAF0F0] border border-[#F3C5C5] text-[#C53030] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tracking Result Card */}
      {order && (
        <div className="bg-[#FAF9F5] border border-[#E3DDD1] p-6 sm:p-8 space-y-8 shadow-sm">
          
          {/* Header metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAE4D8] gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#8C8375] font-semibold">
                Order Tracking Record
              </span>
              <h2 className="text-2xl font-serif text-[#1A1918]">{order.orderNumber}</h2>
              <p className="text-xs text-[#7A7367] mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                order.orderStatus === 'DELIVERED'
                  ? 'bg-[#EBF2EC] text-[#3B6E47]'
                  : order.orderStatus === 'CANCELLED'
                  ? 'bg-[#FBEBEB] text-[#C53030]'
                  : 'bg-[#F2ECE0] text-[#7A5B2F]'
              }`}>
                Status: {order.orderStatus}
              </span>
              <span className="text-[11px] text-[#7A7367] mt-1">
                Payment: COD (₹{order.totalAmount.toLocaleString('en-IN')})
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          {order.orderStatus !== 'CANCELLED' ? (
            <div className="py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
                {steps.map((st, i) => {
                  const status = getStepStatus(st.key, order.orderStatus);
                  return (
                    <div key={st.key} className="flex flex-col items-center text-center space-y-2 relative">
                      {/* Step Circle */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold z-10 transition-colors ${
                        status === 'completed'
                          ? 'bg-[#1A1918] text-[#FAF9F5]'
                          : status === 'current'
                          ? 'bg-[#C5A880] text-[#1A1918] ring-4 ring-[#EFE7DC]'
                          : 'bg-[#ECE7DE] text-[#9E978C]'
                      }`}>
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-[#C5A880]" />
                        ) : status === 'current' ? (
                          <Clock className="w-5 h-5 animate-pulse" />
                        ) : (
                          i + 1
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1A1918]">
                          {st.title}
                        </h4>
                        <p className="text-[11px] text-[#7A7367] mt-0.5 leading-snug">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#FBEBEB] border border-[#F3C5C5] text-[#C53030] text-xs">
              This order has been cancelled. For inquiries, email havenclothingindia@gmail.com.
            </div>
          )}

          {/* Courier Tracking Info if dispatched */}
          {order.trackingNumber && (
            <div className="p-4 bg-[#F2EDE4] border border-[#E3DDD1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[#8C8375] font-semibold uppercase tracking-wider block">Courier Dispatch Partner</span>
                <p className="font-semibold text-[#1A1918] text-sm mt-0.5">
                  {order.trackingCarrier || 'Delhivery Express'} — AWB: <span className="font-mono">{order.trackingNumber}</span>
                </p>
              </div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A1918] text-[#FAF9F5] uppercase tracking-wider font-medium text-[11px] hover:bg-[#33312E]"
                >
                  <span>Track on Courier Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Summary Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#EAE4D8] text-xs">
            <div>
              <h3 className="font-semibold uppercase tracking-wider text-[#1A1918] mb-2">
                Recipient Details
              </h3>
              <p className="font-medium text-[#1A1918]">{order.customerName}</p>
              <p className="text-[#6E675D] mt-0.5 leading-relaxed">{order.address}</p>
              <p className="text-[#6E675D]">{order.city}, {order.state} - {order.pincode}</p>
              <p className="text-[#6E675D] mt-1">Phone: +91 {order.phone}</p>
            </div>

            <div>
              <h3 className="font-semibold uppercase tracking-wider text-[#1A1918] mb-2">
                Order Items ({order.items.length})
              </h3>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[#595349]">
                    <span>{item.name} ({item.size}, {item.color}) × {item.quantity}</span>
                    <span className="font-medium text-[#1A1918]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-[#EAE4D8] flex justify-between font-semibold text-[#1A1918]">
                <span>Total Amount to Pay on COD</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 text-xs text-[#7A7367]">
            Need modifications or have questions? Email our founders at{' '}
            <a href="mailto:havenclothingindia@gmail.com" className="text-[#8C6D45] underline font-medium">
              havenclothingindia@gmail.com
            </a>
          </div>

        </div>
      )}

      {/* Help card */}
      <div className="bg-[#F5F2EB] border border-[#E3DDD1] p-6 text-center space-y-2 max-w-xl mx-auto">
        <h3 className="font-serif text-lg text-[#1A1918]">Need Immediate Assistance?</h3>
        <p className="text-xs text-[#6E675E] leading-relaxed">
          Our support team is active Monday through Saturday from 10:00 AM to 7:00 PM IST. 
          We guarantee prompt responses on WhatsApp and email.
        </p>
        <div className="pt-2">
          <a
            href="mailto:havenclothingindia@gmail.com"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#8C6D45] hover:underline"
          >
            <span>havenclothingindia@gmail.com</span>
          </a>
        </div>
      </div>

    </div>
  );
};
