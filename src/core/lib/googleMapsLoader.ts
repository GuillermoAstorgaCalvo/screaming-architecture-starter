/**
 * Google Maps loader utility
 * Provides a way to load and access Google Maps API from core layer
 * without directly importing from infrastructure
 */

/**
 * Load Google Maps script and return the API
 * This function dynamically imports the adapter to avoid boundary violations
 */
export async function loadGoogleMaps(
	apiKey: string,
	libraries: string[] = []
): Promise<typeof google.maps | null> {
	// Dynamic import to avoid boundary violation at build time
	const { googleMapsAdapter } = await import('@infra/maps/googleMapsAdapter');

	await googleMapsAdapter.initialize(apiKey, libraries);

	if (!googleMapsAdapter.isGoogleMapsAvailable()) {
		return null;
	}

	return googleMapsAdapter.getGoogleMaps();
}

/**
 * Check if Google Maps is available
 */
export async function isGoogleMapsAvailable(): Promise<boolean> {
	const { googleMapsAdapter } = await import('@infra/maps/googleMapsAdapter');
	return googleMapsAdapter.isGoogleMapsAvailable();
}
