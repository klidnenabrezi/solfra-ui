"use client";

import { ImageUp, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { ProductImage } from "@/components/product/product-image";
import { uploadImage } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const MAX_MB = 5;
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  className,
}: {
  value: string | null;
  onChange: (path: string | null) => void;
  label?: string;
  className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = async (file?: File) => {
    if (!file) return;
    setError(null);
    if (!ACCEPT.includes(file.type)) return setError("Use a JPG, PNG or WebP image.");
    if (file.size > MAX_MB * 1024 * 1024) return setError(`Max file size is ${MAX_MB} MB.`);
    setBusy(true);
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files[0]);
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed transition-colors",
          drag ? "border-neon bg-neon/5" : "border-line-strong",
        )}
      >
        {value ? (
          <ProductImage src={value} alt={label} sizes="400px" className="aspect-[4/3]" />
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 text-center text-sm text-subtle hover:text-ink"
          >
            <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-surface text-neon">
              <ImageUp className="size-5" />
            </span>
            <span>
              <span className="font-medium text-ink">Click to upload</span> or drag & drop
              <br />
              <span className="text-xs text-muted">JPG, PNG or WebP · max {MAX_MB} MB</span>
            </span>
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-base/70 backdrop-blur-sm">
            <LoaderCircle className="size-5 animate-spin text-neon" />
          </div>
        )}
      </div>
      <input ref={input} type="file" accept={ACCEPT.join(",")} className="hidden" onChange={(e) => handle(e.target.files?.[0])} aria-label={`Upload ${label}`} />
      {value && (
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => input.current?.click()} className="flex-1 rounded-xl border border-line-strong px-3 py-2 text-sm text-subtle hover:text-ink">
            Replace
          </button>
          <button type="button" onClick={() => onChange(null)} aria-label="Remove image" className="rounded-xl border border-line-strong px-3 py-2 text-subtle hover:border-love/50 hover:text-love">
            <Trash2 className="size-4" />
          </button>
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-xs text-love">{error}</p>}
    </div>
  );
}
