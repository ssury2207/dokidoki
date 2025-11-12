/**
 * Optimizes Cloudinary image URLs for different use cases
 */

/**
 * Converts a Cloudinary URL to a thumbnail version (optimized for carousels/previews)
 * Reduces image to 800px width with 80% quality
 *
 * @param url - Original Cloudinary image URL
 * @returns Optimized thumbnail URL
 *
 * @example
 * getCloudinaryThumbnail("https://res.cloudinary.com/xxx/image/upload/v123/photo.jpg")
 * // Returns: "https://res.cloudinary.com/xxx/image/upload/w_800,q_80/v123/photo.jpg"
 */
export function getCloudinaryThumbnail(url: string): string {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Check if it's a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) {
    return url; // Return as-is for non-Cloudinary URLs (local files, etc.)
  }

  // Check if already optimized
  if (url.includes('/w_') || url.includes('/q_')) {
    return url; // Already has transformations
  }

  // Insert transformation parameters after /upload/
  // Format: https://res.cloudinary.com/{cloud}/image/upload/{transformations}/{version}/{filename}
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url; // Invalid Cloudinary URL format
  }

  const beforeUpload = url.substring(0, uploadIndex + 8); // includes '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);

  return `${beforeUpload}w_800,q_80/${afterUpload}`;
}

/**
 * Returns the original full-resolution Cloudinary URL (no optimization)
 * Use this for full-screen image viewing
 *
 * @param url - Cloudinary image URL
 * @returns Original URL without modifications
 */
export function getCloudinaryFullRes(url: string): string {
  return url; // Return as-is for full resolution
}
