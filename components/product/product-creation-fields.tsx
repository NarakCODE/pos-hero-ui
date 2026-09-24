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
  Switch,
  TextField,
} from "@heroui/react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { lazy, Suspense, useRef, useState } from "react";

import { ProductMediaFields } from "./product-media-fields";
import {
  isProductVariationType,
  productCategoryOptions,
  productStatusOptions,
  productVariationOptions,
  type ProductFieldInitialValues,
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
  initialValues?: ProductFieldInitialValues;
}

export function ProductCreationFields({
  description,
  initialValues,
  onDescriptionChange,
  onMediaChange,
  onVariationsChange,
  variations,
}: ProductCreationFieldsProps) {
  const t = useTranslations("Product");
  const [variationStatus, setVariationStatus] = useState("");
  const nextVariationId = useRef(
    variations.reduce(
      (nextId, variation) => Math.max(nextId, variation.id + 1),
      0,
    ),
  );

  const addVariation = () => {
    onVariationsChange([
      ...variations,
      {
        id: nextVariationId.current++,
        type: "",
        value: "",
      },
    ]);
    setVariationStatus(t("variationAddedAnnouncement"));
  };

  const updateVariationType = (id: number, value: string | null) => {
    if (!value || !isProductVariationType(value)) {
      return;
    }

    onVariationsChange(
      variations.map((variation) =>
        variation.id === id ? { ...variation, type: value } : variation,
      ),
    );
    setVariationStatus("");
  };

  const updateVariationValue = (id: number, value: string) => {
    onVariationsChange(
      variations.map((variation) =>
        variation.id === id ? { ...variation, value } : variation,
      ),
    );
    setVariationStatus("");
  };

  const removeVariation = (id: number) => {
    const variation = variations.find((item) => item.id === id);
    const variationOption = productVariationOptions.find(
      (option) => option.id === variation?.type,
    );

    if (variation) {
      setVariationStatus(
        t("variationRemovedAnnouncement", {
          type: variationOption
            ? t(variationOption.labelKey)
            : t("variationType"),
          value: variation.value || t("variationValueDefaultLabel"),
        }),
      );
    }

    onVariationsChange(variations.filter((variation) => variation.id !== id));
  };

  return (
    <div className="grid w-full min-w-0 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
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
              defaultValue={initialValues?.name}
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
              defaultValue={initialValues?.sku}
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
                placeholder={t("skuPlaceholder")}
                spellCheck={false}
                variant="secondary"
              />

              <FieldError />
            </TextField>
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
              defaultValue={initialValues?.price}
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
              defaultValue={initialValues?.compareAtPrice}
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
              defaultValue={initialValues?.stock}
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
          className="min-w-0 space-y-4"
        >
          <div className="space-y-1">
            <h2
              className="text-base font-semibold text-foreground"
              id="product-variations-heading"
            >
              {t("variations")}
            </h2>
            <p className="text-sm leading-5 text-muted">
              {t("variationsDescription")}
            </p>
          </div>

          <div className="space-y-3">
            {variations.map((variation) => {
              const variationOption = productVariationOptions.find(
                (option) => option.id === variation.type,
              );
              const variationTypeLabel = variationOption
                ? t(variationOption.labelKey)
                : t("variationType");
              const normalizedValue = variation.value.trim().toLowerCase();
              const isVariationStarted =
                isProductVariationType(variation.type) ||
                normalizedValue.length > 0;
              const isDuplicateVariation =
                isProductVariationType(variation.type) &&
                normalizedValue.length > 0 &&
                variations.some(
                  (candidate) =>
                    candidate.id !== variation.id &&
                    candidate.type === variation.type &&
                    candidate.value.trim().toLowerCase() === normalizedValue,
                );

              return (
                <div
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_auto] sm:items-start"
                  key={variation.id}
                >
                  <Select
                    className="col-span-2 min-w-0 sm:col-span-1"
                    fullWidth
                    isRequired={isVariationStarted}
                    name={`variations.${variation.id}.type`}
                    placeholder={t("variationTypePlaceholder")}
                    value={variation.type || null}
                    variant="secondary"
                    onChange={(value) =>
                      updateVariationType(
                        variation.id,
                        value === null ? null : String(value),
                      )
                    }
                  >
                    <Label className="sr-only">{t("variationType")}</Label>
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
                    <FieldError />
                  </Select>

                  <TextField
                    className="min-w-0"
                    fullWidth
                    isInvalid={isDuplicateVariation}
                    isRequired={isVariationStarted}
                    name={`variations.${variation.id}.value`}
                    validate={(value) => {
                      if (!value.trim() && isVariationStarted) {
                        return t("variationValueRequired");
                      }

                      if (isDuplicateVariation) {
                        return t("variationDuplicateError");
                      }

                      return true;
                    }}
                    value={variation.value}
                    onChange={(value) =>
                      updateVariationValue(variation.id, value)
                    }
                  >
                    <Label className="sr-only">
                      {t("variationValueLabel", {
                        type: variationTypeLabel,
                      })}
                    </Label>
                    <Input
                      placeholder={t("variationValuePlaceholder")}
                      variant="secondary"
                    />
                    <FieldError />
                  </TextField>

                  <Button
                    aria-label={t("removeVariation", {
                      type: variationTypeLabel,
                      value: variation.value || t("variationValueDefaultLabel"),
                    })}
                    className="col-start-2 justify-self-end sm:col-start-auto"
                    isIconOnly
                    size="md"
                    type="button"
                    variant="danger-soft"
                    onPress={() => removeVariation(variation.id)}
                  >
                    <IconTrash aria-hidden="true" size={18} />
                  </Button>
                </div>
              );
            })}

            <Button
              className="w-full justify-center"
              fullWidth
              type="button"
              variant="secondary"
              onPress={addVariation}
            >
              <IconPlus aria-hidden="true" size={18} />
              {t("addVariationType")}
            </Button>

            <p
              aria-atomic="true"
              aria-live="polite"
              className="sr-only"
              role="status"
            >
              {variationStatus}
            </p>
          </div>
        </section>

        {/* Description */}
        <section
          aria-labelledby="product-description-heading"
          className="min-w-0 space-y-2"
        >
          <SectionHeading
            id="product-description-heading"
            title={t("productDescription")}
          />
          <Description>{t("productDescriptionHelp")}</Description>

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
              value={description}
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
        </section>
      </div>

      {/* Sidebar */}
      <aside className="min-w-0 space-y-8">
        <ProductMediaFields
          initialThumbnailUrl={initialValues?.initialThumbnailUrl}
          onChange={onMediaChange}
        />

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
              defaultValue={initialValues?.category}
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
              defaultValue={initialValues?.status ?? "in-stock"}
              fullWidth
              name="status"
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

            <div className="w-full rounded-xl border border-border/70 bg-surface-secondary/50 p-3">
              <Switch
                className="w-full"
                defaultSelected={initialValues?.available ?? true}
                name="available"
                value="true"
              >
                <Switch.Content className="flex w-full items-center justify-between">
                  <div className="min-w-0 space-y-1">
                    <Label>
                      {t("productAvailability")}
                    </Label>
                    <Description>
                      {t("productAvailabilityDescription")}
                    </Description>
                  </div>
                  <Switch.Control className="shrink-0">
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Content>
              </Switch>
            </div>
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
