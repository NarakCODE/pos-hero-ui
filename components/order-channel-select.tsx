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
  Wownow:
    "https://play-lh.googleusercontent.com/kj-22jffZNodTZmgSdwrn31er69HHFLNqNUSEy-LFl82-CsJBrU1qRDehSpER8PltIf8b_p2FtdsMuPbNc8olg",
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
