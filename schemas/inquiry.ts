import { z } from "zod";

// UX validation only — mirrors the Pydantic InquiryCreate model (TechDoc §4.2).
// The backend remains the authority and re-validates everything.
export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your full name.").max(100, "Max 100 characters."),
  company: z.string().trim().min(1, "Please enter your company name.").max(150, "Max 150 characters."),
  email: z.email("Enter a valid email address.").max(254),
  phone: z
    .string()
    .trim()
    .max(30, "Max 30 characters.")
    .regex(/^[+()\d\s-]*$/, "Use digits, spaces, +, ( ) or - only."),
  product_id: z.string(),
  quantity: z.string().trim().max(50, "Max 50 characters."),
  country: z.string().trim().max(80, "Max 80 characters."),
  message: z.string().trim().min(1, "Tell us what you need.").max(2000, "Max 2000 characters."),
  // Deliberately unconstrained here: a filled honeypot is rejected server-side, silently.
  honeypot: z.string(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;

export const MESSAGE_MAX = 2000;
