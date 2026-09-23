"use client";

import { Button, Form, Modal, toast } from "@heroui/react";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { defaultLocale, isLocale, type Locale } from "@/config/i18n";
import type { Product } from "@/app/(protected)/sales/data";
import { ProductCreationFields } from "./product-creation-fields";
import {
  isProductCreationCategory,
  isProductCreationStatus,
  isProductVariationType,
  type ProductCreationCategory,
  type ProductCreationFormData,
  type ProductFieldInitialValues,
  type ProductMediaData,
  type ProductVariationDraft,
} from "./product-creation-types";

export type { ProductCreationFormData } from "./product-creation-types";

export type ProductFormMode = "create" | "edit";

export interface ProductFormModalProps {
  mode?: ProductFormMode;
  initialData?: Partial<ProductCreationFormData> | null;
  product?: Product | null;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  trigger?: ReactNode;
  onSubmit?: (data: ProductCreationFormData) => void;
  onCreate?: (data: ProductCreationFormData) => void;
  onEdit?: (data: ProductCreationFormData) => void;
}

const emptyMedia: ProductMediaData = {
  thumbnail: null,
  mediaGallery: [],
};

const createDefaultVariations = (): ProductVariationDraft[] => [
  { id: 0, type: "", value: "" },
];

function resolveInitialValues(
  product?: Product | null,
  initialData?: Partial<ProductCreationFormData> | null,
  locale?: Locale,
): ProductFieldInitialValues {
  if (initialData) {
    return {
      name: initialData.name,
      sku: initialData.sku,
      price: initialData.price,
      compareAtPrice: initialData.compareAtPrice,
      stock: initialData.stock,
      available: initialData.available ?? true,
      category: initialData.category,
      status: initialData.status,
      initialThumbnailUrl: initialData.thumbnailUrl ?? null,
      description: initialData.description,
      variations: initialData.variations?.map((variation, index) => ({
        id: index,
        type: variation.type,
        value: variation.value,
      })),
    };
  }

  if (product) {
    const activeLocale = locale ?? defaultLocale;
    const name =
      typeof product.name === "object"
        ? (product.name[activeLocale] ?? product.name.en ?? "")
        : String(product.name ?? "");
    const description = product.description
      ? (product.description[activeLocale] ?? product.description.en ?? "")
      : "";
    const category: ProductCreationCategory = isProductCreationCategory(
      product.category,
    )
      ? product.category
      : "Electronics";

    return {
      name,
      sku: product.sku ?? product.id.slice(0, 8).toUpperCase(),
      price: product.price,
      stock: product.stock ?? (product.inStock === false ? 0 : 50),
      available: product.status !== "inactive",
      category,
      status:
        product.stock === 0 ||
        product.inStock === false
          ? "out-of-stock"
          : "in-stock",
      initialThumbnailUrl: product.image ?? null,
      description,
      variations: createDefaultVariations(),
    };
  }

  return {
    category: "Electronics",
    status: "in-stock",
    available: true,
    variations: createDefaultVariations(),
  };
}

export function ProductFormModal({
  initialData,
  isOpen: controlledIsOpen,
  mode: propMode,
  onCreate,
  onEdit,
  onOpenChange: controlledOnOpenChange,
  onSubmit,
  product,
  trigger,
}: ProductFormModalProps) {
  const t = useTranslations("Product");
  const currentLocale = useLocale();
  const locale: Locale = isLocale(currentLocale)
    ? currentLocale
    : defaultLocale;

  const effectiveMode: ProductFormMode =
    propMode ?? (initialData || product ? "edit" : "create");
  const isEditMode = effectiveMode === "edit";

  const isControlled = controlledIsOpen !== undefined;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const initialValues = useMemo(
    () => resolveInitialValues(product, initialData, locale),
    [product, initialData, locale],
  );

  const handleOpenChange = (nextIsOpen: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(nextIsOpen);
    }
    controlledOnOpenChange?.(nextIsOpen);
  };

  const handleFormSubmit = (data: ProductCreationFormData) => {
    onSubmit?.(data);

    if (isEditMode) {
      onEdit?.(data);
      toast.success(t("productUpdated"), {
        description: t("productUpdatedDescription"),
      });
    } else {
      onCreate?.(data);
      toast.success(t("productFormReady"), {
        description: t("productFormReadyDescription"),
      });
    }

    handleOpenChange(false);
  };

  const renderTrigger = () => {
    if (trigger !== undefined) {
      if (trigger === null) {
        return null;
      }
      return (
        <span
          className="contents"
          onClick={() => handleOpenChange(true)}
          role="presentation"
        >
          {trigger}
        </span>
      );
    }

    if (isEditMode) {
      return (
        <Button
          aria-label={t("editProduct")}
          isIconOnly
          size="sm"
          type="button"
          variant="secondary"
          onPress={() => handleOpenChange(true)}
        >
          <IconEdit aria-hidden="true" size={18} />
        </Button>
      );
    }

    return (
      <Button
        aria-label={t("addProduct")}
        isIconOnly
        type="button"
        variant="secondary"
        onPress={() => handleOpenChange(true)}
      >
        <IconPlus aria-hidden="true" size={20} />
      </Button>
    );
  };

  return (
    <Modal>
      {renderTrigger()}

      <Modal.Backdrop
        isOpen={isOpen}
        variant="blur"
        onOpenChange={handleOpenChange}
      >
        <Modal.Container scroll="inside" size="cover">
          <Modal.Dialog
            aria-describedby="product-form-description"
            aria-labelledby="product-form-title"
          >
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="space-y-1">
                <Modal.Heading id="product-form-title">
                  {isEditMode ? t("editProductTitle") : t("createProductTitle")}
                </Modal.Heading>
                <p
                  className="text-sm text-muted"
                  id="product-form-description"
                >
                  {isEditMode
                    ? t("editProductDescription")
                    : t("createProductDescription")}
                </p>
              </div>
            </Modal.Header>

            {isOpen ? (
              <ProductFormContent
                initialValues={initialValues}
                isEditMode={isEditMode}
                productId={product?.id ?? initialData?.id}
                onSubmit={handleFormSubmit}
              />
            ) : null}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function ProductFormContent({
  initialValues,
  isEditMode,
  productId,
  onSubmit,
}: {
  initialValues: ProductFieldInitialValues;
  isEditMode: boolean;
  productId?: string;
  onSubmit: (data: ProductCreationFormData) => void;
}) {
  const t = useTranslations("Product");
  const [description, setDescription] = useState(
    () => initialValues.description ?? "",
  );
  const [media, setMedia] = useState<ProductMediaData>(emptyMedia);
  const [variations, setVariations] = useState<ProductVariationDraft[]>(
    () => initialValues.variations ?? createDefaultVariations(),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const category = String(formData.get("category") ?? "");
    const status = String(formData.get("status") ?? "in-stock");
    const available = formData.get("available") === "true";
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const compareAtPriceValue = String(
      formData.get("compareAtPrice") ?? "",
    ).trim();

    if (
      !isProductCreationCategory(category) ||
      !isProductCreationStatus(status) ||
      !Number.isFinite(price) ||
      !Number.isFinite(stock)
    ) {
      return;
    }

    const data: ProductCreationFormData = {
      id: productId,
      name: String(formData.get("name") ?? "").trim(),
      sku: String(formData.get("sku") ?? "").trim(),
      description,
      price,
      compareAtPrice: compareAtPriceValue
        ? Number(compareAtPriceValue)
        : undefined,
      stock,
      available,
      thumbnail: media.thumbnail,
      thumbnailUrl: media.thumbnail
        ? null
        : (initialValues.initialThumbnailUrl ?? null),
      mediaGallery: media.mediaGallery,
      category,
      status,
      variations: variations.flatMap(({ type, value }) =>
        isProductVariationType(type) && value.trim()
          ? [{ type, value: value.trim() }]
          : [],
      ),
    };

    onSubmit(data);
  };

  return (
    <>
      <Modal.Body>
        <Form
          aria-labelledby="product-form-title"
          id="product-form"
          onSubmit={handleSubmit}
        >
          <ProductCreationFields
            description={description}
            initialValues={initialValues}
            onDescriptionChange={setDescription}
            onMediaChange={setMedia}
            onVariationsChange={setVariations}
            variations={variations}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            slot="close"
            type="button"
            variant="secondary"
            fullWidth
          >
            {t("cancel")}
          </Button>
          <Button form="product-form" type="submit" fullWidth>
            {isEditMode ? t("editProductAction") : t("createProductAction")}
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
}
