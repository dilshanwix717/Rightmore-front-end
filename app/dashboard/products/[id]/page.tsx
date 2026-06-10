"use client";

import { use } from "react";
import Link from "next/link";
import { useProductDetails } from "@/lib/api/products/queries";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Unwrap the params promise using React's use() hook
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // Fetch the specific product data using our React Query hook
  const { data: product, isLoading, error } = useProductDetails(id);

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-muted-foreground">
          Loading product details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold text-destructive">
          Product Not Found
        </h2>
        <p className="text-muted-foreground">
          Could not load the requested product asset.
        </p>
        <Link
          href="/products"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to Products Layout
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb / Back button */}
      <div>
        <Link
          href="/products"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          ← Back to Products List
        </Link>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card border rounded-xl p-6 shadow-sm">
        {/* Product Image Frame */}
        <div className="flex items-center justify-center p-4 bg-white rounded-lg border aspect-square max-h-[400px]">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>

        {/* Product Meta Details Content Panel */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground uppercase tracking-wider">
              {product.category}
            </span>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {product.title}
            </h1>

            {/* Rating Section */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5 text-amber-500 font-semibold text-base">
                  ★ {product.rating.rate.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Based on {product.rating.count} verified client reviews
                </span>
              </div>
            )}

            <div className="border-t border-b py-3 my-4">
              <p className="text-2xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                Description
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action buttons (Optional placeholders) */}
          <div className="pt-4 flex gap-3">
            <button className="flex-1 bg-black text-white dark:bg-white dark:text-black py-2.5 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Edit Product Info
            </button>
            <button className="px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
              Manage Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
