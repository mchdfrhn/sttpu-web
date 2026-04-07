/**
 * 🛠️ CMS Utils (Client-Safe)
 * Pure functions for data transformation that can be safely used in both 
 * Server and Client components without the full Payload overhead.
 */

export function getMediaUrl(media: any): string | null {
  if (!media) return null;
  if (typeof media === 'string') return media;
  
  // Handle Payload Media object
  if (media.url) return media.url;
  
  // Fallback for custom objects or missing urls
  return null;
}
