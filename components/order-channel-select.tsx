"use client";

import { Avatar, Label, ListBox, Select } from "@heroui/react";

export const orderChannels = [
  "Foodpanda",
  "GrabFood",
  "E-GetS",
  "Wownow",
] as const;

export type OrderChannel = (typeof orderChannels)[number];

const defaultOrderChannelAvatarSrc =
  "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg";
const orderChannelAvatarSrcByChannel: Partial<Record<OrderChannel, string>> = {
  "E-GetS":
    "https://www.e-gets.com/images/common/logo-egets.png",
  Foodpanda: "https://img.icons8.com/color/1200/foodpanda.jpg",
  GrabFood:
    "https://toppng.com/uploads/preview/grab-logo-11550724942n0ghhh9o1u.png",
  Wownow:
    "https://media.licdn.com/dms/image/v2/D560BAQEOZJiZ1czI1g/company-logo_200_200/company-logo_200_200/0/1681972958993/u_life_kh_super_app_co_ltd_logo?e=2147483647&v=beta&t=Vx4Yylwr809AZKtHMDS6Ib89Gj0cQ0o3Y_NTz5nWxB4",
};

const orderChannelFallbacks: Record<OrderChannel, string> = {
  "E-GetS": "EG",
  Foodpanda: "FO",
  GrabFood: "GR",
  Wownow: "WO",
};

const getOrderChannelAvatarSrc = (channel: OrderChannel) =>
  orderChannelAvatarSrcByChannel[channel] ?? defaultOrderChannelAvatarSrc;

interface OrderChannelSelectProps {
  value: OrderChannel;
  onChange: (value: OrderChannel) => void;
  label?: string | null;
  className?: string;
}

export function OrderChannelSelect({
  className = "w-full",
  label = "Order Channel",
  onChange,
  value,
}: OrderChannelSelectProps) {
  return (
    <Select
      aria-label={label ?? "Order channel"}
      className={className}
      value={value}
      onChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onChange(nextValue as OrderChannel);
        }
      }}
    >
      {label ? <Label>{label}</Label> : null}
      <Select.Trigger>
        <Select.Value>
          {({ defaultChildren, isPlaceholder, state }) => {
            if (isPlaceholder || state.selectedItems.length === 0) {
              return defaultChildren;
            }

            const selectedChannel = orderChannels.find(
              (channel) => channel === state.selectedItems[0]?.key,
            );

            if (!selectedChannel) {
              return defaultChildren;
            }

            return (
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <Avatar.Image
                    alt={`${selectedChannel} logo`}
                    className="object-contain"
                    src={getOrderChannelAvatarSrc(selectedChannel)}
                  />
                  <Avatar.Fallback>
                    {orderChannelFallbacks[selectedChannel]}
                  </Avatar.Fallback>
                </Avatar>
                <span>{selectedChannel}</span>
              </div>
            );
          }}
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {orderChannels.map((channel) => (
            <ListBox.Item key={channel} id={channel} textValue={channel}>
              <Avatar size="sm">
                <Avatar.Image
                  alt={`${channel} logo`}
                  className="object-contain"
                  src={getOrderChannelAvatarSrc(channel)}
                />
                <Avatar.Fallback>
                  {orderChannelFallbacks[channel]}
                </Avatar.Fallback>
              </Avatar>
              <span>{channel}</span>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
