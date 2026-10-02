"use client";

import { ProductForm } from "@/components/admin/product-form";
import { ErrorState, Loading } from "@/components/admin/ui";
import { listCategories } from "@/lib/api/admin";
import { useAsync } from "@/lib/hooks/use-async";

export default function NewProductPage() {
  const { data, error, reload } = useAsync(listCategories, []);
  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  if (!data) return <Loading />;
  return <ProductForm categories={data} />;
}
