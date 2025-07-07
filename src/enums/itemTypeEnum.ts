export const ItemTypes = [
  "found",
  "lost",
] as const;

export type ItemTypeses = (typeof ItemTypes)[number];

// Optional: For label display
export const ItemTypeLabels: Record<ItemTypeses, string> = {
  found: "ของที่พบ",
  lost: "ของที่หาย",
};