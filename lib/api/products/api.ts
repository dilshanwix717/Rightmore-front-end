import { apiGet } from "../client";
import { fakeStoreArraySchema, productSchema } from "./schemas";
import type { PaginatedProducts, Product } from "./types";

export async function getProducts(): Promise<PaginatedProducts> {
  console.log("trying to fetch all products");
  const response = await apiGet<any>("/products");

  console.log("Fetched product data:", response);

  // 1. Validate against the raw array structure first
  const parsedArray = fakeStoreArraySchema.parse(response);

  // 2. Wrap total data into structural definition framework needs
  return {
    results: parsedArray,
    count: parsedArray.length, // Dynamic total count
  };
}

// Add this function to your existing api.ts file
export async function getProductById(id: string): Promise<Product> {
  console.log(`Trying to fetch product with id: ${id}`);
  const response = await apiGet<any>(`/products/${id}`);

  console.log("Fetched single product data:", response);

  // Validate single object against your existing zod schema
  const parsedProduct = productSchema.parse(response);
  return parsedProduct;
}
