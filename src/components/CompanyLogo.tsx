import React, { useState } from 'react';
import { Company } from '../types';

interface CompanyLogoProps {
  company: Partial<Company> & { id: string; name: string };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

// Dedicated vector logos for instant, reliable, crisp zero-latency rendering
const renderCompanyVectorLogo = (companyId: string, companyName: string, sizeClass: string) => {
  const id = companyId.toLowerCase();

  // 1. GOOGLE
  if (id.includes('google') || id.includes('alphabet')) {
    return (
      <svg viewBox="0 0 48 48" className={sizeClass} aria-label="Google Logo">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    );
  }

  // 2. MICROSOFT
  if (id.includes('microsoft')) {
    return (
      <svg viewBox="0 0 44 44" className={sizeClass} aria-label="Microsoft Logo">
        <rect x="2" y="2" width="18" height="18" fill="#F25022" />
        <rect x="24" y="2" width="18" height="18" fill="#7FBA00" />
        <rect x="2" y="24" width="18" height="18" fill="#00A4EF" />
        <rect x="24" y="24" width="18" height="18" fill="#FFB900" />
      </svg>
    );
  }

  // 3. TATA CONSULTANCY SERVICES (TCS)
  if (id === 'tcs' || id.includes('tata-consultancy')) {
    return (
      <svg viewBox="0 0 80 40" className={sizeClass} aria-label="TCS Logo">
        <text x="50%" y="45%" textAnchor="middle" fill="#002D62" fontFamily="sans-serif" fontWeight="900" fontSize="22" letterSpacing="1">
          TATA
        </text>
        <text x="50%" y="78%" textAnchor="middle" fill="#0076CE" fontFamily="sans-serif" fontWeight="800" fontSize="10" letterSpacing="1.5">
          CONSULTANCY
        </text>
      </svg>
    );
  }

  // 4. INFOSYS
  if (id.includes('infosys')) {
    return (
      <svg viewBox="0 0 100 40" className={sizeClass} aria-label="Infosys Logo">
        <text x="50%" y="65%" textAnchor="middle" fill="#007CC3" fontFamily="Georgia, serif" fontWeight="bold" fontSize="22" letterSpacing="0.5">
          Infosys
        </text>
      </svg>
    );
  }

  // 5. AMAZON (AWS)
  if (id.includes('amazon') || id.includes('aws')) {
    return (
      <svg viewBox="0 0 70 40" className={sizeClass} aria-label="Amazon Logo">
        <text x="35" y="22" textAnchor="middle" fill="#000000" fontFamily="sans-serif" fontWeight="900" fontSize="22">
          amazon
        </text>
        {/* Amazon signature curved smile arrow */}
        <path d="M 16 27 Q 35 37 54 28" fill="none" stroke="#FF9900" strokeWidth="3" strokeLinecap="round" />
        <path d="M 51 25 L 56 28 L 52 32 Z" fill="#FF9900" />
      </svg>
    );
  }

  // 6. TATA MOTORS
  if (id.includes('tata-motors')) {
    return (
      <svg viewBox="0 0 80 44" className={sizeClass} aria-label="Tata Motors Logo">
        <ellipse cx="40" cy="18" rx="28" ry="14" fill="none" stroke="#00539B" strokeWidth="2.5" />
        <path d="M 28 14 Q 40 8 52 14 Q 40 22 28 14 Z" fill="#00539B" />
        <text x="40" y="38" textAnchor="middle" fill="#00539B" fontFamily="sans-serif" fontWeight="900" fontSize="8" letterSpacing="1.2">
          TATA MOTORS
        </text>
      </svg>
    );
  }

  // 7. LARSEN & TOUBRO (L&T)
  if (id === 'lnt' || id.includes('larsen') || id.includes('toubro')) {
    return (
      <svg viewBox="0 0 60 50" className={sizeClass} aria-label="L&T Logo">
        <circle cx="30" cy="25" r="22" fill="#004B87" />
        <circle cx="30" cy="25" r="19" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <text x="30" y="32" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="16" letterSpacing="0.5">
          L&amp;T
        </text>
      </svg>
    );
  }

  // 8. ISRO
  if (id.includes('isro')) {
    return (
      <svg viewBox="0 0 60 50" className={sizeClass} aria-label="ISRO Logo">
        {/* Orange launch trajectory */}
        <path d="M 20 40 L 30 10 L 40 40 Z" fill="#F47920" />
        <path d="M 30 10 Q 42 22 46 36" fill="none" stroke="#0B3C5D" strokeWidth="3" strokeLinecap="round" />
        <rect x="12" y="24" width="8" height="12" fill="#0B3C5D" />
        <rect x="40" y="24" width="8" height="12" fill="#0B3C5D" />
        <text x="30" y="47" textAnchor="middle" fill="#0B3C5D" fontFamily="sans-serif" fontWeight="900" fontSize="10" letterSpacing="1">
          ISRO
        </text>
      </svg>
    );
  }

  // 9. DELOITTE - The exact brand logo with the signature green dot!
  if (id.includes('deloitte')) {
    return (
      <svg viewBox="0 0 90 32" className={sizeClass} aria-label="Deloitte Logo">
        <text x="6" y="23" fill="#000000" fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontSize="18" letterSpacing="-0.5">
          Deloitte
        </text>
        {/* Signature Deloitte Green Dot */}
        <circle cx="79" cy="21" r="3.2" fill="#86BC25" />
      </svg>
    );
  }

  // 10. QUALCOMM
  if (id.includes('qualcomm')) {
    return (
      <svg viewBox="0 0 90 30" className={sizeClass} aria-label="Qualcomm Logo">
        <text x="5" y="22" fill="#3253DC" fontFamily="sans-serif" fontWeight="900" fontSize="17" letterSpacing="-0.2">
          Qualcomm
        </text>
      </svg>
    );
  }

  // 11. RELIANCE JIO
  if (id.includes('jio') || id.includes('reliance')) {
    return (
      <svg viewBox="0 0 48 48" className={sizeClass} aria-label="Reliance Jio Logo">
        <circle cx="24" cy="24" r="22" fill="#0A2885" />
        <circle cx="24" cy="24" r="19" fill="#E11B22" />
        <text x="24" y="31" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="19" letterSpacing="-0.5">
          Jio
        </text>
      </svg>
    );
  }

  // 12. DR. REDDY'S
  if (id.includes('dr-reddys') || id.includes('reddy')) {
    return (
      <svg viewBox="0 0 90 40" className={sizeClass} aria-label="Dr. Reddy's Logo">
        <circle cx="20" cy="20" r="14" fill="#662D91" />
        <path d="M 16 12 Q 22 20 16 28 Q 24 20 24 12" fill="#FFFFFF" opacity="0.85" />
        <text x="38" y="21" fill="#662D91" fontFamily="sans-serif" fontWeight="900" fontSize="11">
          Dr.Reddy's
        </text>
        <text x="38" y="30" fill="#333333" fontFamily="sans-serif" fontWeight="700" fontSize="6" letterSpacing="0.5">
          LABORATORIES
        </text>
      </svg>
    );
  }

  // 13. ACCENTURE
  if (id.includes('accenture')) {
    return (
      <svg viewBox="0 0 90 30" className={sizeClass} aria-label="Accenture Logo">
        <text x="5" y="22" fill="#000000" fontFamily="sans-serif" fontWeight="900" fontSize="16">
          accenture
        </text>
        <path d="M 40 9 L 45 13 L 40 17" fill="none" stroke="#A100FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 14. WIPRO
  if (id.includes('wipro')) {
    return (
      <svg viewBox="0 0 80 40" className={sizeClass} aria-label="Wipro Logo">
        <circle cx="16" cy="18" r="4" fill="#E4002B" />
        <circle cx="26" cy="14" r="3.5" fill="#FFB81C" />
        <circle cx="22" cy="24" r="3.5" fill="#00A3E0" />
        <circle cx="12" cy="26" r="3" fill="#78BE20" />
        <text x="40" y="24" fill="#000000" fontFamily="sans-serif" fontWeight="900" fontSize="16">
          wipro
        </text>
      </svg>
    );
  }

  // 15. COGNIZANT
  if (id.includes('cognizant')) {
    return (
      <svg viewBox="0 0 90 30" className={sizeClass} aria-label="Cognizant Logo">
        <circle cx="16" cy="15" r="10" fill="#0033A0" />
        <text x="32" y="20" fill="#0033A0" fontFamily="sans-serif" fontWeight="900" fontSize="13">
          Cognizant
        </text>
      </svg>
    );
  }

  // Default typographic corporate badge (High-contrast, professional, no random emojis)
  const initials = companyName
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col items-center justify-center text-center w-full h-full p-1 bg-stone-900 text-white font-mono font-black select-none">
      <span className="text-xs tracking-wider">{initials}</span>
    </div>
  );
};

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  company,
  size = 'md',
  className = '',
  showBorder = true
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const svgInnerSizes = {
    xs: 'w-4 h-4',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16'
  };

  const id = (company.id || '').toLowerCase();
  // Known companies with pristine custom vector logos
  const hasVector = [
    'google', 'alphabet', 'microsoft', 'tcs', 'tata-consultancy', 
    'infosys', 'amazon', 'aws', 'tata-motors', 'lnt', 'larsen', 
    'toubro', 'isro', 'deloitte', 'qualcomm', 'jio', 'reliance', 
    'dr-reddys', 'reddy', 'accenture', 'wipro', 'cognizant'
  ].some(k => id.includes(k));

  // If company has vector, render it directly for instant crisp 0ms rendering
  if (hasVector) {
    return (
      <div 
        className={`
          ${sizeClasses[size]} 
          bg-white shrink-0 flex items-center justify-center overflow-hidden p-1.5 transition-transform
          ${showBorder ? 'border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : ''}
          ${className}
        `}
        title={company.name}
      >
        {renderCompanyVectorLogo(company.id, company.name, svgInnerSizes[size])}
      </div>
    );
  }

  // Otherwise, use image URL with fallback to typography badge
  const hasLogoUrl = company.logoUrl && !imgError;

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        bg-white shrink-0 flex items-center justify-center overflow-hidden p-1.5 transition-transform
        ${showBorder ? 'border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : ''}
        ${className}
      `}
      title={company.name}
    >
      {hasLogoUrl ? (
        <img 
          src={company.logoUrl} 
          alt={`${company.name} logo`}
          className="w-full h-full object-contain pointer-events-none select-none"
          loading="lazy"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        renderCompanyVectorLogo(company.id, company.name, svgInnerSizes[size])
      )}
    </div>
  );
};

export default CompanyLogo;
