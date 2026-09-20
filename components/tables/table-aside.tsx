"use client";

import { Button, Chip, ListBox, Select, Table } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { IconComponent } from "reicon-react";
import {
  ArrangeSquare2,
  ArrowSwapHorizontal,
  Bill,
  Edit2,
  Link2,
  ProfileAdd,
  ReceiptAdd,
} from "reicon-react";

type TableAsideAction =
  | "editOrder"
  | "payRequest"
  | "addGuest"
  | "addBill"
  | "mergeBill"
  | "splitBill"
  | "mergeTable"
  | "moveTable";

type TableOrderChannel = "dineIn" | "takeAway" | "foodpanda";

interface TableAsideItem {
  id: string;
  nameKey: string;
  detailKey: string;
  price: string;
  quantity: number;
  amount: string;
  isAddon?: boolean;
}

const tableOrderItems: TableAsideItem[] = [
  {
    id: "bubble-oolong",
    nameKey: "asideBubbleOolong",
    detailKey: "asideBubbleOolongDetail",
    price: "$3.75",
    quantity: 2,
    amount: "$7.50",
  },
  {
    id: "black-tea-macchiato",
    nameKey: "asideBlackTeaMacchiato",
    detailKey: "asideBlackTeaMacchiatoDetail",
    price: "$4.50",
    quantity: 3,
    amount: "$13.50",
  },
  {
    id: "grass-jelly",
    nameKey: "asideGrassJelly",
    detailKey: "asideGrassJellyDetail",
    price: "$0.75",
    quantity: 2,
    amount: "$1.50",
    isAddon: true,
  },
];

const channelOptions: ReadonlyArray<{
  id: TableOrderChannel;
  labelKey: string;
}> = [
  { id: "dineIn", labelKey: "asideDineIn" },
  { id: "takeAway", labelKey: "asideTakeAway" },
  { id: "foodpanda", labelKey: "asideFoodpanda" },
];

const primaryActions: ReadonlyArray<{
  id: TableAsideAction;
  icon: IconComponent;
  labelKey: string;
}> = [
  { id: "editOrder", icon: Edit2, labelKey: "asideEditOrder" },
  { id: "payRequest", icon: Bill, labelKey: "asidePayRequest" },
  { id: "addGuest", icon: ProfileAdd, labelKey: "asideAddGuest" },
];

const billingActions: ReadonlyArray<{
  id: TableAsideAction;
  icon: IconComponent;
  labelKey: string;
}> = [
  { id: "addBill", icon: ReceiptAdd, labelKey: "asideAddBill" },
  { id: "mergeBill", icon: Link2, labelKey: "asideMergeBill" },
  { id: "splitBill", icon: ArrangeSquare2, labelKey: "asideSplitBill" },
];

const tableActions: ReadonlyArray<{
  id: TableAsideAction;
  icon: IconComponent;
  labelKey: string;
}> = [
  { id: "mergeTable", icon: ArrangeSquare2, labelKey: "asideMergeTable" },
  {
    id: "moveTable",
    icon: ArrowSwapHorizontal,
    labelKey: "asideMoveTable",
  },
];

export function TableAside() {
  const t = useTranslations("SalesMenu");
  const [channel, setChannel] = useState<TableOrderChannel>("dineIn");
  const [activeAction, setActiveAction] = useState<TableAsideAction | null>(
    null,
  );
  const itemCount = tableOrderItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleAction = (action: TableAsideAction) => {
    setActiveAction(action);
  };

  return (
    <section
      aria-labelledby="table-aside-title"
      className="flex h-full min-h-0 flex-col overflow-hidden bg-background"
    >
      <header className="shrink-0 px-[var(--pos-content-padding)] pb-4 pt-[var(--pos-content-padding)]">
        <h2 id="table-aside-title" className="sr-only">
          {t("pages.table.asideAriaLabel")}
        </h2>

        <div className="flex items-start justify-between gap-4">
          <div className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-3">
            <MetadataItem
              label={t("pages.table.asideTableTicket")}
              value="Table02/05"
            />
            <MetadataItem
              label={t("pages.table.asideSequence")}
              value="155"
            />
          </div>

          <div className="flex min-w-0 max-w-[52%] flex-col items-end gap-2">
            <Chip color="warning" size="sm" variant="soft">
              {t("pages.table.asideStatus")}: {t("pages.table.asideInProgress")}
            </Chip>

            <div className="flex min-w-0 items-center gap-1 text-xs">
              <span className="shrink-0 text-muted">
                {t("pages.table.asideOrderChannel")}:
              </span>
              <Select
                aria-label={t("pages.table.asideOrderChannel")}
                className="min-w-0 w-[6.75rem]"
                value={channel}
                variant="secondary"
                onChange={(nextValue) => {
                  if (typeof nextValue === "string") {
                    setChannel(nextValue as TableOrderChannel);
                  }
                }}
              >
                <Select.Trigger className="h-8 min-h-8 w-full justify-start ps-2 pe-6 text-xs font-medium">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover placement="bottom end">
                  <ListBox>
                    {channelOptions.map((option) => (
                      <ListBox.Item
                        key={option.id}
                        id={option.id}
                        textValue={t(`pages.table.${option.labelKey}`)}
                      >
                        {t(`pages.table.${option.labelKey}`)}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)]">
        <section
          aria-labelledby="table-aside-items-title"
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_4rem_3rem_5rem] gap-2 rounded-t-xl bg-surface-secondary/60 px-2 py-2.5 text-xs font-semibold text-muted">
            <h3 id="table-aside-items-title">
              {t("pages.table.asideProductCount", { count: itemCount })}
            </h3>
            <span className="text-end">{t("pages.table.asidePrice")}</span>
            <span className="text-center">
              {t("pages.table.asideQuantity")}
            </span>
            <span className="text-end">{t("pages.table.asideAmount")}</span>
          </div>

          <Table className="min-h-0 flex-1" variant="secondary">
            <Table.ScrollContainer className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
              <Table.Content
                aria-label={t("pages.table.asideItemsAriaLabel")}
                className="w-full min-w-[20rem] text-xs"
              >
                <Table.Header className="sr-only">
                  <Table.Column isRowHeader>
                    {t("pages.table.asideProduct")}
                  </Table.Column>
                  <Table.Column>{t("pages.table.asidePrice")}</Table.Column>
                  <Table.Column>{t("pages.table.asideQuantity")}</Table.Column>
                  <Table.Column>{t("pages.table.asideAmount")}</Table.Column>
                </Table.Header>
                <Table.Body>
                  {tableOrderItems.map((item) => (
                    <Table.Row
                      key={item.id}
                      className="[&_.table__cell]:border-0"
                    >
                      <Table.Cell className="align-top">
                        <div
                          className={`min-w-0 py-2 ${
                            item.isAddon ? "ps-3" : ""
                          }`}
                        >
                          <p
                            className={`leading-5 ${
                              item.isAddon
                                ? "font-medium text-accent"
                                : "font-semibold text-foreground"
                            }`}
                          >
                            {item.isAddon ? "+ " : ""}
                            {t(`pages.table.${item.nameKey}`)}
                          </p>
                          <p className="leading-4 text-[11px] text-muted">
                            {t(`pages.table.${item.detailKey}`)}
                          </p>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="align-top text-end">
                        <span className="block py-2 tabular-nums text-muted">
                          {item.price}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-top text-center">
                        <span className="block py-2 tabular-nums text-foreground">
                          {item.quantity}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-top text-end">
                        <span className="block py-2 font-medium tabular-nums text-foreground">
                          {item.amount}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </section>

        <section
          aria-labelledby="table-aside-remark-title"
          className="mt-3 shrink-0 rounded-xl bg-surface-secondary/60 px-3 py-3"
        >
          <h3
            id="table-aside-remark-title"
            className="text-xs font-semibold text-foreground"
          >
            {t("pages.table.asideRemark")}
          </h3>
          <p className="mt-1 text-sm leading-5 text-muted">
            {t("pages.table.asideRemarkText")}
          </p>
        </section>

        <section
          aria-labelledby="table-aside-payment-title"
          className="mt-3 grid shrink-0 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-4 border-y border-border/70 py-3"
        >
          <div className="min-w-0">
            <h3
              id="table-aside-payment-title"
              className="mb-2 text-xs font-semibold text-foreground"
            >
              {t("pages.table.asidePaymentDetails")}
            </h3>
            <div className="flex flex-col gap-2">
              <SummaryRow
                label={t("pages.table.asidePayment")}
                value={t("pages.table.asideCash")}
              />
              <SummaryRow
                label={t("pages.table.asideReceived")}
                value="៛100,000.00"
              />
              <SummaryRow
                label={t("pages.table.asideChange")}
                value="$2.50 / ៛10,000.00"
              />
            </div>
          </div>

          <div className="min-w-0 border-s border-border/70 ps-4">
            <h3 className="mb-2 text-xs font-semibold text-foreground">
              {t("pages.table.asideTotals")}
            </h3>
            <div className="flex flex-col gap-2">
              <SummaryRow
                label={t("pages.table.asideSubtotal")}
                value="$22.50"
              />
              <SummaryRow
                label={t("pages.table.asideDiscount")}
                value="0.00"
              />
              <div className="mt-1 flex items-end justify-between gap-3 border-t border-border/70 pt-2">
                <span className="text-base font-bold text-foreground">
                  {t("pages.table.asideTotal")}
                </span>
                <span className="text-end tabular-nums text-foreground">
                  <strong className="block text-lg font-bold tracking-tight">
                    $22.50
                  </strong>
                  <span className="block text-xs font-semibold text-muted">
                    ៛90,000.00
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-3 grid shrink-0 grid-cols-3 gap-2">
          {primaryActions.map((action) => (
            <ActionButton
              key={action.id}
              action={action}
              isActive={activeAction === action.id}
              onPress={handleAction}
              t={t}
            />
          ))}
        </div>

        <section
          aria-labelledby="table-aside-management-title"
          className="mt-3 shrink-0"
        >
          <h3
            id="table-aside-management-title"
            className="mb-2 text-xs font-semibold text-muted"
          >
            {t("pages.table.asideManagement")}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {billingActions.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                isActive={activeAction === action.id}
                onPress={handleAction}
                t={t}
              />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {tableActions.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                isActive={activeAction === action.id}
                onPress={handleAction}
                t={t}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function ActionButton({
  action,
  isActive,
  onPress,
  t,
}: {
  action: {
    id: TableAsideAction;
    icon: IconComponent;
    labelKey: string;
  };
  isActive: boolean;
  onPress: (action: TableAsideAction) => void;
  t: ReturnType<typeof useTranslations<"SalesMenu">>;
}) {
  const Icon = action.icon;

  return (
    <Button
      aria-pressed={isActive}
      fullWidth
      size="lg"
      type="button"
      variant="secondary"
      onPress={() => onPress(action.id)}
    >
      <Icon aria-hidden="true" size={16} />
      <span className="truncate">{t(`pages.table.${action.labelKey}`)}</span>
    </Button>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium tracking-wider text-muted">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 text-xs">
      <span className="min-w-0 text-muted">{label}</span>
      <span className="max-w-[68%] text-end font-medium tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}
