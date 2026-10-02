// Shapes mirror the data model in TechDoc §6 / PRD §12. When the FastAPI
// OpenAPI schema is available, these can be regenerated from it.

export type CategoryStatus = "published" | "archived";
export type ProductStatus = "draft" | "published" | "archived";
export type InquiryStatus = "new" | "contacted" | "closed";
export type NotificationChannel = "email" | "telegram" | "discord";
export type NotificationStatus = "pending" | "sent" | "failed";

/** Frontend proposal — not yet in the TechDoc schema (PRD §7.4 "Status produk"). */
export type ProductAvailability = "in_stock" | "on_request" | "made_to_order";

export interface Specification {
  name: string;
  value: string;
}

export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface Category extends CategoryRef {
  description: string;
  image: string | null;
  status: CategoryStatus;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  category: CategoryRef;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image: string | null;
  specifications: Specification[];
  status: ProductStatus;
  availability: ProductAvailability;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductDetail {
  product: Product;
  related: Product[];
}

export interface ProductQuery {
  search?: string;
  category?: string;
}

export interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface CompanySettings {
  company_name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  business_hours: string;
  social: SocialLinks;
  logo: string | null;
}

export interface InquiryCreate {
  name: string;
  company: string;
  email: string;
  phone?: string | null;
  product_id?: string | null;
  quantity?: string | null;
  country?: string | null;
  message: string;
  honeypot: string;
  turnstile_token: string;
}

export interface InquiryCreated {
  id: string;
  reference: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  reference: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  product_id: string | null;
  product: Pick<Product, "id" | "name" | "slug"> | null;
  quantity: string | null;
  country: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}

export interface InquiryNotification {
  id: string;
  inquiry_id: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  error: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface InquiryDetail extends Inquiry {
  notifications: InquiryNotification[];
}

export interface InquiryQuery {
  status?: InquiryStatus | "";
  search?: string;
  from?: string;
  to?: string;
}

export interface DashboardSummary {
  total_products: number;
  published_products: number;
  total_inquiries: number;
  new_inquiries: number;
  recent_inquiries: Inquiry[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface ProductInput {
  category_id: string;
  name: string;
  short_description: string;
  description: string;
  specifications: Specification[];
  status: ProductStatus;
  availability: ProductAvailability;
  featured: boolean;
  image: string | null;
}

export interface CategoryInput {
  name: string;
  description: string;
  status: CategoryStatus;
  image: string | null;
}
