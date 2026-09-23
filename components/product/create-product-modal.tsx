"use client";

import { Button, Form, Modal, toast } from "@heroui/react";
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

import { ProductCreationFields } from "./product-creation-fields";
import {
  isProductCreationCategory,
  isProductCreationStatus,
  isProductVariationType,
  type ProductCreationFormData,
  type ProductMediaData,
  type ProductVariationDraft,
} from "./product-creation-types";

export type { ProductCreationFormData } from "./product-creation-types";

interface CreateProductModalProps {
  onCreate?: (data: ProductCreationFormData) => void;
}

const emptyMedia: ProductMediaData = {
  thumbnail: null,
  mediaGallery: [],
};

const createDefaultVariations = (): ProductVariationDraft[] => [
  { id: 0, type: "", value: "" },
];

export function CreateProductModal({ onCreate }: CreateProductModalProps) {
  const t = useTranslations("Product");
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<ProductMediaData>(emptyMedia);
  const [variations, setVariations] = useState<ProductVariationDraft[]>(
    createDefaultVariations,
  );

  const handleOpenChange = (nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen);

    if (!nextIsOpen) {
      setDescription("");
      setMedia(emptyMedia);
      setVariations(createDefaultVariations());
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const category = String(formData.get("category") ?? "");
    const status = String(formData.get("status") ?? "in-stock");
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
      name: String(formData.get("name") ?? "").trim(),
      sku: String(formData.get("sku") ?? "").trim(),
      description,
      price,
      compareAtPrice: compareAtPriceValue
        ? Number(compareAtPriceValue)
        : undefined,
      stock,
      thumbnail: media.thumbnail,
      mediaGallery: media.mediaGallery,
      category,
      status,
      variations: variations.flatMap(({ type, value }) =>
        isProductVariationType(type) && value.trim()
          ? [{ type, value: value.trim() }]
          : [],
      ),
    };

    onCreate?.(data);
    toast.success(t("productFormReady"), {
      description: t("productFormReadyDescription"),
    });
    handleOpenChange(false);
  };

  return (
    <Modal>
      <Button
        aria-label={t("addProduct")}
        isIconOnly
        type="button"
        variant="secondary"
        onPress={() => setIsOpen(true)}
      >
        <IconPlus aria-hidden="true" size={20} />
      </Button>

      <Modal.Backdrop
        isOpen={isOpen}
        variant="blur"
        onOpenChange={handleOpenChange}
      >
        <Modal.Container scroll="inside" size="cover">
          <Modal.Dialog
            aria-describedby="create-product-description"
            aria-labelledby="create-product-title"
          >
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="space-y-1">
                <Modal.Heading id="create-product-title">
                  {t("createProductTitle")}
                </Modal.Heading>
                <p
                  className="text-sm text-muted"
                  id="create-product-description"
                >
                  {t("createProductDescription")}
                </p>
              </div>
            </Modal.Header>

            {isOpen ? (
              <>
                <Modal.Body>
                  <Form
                    aria-labelledby="create-product-title"
                    id="create-product-form"
                    onSubmit={handleSubmit}
                  >
                    <ProductCreationFields
                      description={description}
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
                    <Button form="create-product-form" type="submit" fullWidth>
                      {t("createProductAction")}
                    </Button>
                  </div>
                </Modal.Footer>
              </>
            ) : null}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
