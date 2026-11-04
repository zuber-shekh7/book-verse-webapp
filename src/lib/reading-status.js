import { BookmarkPlus, BookOpen, CircleCheck, CircleX, Pause } from "lucide-react";

// Single source of truth for reading-list statuses (keys are stored in MongoDB).
// Keep the order in sync with READING_STATUS_VALUES in src/models/ReadingEntry.js.
export const READING_STATUSES = [
  { value: "wishlist", label: "Wishlist", icon: BookmarkPlus },
  { value: "reading", label: "Reading", icon: BookOpen },
  { value: "on_hold", label: "On hold", icon: Pause },
  { value: "dropped", label: "Dropped", icon: CircleX },
  { value: "completed", label: "Completed", icon: CircleCheck },
];

export const isReadingStatus = (v) => READING_STATUSES.some((s) => s.value === v);
export const statusMeta = (v) => READING_STATUSES.find((s) => s.value === v);
