export type TimeTheme = {
  bgTop: string
  bgMid: string
  bgBottom: string
  particleColor: string
  badge: string
  desc: string
  glowFrom: string
  glowVia: string
  headingFrom: string
  headingTo: string
  panel: string
  overlay: string
}

function getTimeTheme(): TimeTheme {
  const h = new Date().getHours()
  // Pagi: 05:00 - 10:59
  if (h >= 5 && h < 11) {
    return {
      bgTop: "#7EDAFF",
      bgMid: "#FFF6F2",
      bgBottom: "#FDC64A",
      particleColor: "#FFFFFF",
      badge: "bg-black/10 text-gray-800",
      desc: "text-gray-800",
      glowFrom: "#FFFFFF",
      glowVia: "#FDC64A",
      headingFrom: "#0B1F3A",
      headingTo: "#028FEF",
      panel: "bg-white/55 backdrop-blur-md",
      overlay: "from-transparent",
    }
  }
  // Siang: 11:00 - 14:59
  if (h >= 11 && h < 15) {
    return {
      bgTop: "#028FEF",
      bgMid: "#CFECFF",
      bgBottom: "#ADDAFD",
      particleColor: "#FFFFFF",
      badge: "bg-black/10 text-gray-800",
      desc: "text-gray-800",
      glowFrom: "#FFFFFF",
      glowVia: "#ADDAFD",
      headingFrom: "#0B1F3A",
      headingTo: "#1D4ED8",
      panel: "bg-white/50 backdrop-blur-md",
      overlay: "from-transparent",
    }
  }
  // Sore: 15:00 - 17:59
  if (h >= 15 && h < 18) {
    return {
      bgTop: "#F42507",
      bgMid: "#F42507",
      bgBottom: "#F9DB09",
      particleColor: "#FFF1CF",
      badge: "bg-black/10 text-red-950",
      desc: "text-red-950",
      glowFrom: "#F42507",
      glowVia: "#F9DB09",
      headingFrom: "#7C2D12",
      headingTo: "#9A3412",
      panel: "bg-white/50 backdrop-blur-md",
      overlay: "from-transparent",
    }
  }
  // Malam: 18:00 - 04:59
  return {
    bgTop: "#000030",
    bgMid: "#000030",
    bgBottom: "#002878",
    particleColor: "#D4AF37",
    badge: "bg-white/10 text-white/80",
    desc: "text-blue-100",
    glowFrom: "#FFD700",
    glowVia: "#002878",
    headingFrom: "#FFD700",
    headingTo: "#FFFFFF",
    panel: "bg-black/55 backdrop-blur-md",
    overlay: "from-transparent",
  }
}

export { getTimeTheme }
