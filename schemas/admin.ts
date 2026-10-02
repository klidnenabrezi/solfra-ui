import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(150),
  category_id: z.string().min(1, "Choose a category."),
  short_description: z.string().trim().min(1, "Add a one-line summary.").max(200),
  description: z.string().trim().max(5000),
  status: z.enum(["draft", "published", "archived"]),
  availability: z.enum(["in_stock", "on_request", "made_to_order"]),
  featured: z.boolean(),
  specifications: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Required").max(60),
        value: z.string().trim().min(1, "Required").max(200),
      }),
    )
    .max(40),
});
export type ProductFormValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  description: z.string().trim().max(500),
  status: z.enum(["published", "archived"]),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;

const optionalUrl = z.union([z.literal(""), z.url("Enter a full URL (https://…)")]);

export const settingsSchema = z.object({
  company_name: z.string().trim().min(1, "Required").max(100),
  tagline: z.string().trim().max(160),
  description: z.string().trim().max(600),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().max(30),
  whatsapp: z.string().trim().regex(/^\d{8,15}$/, "Digits only, with country code (e.g. 6281234567890)."),
  address: z.string().trim().max(300),
  business_hours: z.string().trim().max(120),
  social: z.object({
    linkedin: optionalUrl,
    instagram: optionalUrl,
    facebook: optionalUrl,
    youtube: optionalUrl,
  }),
});
export type SettingsFormValues = z.infer<typeof settingsSchema>;
