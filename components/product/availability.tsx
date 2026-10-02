import { Badge, type Tone } from "@/components/ui/badge";
import type { ProductAvailability } from "@/lib/types";

export const availabilityMeta: Record<ProductAvailability, { label: string; tone: Tone; hint: string }> = {
  in_stock: { label: "In stock", tone: "foam", hint: "Ships from local stock, typically within 2–5 business days." },
  on_request: { label: "On request", tone: "gold", hint: "Sourced to order — lead time confirmed with your quotation." },
  made_to_order: { label: "Built to order", tone: "iris", hint: "Configured to your spec and burn-in tested before delivery." },
};

export function AvailabilityBadge({ value }: { value: ProductAvailability }) {
  const m = availabilityMeta[value];
  return (
    <Badge tone={m.tone} dot>
      {m.label}
    </Badge>
  );
}
