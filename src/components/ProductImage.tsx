import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function ProductImage({ src, alt, className = '', loading = 'lazy' }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F2ECE3] via-[#EAE0D2] to-[#DFD4C6] text-[#6E6359] p-6 text-center ${className}`}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          aria-hidden="true"
          className="mb-2 opacity-70"
        >
          <path d="M3 16.5C3 14.5 5 13 7 13c1.5 0 2.5-.5 3.5-2L13 7l4 3c1.5 1 4 2 4 4.5V18H3v-1.5Z" />
          <path d="M3 18h18" />
        </svg>
        <span className="text-xs font-medium tracking-wide uppercase">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
