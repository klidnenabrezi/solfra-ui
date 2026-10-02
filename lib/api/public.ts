import { apiFetch, ApiError, mockDelay, USE_MOCK } from "@/lib/api/client";
import * as db from "@/lib/mock/data";
import type {
  Category,
  CompanySettings,
  InquiryCreate,
  InquiryCreated,
  Product,
  ProductDetail,
  ProductQuery,
} from "@/lib/types";

const clone = <T>(v: T): T => structuredClone(v);

/** GET /api/products?search=&category= */
export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  if (!USE_MOCK) return apiFetch<Product[]>("/products", { query: { ...query } });
  await mockDelay(0);
  const q = query.search?.trim().toLowerCase();
  return clone(
    db.products.filter(
      (p) =>
        p.status === "published" &&
        (!query.category || p.category.slug === query.category) &&
        (!q || p.name.toLowerCase().includes(q) || p.short_description.toLowerCase().includes(q)),
    ),
  );
}

/** GET /api/products/{slug} — returns null on 404. */
export async function getProduct(slug: string): Promise<ProductDetail | null> {
  if (!USE_MOCK) {
    try {
      return await apiFetch<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }
  }
  const product = db.products.find((p) => p.slug === slug && p.status === "published");
  if (!product) return null;
  const related = db.products
    .filter((p) => p.status === "published" && p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);
  return clone({ product, related });
}

/** GET /api/categories */
export async function getCategories(): Promise<Category[]> {
  if (!USE_MOCK) return apiFetch<Category[]>("/categories");
  return clone(db.categories.filter((c) => c.status === "published"));
}

/** GET /api/settings */
export async function getSettings(): Promise<CompanySettings> {
  if (!USE_MOCK) return apiFetch<CompanySettings>("/settings");
  return clone(db.settings);
}

/** POST /api/inquiries */
export async function submitInquiry(data: InquiryCreate): Promise<InquiryCreated> {
  if (!USE_MOCK) return apiFetch<InquiryCreated>("/inquiries", { method: "POST", json: data });

  await mockDelay(900);
  if (data.product_id) {
    const p = db.products.find((x) => x.id === data.product_id);
    if (!p) throw new ApiError(404, "The selected product no longer exists.");
    if (p.status !== "published") throw new ApiError(409, "The selected product is no longer available.");
  }
  const now = new Date().toISOString();
  const id = `inq_${Date.now()}`;
  const reference = `SLF-${String(Date.now()).slice(-6)}`;
  // Honeypot hits get a normal-looking response but are never stored.
  if (data.honeypot) return { id, reference, created_at: now };

  const product = data.product_id ? db.products.find((x) => x.id === data.product_id)! : null;
  db.inquiries.unshift({
    id,
    reference,
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone || null,
    product_id: data.product_id || null,
    product: product ? { id: product.id, name: product.name, slug: product.slug } : null,
    quantity: data.quantity || null,
    country: data.country || null,
    message: data.message,
    status: "new",
    created_at: now,
    updated_at: now,
  });
  db.notifications.push({
    id: `ntf_${id}_email`,
    inquiry_id: id,
    channel: "email",
    status: "sent",
    error: null,
    sent_at: now,
    created_at: now,
  });
  return { id, reference, created_at: now };
}
