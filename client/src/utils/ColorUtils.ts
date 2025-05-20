/**
 * Utility functions for handling color contrast
 */

/**
 * Determines if a color is light or dark
 * @param hexColor - Hex color code (with or without #)
 * @returns boolean - true if light, false if dark
 */
export function isLightColor(hexColor: string): boolean {
  // Remove # if present
  const color = hexColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate relative luminance (standard formula)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if light (luminance > 0.5), false if dark
  return luminance > 0.5;
}

/**
 * Returns the optimal text color (black or white) for contrast against a background
 * @param bgHexColor - Background hex color code
 * @returns string - '#000000' for dark text or '#ffffff' for light text
 */
export function getContrastingTextColor(bgHexColor: string): string {
  return isLightColor(bgHexColor) ? '#000000' : '#ffffff';
}
