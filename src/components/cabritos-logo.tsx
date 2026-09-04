import React from "react";
import Image from "next/image";

interface CabritosLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function CabritosLogo({
  size = "md",
  className = "",
}: CabritosLogoProps) {
  const sizeStyles = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-24 h-24",
    xl: "w-36 h-36",
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeStyles} ${className}`}>
      <Image
        src="/logo.png"
        alt="Cabritos Race Team"
        width={160}
        height={160}
        priority
        className="w-full h-full object-contain"
      />
    </div>
  );
}
