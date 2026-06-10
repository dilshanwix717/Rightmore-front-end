// FILE: lib/api/vendors/types.ts

import type { z } from "zod";
import type { productSchema, paginatedProductsSchema } from "./schemas";

export type Product = z.infer<typeof productSchema>;
export type PaginatedProducts = z.infer<typeof paginatedProductsSchema>;
