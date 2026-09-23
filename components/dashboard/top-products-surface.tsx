"use client";

import {
  Avatar,
  Button,
  Card,
  Chip,
  Description,
  Label,
  ListBox,
} from "@heroui/react";
import { IconCoffee } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export interface TopProductItem {
  id: string;
  rank: number;
  name: string;
  category: string;
  soldCount: number;
  revenue: number;
  trend: number;
  image?: string;
}

export const defaultTopProducts: TopProductItem[] = [
  {
    id: "iced-latte",
    rank: 1,
    name: "Iced Latte",
    category: "Iced Coffee",
    soldCount: 142,
    revenue: 497.0,
    trend: 18.4,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "caramel-macchiato",
    rank: 2,
    name: "Caramel Macchiato",
    category: "Iced Coffee",
    soldCount: 98,
    revenue: 416.5,
    trend: 12.1,
    image:
      "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "pandan-coconut-coffee",
    rank: 3,
    name: "Pandan Coconut Cloud",
    category: "Signature",
    soldCount: 86,
    revenue: 387.0,
    trend: 24.5,
    image:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "rose-pistachio-latte",
    rank: 4,
    name: "Rose Pistachio Latte",
    category: "Signature",
    soldCount: 74,
    revenue: 351.5,
    trend: 8.7,
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "honeycomb-affogato",
    rank: 5,
    name: "Honeycomb Crunch Affogato",
    category: "Signature",
    soldCount: 65,
    revenue: 276.25,
    trend: 15.3,
    image:
      "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=700&q=80",
  },
];

interface TopProductsSurfaceProps {
  products?: TopProductItem[];
  title?: string;
  onViewAll?: () => void;
}

export function TopProductsSurface({
  products = defaultTopProducts,
  title = "Top Selling Products",
  onViewAll,
}: TopProductsSurfaceProps = {}) {
  const router = useRouter();

  const handleAction = (productId: string) => {
    router.push(`/products?selected=${productId}`);
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push("/products");
    }
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex w-full items-center justify-between gap-3">
          <div>
            <Card.Title className="text-sm font-semibold tracking-tight sm:text-base">
              {title}
            </Card.Title>
            <Card.Description className="text-xs">
              Ranked by volume today
            </Card.Description>
          </div>

          <Chip color="accent" size="sm" variant="soft">
            5 Best Sellers
          </Chip>
        </div>
      </Card.Header>

      <Card.Content>
        <ListBox
          aria-label="Top 5 selling products"
          items={products}
          selectionMode="none"
          onAction={(key) => handleAction(String(key))}
        >
          {(item) => (
            <ListBox.Item id={item.id} textValue={item.name}>
              <div className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-secondary/50">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-[11px] font-bold text-muted">
                    #{item.rank}
                  </span>

                  <Avatar color="accent" size="sm" variant="soft">
                    {item.image ? (
                      <Avatar.Image alt={item.name} src={item.image} />
                    ) : null}
                    <Avatar.Fallback>
                      <IconCoffee aria-hidden="true" size={14} />
                    </Avatar.Fallback>
                  </Avatar>

                  <div className="flex min-w-0 flex-col">
                    <div className="truncate text-sm font-medium leading-tight text-foreground">
                      <Label>{item.name}</Label>
                    </div>
                    <div className="truncate text-xs text-muted">
                      <Description>
                        {item.category} · {item.soldCount} sold
                      </Description>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end">
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    ${item.revenue.toFixed(2)}
                  </span>
                  <span className="text-[11px] font-medium tabular-nums text-success">
                    +{item.trend}%
                  </span>
                </div>
              </div>
            </ListBox.Item>
          )}
        </ListBox>
      </Card.Content>

      <Card.Footer>
        <div className="flex w-full items-center justify-between gap-3">
          <span className="text-xs text-muted">
            Top 5 makes up $1,928.25 of today&apos;s revenue
          </span>
          <Button
            size="sm"
            variant="ghost"
            onPress={handleViewAll}
          >
            View all products
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}

export default TopProductsSurface;
