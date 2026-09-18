"use client";

import { Avatar, Label, ListBox, Select } from "@heroui/react";

export const orderChannels = ["Foodpanda", "GrabFood", "E-GetS", "Wownow"] as const;
export type OrderChannel = (typeof orderChannels)[number];

const orderChannelAvatarSrc =
  "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg";

const orderChannelFallbacks: Record<OrderChannel, string> = {
  "E-GetS": "EG",
  Foodpanda: "FO",
  GrabFood: "GR",
  Wownow: "WO",
};

interface OrderChannelSelectProps {
  value: OrderChannel;
  onChange: (value: OrderChannel) => void;
  label?: string;
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
      className={className}
      value={value}
      onChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onChange(nextValue as OrderChannel);
        }
      }}
      variant="secondary"
    >
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {orderChannels.map((channel) => (
            <ListBox.Item key={channel} id={channel} textValue={channel}>
              <Avatar size="sm">
                <Avatar.Image alt={`${channel} logo`} src={orderChannelAvatarSrc} />
                <Avatar.Fallback>{orderChannelFallbacks[channel]}</Avatar.Fallback>
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
