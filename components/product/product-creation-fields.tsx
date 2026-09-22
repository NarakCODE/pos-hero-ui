"use client";

import {
  Button,
  Description,
  FieldError,
  Input,
  Label,
  ListBox,
  NumberField,
  Select,
  TextField,
} from "@heroui/react";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { lazy, Suspense, useRef, useState } from "react";

import { ProductMediaFields } from "./product-media-fields";
import {
  isProductVariationType,
  productCategoryOptions,
  productStatusOptions,
  productVariationOptions,
  type ProductMediaData,
  type ProductVariationDraft,
} from "./product-creation-types";

const ProductDescriptionEditor = lazy(() =>
  import("./product-description-editor").then((module) => ({
    default: module.ProductDescriptionEditor,
  })),
);

interface ProductCreationFieldsProps {
  description: string;
  onDescriptionChange: (description: string) => void;
  onMediaChange: (media: ProductMediaData) => void;
  onVariationsChange: (variations: ProductVariationDraft[]) => void;
  variations: ProductVariationDraft[];
}

export function ProductCreationFields({
  description,
  onDescriptionChange,
  onMediaChange,
  onVariationsChange,
  variations,
}: ProductCreationFieldsProps) {
  const t = useTranslations("Product");
  const [selectedVariation, setSelectedVariation] = useState("");
  const [variationValue, setVariationValue] = useState("");
  const [variationStatus, setVariationStatus] = useState("");
  const nextVariationId = useRef(0);
  const normalizedVariationValue = variationValue.trim().toLowerCase();
  const selectedVariationOption = productVariationOptions.find(
    (option) => option.id === selectedVariation,
  );
  const selectedVariationLabel = selectedVariationOption
    ? t(selectedVariationOption.labelKey)
    : "";
  const isDuplicateVariation =
    isProductVariationType(selectedVariation) &&
    normalizedVariationValue.length > 0 &&
    variations.some(
      (variation) =>
        variation.type === selectedVariation &&
        variation.value.trim().toLowerCase() === normalizedVariationValue,
    );
  const canAddVariation =
    isProductVariationType(selectedVariation) &&
    normalizedVariationValue.length > 0 &&
    !isDuplicateVariation;
  const groupedVariations = productVariationOptions.flatMap((option) => {
    const options = variations.filter(
      (variation) => variation.type === option.id,
    );

    return options.length
      ? [{ id: option.id, label: t(option.labelKey), options }]
      : [];
  });

  const addVariation = () => {
    if (!canAddVariation || !isProductVariationType(selectedVariation)) {
      return;
    }

    onVariationsChange([
      ...variations,
      {
        id: nextVariationId.current++,
        type: selectedVariation,
        value: variationValue.trim(),
      },
    ]);
    setVariationStatus(
      t("variationAddedAnnouncement", {
        type: selectedVariationLabel,
        value: variationValue.trim(),
      }),
    );
    setVariationValue("");
  };

  const selectVariationType = (value: string | null) => {
    setSelectedVariation(value && isProductVariationType(value) ? value : "");
    setVariationValue("");
    setVariationStatus("");
  };

  const removeVariation = (id: number) => {
    const variation = variations.find((item) => item.id === id);
    const variationOption = productVariationOptions.find(
      (option) => option.id === variation?.type,
    );

    if (variation && variationOption) {
      setVariationStatus(
        t("variationRemovedAnnouncement", {
          type: t(variationOption.labelKey),
          value: variation.value,
        }),
      );
    }

    onVariationsChange(variations.filter((variation) => variation.id !== id));
  };

  return (
    <div className="grid w-full min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="min-w-0 space-y-10">
        {/* General information */}
        <section
          aria-labelledby="product-general-heading"
          className="space-y-5"
        >
          <SectionHeading
            id="product-general-heading"
            title={t("generalInformation")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              fullWidth
              isRequired
              minLength={2}
              name="name"
              validate={(value) =>
                value.trim().length < 2 ? t("productNameError") : null
              }
            >
              <Label>{t("productName")}</Label>

              <Input
                autoComplete="off"
                placeholder={t("productNamePlaceholder")}
                variant="secondary"
              />

              <FieldError />
            </TextField>

            <TextField
              fullWidth
              isRequired
              minLength={2}
              name="sku"
              validate={(value) =>
                value.trim().length < 2 ? t("skuError") : null
              }
            >
              <Label>{t("sku")}</Label>

              <Input
                autoComplete="off"
                className="font-mono"
                placeholder={t("skuPlaceholder")}
                spellCheck={false}
                variant="secondary"
              />

              <FieldError />
            </TextField>
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <Label>{t("productDescription")}</Label>
              <Description>{t("productDescriptionHelp")}</Description>
            </div>

            <Suspense
              fallback={
                <div
                  aria-live="polite"
                  className="flex min-h-44 items-center justify-center rounded-xl border border-border text-sm text-muted"
                  role="status"
                >
                  {t("editorLoading")}
                </div>
              }
            >
              <ProductDescriptionEditor
                editorLabel={t("productDescription")}
                onChange={onDescriptionChange}
                placeholder={t("productDescriptionPlaceholder")}
                toolbarLabel={t("descriptionToolbar")}
                toolbarLabels={{
                  bold: t("formatBold"),
                  blockquote: t("formatBlockquote"),
                  bulletList: t("formatBulletList"),
                  code: t("formatInlineCode"),
                  heading1: t("formatHeading1"),
                  heading2: t("formatHeading2"),
                  heading3: t("formatHeading3"),
                  italic: t("formatItalic"),
                  numberedList: t("formatNumberedList"),
                  strikethrough: t("formatStrikethrough"),
                  underline: t("formatUnderline"),
                }}
              />
            </Suspense>

            <input name="description" type="hidden" value={description} />
          </div>
        </section>

        {/* Pricing */}
        <section
          aria-labelledby="product-pricing-heading"
          className="space-y-5"
        >
          <SectionHeading
            id="product-pricing-heading"
            title={t("pricingAndInventory")}
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <NumberField
              fullWidth
              isRequired
              minValue={0}
              name="price"
              step={0.01}
              variant="secondary"
            >
              <Label>{t("priceUsd")}</Label>

              <NumberField.Group>
                <NumberField.Input placeholder="0.00" />
              </NumberField.Group>

              <FieldError />
            </NumberField>

            <NumberField
              fullWidth
              minValue={0}
              name="compareAtPrice"
              step={0.01}
              variant="secondary"
            >
              <Label>{t("compareAtPriceUsd")}</Label>

              <NumberField.Group>
                <NumberField.Input placeholder="0.00" />
              </NumberField.Group>

              <FieldError />
            </NumberField>

            <NumberField
              fullWidth
              isRequired
              minValue={0}
              name="stock"
              step={1}
              variant="secondary"
            >
              <Label>{t("stockQuantity")}</Label>

              <NumberField.Group>
                <NumberField.Input placeholder="0" />
              </NumberField.Group>

              <FieldError />
            </NumberField>
          </div>
        </section>

        {/* Variations */}
        <section
          aria-labelledby="product-variations-heading"
          className="space-y-5"
        >
          <div className="space-y-1">
            <SectionHeading
              id="product-variations-heading"
              title={t("variations")}
            />

            <p className="text-sm text-muted">{t("variationsDescription")}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_auto] sm:items-end">
            <Select
              fullWidth
              placeholder={t("variationTypePlaceholder")}
              value={selectedVariation || null}
              variant="secondary"
              onChange={(value) =>
                selectVariationType(value === null ? null : String(value))
              }
            >
              <Label>{t("variationType")}</Label>

              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>

              <Select.Popover placement="bottom start">
                <ListBox>
                  {productVariationOptions.map((option) => (
                    <ListBox.Item
                      id={option.id}
                      key={option.id}
                      textValue={t(option.labelKey)}
                    >
                      {t(option.labelKey)}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <TextField
              fullWidth
              isInvalid={isDuplicateVariation}
              value={variationValue}
              onChange={(value) => {
                setVariationValue(value);
                setVariationStatus("");
              }}
            >
              <Label>
                {selectedVariationOption
                  ? t("variationValueLabel", {
                      type: selectedVariationLabel,
                    })
                  : t("variationValueDefaultLabel")}
              </Label>

              <Input
                placeholder={t("variationValuePlaceholder")}
                variant="secondary"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addVariation();
                  }
                }}
              />

              <FieldError>{t("variationDuplicateError")}</FieldError>
            </TextField>

            <Button
              isDisabled={!canAddVariation}
              type="button"
              variant="secondary"
              onPress={addVariation}
            >
              <IconPlus aria-hidden="true" size={18} />
              {t("addVariationType")}
            </Button>
          </div>

          {groupedVariations.length ? (
            <div className="space-y-5">
              {groupedVariations.map((group) => {
                const headingId = `product-variation-group-${group.id}`;

                return (
                  <div className="space-y-2" key={group.id}>
                    <div className="flex items-center gap-2">
                      <h3
                        className="text-sm font-medium text-foreground"
                        id={headingId}
                      >
                        {group.label}
                      </h3>

                      <span className="text-xs text-muted">
                        {group.options.length}
                      </span>
                    </div>

                    <ul
                      aria-labelledby={headingId}
                      className="flex flex-wrap gap-2"
                    >
                      {group.options.map((variation) => (
                        <li
                          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-secondary py-1 ps-3 pe-1 text-sm"
                          key={variation.id}
                        >
                          <span>{variation.value}</span>

                          <Button
                            aria-label={t("removeVariation", {
                              type: group.label,
                              value: variation.value,
                            })}
                            isIconOnly
                            size="sm"
                            type="button"
                            variant="ghost"
                            onPress={() => removeVariation(variation.id)}
                          >
                            <IconX aria-hidden="true" size={16} />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center">
              <p className="text-sm text-muted">{t("variationsEmpty")}</p>
            </div>
          )}

          <p
            aria-atomic="true"
            aria-live="polite"
            className="sr-only"
            role="status"
          >
            {variationStatus}
          </p>
        </section>
      </div>

      {/* Sidebar */}
      <aside className="min-w-0 space-y-8">
        <ProductMediaFields onChange={onMediaChange} />

        <section
          aria-labelledby="product-organization-heading"
          className="space-y-5"
        >
          <SectionHeading
            id="product-organization-heading"
            title={t("organization")}
          />

          <div className="space-y-4">
            <Select
              fullWidth
              isRequired
              name="category"
              placeholder={t("categoryPlaceholder")}
              variant="secondary"
            >
              <Label>{t("category")}</Label>

              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>

              <Select.Popover placement="bottom start">
                <ListBox>
                  {productCategoryOptions.map((option) => (
                    <ListBox.Item
                      id={option.id}
                      key={option.id}
                      textValue={t(option.labelKey)}
                    >
                      {t(option.labelKey)}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Select
              fullWidth
              name="status"
              defaultValue="in-stock"
              variant="secondary"
            >
              <Label>{t("productInventoryStatus")}</Label>

              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>

              <Select.Popover placement="bottom start">
                <ListBox>
                  {productStatusOptions.map((option) => (
                    <ListBox.Item
                      id={option.id}
                      key={option.id}
                      textValue={t(option.labelKey)}
                    >
                      {t(option.labelKey)}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </section>
      </aside>
    </div>
  );
}

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <h2 className="text-base font-semibold text-foreground" id={id}>
      {title}
    </h2>
  );
}
