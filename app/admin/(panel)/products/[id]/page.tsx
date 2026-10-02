"use client";

import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { ErrorState, Loading } from "@/components/admin/ui";
import { getProductById, listCategories } from "@/lib/api/admin";
import { useAsync } from "@/lib/hooks/use-async";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data, error, reload } = useAsync(() => Promise.all([getProductById(id), listCategories()]), [id]);
  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  if (!data) return <Loading />;
  const [product, categories] = data;
  return <ProductForm key={product.id} product={product} categories={categories} />;
}
