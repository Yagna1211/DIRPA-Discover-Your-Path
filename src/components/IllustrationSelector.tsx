import React from 'react';
import { CUSTOM_ILLUSTRATIONS } from '../data/illustrationsData';
import { X, Check } from 'lucide-react';

interface IllustrationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSelectAvatar: (avatarIdOrUrl: string) => void;
}

export const IllustrationSelector: React.FC<IllustrationSelectorProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  onSelectAvatar
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
      id="custom-illustrations-modal-overlay"
    >
      <div 
        className="relative bg-white border-2 border-black rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="custom-illustrations-modal-content"
      >
        {/* Top bar with close button ONLY - NO HEADINGS */}
        <div className="flex justify-end items-center p-3 sm:p-4 bg-amber-50 border-b border-black shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Pure Illustration Grid - NO NAMES, NO HEADINGS, NO SPECIFICATIONS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 justify-items-center">
            {CUSTOM_ILLUSTRATIONS.map((item) => {
              const isSelected = currentAvatar === item.id || currentAvatar === item.url;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectAvatar(item.url);
                    onClose();
                  }}
                  className={`group relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 transition-all duration-200 cursor-pointer select-none overflow-hidden flex items-center justify-center p-1 bg-amber-50/40 ${
                    isSelected
                      ? 'border-amber-500 ring-4 ring-amber-400 scale-105 bg-amber-100 shadow-[4px_4px_0px_0px_rgba(245,158,11,1)]'
                      : 'border-black hover:border-amber-600 hover:scale-110 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95'
                  }`}
                >
                  {/* Image ONLY with fallback */}
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover rounded-full transition-transform group-hover:scale-105"
                    loading="eager"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.illus-fallback')) {
                        const fb = document.createElement('div');
                        fb.className = 'illus-fallback flex items-center justify-center w-full h-full text-3xl select-none';
                        fb.innerText = item.badge.split(' ')[0] || '🎨';
                        parent.appendChild(fb);
                      }
                    }}
                  />

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-amber-500 text-black border border-black rounded-full p-0.5 shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
