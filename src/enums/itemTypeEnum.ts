export const ItemTypes = [
  "found",
  "lost",
] as const;

export type ItemType = (typeof ItemTypes)[number];

// Optional: For label display
export const ItemTypeLabels: Record<ItemType, string> = {
  found: "เก็บของได้",
  lost: "แจ้งของหาย",
};