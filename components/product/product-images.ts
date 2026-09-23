const productImages = [
  "/products/product-1.png",
  "/products/product-2.png",
  "/products/product-3.png",
  "/products/product-4.png",
  "/products/product-5.png",
  "/products/product-6.png",
  "/products/product-7.png",
  "/products/product-8.png",
  "/products/product-9.png",
  "/products/product-10.png",
  "/products/product-11.png",
] as const;

export function getProductImage(productId: string): string {
  let hash = 14;

  for (let index = 0; index < productId.length; index++) {
    hash = Math.imul(hash ^ productId.charCodeAt(index), 16777619);
  }

  return productImages[Math.abs(hash) % productImages.length];
}
