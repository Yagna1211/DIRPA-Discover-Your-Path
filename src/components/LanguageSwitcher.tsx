import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../i18n/i18n';

interface LanguageSwitcherProps {
  variant?: 'header' | 'compact' | 'mobile';
  className?: string;
  isDarkMode?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = '',
  isDarkMode = false,
}) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangCode = (i18n.language?.split('-')[0] || 'en') as LanguageCode;
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === currentLangCode) || SUPPORTED_LANGUAGES[0];

  const handleSelectLanguage = (code: LanguageCode) => {
    i18n.changeLanguage(code);
    localStorage.setItem('dirpa_i18n_lang', code);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'mobile') {
    return (
      <div className={`flex flex-col gap-1 w-full ${className}`}>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 mb-1">
          <Globe className="w-3.5 h-3.5 text-amber-600" />
          {t('nav.selectLanguage', 'Language / भाषा / భాష / மொழி')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLangCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code as LanguageCode)}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'bg-amber-100 border-black text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : isDarkMode
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                    : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-black'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border-2 transition-all cursor-pointer ${
          isDarkMode
            ? 'bg-zinc-800 border-zinc-700 text-zinc-100 hover:border-amber-400'
            : 'bg-amber-50 border-black text-black hover:bg-amber-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
        }`}
        title={t('nav.selectLanguage', 'Select Language')}
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-amber-600 animate-pulse" />
        <span className="flex items-center gap-1">
          <span>{currentLang.flag}</span>
          <span className="font-black">{currentLang.nativeName}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden py-1 transition-all ${
            isDarkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white text-gray-900'
          }`}
        >
          <div className="px-3 py-1.5 border-b border-gray-200 text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50/50 flex items-center justify-between">
            <span>🌐 {t('nav.selectLanguage', 'Select Language')}</span>
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLangCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code as LanguageCode)}
                className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-amber-100 text-black font-extrabold border-l-4 border-amber-600'
                    : isDarkMode
                    ? 'hover:bg-zinc-800 text-zinc-200'
                    : 'hover:bg-amber-50 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <div className="flex flex-col leading-tight">
                    <span>{lang.nativeName}</span>
                    <span className="text-[9px] font-normal text-gray-500 uppercase">{lang.name}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-700" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
