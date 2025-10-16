/**
 * Utility to construct Google Maps Place Photo URLs
 * @param photoReference - The photo reference from Google Maps API
 * @param apiKey - Google Maps API key
 * @param maxWidth - Maximum width of the photo (default: 800)
 * @returns The full URL to the photo
 */
export const getGooglePlacePhotoUrl = (
  photoReference: string,
  apiKey: string,
  maxWidth: number = 800
): string => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`;
};

/**
 * Process place images to convert Google photo references to full URLs
 * @param images - Array of image URLs or photo references
 * @param apiKey - Google Maps API key (optional)
 * @returns Array of processed image URLs
 */
export const processPlaceImages = (
  images: string[] | undefined,
  apiKey: string | undefined
): string[] => {
  if (!images || images.length === 0) return [];
  
  return images.map(img => {
    // If it's already a full URL, return as is
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    
    // If it looks like a photo reference and we have an API key, construct the URL
    if (apiKey && img.length > 20 && !img.includes('/')) {
      return getGooglePlacePhotoUrl(img, apiKey);
    }
    
    // Otherwise return as is (might be a relative path or placeholder)
    return img;
  });
};
