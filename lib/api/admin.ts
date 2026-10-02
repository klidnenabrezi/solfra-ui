"use client";

import { apiFetch, ApiError, mockDelay, USE_MOCK } from "@/lib/api/client";
import * as db from "@/lib/mock/data";
import type {
  AdminUser,
  Category,
  CategoryInput,
  CategoryStatus,
  CompanySettings,
  DashboardSummary,
  Inquiry,
  InquiryDetail,
  InquiryQuery,
  InquiryStatus,
  Product,
  ProductInput,
  ProductStatus,
} from "@/lib/types";
import { slugify, uniqueSlug } from "@/lib/utils";

const clone = <T>(v: T): T => structuredClone(v);
const now = () => new Date().toISOString();
const MOCK_SESSION_KEY = "solfra_mock_admin";

function requireMockSession() {
  try {
    if (sessionStorage.getItem(MOCK_SESSION_KEY)) return;
  } catch {
    /* storage unavailable — treat as signed out */
  }
  throw new ApiError(401, "Please sign in.");
}

// ── Auth ────────────────────────────────────────────────────────────────

/** POST /api/admin/auth/login */
export async function login(email: string, password: string): Promise<AdminUser> {
  if (!USE_MOCK) return apiFetch<AdminUser>("/admin/auth/login", { method: "POST", json: { email, password } });
  await mockDelay(700);
  if (password.length < 4) throw new ApiError(401, "Invalid email or password.");
  const user = { id: "usr_1", email, name: email.split("@")[0] };
  try {
    sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
  return user;
}

/** POST /api/admin/auth/logout */
export async function logout(): Promise<void> {
  if (!USE_MOCK) return apiFetch<void>("/admin/auth/logout", { method: "POST" });
  try {
    sessionStorage.removeItem(MOCK_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** GET /api/admin/auth/me — proposed; lets the UI restore the session on load. */
export async function me(): Promise<AdminUser> {
  if (!USE_MOCK) return apiFetch<AdminUser>("/admin/auth/me");
  requireMockSession();
  return JSON.parse(sessionStorage.getItem(MOCK_SESSION_KEY)!) as AdminUser;
}

// ── Dashboard ───────────────────────────────────────────────────────────

/** GET /api/admin/dashboard */
export async function getDashboard(): Promise<DashboardSummary> {
  if (!USE_MOCK) return apiFetch<DashboardSummary>("/admin/dashboard");
  requireMockSession();
  await mockDelay();
  const live = db.products.filter((p) => p.status !== "archived");
  return clone({
    total_products: live.length,
    published_products: db.products.filter((p) => p.status === "published").length,
    total_inquiries: db.inquiries.length,
    new_inquiries: db.inquiries.filter((i) => i.status === "new").length,
    recent_inquiries: [...db.inquiries].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 6),
  });
}

// ── Products ────────────────────────────────────────────────────────────

export interface AdminProductQuery {
  search?: string;
  status?: ProductStatus | "";
  category?: string;
}

/** GET /api/admin/products */
export async function listProducts(query: AdminProductQuery = {}): Promise<Product[]> {
  if (!USE_MOCK) return apiFetch<Product[]>("/admin/products", { query: { ...query } });
  requireMockSession();
  await mockDelay();
  const q = query.search?.trim().toLowerCase();
  return clone(
    db.products
      .filter(
        (p) =>
          (!query.status || p.status === query.status) &&
          (!query.category || p.category_id === query.category) &&
          (!q || p.name.toLowerCase().includes(q)),
      )
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
  );
}

/** GET /api/admin/products/{id} — proposed (TechDoc lists PATCH/DELETE only). */
export async function getProductById(id: string): Promise<Product> {
  if (!USE_MOCK) return apiFetch<Product>(`/admin/products/${id}`);
  requireMockSession();
  await mockDelay(200);
  const p = db.products.find((x) => x.id === id);
  if (!p) throw new ApiError(404, "Product not found.");
  return clone(p);
}

function categoryRef(categoryId: string) {
  const c = db.categories.find((x) => x.id === categoryId);
  if (!c) throw new ApiError(422, "Choose a valid category.");
  return { id: c.id, name: c.name, slug: c.slug };
}

function recountCategories() {
  for (const c of db.categories) {
    c.product_count = db.products.filter((p) => p.category_id === c.id && p.status === "published").length;
  }
}

/** POST /api/admin/products */
export async function createProduct(input: ProductInput): Promise<Product> {
  if (!USE_MOCK) return apiFetch<Product>("/admin/products", { method: "POST", json: input });
  requireMockSession();
  await mockDelay(600);
  const ts = now();
  const product: Product = {
    ...input,
    id: `prd_${Date.now()}`,
    category: categoryRef(input.category_id),
    slug: uniqueSlug(slugify(input.name), db.products.map((p) => p.slug)),
    created_at: ts,
    updated_at: ts,
  };
  db.products.unshift(product);
  recountCategories();
  return clone(product);
}

/** PATCH /api/admin/products/{id} */
export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  if (!USE_MOCK) return apiFetch<Product>(`/admin/products/${id}`, { method: "PATCH", json: input });
  requireMockSession();
  await mockDelay(600);
  const p = db.products.find((x) => x.id === id);
  if (!p) throw new ApiError(404, "Product not found.");
  Object.assign(p, input, { updated_at: now() });
  if (input.category_id) p.category = categoryRef(input.category_id);
  if (input.name) {
    p.slug = uniqueSlug(slugify(input.name), db.products.filter((x) => x.id !== id).map((x) => x.slug));
  }
  recountCategories();
  return clone(p);
}

/** DELETE /api/admin/products/{id} — archives, never hard-deletes. */
export async function archiveProduct(id: string): Promise<void> {
  if (!USE_MOCK) return apiFetch<void>(`/admin/products/${id}`, { method: "DELETE" });
  await updateProduct(id, { status: "archived" });
}

/** POST /api/admin/uploads — proposed; returns the stored path for products.image. */
export async function uploadImage(file: File): Promise<string> {
  if (!USE_MOCK) {
    const body = new FormData();
    body.append("file", file);
    const res = await apiFetch<{ path: string }>("/admin/uploads", { method: "POST", body });
    return res.path;
  }
  requireMockSession();
  await mockDelay(500);
  return URL.createObjectURL(file);
}

// ── Categories ──────────────────────────────────────────────────────────

/** GET /api/admin/categories */
export async function listCategories(): Promise<Category[]> {
  if (!USE_MOCK) return apiFetch<Category[]>("/admin/categories");
  requireMockSession();
  await mockDelay();
  return clone(db.categories);
}

/** POST /api/admin/categories */
export async function createCategory(input: CategoryInput): Promise<Category> {
  if (!USE_MOCK) return apiFetch<Category>("/admin/categories", { method: "POST", json: input });
  requireMockSession();
  await mockDelay(500);
  const ts = now();
  const category: Category = {
    ...input,
    id: `cat_${Date.now()}`,
    slug: uniqueSlug(slugify(input.name), db.categories.map((c) => c.slug)),
    product_count: 0,
    created_at: ts,
    updated_at: ts,
  };
  db.categories.push(category);
  return clone(category);
}

/** PATCH /api/admin/categories/{id} */
export async function updateCategory(id: string, input: Partial<CategoryInput>): Promise<Category> {
  if (!USE_MOCK) return apiFetch<Category>(`/admin/categories/${id}`, { method: "PATCH", json: input });
  requireMockSession();
  await mockDelay(500);
  const c = db.categories.find((x) => x.id === id);
  if (!c) throw new ApiError(404, "Category not found.");
  Object.assign(c, input, { updated_at: now() });
  if (input.name) {
    c.slug = uniqueSlug(slugify(input.name), db.categories.filter((x) => x.id !== id).map((x) => x.slug));
  }
  for (const p of db.products) if (p.category_id === id) p.category = { id: c.id, name: c.name, slug: c.slug };
  return clone(c);
}

export const setCategoryStatus = (id: string, status: CategoryStatus) => updateCategory(id, { status });

// ── Inquiries ───────────────────────────────────────────────────────────

/** GET /api/admin/inquiries?status=&search=&from=&to= */
export async function listInquiries(query: InquiryQuery = {}): Promise<Inquiry[]> {
  if (!USE_MOCK) return apiFetch<Inquiry[]>("/admin/inquiries", { query: { ...query } });
  requireMockSession();
  await mockDelay();
  const q = query.search?.trim().toLowerCase();
  return clone(
    db.inquiries
      .filter((i) => {
        if (query.status && i.status !== query.status) return false;
        if (query.from && i.created_at.slice(0, 10) < query.from) return false;
        if (query.to && i.created_at.slice(0, 10) > query.to) return false;
        if (!q) return true;
        return [i.name, i.company, i.email, i.reference, i.product?.name ?? ""].some((v) => v.toLowerCase().includes(q));
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at)),
  );
}

/** GET /api/admin/inquiries/{id} */
export async function getInquiry(id: string): Promise<InquiryDetail> {
  if (!USE_MOCK) return apiFetch<InquiryDetail>(`/admin/inquiries/${id}`);
  requireMockSession();
  await mockDelay(250);
  const i = db.inquiries.find((x) => x.id === id);
  if (!i) throw new ApiError(404, "Inquiry not found.");
  return clone({ ...i, notifications: db.notifications.filter((n) => n.inquiry_id === id) });
}

export const NEXT_STATUS: Record<InquiryStatus, InquiryStatus[]> = {
  new: ["contacted", "closed"],
  contacted: ["closed"],
  closed: ["contacted"],
};

/** PATCH /api/admin/inquiries/{id}/status */
export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
  if (!USE_MOCK) return apiFetch<Inquiry>(`/admin/inquiries/${id}/status`, { method: "PATCH", json: { status } });
  requireMockSession();
  await mockDelay(400);
  const i = db.inquiries.find((x) => x.id === id);
  if (!i) throw new ApiError(404, "Inquiry not found.");
  if (!NEXT_STATUS[i.status].includes(status)) {
    throw new ApiError(409, `Can't move an inquiry from ${i.status} to ${status}.`);
  }
  Object.assign(i, { status, updated_at: now() });
  return clone(i);
}

// ── Settings ────────────────────────────────────────────────────────────

/** GET /api/admin/settings — proposed. */
export async function getAdminSettings(): Promise<CompanySettings> {
  if (!USE_MOCK) return apiFetch<CompanySettings>("/admin/settings");
  requireMockSession();
  await mockDelay(200);
  return clone(db.settings);
}

/** PATCH /api/admin/settings — proposed. */
export async function updateSettings(input: CompanySettings): Promise<CompanySettings> {
  if (!USE_MOCK) return apiFetch<CompanySettings>("/admin/settings", { method: "PATCH", json: input });
  requireMockSession();
  await mockDelay(600);
  Object.assign(db.settings, input);
  return clone(db.settings);
}
