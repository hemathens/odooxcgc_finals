import React from "react";

interface GraduationHatProps {
  className?: string;
  size?: number;
}

export const GraduationHat: React.FC<GraduationHatProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="hatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4F46E5", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#7C3AED", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Graduation Hat */}
      <path
        d="M4.5 9l7.5-4.5 7.5 4.5v6c0 1.66-1.34 3-3 3H7.5c-1.66 0-3-1.34-3-3V9z"
        fill="url(#hatGradient)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Hat Top */}
      <rect
        x="6"
        y="6"
        width="12"
        height="1.5"
        rx="0.75"
        fill="currentColor"
      />
      
      {/* Tassel */}
      <circle
        cx="12"
        cy="7.5"
        r="0.75"
        fill="#F59E0B"
      />
      <path
        d="M12 8.25v3"
        stroke="#F59E0B"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
};
