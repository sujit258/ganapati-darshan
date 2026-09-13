/**
 * Generates a Google Maps directions URL for walking navigation to a Ganpati destination
 */
export function getDirectionsUrl(
  destLat: number,
  destLon: number,
  userLat?: number,
  userLon?: number
): string {
  const base = 'https://www.google.com/maps/dir/?api=1';
  const destination = `&destination=${destLat},${destLon}`;
  const mode = '&travelmode=walking';
  
  if (userLat !== undefined && userLon !== undefined) {
    return `${base}&origin=${userLat},${userLon}${destination}${mode}`;
  }
  
  return `${base}${destination}${mode}`;
}

/**
 * Generates a Google Maps search/place link
 */
export function getPlaceUrl(lat: number, lon: number, name?: string): string {
  if (name) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' पुणे')}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}
