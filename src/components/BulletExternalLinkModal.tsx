import React from 'react';
import { ExternalLink, ShieldCheck, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { Bullet } from '../types';

interface BulletExternalLinkModalProps {
  bullet: Bullet;
  onClose: () => void;
  onProceed: () => void;
  isDarkMode?: boolean;
}

export const BulletExternalLinkModal: React.FC<BulletExternalLinkModalProps> = ({
  bullet,
  onClose,
  onProceed,
  isDarkMode = false
}) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md rounded-xl border-2 border-black p-6 md:p-7 shadow-[6px_6px_0px_0px_#000] relative space-y-5 ${
          isDarkMode ? 'bg-stone-900 text-stone-100' : 'bg-white text-stone-900'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 border-2 border-black bg-white hover:bg-stone-100 text-black transition-colors rounded-lg shadow-[1px_1px_0px_0px_#000] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning / Verification Icon */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-400 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000]">
            <ExternalLink className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
              External Portal Notice
            </span>
            <h3 className="font-display font-black text-lg text-black leading-tight">
              Leaving DIRPA
            </h3>
          </div>
        </div>

        {/* Notice Info */}
        <div className="space-y-2.5 text-xs text-stone-700 leading-relaxed">
          <p>
            You are navigating to an official external portal to view the primary Bullet or begin your application:
          </p>

          <div className="p-3 bg-stone-100 border border-stone-300 rounded-lg space-y-1">
            <div className="font-bold text-stone-900 text-sm">
              {bullet.sourceName}
            </div>
            <div className="font-mono text-[11px] text-stone-500 break-all">
              {bullet.sourceUrl}
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-lg flex items-center gap-2 text-[11px] font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>This is a verified official government or institutional portal.</span>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-black bg-white hover:bg-stone-100 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            Stay on DIRPA
          </button>

          <button
            type="button"
            onClick={() => {
              onProceed();
              onClose();
            }}
            className="px-4 py-2 border-2 border-black bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] transition-transform active:scale-95 cursor-pointer"
          >
            <span>Proceed to Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
