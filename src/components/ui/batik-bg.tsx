export function BatikBackground({ noWhite }: { noWhite?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className={`absolute inset-0 ${noWhite ? "opacity-[0.18]" : "opacity-[0.3]"}`}
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 25%, rgba(0,0,0,0.6) 50%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 25%, rgba(0,0,0,0.6) 50%, transparent 80%)",
          transform: noWhite ? "rotate(180deg)" : undefined,
        }}
      >
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="ceplok" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,2 58,30 30,58 2,30" fill="none" stroke="#D4AF37" strokeWidth="1" />
              <polygon points="30,10 50,30 30,50 10,30" fill="none" stroke="#D4AF37" strokeWidth="0.7" />
              <circle cx="30" cy="30" r="2.5" fill="#D4AF37" opacity="0.6" />
              <circle cx="30" cy="30" r="1" fill="#D4AF37" />
              <polygon points="0,30 28,2" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
              <polygon points="30,0 2,28" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
              <polygon points="60,30 32,2" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
              <polygon points="30,60 2,32" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
              <polygon points="30,0 58,28" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
              <polygon points="60,30 32,58" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
              <circle cx="2" cy="28" r="1" fill="#D4AF37" opacity="0.4" />
              <circle cx="28" cy="2" r="1" fill="#D4AF37" opacity="0.4" />
              <circle cx="58" cy="28" r="1" fill="#D4AF37" opacity="0.4" />
              <circle cx="28" cy="58" r="1" fill="#D4AF37" opacity="0.4" />
            </pattern>
          </defs>

          <rect x="0" y="0" width="100%" height="100%" fill="url(#ceplok)" />
        </svg>
      </div>
      {!noWhite && (
        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.85) 85%, white 100%)"
          }}
        />
      )}
    </div>
  )
}
