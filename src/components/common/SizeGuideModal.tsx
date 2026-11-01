import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category }) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  const isSweatshirt = category?.toLowerCase().includes('sweatshirt');

  const measurements = unit === 'inches' ? [
    { size: 'S', chest: '42"', length: isSweatshirt ? '27"' : '28"', shoulder: '21"', sleeve: isSweatshirt ? '24"' : '9.5"' },
    { size: 'M', chest: '44"', length: isSweatshirt ? '28"' : '29"', shoulder: '22"', sleeve: isSweatshirt ? '24.5"' : '10"' },
    { size: 'L', chest: '46"', length: isSweatshirt ? '29"' : '30"', shoulder: '23"', sleeve: isSweatshirt ? '25"' : '10.5"' },
    { size: 'XL', chest: '48"', length: isSweatshirt ? '30"' : '31"', shoulder: '24"', sleeve: isSweatshirt ? '25.5"' : '11"' },
    { size: 'XXL', chest: '50"', length: isSweatshirt ? '31"' : '32"', shoulder: '25"', sleeve: isSweatshirt ? '26"' : '11.5"' },
  ] : [
    { size: 'S', chest: '106 cm', length: isSweatshirt ? '68 cm' : '71 cm', shoulder: '53 cm', sleeve: isSweatshirt ? '61 cm' : '24 cm' },
    { size: 'M', chest: '112 cm', length: isSweatshirt ? '71 cm' : '74 cm', shoulder: '56 cm', sleeve: isSweatshirt ? '62 cm' : '25 cm' },
    { size: 'L', chest: '117 cm', length: isSweatshirt ? '74 cm' : '76 cm', shoulder: '58 cm', sleeve: isSweatshirt ? '63 cm' : '27 cm' },
    { size: 'XL', chest: '122 cm', length: isSweatshirt ? '76 cm' : '79 cm', shoulder: '61 cm', sleeve: isSweatshirt ? '65 cm' : '28 cm' },
    { size: 'XXL', chest: '127 cm', length: isSweatshirt ? '79 cm' : '81 cm', shoulder: '63 cm', sleeve: isSweatshirt ? '66 cm' : '29 cm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF9F5] border border-[#E3DED4] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#6B655D] hover:text-[#1A1918] transition-colors p-1"
          aria-label="Close size guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-[#8F877B] font-semibold mb-1">
            HAVEN CLOTHING FIT GUIDE
          </p>
          <h3 className="text-2xl font-serif text-[#1A1918]">
            {isSweatshirt ? 'Heavyweight Fleece Sweatshirts' : 'Relaxed & Oversized Tops'}
          </h3>
          <p className="text-sm text-[#666057] mt-1.5 leading-relaxed">
            All HAVEN silhouettes are tailored with a relaxed boxy cut and dropped shoulders. If you prefer a traditional fitted look, we recommend sizing down one size.
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EBE6DC]">
          <span className="text-xs font-semibold tracking-wider text-[#666057] uppercase">Measurements Table</span>
          <div className="inline-flex p-1 bg-[#ECE7DE] rounded-none">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs tracking-wider transition-colors ${
                unit === 'inches' ? 'bg-[#1A1918] text-[#FAF9F5] font-medium' : 'text-[#666057]'
              }`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs tracking-wider transition-colors ${
                unit === 'cm' ? 'bg-[#1A1918] text-[#FAF9F5] font-medium' : 'text-[#666057]'
              }`}
            >
              CENTIMETERS
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#DCD6CA] text-xs uppercase tracking-wider text-[#7A746B]">
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Chest Circumference</th>
                <th className="py-2.5 px-3">Garment Length</th>
                <th className="py-2.5 px-3">Shoulder Width</th>
                <th className="py-2.5 px-3">Sleeve Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DC]">
              {measurements.map((row) => (
                <tr key={row.size} className="hover:bg-[#F2EFE8] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#1A1918]">{row.size}</td>
                  <td className="py-3 px-3 text-[#4A4742]">{row.chest}</td>
                  <td className="py-3 px-3 text-[#4A4742]">{row.length}</td>
                  <td className="py-3 px-3 text-[#4A4742]">{row.shoulder}</td>
                  <td className="py-3 px-3 text-[#4A4742]">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional guidance */}
        <div className="mt-6 p-4 bg-[#F2EEE5] border border-[#E3DDCF] space-y-2 text-xs text-[#5C564E]">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
            <span><strong>Pre-Shrunk Guarantee:</strong> Fabrics are treated with double bio-wash to ensure minimal shrinkage under standard cold washing.</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
            <span><strong>Easy 7-Day Size Exchange:</strong> In case the fit isn't perfect, we arrange a doorstep pickup across India with zero courier fee.</span>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1A1918] text-[#FAF9F5] text-xs uppercase tracking-widest hover:bg-[#33312E] transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
