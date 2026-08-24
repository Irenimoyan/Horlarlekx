/**
 * Utility to resolve optimized image URLs (WebP full resolution & WebP 800px thumbnail)
 * 
 * @param {string|Array} src - The original image URL or array of URLs
 * @param {'full'|'thumb'} size - Target size variant ('thumb' for 800px cards, 'full' for 1920px lightbox/hero)
 * @returns {string} - Clean, optimized image URL
 */
export function getOptimizedImageUrl(src, size = 'full') {
  if (!src) return '';
  
  // If array was passed (e.g. from user edit data), extract first item
  let url = Array.isArray(src) ? src[0] : src;
  if (!url || typeof url !== 'string') return '';

  // Clean leading whitespace and strip unnecessary "public/" prefix
  url = url.trim().replace(/^public\//i, '').replace(/^\/public\//i, '/');

  // Ensure leading slash for relative public paths
  if (!url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = '/' + url;
  }

  // Leave external URLs intact
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Replace original extensions (.jpg, .jpeg, .png) with WebP variants
  const extMatch = url.match(/\.(jpg|jpeg|png)$/i);
  if (extMatch) {
    const basePath = url.substring(0, extMatch.index);
    return size === 'thumb' ? `${basePath}-800.webp` : `${basePath}.webp`;
  }

  // If already a .webp path, append or adjust size
  if (url.endsWith('.webp')) {
    if (size === 'thumb' && !url.endsWith('-800.webp')) {
      return url.replace(/\.webp$/i, '-800.webp');
    }
    if (size === 'full' && url.endsWith('-800.webp')) {
      return url.replace(/-800\.webp$/i, '.webp');
    }
  }

  return url;
}
