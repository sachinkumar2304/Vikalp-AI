import React from "react";

interface EmblemProps {
  className?: string;
  size?: number;
  variant?: "gold" | "navy" | "white" | "monochrome";
  showMotto?: boolean;
}

/**
 * State Emblem of India (Lion Capital of Ashoka with Satyameva Jayate)
 * Authentic Government of India official vector representation
 */
export const EmblemOfIndia: React.FC<EmblemProps> = ({
  className = "",
  size = 36,
  variant = "navy",
}) => {
  const height = Math.round(size * 1.5937);

  // Exact color calibration filters for official variants
  const filterStyles: Record<string, string> = {
    gold: "brightness(0) saturate(100%) invert(64%) sepia(50%) saturate(750%) hue-rotate(4deg) brightness(95%) contrast(92%)",
    navy: "brightness(0) saturate(100%) invert(10%) sepia(85%) saturate(4000%) hue-rotate(205deg) brightness(85%) contrast(105%)",
    white: "brightness(0) invert(1)",
    monochrome: "none",
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height }}
      aria-label="State Emblem of India - सत्यमेव जयते"
      role="img"
    >
      <img
        src="/emblem-of-india.svg"
        alt="State Emblem of India - सत्यमेव जयते"
        className="w-full h-full object-contain pointer-events-none"
        style={{
          filter: filterStyles[variant] || filterStyles.navy,
        }}
        loading="eager"
      />
    </div>
  );
};
