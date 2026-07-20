import type { SocialPost } from "../types";
import { socialPosts } from "../mock/social";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/social/posts
export function fetchSocialPosts(): Promise<SocialPost[]> {
  return mockRequest(socialPosts);
}
