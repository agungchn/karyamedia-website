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
  // Siang: 11:00 - 16:59
  if (h >= 11 && h < 17) {
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
  // Sore: 17:00 - 17:59
  if (h >= 17 && h < 18) {
    return {
      bgTop: "#E8A0B0",
      bgMid: "#B59DC4",
      bgBottom: "#6A7BA8",
      particleColor: "#FFF1CF",
      badge: "bg-black/10 text-purple-950",
      desc: "text-purple-950",
      glowFrom: "#E8A0B0",
      glowVia: "#B59DC4",
      headingFrom: "#4A3A6B",
      headingTo: "#2E3A5C",
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
