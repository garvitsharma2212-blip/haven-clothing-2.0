import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';

interface AboutPageProps {
  onNavigateToShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToShop }) => {
  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      
      {/* 1. Hero Brand Statement */}
      <section className="bg-[#1A1918] text-[#FAF9F5] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="inline-block text-xs uppercase tracking-[0.35em] text-[#C5A880] font-semibold">
            ABOUT HAVEN CLOTHING
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#FAF9F5] leading-tight">
            Quiet Luxury. Everyday Comfort.
          </h1>
          <p className="text-sm sm:text-base text-[#D4CDC2] max-w-2xl mx-auto leading-relaxed font-light">
            Founded on the belief that everyday clothing should feel extraordinary. 
            We design minimalist silhouettes that empower through comfort, substance, and confidence.
          </p>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. The Founders Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C8375] font-semibold">
            LEADERSHIP &amp; VISION
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1A1918]">
            Founded by Garvit Sharma &amp; Ankit Meena
          </h2>
          <p className="text-sm text-[#666055] leading-relaxed">
            Two fashion visionaries united by a shared passion for Indian textile excellence and contemporary streetwear aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Founder 1: Garvit Sharma */}
          <div className="bg-[#F5F2EB] border border-[#E3DDD1] p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-[#1A1918] text-[#FAF9F5] flex items-center justify-center font-serif text-2xl font-semibold shadow-md">
                GS
              </div>
              <div>
                <h3 className="text-2xl font-serif text-[#1A1918]">Garvit Sharma</h3>
                <p className="text-xs uppercase tracking-widest text-[#8C6D45] font-semibold mt-0.5">
                  Co-Founder &amp; Creative Director
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#595349] leading-relaxed">
                Garvit guides the creative vision, architectural silhouettes, and color palettes of HAVEN. 
                With an obsessive eye for drape and garment balance, he ensures every drop embodies the pure balance of comfort and form.
              </p>
            </div>
            <blockquote className="border-l-2 border-[#C5A880] pl-3 italic text-xs text-[#70695E]">
              "Fashion should feel like a sanctuary you step into each morning. Simplicity is the ultimate sophistication."
            </blockquote>
          </div>

          {/* Founder 2: Ankit Meena */}
          <div className="bg-[#F5F2EB] border border-[#E3DDD1] p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-[#1A1918] text-[#FAF9F5] flex items-center justify-center font-serif text-2xl font-semibold shadow-md">
                AM
              </div>
              <div>
                <h3 className="text-2xl font-serif text-[#1A1918]">Ankit Meena</h3>
                <p className="text-xs uppercase tracking-widest text-[#8C6D45] font-semibold mt-0.5">
                  Co-Founder &amp; Operations Lead
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#595349] leading-relaxed">
                Ankit steers textile sourcing, yarn selection, manufacturing precision, and seamless nationwide logistics. 
                He ensures our heavy French terry and combed waffle knits meet the highest international standards.
              </p>
            </div>
            <blockquote className="border-l-2 border-[#C5A880] pl-3 italic text-xs text-[#70695E]">
              "From cotton field to your doorstep, our commitment is absolute transparency, quality, and respect for the customer."
            </blockquote>
          </div>

        </div>

        {/* Foundational Quote */}
        <div className="mt-12 bg-[#FAF9F5] border-2 border-[#1A1918] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
          <Sparkles className="w-6 h-6 text-[#C5A880] mx-auto" />
          <blockquote className="text-xl sm:text-2xl font-serif text-[#1A1918] italic leading-relaxed">
            "Our vision is to create timeless everyday essentials that combine comfort, simplicity and confidence."
          </blockquote>
          <p className="text-xs uppercase tracking-widest text-[#8C8375] font-semibold">
            — Garvit Sharma &amp; Ankit Meena, Founders of HAVEN CLOTHING
          </p>
        </div>
      </section>

      {/* 3. The 3 Pillars of HAVEN Craft */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C8375] font-semibold">
            THE HAVEN CODE
          </p>
          <h2 className="text-3xl font-serif text-[#1A1918] mt-1">
            Why Our Essentials Stand Apart
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FAF9F5] border border-[#E3DDCF] p-6 space-y-3">
            <Award className="w-8 h-8 text-[#C5A880]" />
            <h3 className="text-lg font-serif text-[#1A1918]">240 – 400 GSM Densities</h3>
            <p className="text-xs text-[#666055] leading-relaxed">
              Standard tees are 140–180 GSM. HAVEN only knits starting from 240 GSM for t-shirts and 380 GSM for sweatshirts, ensuring structured drape that never clings.
            </p>
          </div>

          <div className="bg-[#FAF9F5] border border-[#E3DDCF] p-6 space-y-3">
            <Heart className="w-8 h-8 text-[#C5A880]" />
            <h3 className="text-lg font-serif text-[#1A1918]">Indian Long-Staple Cotton</h3>
            <p className="text-xs text-[#666055] leading-relaxed">
              Proudly grown and spun in India. Double-combed to remove shorter fibers and impurities, resulting in a fabric that gets softer with every wash cycle.
            </p>
          </div>

          <div className="bg-[#FAF9F5] border border-[#E3DDCF] p-6 space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#C5A880]" />
            <h3 className="text-lg font-serif text-[#1A1918]">Pre-Shrunk &amp; Bio-Washed</h3>
            <p className="text-xs text-[#666055] leading-relaxed">
              Treated with natural enzyme washes to eliminate surface fuzz and thermally stabilized to prevent frustrating post-wash shrinkage.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-serif text-[#1A1918]">
          Experience The Difference Firsthand
        </h2>
        <p className="text-xs sm:text-sm text-[#736C62] max-w-md mx-auto">
          Delivered across India with Cash on Delivery and complimentary 7-day doorstep size swaps.
        </p>
        <button
          onClick={onNavigateToShop}
          className="px-8 py-4 bg-[#1A1918] hover:bg-[#33312E] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2 shadow-md"
        >
          <span>Explore The Wardrobe</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
