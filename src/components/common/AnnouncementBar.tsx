import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#181615] text-[#DED9D0] text-[11px] sm:text-xs font-medium tracking-widest uppercase py-2 px-4 text-center border-b border-[#2C2927] select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3">
        <span className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Free Shipping on Orders Above ₹999</span>
        </span>
        <span className="text-[#696257]">|</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>COD Available</span>
        </span>
      </div>
    </div>
  );
};
