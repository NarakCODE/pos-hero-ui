import { ShoppingCart } from "reicon-react";

export type LogoProps = {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  name?: string;
  className?: string;
};

const logoSizes = {
  sm: {
    icon: 20,
    text: "text-sm",
    gap: "gap-2",
  },
  md: {
    icon: 24,
    text: "text-base",
    gap: "gap-2.5",
  },
  lg: {
    icon: 32,
    text: "text-xl",
    gap: "gap-3",
  },
};

export function Logo({
  showText = true,
  size = "md",
  name = "RakPOS",
  className = "",
}: LogoProps) {
  const config = logoSizes[size];

  return (
    <div
      className={`inline-flex items-center ${config.gap} ${className}`}
      aria-label={name}
    >
      <span className="flex shrink-0 items-center justify-center">
        <ShoppingCart
          size={config.icon}
          weight="Filled"
          aria-hidden="true"
        />
      </span>

      {showText && (
        <span className={`${config.text} font-semibold tracking-tight`}>
          {name}
        </span>
      )}
    </div>
  );
}
