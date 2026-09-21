import Image from "next/image";

export type LogoProps = {
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
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
  xl: {
    icon: 56,
    text: "text-3xl",
    gap: "gap-4",
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
      <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-full">
        <Image
          src="/rakpos-logo.png"
          alt={showText ? "" : name}
          width={config.icon}
          height={config.icon}
          className="rounded-full object-cover"
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
