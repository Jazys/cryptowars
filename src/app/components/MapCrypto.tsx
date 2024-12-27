export default function MapCrypto() {
    return (
      <div className="relative w-full h-full bg-blue-100">
        <svg
          viewBox="0 0 1000 500"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary-foreground))" />
            </linearGradient>
          </defs>
          <rect width="1000" height="500" fill="url(#ocean)" />
          <g fill="hsl(var(--secondary))">
            <path d="M250,60 Q380,40 520,100 Q680,70 750,140 L800,170 Q870,220 900,300 L850,340 Q750,380 680,340 Q670,300 630,280 Q580,260 510,280 Q440,320 380,300 Q320,270 250,260 Q180,260 150,300 Q130,350 160,380 L100,400 Q60,340 80,280 Q120,180 250,60" />
            <path d="M600,400 Q650,350 740,360 Q760,370 780,400 L600,400" />
            <circle cx="880" cy="230" r="30" />
            <circle cx="940" cy="280" r="20" />
          </g>
        </svg>
      </div>
    )
  }
  
  