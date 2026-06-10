// FILE: lib/api/products/schemas.ts
import { z } from "zod";

// 1. Define the base product schema matching FakeStoreAPI fields
export const productSchema = z.object({
  id: z.union([z.number(), z.string()]),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  rating: z
    .object({
      rate: z.number(),
      count: z.number(),
    })
    .optional(),
});

// 2. This expects a raw array from FakeStoreAPI
export const fakeStoreArraySchema = z.array(productSchema);

// 3. Keep this structural definition for your existing UI components
export const paginatedProductsSchema = z.object({
  results: z.array(productSchema),
  count: z.number(),
});
