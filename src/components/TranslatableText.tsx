import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Loader2, RefreshCw } from 'lucide-react';

interface TranslatableTextProps {
  text: string;
  className?: string;
}

export const TranslatableText: React.FC<TranslatableTextProps> = ({ text, className = '' }) => {
  const { t, i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  const activeLang = i18n.language || 'en';

  const handleTranslate = async () => {
    if (translatedText) {
      setShowOriginal(!showOriginal);
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: activeLang })
      });
      if (res.ok) {
        const data = await res.json();
        setTranslatedText(data.translatedText);
        setShowOriginal(false);
      }
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const displayText = (translatedText && !showOriginal) ? translatedText : text;

  return (
    <div className="space-y-1.5">
      <p className={className}>
        "{displayText}"
      </p>
      {activeLang !== 'en' && text && text.length > 5 && (
        <button
          type="button"
          onClick={handleTranslate}
          disabled={isTranslating}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-colors cursor-pointer"
        >
          {isTranslating ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
              <span>{t('forumActions.translating', 'Translating...')}</span>
            </>
          ) : translatedText ? (
            <>
              <RefreshCw className="w-3 h-3 text-indigo-600" />
              <span>{showOriginal ? t('forumActions.translatePost', 'Translate post') : t('forumActions.showOriginal', 'Show original text')}</span>
            </>
          ) : (
            <>
              <Languages className="w-3 h-3 text-indigo-600" />
              <span>{t('forumActions.translatePost', 'Translate post')}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
