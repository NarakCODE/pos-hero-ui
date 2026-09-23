export type ProductCreationCategory =
  | "Electronics"
  | "Furniture"
  | "Footwear"
  | "Accessories"
  | "Fitness";

export type ProductCreationStatus = "in-stock" | "low-stock" | "out-of-stock";

export type ProductVariationType = "Color" | "Size" | "Material";

export interface ProductCreationFormData {
  name: string;
  sku: string;
  /** Markdown serialized from the Tiptap editor. */
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  thumbnail: File | null;
  mediaGallery: File[];
  category: ProductCreationCategory;
  status: ProductCreationStatus;
  variations?: Array<{type: ProductVariationType; value: string}>;
}

export interface ProductMediaData {
  thumbnail: File | null;
  mediaGallery: File[];
}

export interface ProductVariationDraft {
  id: number;
  type: ProductVariationType | "";
  value: string;
}

export const productCategoryOptions: ReadonlyArray<{
  id: ProductCreationCategory;
  labelKey: string;
}> = [
  {id: "Electronics", labelKey: "productCategoryElectronics"},
  {id: "Furniture", labelKey: "productCategoryFurniture"},
  {id: "Footwear", labelKey: "productCategoryFootwear"},
  {id: "Accessories", labelKey: "productCategoryAccessories"},
  {id: "Fitness", labelKey: "productCategoryFitness"},
];

export const productStatusOptions: ReadonlyArray<{
  id: ProductCreationStatus;
  labelKey: string;
}> = [
  {id: "in-stock", labelKey: "productStatusInStock"},
  {id: "low-stock", labelKey: "productStatusLowStock"},
  {id: "out-of-stock", labelKey: "productStatusOutOfStock"},
];

export const productVariationOptions: ReadonlyArray<{
  id: ProductVariationType;
  labelKey: string;
}> = [
  {id: "Color", labelKey: "variationColor"},
  {id: "Size", labelKey: "variationSize"},
  {id: "Material", labelKey: "variationMaterial"},
];

export function isProductCreationCategory(
  value: string,
): value is ProductCreationCategory {
  return productCategoryOptions.some((option) => option.id === value);
}

export function isProductCreationStatus(
  value: string,
): value is ProductCreationStatus {
  return productStatusOptions.some((option) => option.id === value);
}

export function isProductVariationType(
  value: string,
): value is ProductVariationType {
  return productVariationOptions.some((option) => option.id === value);
}
