import React, { useState, useEffect } from 'react';
import { CUSTOM_ILLUSTRATIONS } from '../data/illustrationsData';

export const resolveAvatarUrl = (avatarStr: string | undefined | null): string | null => {
  if (!avatarStr) return null;
  const trimmed = avatarStr.trim();
  if (!trimmed) return null;

  // Exact illustration match by ID, URL, name, or filename
  const matched = CUSTOM_ILLUSTRATIONS.find(item => 
    item.id.toLowerCase() === trimmed.toLowerCase() || 
    item.url.toLowerCase() === trimmed.toLowerCase() ||
    item.name.toLowerCase() === trimmed.toLowerCase() ||
    item.url.toLowerCase().endsWith('/' + trimmed.toLowerCase())
  );
  if (matched) {
    return matched.url;
  }

  // Pre-formatted URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/') || trimmed.startsWith('/')) {
    return trimmed;
  }

  // Filename or simple ID fallback
  if (trimmed.includes('.png') || trimmed.includes('.jpg') || trimmed.includes('.jpeg') || trimmed.includes('.webp')) {
    return `/illustrations/${trimmed.replace(/^\/+/, '')}`;
  }

  return null;
};

interface AvatarDisplayProps {
  avatar?: string | null;
  name?: string | null;
  className?: string;
  imgClassName?: string;
  textClassName?: string;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatar,
  name,
  className = "w-10 h-10 rounded-full bg-amber-100 border-2 border-black flex items-center justify-center overflow-hidden shrink-0",
  imgClassName = "w-full h-full object-cover rounded-full",
  textClassName = "text-xs font-black uppercase text-amber-950"
}) => {
  const [imgError, setImgError] = useState(false);
  const resolvedUrl = resolveAvatarUrl(avatar);

  // Reset error state if avatar prop changes
  useEffect(() => {
    setImgError(false);
  }, [avatar]);

  const getInitials = (str?: string | null): string => {
    if (!str) return '🎓';
    const trimmed = str.trim();
    if (trimmed.length <= 2 && !trimmed.includes(' ')) {
      return trimmed;
    }
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  };

  const displayText = getInitials(avatar && avatar.length <= 2 ? avatar : (name || avatar || '🎓'));

  if (resolvedUrl && !imgError) {
    return (
      <div className={className}>
        <img
          src={resolvedUrl}
          alt=""
          className={imgClassName}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <span className={textClassName}>
        {displayText}
      </span>
    </div>
  );
};
