"use client";

import { Button, Description, Label } from "@heroui/react";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type DragEvent } from "react";

import type { ProductMediaData } from "./product-creation-types";

interface ProductMediaFieldsProps {
  onChange: (media: ProductMediaData) => void;
}

interface UploadedImage {
  file: File;
  previewUrl: string;
}

const imageAccept = "image/png,image/jpeg,image/gif,.png,.jpg,.jpeg,.gif";
const acceptedImageTypes = new Set(["image/png", "image/jpeg", "image/gif"]);
const maximumImageSize = 5 * 1024 * 1024;

export function ProductMediaFields({ onChange }: ProductMediaFieldsProps) {
  const t = useTranslations("Product");
  const [thumbnail, setThumbnail] = useState<UploadedImage | null>(null);
  const [gallery, setGallery] = useState<UploadedImage[]>([]);
  const [thumbnailError, setThumbnailError] = useState("");
  const [galleryError, setGalleryError] = useState("");
  const previewUrls = useRef(new Set<string>());

  useEffect(
    () => () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.current.clear();
    },
    [],
  );

  const createUploadedImage = (file: File): UploadedImage => {
    const previewUrl = URL.createObjectURL(file);
    previewUrls.current.add(previewUrl);

    return { file, previewUrl };
  };

  const releaseUploadedImage = (image: UploadedImage) => {
    URL.revokeObjectURL(image.previewUrl);
    previewUrls.current.delete(image.previewUrl);
  };

  const publishMedia = (
    nextThumbnail: UploadedImage | null,
    nextGallery: UploadedImage[],
  ) => {
    onChange({
      thumbnail: nextThumbnail?.file ?? null,
      mediaGallery: nextGallery.map((image) => image.file),
    });
  };

  const handleThumbnailFiles = (files: File[]) => {
    setThumbnailError("");
    const file = files[0];

    if (!file) {
      return;
    }

    const validationError = validateImage(file);

    if (validationError) {
      setThumbnailError(
        t(validationError === "type" ? "imageTypeError" : "imageSizeError"),
      );
      return;
    }

    if (thumbnail) {
      releaseUploadedImage(thumbnail);
    }

    const nextThumbnail = createUploadedImage(file);
    setThumbnail(nextThumbnail);
    publishMedia(nextThumbnail, gallery);
  };

  const handleGalleryFiles = (files: File[]) => {
    setGalleryError("");

    const validationError = files.map(validateImage).find(Boolean);

    if (validationError) {
      setGalleryError(
        t(validationError === "type" ? "imageTypeError" : "imageSizeError"),
      );
      return;
    }

    const availableSlots = Math.max(0, 10 - gallery.length);

    if (files.length > availableSlots) {
      setGalleryError(t("galleryLimitError"));
    }

    const newImages = files.slice(0, availableSlots).map(createUploadedImage);
    const nextGallery = [...gallery, ...newImages];

    setGallery(nextGallery);
    publishMedia(thumbnail, nextGallery);
  };

  const removeThumbnail = () => {
    if (!thumbnail) {
      return;
    }

    releaseUploadedImage(thumbnail);
    setThumbnail(null);
    publishMedia(null, gallery);
  };

  const removeGalleryImage = (index: number) => {
    const removedImage = gallery[index];

    if (!removedImage) {
      return;
    }

    releaseUploadedImage(removedImage);
    const nextGallery = gallery.filter((_, fileIndex) => fileIndex !== index);
    setGallery(nextGallery);
    publishMedia(thumbnail, nextGallery);
  };

  return (
    <section aria-labelledby="product-media-heading" className="space-y-5">
      <h2
        className="text-base font-semibold text-foreground"
        id="product-media-heading"
      >
        {t("mediaAndAssets")}
      </h2>

      <ImageUploadField
        accept={imageAccept}
        buttonLabel={t("browseImages")}
        description={t("thumbnailDescription")}
        error={thumbnailError}
        files={thumbnail ? [thumbnail] : []}
        inputId="file-upload-1"
        label={t("thumbnail")}
        multiple={false}
        onFilesSelected={handleThumbnailFiles}
        onRemove={removeThumbnail}
        uploadLabel={t("dropOrBrowse")}
      />

      <ImageUploadField
        accept={imageAccept}
        buttonLabel={t("browseImages")}
        description={t("mediaGalleryDescription")}
        error={galleryError}
        files={gallery}
        inputId="file-upload-10"
        label={t("mediaGallery")}
        multiple
        onFilesSelected={handleGalleryFiles}
        onRemove={removeGalleryImage}
        uploadLabel={t("dropOrBrowse")}
      />
      <Description>
        {t("mediaGalleryCount", { count: gallery.length })}
      </Description>
    </section>
  );
}

function ImageUploadField({
  accept,
  buttonLabel,
  description,
  error,
  files,
  inputId,
  label,
  multiple,
  onFilesSelected,
  onRemove,
  uploadLabel,
}: {
  accept: string;
  buttonLabel: string;
  description: string;
  error: string;
  files: UploadedImage[];
  inputId: string;
  label: string;
  multiple: boolean;
  onFilesSelected: (files: File[]) => void;
  onRemove: (index: number) => void;
  uploadLabel: string;
}) {
  const t = useTranslations("Product");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const descriptionId = `${inputId}-description`;
  const constraintsId = `${inputId}-constraints`;
  const errorId = `${inputId}-error`;

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onFilesSelected(Array.from(event.dataTransfer.files));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Description id={descriptionId}>{description}</Description>
      <p className="text-xs text-muted" id={constraintsId}>
        {t("uploadConstraints")}
      </p>
      <div
        className={`space-y-4 rounded-xl border border-dashed p-4 ${
          isDragging ? "border-accent bg-accent-soft" : "border-border"
        }`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={(event) => {
          if (event.currentTarget === event.target) {
            setIsDragging(false);
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          accept={accept}
          aria-describedby={`${descriptionId} ${constraintsId} ${errorId}`}
          aria-invalid={Boolean(error)}
          className="sr-only"
          id={inputId}
          multiple={multiple}
          ref={inputRef}
          tabIndex={-1}
          type="file"
          onChange={(event) => {
            onFilesSelected(Array.from(event.currentTarget.files ?? []));
            event.currentTarget.value = "";
          }}
        />
        {files.length ? (
          <div
            className={
              multiple
                ? "grid grid-cols-3 gap-3 sm:grid-cols-2 xl:grid-cols-3"
                : "grid grid-cols-[5rem_minmax(0,1fr)_auto] items-center gap-3"
            }
          >
            {files.map((image, index) => (
              <div
                className={multiple ? "relative space-y-2" : "contents"}
                key={`${image.file.name}-${image.file.size}-${image.file.lastModified}-${index}`}
              >
                <ImagePreview image={image} />
                {!multiple ? (
                  <p className="truncate text-sm text-foreground">
                    {image.file.name}
                  </p>
                ) : null}
                <Button
                  aria-label={t("removeImage", { name: image.file.name })}
                  isIconOnly
                  size="sm"
                  type="button"
                  variant="secondary"
                  onPress={() => onRemove(index)}
                >
                  <IconX aria-hidden="true" size={16} />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2 text-center">
            <IconPhoto aria-hidden="true" className="text-muted" size={24} />
            <p className="text-sm text-muted">{uploadLabel}</p>
          </div>
        )}
        <div className="flex">
          <Button
            type="button"
            variant="secondary"
            onPress={() => inputRef.current?.click()}
          >
            <IconUpload aria-hidden="true" size={18} />
            {buttonLabel}
          </Button>
        </div>
      </div>
      <p
        aria-live="polite"
        className="min-h-5 text-xs text-danger"
        id={errorId}
      >
        {error}
      </p>
    </div>
  );
}

function ImagePreview({ image }: { image: UploadedImage }) {
  return (
    <div
      aria-label={image.file.name}
      className="aspect-[4/3] rounded-lg bg-cover bg-center bg-default outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
      role="img"
      style={{ backgroundImage: `url("${image.previewUrl}")` }}
    />
  );
}

function validateImage(file: File): "type" | "size" | null {
  const hasAcceptedType =
    acceptedImageTypes.has(file.type) || /\.(png|jpe?g|gif)$/i.test(file.name);

  if (!hasAcceptedType) {
    return "type";
  }

  if (file.size > maximumImageSize) {
    return "size";
  }

  return null;
}
