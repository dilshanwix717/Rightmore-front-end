import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getProducts, getProductById } from "./api";
import type { PaginatedProducts } from "./types";
import type { Product } from "./types";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProducts(): UseQueryResult<PaginatedProducts> {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: () => getProducts(), // No arguments needed
  });
}

// Keep your existing productKeys and useProducts...

export function useProductDetails(id: string): UseQueryResult<Product> {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id, // Only run query if id is truthy
  });
}
