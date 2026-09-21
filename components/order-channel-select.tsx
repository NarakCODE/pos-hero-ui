"use client";

import { Avatar, Label, ListBox, Select } from "@heroui/react";

export const orderChannels = [
  "Foodpanda",
  "GrabFood",
  "E-GetS",
  "Wownow",
] as const;

export type OrderChannel = (typeof orderChannels)[number];

export const defaultOrderChannelAvatarSrc =
  "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg";
export const orderChannelAvatarSrcByChannel: Record<string, string> = {
  "E-GetS": "https://www.e-gets.com/images/common/logo-egets.png",
  Foodpanda: "https://img.icons8.com/color/1200/foodpanda.jpg",
  GrabFood:
    "https://toppng.com/uploads/preview/grab-logo-11550724942n0ghhh9o1u.png",
  Wownow:
    "https://media.licdn.com/dms/image/v2/D560BAQEOZJiZ1czI1g/company-logo_200_200/company-logo_200_200/0/1681972958993/u_life_kh_super_app_co_ltd_logo?e=2147483647&v=beta&t=Vx4Yylwr809AZKtHMDS6Ib89Gj0cQ0o3Y_NTz5nWxB4",
};

export const orderChannelFallbacks: Record<string, string> = {
  "E-GetS": "EG",
  Foodpanda: "FO",
  GrabFood: "GR",
  Wownow: "WO",
};

export const getOrderChannelAvatarSrc = (
  channel: string,
): string | undefined => {
  const normalized = channel.toLowerCase();
  if (normalized === "foodpanda")
    return orderChannelAvatarSrcByChannel.Foodpanda;
  if (normalized === "grabfood") return orderChannelAvatarSrcByChannel.GrabFood;
  if (normalized === "wownow") return orderChannelAvatarSrcByChannel.Wownow;
  if (normalized === "e-gets" || normalized === "egets")
    return orderChannelAvatarSrcByChannel["E-GetS"];
  return orderChannelAvatarSrcByChannel[channel];
};

interface OrderChannelSelectProps {
  value: OrderChannel;
  onChange: (value: OrderChannel) => void;
  label?: string | null;
  className?: string;
  size?: "sm" | "md";
  variant?: "primary" | "secondary";
}

export function OrderChannelSelect({
  className = "w-36",
  label = "Order Channel",
  onChange,
  size = "sm",
  value,
  variant = "secondary",
}: OrderChannelSelectProps) {
  const isSm = size === "sm";

  return (
    <Select
      aria-label={label ?? "Order channel"}
      className={className}
      value={value}
      variant={variant}
      onChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onChange(nextValue as OrderChannel);
        }
      }}
    >
      {label ? (
        <Label className="text-xs font-semibold text-muted">{label}</Label>
      ) : null}
      <Select.Trigger
        className={
          isSm
            ? "h-8 min-h-8 w-full justify-start ps-2 pe-7 text-xs font-medium sm:text-xs"
            : "h-9 min-h-9 w-full justify-start ps-2.5 pe-7 text-sm font-medium"
        }
      >
        <Select.Value className={isSm ? "text-xs" : "text-sm"}>
          {({ defaultChildren, isPlaceholder, state }) => {
            if (isPlaceholder && state.selectedItems.length === 0 && !value) {
              return defaultChildren;
            }

            const selectedChannel =
              orderChannels.find(
                (channel) => channel === state.selectedItems[0]?.key,
              ) ?? orderChannels.find((channel) => channel === value);

            if (!selectedChannel) {
              return defaultChildren;
            }

            return (
              <div className="flex min-w-0 items-center gap-1.5">
                <Avatar
                  className={
                    isSm
                      ? "size-5 shrink-0 rounded-full"
                      : "size-6 shrink-0 rounded-full"
                  }
                  size="sm"
                >
                  <Avatar.Image
                    alt={`${selectedChannel} logo`}
                    className="object-contain"
                    src={getOrderChannelAvatarSrc(selectedChannel)}
                  />
                  <Avatar.Fallback
                    className={
                      isSm
                        ? "text-[10px] font-semibold"
                        : "text-xs font-semibold"
                    }
                  >
                    {orderChannelFallbacks[selectedChannel] ??
                      selectedChannel.slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>
                <span className="truncate">{selectedChannel}</span>
              </div>
            );
          }}
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="min-w-[160px]" placement="bottom start">
        <ListBox>
          {orderChannels.map((channel) => (
            <ListBox.Item
              className={isSm ? "py-1.5 text-xs" : "py-2 text-sm"}
              id={channel}
              key={channel}
              textValue={channel}
            >
              <div className="flex min-w-0 items-center gap-2">
                <Avatar
                  className={
                    isSm
                      ? "size-5 shrink-0 rounded-full"
                      : "size-6 shrink-0 rounded-full"
                  }
                  size="sm"
                >
                  <Avatar.Image
                    alt={`${channel} logo`}
                    className="object-contain"
                    src={getOrderChannelAvatarSrc(channel)}
                  />
                  <Avatar.Fallback
                    className={
                      isSm
                        ? "text-[10px] font-semibold"
                        : "text-xs font-semibold"
                    }
                  >
                    {orderChannelFallbacks[channel] ??
                      channel.slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>
                <span className="truncate">{channel}</span>
              </div>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
