import type { FileItem } from "../types";
import { files, storageUsedBytes, storageTotalBytes } from "../mock/files";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/files/recent
export function fetchRecentFiles(): Promise<FileItem[]> {
  return mockRequest(files);
}

// Integration placeholder: GET /api/storage/usage
export function fetchStorageUsage(): Promise<{ used: number; total: number }> {
  return mockRequest({ used: storageUsedBytes, total: storageTotalBytes });
}
