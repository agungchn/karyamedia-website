import React from "react"

interface IconProps {
  className?: string
  size?: number
}

// ===== ICON KATEGORI PRODUK =====

// Award/Ribbon - Plakat
export const PlakatCategoryIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="plakatRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#F0D78C" />
      </linearGradient>
    </defs>
    <path d="M12 15C14.21 15 16 13.21 16 11V5L12 3L8 5V11C8 13.21 9.79 15 12 15Z" fill="url(#plakatRibbon)" stroke="#B8941F" strokeWidth="0.5" />
    <circle cx="12" cy="10" r="2" fill="#0B1F3A" />
    <path d="M9 14L7 21L12 18L17 21L15 14" fill="url(#plakatRibbon)" stroke="#B8941F" strokeWidth="0.5" />
  </svg>
)

// Medal - Medali
export const MedaliCategoryIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="medalGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#F0D78C" />
      </linearGradient>
      <linearGradient id="medalRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M8 3L12 7L16 3V9L12 11L8 9V3Z" fill="url(#medalRibbon)" />
    <circle cx="12" cy="16" r="5" fill="url(#medalGold)" stroke="#B8941F" strokeWidth="0.5" />
    <circle cx="12" cy="16" r="3" fill="none" stroke="#0B1F3A" strokeWidth="0.5" />
    <path d="M12 14L12.3 14.8L13.1 15L12.3 15.2L12 16L11.7 15.2L10.9 15L11.7 14.8L12 14Z" fill="#0B1F3A" />
  </svg>
)

// Trophy - Piala & Trophy
export const PialaCategoryIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#F0D78C" />
        <stop offset="100%" stopColor="#D4AF37" />
      </linearGradient>
    </defs>
    <path d="M7 4H17V9C17 11.76 14.76 14 12 14C9.24 14 7 11.76 7 9V4Z" fill="url(#trophyGold)" stroke="#B8941F" strokeWidth="0.5" />
    <path d="M7 6H5C4.45 6 4 6.45 4 7V8C4 9.1 4.9 10 6 10H7" fill="none" stroke="url(#trophyGold)" strokeWidth="1.5" />
    <path d="M17 6H19C19.55 6 20 6.45 20 7V8C20 9.1 19.1 10 18 10H17" fill="none" stroke="url(#trophyGold)" strokeWidth="1.5" />
    <rect x="11" y="14" width="2" height="3" fill="url(#trophyGold)" />
    <rect x="9" y="17" width="6" height="2" rx="1" fill="url(#trophyGold)" />
    <path d="M12 6L12.3 6.8L13.1 7L12.3 7.2L12 8L11.7 7.2L10.9 7L11.7 6.8L12 6Z" fill="#0B1F3A" />
  </svg>
)

// GraduationCap - Souvenir Wisuda
export const WisudaCategoryIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0B1F3A" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="tasselGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#F0D78C" />
      </linearGradient>
    </defs>
    <path d="M12 3L2 8L12 13L22 8L12 3Z" fill="url(#capGrad)" />
    <path d="M6 10.5V14C6 15.66 8.69 17 12 17C15.31 17 18 15.66 18 14V10.5" fill="none" stroke="url(#capGrad)" strokeWidth="1.5" />
    <line x1="22" y1="8" x2="22" y2="13" stroke="url(#tasselGrad)" strokeWidth="1.5" />
    <circle cx="22" cy="14" r="1.5" fill="url(#tasselGrad)" />
  </svg>
)

// Package - Gift Box
export const GiftBoxCategoryIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#F0D78C" />
      </linearGradient>
    </defs>
    <rect x="4" y="10" width="16" height="10" rx="1" fill="url(#boxGrad)" />
    <rect x="3" y="8" width="18" height="3" rx="1" fill="url(#boxGrad)" stroke="#0B1F3A" strokeWidth="0.3" />
    <rect x="11" y="8" width="2" height="12" fill="url(#ribbonGrad)" />
    <path d="M12 8C12 8 10 5 8 5C6 5 6 7 8 8" fill="none" stroke="url(#ribbonGrad)" strokeWidth="1.5" />
    <path d="M12 8C12 8 14 5 16 5C18 5 18 7 16 8" fill="none" stroke="url(#ribbonGrad)" strokeWidth="1.5" />
  </svg>
)

// Gem - Accessories
export const AccessoriesCategoryIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1D4ED8" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M6 9L12 4L18 9L12 20L6 9Z" fill="url(#gemGrad)" stroke="#0B1F3A" strokeWidth="0.5" />
    <path d="M6 9H18" stroke="white" strokeWidth="0.5" opacity="0.5" />
    <path d="M12 4L9 9L12 20" stroke="white" strokeWidth="0.5" opacity="0.3" />
    <path d="M12 4L15 9L12 20" stroke="white" strokeWidth="0.5" opacity="0.3" />
    <path d="M9 9L12 20" stroke="white" strokeWidth="0.3" opacity="0.2" />
    <path d="M15 9L12 20" stroke="white" strokeWidth="0.3" opacity="0.2" />
  </svg>
)

// Scroll - Prasasti
export const PrasastiCategoryIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="scrollGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#F0D78C" />
      </linearGradient>
    </defs>
    <path d="M6 4C6 4 6 20 6 20C6 20 18 20 18 20C18 20 18 4 18 4" fill="none" stroke="url(#scrollGrad)" strokeWidth="1.5" />
    <path d="M6 4C6 4 12 6 18 4" fill="none" stroke="url(#scrollGrad)" strokeWidth="1.5" />
    <path d="M6 20C6 20 12 18 18 20" fill="none" stroke="url(#scrollGrad)" strokeWidth="1.5" />
    <line x1="9" y1="8" x2="15" y2="8" stroke="#0B1F3A" strokeWidth="0.8" />
    <line x1="9" y1="11" x2="15" y2="11" stroke="#0B1F3A" strokeWidth="0.8" />
    <line x1="9" y1="14" x2="13" y2="14" stroke="#0B1F3A" strokeWidth="0.8" />
  </svg>
)

// MapPin - Batas Wilayah
export const BatasWilayahCategoryIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="url(#pinGrad)" stroke="#991B1B" strokeWidth="0.5" />
    <circle cx="12" cy="9" r="3" fill="white" />
    <circle cx="12" cy="9" r="1.5" fill="#DC2626" />
  </svg>
)

// ===== ICON KEUNGGULAN (WHY CHOOSE US) =====

// Calendar - Sejak 2001
export const CalendarColoredIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#F0D78C" />
      </linearGradient>
    </defs>
    <rect x="3" y="5" width="18" height="16" rx="2" fill="url(#calGrad)" stroke="#B8941F" strokeWidth="0.5" />
    <line x1="3" y1="10" x2="21" y2="10" stroke="#0B1F3A" strokeWidth="1" />
    <line x1="8" y1="3" x2="8" y2="7" stroke="#0B1F3A" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="3" x2="16" y2="7" stroke="#0B1F3A" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="14" r="1" fill="#0B1F3A" />
    <circle cx="12" cy="14" r="1" fill="#0B1F3A" />
    <circle cx="16" cy="14" r="1" fill="#0B1F3A" />
    <circle cx="8" cy="17" r="1" fill="#0B1F3A" />
    <circle cx="12" cy="17" r="1" fill="#0B1F3A" />
  </svg>
)

// Shield - Berbadan Hukum
export const ShieldColoredIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M12 2L4 6V11C4 16.55 7.16 21.74 12 23C16.84 21.74 20 16.55 20 11V6L12 2Z" fill="url(#shieldGrad)" stroke="#0B1F3A" strokeWidth="0.5" />
    <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Users - Pengerajin Langsung
export const UsersColoredIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="usersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0B1F3A" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    <circle cx="9" cy="7" r="3" fill="url(#usersGrad)" />
    <path d="M3 21V19C3 16.79 4.79 15 7 15H11C13.21 15 15 16.79 15 19V21" fill="url(#usersGrad)" />
    <circle cx="17" cy="9" r="2.5" fill="url(#usersGrad)" opacity="0.7" />
    <path d="M17 14C19.21 14 21 15.79 21 18V21" fill="none" stroke="url(#usersGrad)" strokeWidth="2" opacity="0.7" />
  </svg>
)

// Palette - Bisa Custom Desain
export const PaletteColoredIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="paletteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#A78BFA" />
      </linearGradient>
    </defs>
    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C12.83 22 13.5 21.33 13.5 20.5C13.5 20.15 13.39 19.82 13.2 19.54C13.04 19.31 13 19.03 13 18.75C13 17.65 13.9 16.75 15 16.75H17C19.76 16.75 22 14.51 22 11.75C22 6.37 17.52 2 12 2Z" fill="url(#paletteGrad)" />
    <circle cx="7.5" cy="10.5" r="1.5" fill="#D4AF37" />
    <circle cx="10.5" cy="7" r="1.5" fill="#EF4444" />
    <circle cx="15.5" cy="7" r="1.5" fill="#3B82F6" />
    <circle cx="18" cy="11" r="1.5" fill="#10B981" />
  </svg>
)

// DollarSign - Harga Menyesuaikan
export const DollarColoredIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="dollarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#34D399" />
      </linearGradient>
    </defs>
    <line x1="12" y1="2" x2="12" y2="22" stroke="url(#dollarGrad)" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 6H10C7.79 6 6 7.79 6 10C6 12.21 7.79 14 10 14H14C16.21 14 18 15.79 18 18C18 20.21 16.21 22 14 22H7" stroke="url(#dollarGrad)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

// CheckCircle - Quality Control
export const CheckCircleColoredIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#34D399" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#checkGrad)" stroke="#059669" strokeWidth="0.5" />
    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ===== MAPPINGS =====

export const categoryIconMap: Record<string, React.FC<IconProps>> = {
  plakat: PlakatCategoryIcon,
  medali: MedaliCategoryIcon,
  "piala-trophy": PialaCategoryIcon,
  "souvenir-wisuda": WisudaCategoryIcon,
  "gift-box": GiftBoxCategoryIcon,
  accessories: AccessoriesCategoryIcon,
  prasasti: PrasastiCategoryIcon,
  "batas-wilayah": BatasWilayahCategoryIcon,
}

export const advantageIconMap: Record<string, React.FC<IconProps>> = {
  Calendar: CalendarColoredIcon,
  Shield: ShieldColoredIcon,
  Users: UsersColoredIcon,
  Palette: PaletteColoredIcon,
  DollarSign: DollarColoredIcon,
  CheckCircle: CheckCircleColoredIcon,
}

// Legacy mappings for backward compatibility
export const productIconMap: Record<string, React.FC<IconProps>> = {
  ...categoryIconMap,
  "plakat-akrilik-custom-premium": PlakatCategoryIcon,
  "medali-kuningan-etching": MedaliCategoryIcon,
  "piala-trophy-custom": PialaCategoryIcon,
  "prasasti-peresmian-marmer": PrasastiCategoryIcon,
  "samir-wisuda-premium": WisudaCategoryIcon,
  "kalung-rektor-guru-besar": WisudaCategoryIcon,
  "tongkat-rektor-custom": WisudaCategoryIcon,
  "name-tag-custom": AccessoriesCategoryIcon,
  "plakat-kayu": PlakatCategoryIcon,
  "plakat-marmer": PlakatCategoryIcon,
  "plakat-fiberglass": PlakatCategoryIcon,
  "plakat-wayang": PlakatCategoryIcon,
  "souvenir-pernikahan": PlakatCategoryIcon,
  "samir-wisuda-akrilik": WisudaCategoryIcon,
  "patok-batas-wilayah": BatasWilayahCategoryIcon,
  "map-wisuda": WisudaCategoryIcon,
  "tabung-wisuda": WisudaCategoryIcon,

  "patung-wisuda": WisudaCategoryIcon,
  "pin-bross-custom": AccessoriesCategoryIcon,
  "tumbler-custom": AccessoriesCategoryIcon,
}
