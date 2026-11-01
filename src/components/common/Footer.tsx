import React from 'react';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, RefreshCw, Truck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#141312] text-[#E0DDD5] border-t border-[#262422] select-none">
      {/* Brand values banner */}
      <div className="border-b border-[#282624] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <Truck className="w-6 h-6 text-[#C5A880] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FAF9F5]">Express Pan-India Delivery</h4>
              <p className="text-xs text-[#999388] mt-1 leading-relaxed">
                Free shipping on orders above ₹1,999. Fast door dispatch across all 19,000+ Indian PIN codes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-[#C5A880] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FAF9F5]">Cash On Delivery (COD)</h4>
              <p className="text-xs text-[#999388] mt-1 leading-relaxed">
                Pay conveniently with Cash on Delivery at your doorstep once your order arrives safely.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <RefreshCw className="w-6 h-6 text-[#C5A880] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FAF9F5]">7-Day Hassle-Free Exchange</h4>
              <p className="text-xs text-[#999388] mt-1 leading-relaxed">
                Effortless size swaps with prompt reverse pickup from your home address.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <Heart className="w-6 h-6 text-[#C5A880] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FAF9F5]">Heavyweight Combed Cotton</h4>
              <p className="text-xs text-[#999388] mt-1 leading-relaxed">
                240–400 GSM custom-knit fabrics pre-shrunk for enduring everyday wear.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Founders */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-3xl tracking-[0.2em] font-medium text-[#FAF9F5] uppercase block">
              HAVEN
            </span>
            <p className="text-xs tracking-[0.4em] text-[#C5A880] font-sans uppercase -mt-2">
              CLOTHING
            </p>
            <p className="text-sm text-[#A8A196] leading-relaxed max-w-sm italic font-serif">
              "Wear Your Comfort. Define Your Style."
            </p>
            <p className="text-xs text-[#8C857A] leading-relaxed max-w-sm pt-1">
              Timeless everyday apparel combining high-GSM natural fabrics, architectural silhouettes, and effortless simplicity.
            </p>

            <div className="pt-2 text-xs text-[#B5ACA0]">
              <span className="text-[#8C857A] block mb-1 uppercase tracking-wider">Founding Leadership</span>
              <p className="font-medium text-[#FAF9F5]">Garvit Sharma &amp; Ankit Meena</p>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#FAF9F5] mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8A196]">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#FAF9F5] transition-colors">
                  Shop All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category-oversized')} className="hover:text-[#FAF9F5] transition-colors">
                  Oversized T-Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category-waffle')} className="hover:text-[#FAF9F5] transition-colors">
                  Waffle Knit Tees
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category-sweatshirts')} className="hover:text-[#FAF9F5] transition-colors">
                  Heavyweight Sweatshirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#FAF9F5] transition-colors">
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#FAF9F5] mb-4">
              Assistance
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8A196]">
              <li>
                <button onClick={() => onNavigate('tracking')} className="hover:text-[#FAF9F5] transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#FAF9F5] transition-colors">
                  About Founders &amp; Brand
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#FAF9F5] transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-[#C5A880] transition-colors">
                  Admin &amp; Operations Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#FAF9F5]">
              Stay Connected
            </h4>
            <p className="text-xs text-[#999285] leading-relaxed">
              Receive private invitations to seasonal drops, fabric stories, and curated subscriber exclusives.
            </p>
            {subscribed ? (
              <p className="text-xs text-[#C5A880] font-medium">Thank you for subscribing to HAVEN.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-[#22201D] text-[#FAF9F5] placeholder-[#736C62] border border-[#3A3632] focus:outline-none focus:border-[#C5A880]"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-[#FAF9F5] text-[#141312] hover:bg-[#EAE5DB] transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 text-xs text-[#999285] space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                <a href="mailto:havenclothingindia@gmail.com" className="hover:underline">
                  havenclothingindia@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Atelier: Jaipur &amp; New Delhi, India</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-[#242220] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A7368] gap-4">
          <p className="tracking-wide text-center sm:text-left">
            © 2026 HAVEN CLOTHING. Founded by Garvit Sharma &amp; Ankit Meena.
          </p>
          <div className="flex items-center space-x-6 text-[11px] uppercase tracking-wider">
            <span>Cash On Delivery</span>
            <span>100% Indian Combed Cotton</span>
            <span>All India Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
