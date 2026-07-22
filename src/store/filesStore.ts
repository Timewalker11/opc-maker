import { create } from "zustand";
import type { FileItem } from "../types";
import { fetchRecentFiles, fetchStorageUsage } from "../services/files";

interface FilesState {
  items: FileItem[];
  storageUsedBytes: number;
  storageTotalBytes: number;
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  seedDemo: () => void;
}

const GB = 1024 * 1024 * 1024;
const MB = 1024 * 1024;
const DAY = 24 * 60 * 60 * 1000;

export const useFilesStore = create<FilesState>()((set) => ({
  items: [],
  storageUsedBytes: 0,
  storageTotalBytes: 10 * GB,
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const [items, usage] = await Promise.all([fetchRecentFiles(), fetchStorageUsage()]);
      set({ items, storageUsedBytes: usage.used, storageTotalBytes: usage.total, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  seedDemo: () => {
    const now = Date.now();
    const items: FileItem[] = [
      { id: "file_demo_1", name: "product-hero.jpg", sizeBytes: 4.2 * MB, uploadedAt: new Date(now - 1 * DAY).toISOString(), kind: "image" },
      { id: "file_demo_2", name: "Q2-invoice-summary.xlsx", sizeBytes: 0.8 * MB, uploadedAt: new Date(now - 3 * DAY).toISOString(), kind: "spreadsheet" },
      { id: "file_demo_3", name: "brand-guidelines.pdf", sizeBytes: 6.1 * MB, uploadedAt: new Date(now - 8 * DAY).toISOString(), kind: "document" },
      { id: "file_demo_4", name: "summer-campaign-promo.mp4", sizeBytes: 145 * MB, uploadedAt: new Date(now - 2 * DAY).toISOString(), kind: "media" },
      { id: "file_demo_5", name: "customer-list-export.csv", sizeBytes: 0.3 * MB, uploadedAt: new Date(now - 12 * DAY).toISOString(), kind: "spreadsheet" },
      { id: "file_demo_6", name: "storefront-banner.png", sizeBytes: 2.6 * MB, uploadedAt: new Date(now - 5 * DAY).toISOString(), kind: "image" },
    ];
    set({ items, storageUsedBytes: 2.3 * GB, storageTotalBytes: 10 * GB, status: "ready" });
  },
}));
