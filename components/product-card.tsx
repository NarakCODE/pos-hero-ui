import { Surface } from "@heroui/react";

interface ProductCardProps {
  addToTicketLabel: string;
  image: string;
  name: string;
  onClick: () => void;
  price: string;
}

export function ProductCard({
  addToTicketLabel,
  image,
  name,
  onClick,
  price,
}: ProductCardProps) {
  return (
    <Surface<"button">
      className="flex min-h-24 w-full items-center gap-3 overflow-hidden rounded-xl border border-default p-2 text-start hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      render={(props) => (
        <button
          {...props}
          aria-label={`${addToTicketLabel}: ${name}`}
          type="button"
          onClick={onClick}
        />
      )}
      variant="default"
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-surface-secondary sm:size-[4.5rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={name}
          className="size-full object-cover"
          loading="lazy"
          src={image}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 pe-1">
        <p className="line-clamp-2 text-sm font-medium leading-5 text-foreground">
          {name}
        </p>

        <p className="text-sm font-semibold tabular-nums text-foreground">
          {price}
        </p>
      </div>
    </Surface>
  );
}