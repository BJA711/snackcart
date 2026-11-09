import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "stone" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function Badge({
  children,
  variant = "brand",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    brand: "bg-brand-50 text-brand-800 border-brand-200",
    stone: "bg-stone-100 text-stone-700 border-stone-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

