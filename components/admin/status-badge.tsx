import { Badge, type Tone } from "@/components/ui/badge";
import type { CategoryStatus, InquiryStatus, NotificationStatus, ProductStatus } from "@/lib/types";

const map: Record<string, { tone: Tone; label: string }> = {
  published: { tone: "foam", label: "Published" },
  draft: { tone: "gold", label: "Draft" },
  archived: { tone: "muted", label: "Archived" },
  new: { tone: "neon", label: "New" },
  contacted: { tone: "iris", label: "Contacted" },
  closed: { tone: "muted", label: "Closed" },
  pending: { tone: "gold", label: "Pending" },
  sent: { tone: "foam", label: "Sent" },
  failed: { tone: "love", label: "Failed" },
};

export function StatusBadge({ status }: { status: ProductStatus | CategoryStatus | InquiryStatus | NotificationStatus }) {
  const m = map[status];
  return (
    <Badge tone={m.tone} dot>
      {m.label}
    </Badge>
  );
}
