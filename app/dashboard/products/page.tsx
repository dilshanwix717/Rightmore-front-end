"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";

import { useProducts } from "@/lib/api/products/queries";
import type { Product } from "@/lib/api/products/types";
import Link from "next/link";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 1. Fetch ALL products without passing page/limit parameters to the API hook
  const { data: paginatedData, isLoading } = useProducts();

  useEffect(() => {
    if (paginatedData) {
      console.log("Products fetched:", paginatedData);
    }
  }, [paginatedData]);

  // 2. Map the data structure first
  const allTableData = (paginatedData?.results ?? []).map((v: Product) => {
    const title = v.title ?? "";
    const description = v.description ?? "";

    return {
      id: v.id,
      // Concatenate title and description into a single string for unified display
      productDetails: `${title} - ${description}`,
      // Keep raw title separately in case your DataTable's internal search bar relies specifically on this exact string
      name: title,
      venderImageUrl: v.image ?? "",
      price: v.price ?? 0,
      rating: v.rating ?? { rate: 0, count: 0 },
    };
  });

  // 3. Slice the data on the front end based on current state
  const totalItems = allTableData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const slicedTableData = allTableData.slice(startIndex, endIndex);

  const columns = [
    {
      key: "venderImageUrl",
      label: "Image",
      render: (value: string, row: any) => (
        // Wrapping the image in a link makes it clickable too!
        <Link
          href={`/products/${row.id}`}
          className="block w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border border-border hover:opacity-80 transition-opacity"
        >
          {value ? (
            <img
              src={value || "/placeholder.svg"}
              alt="Product"
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
        </Link>
      ),
    },
    {
      key: "productDetails",
      label: "Product",
      // Most custom datatables pass the entire 'row' or 'item' record as a second parameter to 'render'
      render: (value: string, row: any) => (
        <div className="max-w-[300px] md:max-w-[450px]">
          {/* Dynamic routing Link pointing to the product ID */}
          <Link
            href={`/dashboard/products/${row.id}`}
            className="text-sm font-medium text-foreground line-clamp-2 hover:text-blue-600 hover:underline transition-colors"
            title="Click to view details"
          >
            {value}
          </Link>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (value: number) => (
        <span className="font-semibold text-sm">${value.toFixed(2)}</span>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (value: { rate: number; count: number }) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="inline-flex items-center gap-0.5 font-medium text-sm text-amber-600 dark:text-amber-400">
            ★ {value?.rate?.toFixed(1) ?? "0.0"}
          </span>
          <span className="text-xs text-muted-foreground">
            ({value?.count ?? 0})
          </span>
        </div>
      ),
    },
  ];

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to page 1 to prevent layout empty states
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage product accounts</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={slicedTableData} // Pass the sliced view data
        searchKey="name" // Keeps searching based on the product title matching your DataTable logic
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={totalItems} // Pass total raw item count
      />
    </div>
  );
}
