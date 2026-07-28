import React from 'react';

interface ProductImageProps {
  type: 'sparkler' | 'pot' | 'chakkar' | 'bomb' | 'kids' | 'garland' | 'rocket';
}

export const ProductImage: React.FC<ProductImageProps> = ({ type }) => {
  // Return styled SVGs with distinct, beautiful colors to match the premium Sivakasi look
  switch (type) {
    case 'sparkler':
      return (
        <svg viewBox="0 0 100 100" className="product-svg-icon" style={{ width: '45px', height: '45px' }}>
          <rect width="100" height="100" rx="8" fill="#e8f4fd" />
          {/* Sparkler stick */}
          <line x1="50" y1="40" x2="50" y2="85" stroke="#78909c" strokeWidth="3" strokeLinecap="round" />
          <rect x="48" y="25" width="4" height="20" rx="2" fill="#b0bec5" />
          {/* Spark sparkles */}
          <circle cx="50" cy="20" r="2" fill="#ffb300" />
          <line x1="50" y1="20" x2="50" y2="10" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="20" x2="40" y2="15" stroke="#ffa000" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="20" x2="60" y2="15" stroke="#ffa000" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="20" x2="42" y2="28" stroke="#ff8f00" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="20" x2="58" y2="28" stroke="#ff8f00" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="20" x2="38" y2="22" stroke="#ff6f00" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="50" y1="20" x2="62" y2="22" stroke="#ff6f00" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'pot':
      return (
        <svg viewBox="0 0 100 100" className="product-svg-icon" style={{ width: '45px', height: '45px' }}>
          <rect width="100" height="100" rx="8" fill="#fff3e0" />
          {/* Flame plume */}
          <path d="M50 10 C35 35 45 50 50 50 C55 50 65 35 50 10 Z" fill="#ff6f00" />
          <path d="M50 20 C40 38 48 50 50 50 C52 50 60 38 50 20 Z" fill="#ffb300" />
          <path d="M50 32 C45 42 49 50 50 50 C51 50 55 42 50 32 Z" fill="#fff59d" />
          {/* Flower pot clay body */}
          <path d="M35 80 L65 80 L58 50 L42 50 Z" fill="#d84315" stroke="#bf360c" strokeWidth="1" />
          <rect x="40" y="48" width="20" height="3" fill="#ffb74d" rx="1" />
        </svg>
      );
    case 'chakkar':
      return (
        <svg viewBox="0 0 100 100" className="product-svg-icon" style={{ width: '45px', height: '45px' }}>
          <rect width="100" height="100" rx="8" fill="#efebe9" />
          {/* Ground Chakkar circular frame */}
          <circle cx="50" cy="50" r="30" fill="none" stroke="#d84315" strokeWidth="3" strokeDasharray="5,3" />
          <circle cx="50" cy="50" r="22" fill="none" stroke="#ff8f00" strokeWidth="3" strokeDasharray="6,4" />
          <circle cx="50" cy="50" r="14" fill="none" stroke="#ffc107" strokeWidth="3" strokeDasharray="4,2" />
          <circle cx="50" cy="50" r="6" fill="#bf360c" />
          {/* Fire trails */}
          <path d="M50 10 C65 15 75 30 75 50" fill="none" stroke="#ff6f00" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 90 C35 85 25 70 25 50" fill="none" stroke="#ff8f00" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 50 C15 65 30 75 50 75" fill="none" stroke="#ffa000" strokeWidth="2" strokeLinecap="round" />
          <path d="M90 50 C85 35 70 25 50 25" fill="none" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'bomb':
      return (
        <svg viewBox="0 0 100 100" className="product-svg-icon" style={{ width: '45px', height: '45px' }}>
          <rect width="100" height="100" rx="8" fill="#e8f5e9" />
          {/* Laxmi Bomb jute pattern (braided green string) */}
          <rect x="30" y="35" width="40" height="40" rx="6" fill="#2e7d32" stroke="#1b5e20" strokeWidth="2" />
          {/* Braided lines */}
          <line x1="30" y1="45" x2="70" y2="65" stroke="#c8e6c9" strokeWidth="1.5" />
          <line x1="30" y1="55" x2="70" y2="75" stroke="#c8e6c9" strokeWidth="1.5" />
          <line x1="30" y1="65" x2="60" y2="80" stroke="#c8e6c9" strokeWidth="1.5" />
          <line x1="30" y1="55" x2="70" y2="35" stroke="#c8e6c9" strokeWidth="1.5" />
          <line x1="30" y1="65" x2="70" y2="45" stroke="#c8e6c9" strokeWidth="1.5" />
          <line x1="40" y1="75" x2="70" y2="55" stroke="#c8e6c9" strokeWidth="1.5" />
          {/* Bomb label band */}
          <rect x="29" y="50" width="42" height="10" fill="#d50000" />
          <circle cx="50" cy="55" r="3" fill="#ffeb3b" />
          {/* Fuse */}
          <path d="M50 35 Q55 25 45 15" fill="none" stroke="#37474f" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="45" cy="15" r="2.5" fill="#ffc107" />
        </svg>
      );
    case 'kids':
      return (
        <svg viewBox="0 0 100 100" className="product-svg-icon" style={{ width: '45px', height: '45px' }}>
          <rect width="100" height="100" rx="8" fill="#f3e5f5" />
          {/* Pencil and magic pops container */}
          <rect x="25" y="30" width="22" height="50" rx="3" fill="#ab47bc" stroke="#8e24aa" strokeWidth="1.5" />
          <path d="M25 30 L36 15 L47 30 Z" fill="#ffb74d" />
          <line x1="36" y1="15" x2="36" y2="10" stroke="#757575" strokeWidth="2" />
          {/* Small magic pops dots */}
          <circle cx="68" cy="40" r="5" fill="#e91e63" />
          <circle cx="75" cy="55" r="4" fill="#00bcd4" />
          <circle cx="62" cy="65" r="6" fill="#ffeb3b" />
          <circle cx="78" cy="72" r="5" fill="#4caf50" />
        </svg>
      );
    case 'garland':
      return (
        <svg viewBox="0 0 100 100" className="product-svg-icon" style={{ width: '45px', height: '45px' }}>
          <rect width="100" height="100" rx="8" fill="#ffebee" />
          {/* Red garland/lari string */}
          <line x1="50" y1="10" x2="50" y2="90" stroke="#ffeb3b" strokeWidth="2" strokeDasharray="3,1" />
          {/* Crackers attached */}
          <rect x="35" y="15" width="12" height="6" rx="1" fill="#d50000" />
          <rect x="53" y="20" width="12" height="6" rx="1" fill="#d50000" />
          <rect x="35" y="29" width="12" height="6" rx="1" fill="#d50000" />
          <rect x="53" y="34" width="12" height="6" rx="1" fill="#d50000" />
          <rect x="35" y="43" width="12" height="6" rx="1" fill="#d50000" />
          <rect x="53" y="48" width="12" height="6" rx="1" fill="#d50000" />
          <rect x="35" y="57" width="12" height="6" rx="1" fill="#d50000" />
          <rect x="53" y="62" width="12" height="6" rx="1" fill="#d50000" />
          <rect x="35" y="71" width="12" height="6" rx="1" fill="#d50000" />
          <rect x="53" y="76" width="12" height="6" rx="1" fill="#d50000" />
          {/* Bottom fuse spark */}
          <circle cx="50" cy="90" r="3" fill="#ff9100" />
        </svg>
      );
    case 'rocket':
      return (
        <svg viewBox="0 0 100 100" className="product-svg-icon" style={{ width: '45px', height: '45px' }}>
          <rect width="100" height="100" rx="8" fill="#e0f7fa" />
          {/* Rocket stick */}
          <line x1="35" y1="45" x2="35" y2="90" stroke="#8d6e63" strokeWidth="2.5" />
          {/* Rocket body */}
          <rect x="42" y="35" width="16" height="35" fill="#0288d1" rx="1" />
          <path d="M42 35 L50 15 L58 35 Z" fill="#d50000" />
          {/* Yellow fuse trail */}
          <path d="M50 70 Q52 80 48 90" fill="none" stroke="#ffeb3b" strokeWidth="2" strokeDasharray="3,1" />
          <circle cx="48" cy="90" r="2.5" fill="#ff3d00" />
        </svg>
      );
    default:
      return null;
  }
};
