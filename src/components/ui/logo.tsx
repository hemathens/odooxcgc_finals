import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <img
      src="/placement-tracker-logo.svg"
      alt="Placement Tracker Logo"
      width={size}
      height={size}
      className={className}
    />
  );
};
