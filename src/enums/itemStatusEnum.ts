export const ItemStatuses = [
  "pending",
  "matched",
  "returned",
  "cancelled",
  "reviewing",
] as const;

export type ItemStatus = (typeof ItemStatuses)[number];

// Optional: For label display
export const ItemStatusLabels: Record<ItemStatus, string> = {
  pending: "กำลังรอดำเนินการ",
  matched: "จับคู่สำเร็จ",
  returned: "คืนแล้ว",
  cancelled: "ยกเลิกแล้ว",
  reviewing: "กำลังตรวจสอบ",
};