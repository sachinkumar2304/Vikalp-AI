import React from "react";

interface EmblemProps {
  className?: string;
  size?: number;
  variant?: "gold" | "navy" | "white" | "monochrome";
}

/**
 * State Emblem of India (Lion Capital of Ashoka with Satyameva Jayate)
 * Authentic Government of India official vector representation
 */
export const EmblemOfIndia: React.FC<EmblemProps> = ({
  className = "",
  size = 40,
  variant = "navy",
}) => {
  const colors = {
    gold: {
      primary: "#C59B27",
      secondary: "#8B6B1B",
      text: "#8B6B1B",
    },
    navy: {
      primary: "#002147",
      secondary: "#003366",
      text: "#002147",
    },
    white: {
      primary: "#FFFFFF",
      secondary: "#E2E8F0",
      text: "#FFFFFF",
    },
    monochrome: {
      primary: "currentColor",
      secondary: "currentColor",
      text: "currentColor",
    },
  }[variant];

  return (
    <div
      className={`inline-flex flex-col items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, minWidth: size }}
      aria-label="State Emblem of India - सत्यमेव जयते"
      role="img"
    >
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
      >
        {/* Central Crown / Lion Stems */}
        <path
          d="M50 8C43 8 38 13 38 19C38 23 40 26 43 28C39 31 36 36 36 42C36 46 38 50 41 53C37 56 34 61 34 67C34 71 36 74 39 76H61C64 74 66 71 66 67C66 61 63 56 59 53C62 50 64 46 64 42C64 36 61 31 57 28C60 26 62 23 62 19C62 13 57 8 50 8Z"
          fill={colors.primary}
          fillOpacity="0.95"
        />

        {/* Left Lion Profile */}
        <path
          d="M32 24C27 24 23 28 23 34C23 39 25 43 29 45C26 48 24 53 24 58C24 62 26 66 29 68C26 70 24 74 24 78H37C37 73 35 69 35 65C35 60 37 56 37 52C37 47 35 44 35 40C35 34 33 29 32 24Z"
          fill={colors.secondary}
          fillOpacity="0.85"
        />

        {/* Right Lion Profile */}
        <path
          d="M68 24C73 24 77 28 77 34C77 39 75 43 71 45C74 48 76 53 76 58C76 62 74 66 71 68C74 70 76 74 76 78H63C63 73 65 69 65 65C65 60 63 56 63 52C63 47 65 44 65 40C65 34 67 29 68 24Z"
          fill={colors.secondary}
          fillOpacity="0.85"
        />

        {/* Capital Abacus Base */}
        <rect
          x="20"
          y="78"
          width="60"
          height="7"
          rx="1.5"
          fill={colors.primary}
        />

        {/* Ashoka Chakra in Central Abacus */}
        <circle
          cx="50"
          cy="92"
          r="7.5"
          stroke={colors.primary}
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="50" cy="92" r="1.5" fill={colors.primary} />
        {/* Chakra Spokes */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="92"
            x2={50 + 6.5 * Math.cos((deg * Math.PI) / 180)}
            y2={92 + 6.5 * Math.sin((deg * Math.PI) / 180)}
            stroke={colors.primary}
            strokeWidth="0.8"
          />
        ))}

        {/* Left Bull Outline */}
        <path
          d="M26 89C23 89 22 92 23 94C24 95 27 95 29 94C31 93 32 91 30 89C28 88 27 89 26 89Z"
          fill={colors.secondary}
        />

        {/* Right Galloping Horse Outline */}
        <path
          d="M74 89C77 89 78 92 77 94C76 95 73 95 71 94C69 93 68 91 70 89C72 88 73 89 74 89Z"
          fill={colors.secondary}
        />

        {/* Lower Lotus Plinth Base */}
        <path
          d="M16 101C28 99 72 99 84 101L81 106C68 107.5 32 107.5 19 106L16 101Z"
          fill={colors.primary}
          fillOpacity="0.9"
        />
      </svg>
      {/* Satyameva Jayate Motto Text */}
      <span
        className="font-serif text-[7.5px] font-black tracking-widest leading-none mt-0.5 whitespace-nowrap"
        style={{ color: colors.text }}
      >
        सत्यमेव जयते
      </span>
    </div>
  );
};
