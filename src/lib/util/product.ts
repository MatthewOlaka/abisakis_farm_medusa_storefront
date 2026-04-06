import { HttpTypes } from "@medusajs/types";

export const isSimpleProduct = (product: HttpTypes.StoreProduct): boolean => {
    return product.options?.length === 1 && product.options[0].values?.length === 1;
}

/**
 * Returns true if every variant has 0 (or less) available stock.
 * Variants with manage_inventory explicitly set to false are skipped.
 * If manage_inventory is undefined (not returned by API), the variant is still checked.
 */
export const isProductOutOfStock = (product: HttpTypes.StoreProduct): boolean => {
    const variants = product.variants;
    if (!variants || variants.length === 0) return false;

    // Only skip variants that explicitly opt out of inventory management
    const checked = variants.filter((v) => v.manage_inventory !== false);
    if (checked.length === 0) return false;

    return checked.every((v) => (v.inventory_quantity ?? 0) <= 0);
}