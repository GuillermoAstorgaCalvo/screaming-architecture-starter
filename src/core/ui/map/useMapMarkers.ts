import { UI_TIMEOUTS } from '@core/constants/timeouts';
import { useDebounce } from '@core/hooks/useDebounce';
import { sanitizeHtml } from '@core/security/sanitizeHtml';
import type { MapMarker } from '@src-types/ui/maps';
import { type ReactNode, useEffect, useRef } from 'react';

/**
 * Context object for marker management operations
 */
interface MarkerContext {
	map: google.maps.Map;
	googleMaps: typeof google.maps;
	markersRef: Map<string, google.maps.marker.AdvancedMarkerElement>;
	infoWindowsRef: Map<string, google.maps.InfoWindow>;
}

/**
 * Hook to manage map markers
 * Debounces marker updates to batch rapid changes and improve performance
 */
export function useMapMarkers(
	map: google.maps.Map | null,
	markers: MapMarker[],
	googleMaps: typeof google.maps | null
): void {
	const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
	const infoWindowsRef = useRef<Map<string, google.maps.InfoWindow>>(new Map());

	// Debounce markers to batch rapid updates (e.g., during filtering or real-time updates)
	// Using a shorter debounce for UI responsiveness while still batching updates
	const debouncedMarkers = useDebounce(markers, UI_TIMEOUTS.DEBOUNCE_SHORT);

	useEffect(() => {
		if (!map || !googleMaps) {
			return;
		}

		const context: MarkerContext = {
			map,
			googleMaps,
			markersRef: markersRef.current,
			infoWindowsRef: infoWindowsRef.current,
		};

		removeStaleMarkers(debouncedMarkers, context);
		updateOrCreateMarkers(debouncedMarkers, context);
	}, [map, debouncedMarkers, googleMaps]);
}

/**
 * Remove markers that are no longer in the markers array
 */
function removeStaleMarkers(markers: MapMarker[], context: MarkerContext): void {
	const currentMarkerIds = new Set(markers.map(m => m.id));
	for (const [id, marker] of context.markersRef.entries()) {
		if (!currentMarkerIds.has(id)) {
			marker.map = null;
			context.markersRef.delete(id);
			context.infoWindowsRef.get(id)?.close();
			context.infoWindowsRef.delete(id);
		}
	}
}

/**
 * Update existing markers or create new ones
 */
function updateOrCreateMarkers(markers: MapMarker[], context: MarkerContext): void {
	for (const markerConfig of markers) {
		const existingMarker = context.markersRef.get(markerConfig.id);

		if (existingMarker) {
			updateMarkerPosition(existingMarker, markerConfig, context);
		} else {
			createNewMarker(markerConfig, context);
		}
	}
}

/**
 * Update an existing marker's position
 */
function updateMarkerPosition(
	marker: google.maps.marker.AdvancedMarkerElement,
	markerConfig: MapMarker,
	context: MarkerContext
): void {
	const newPosition = new context.googleMaps.LatLng(markerConfig.lat, markerConfig.lng);
	marker.position = newPosition;
}

/**
 * Create a new marker and add it to the map
 */
function createNewMarker(markerConfig: MapMarker, context: MarkerContext): void {
	const position = new context.googleMaps.LatLng(markerConfig.lat, markerConfig.lng);
	const content = createMarkerContent(markerConfig, context);

	const marker = new context.googleMaps.marker.AdvancedMarkerElement({
		map: context.map,
		position,
		content,
		...(markerConfig.title ? { title: markerConfig.title } : {}),
	});

	context.markersRef.set(markerConfig.id, marker);

	if (markerConfig.onClick || markerConfig.infoWindow) {
		setupMarkerClickHandler(marker, markerConfig, context);
	}
}

/**
 * Create marker content (PinElement or HTML element) from configuration
 */
function createMarkerContent(
	markerConfig: MapMarker,
	context: MarkerContext
): HTMLElement | google.maps.marker.PinElement | null {
	// If icon is provided, use PinElement with custom icon
	if (markerConfig.icon) {
		return new context.googleMaps.marker.PinElement({
			background: markerConfig.icon,
			...(markerConfig.label ? { glyph: markerConfig.label } : {}),
			scale: 1,
		});
	}

	// If label is provided without icon, use PinElement with label
	if (markerConfig.label) {
		return new context.googleMaps.marker.PinElement({
			glyph: markerConfig.label,
			scale: 1,
		});
	}

	// Default: use default pin (null means default)
	return null;
}

/**
 * Set up click handler for a marker with optional info window
 */
function setupMarkerClickHandler(
	marker: google.maps.marker.AdvancedMarkerElement,
	markerConfig: MapMarker,
	context: MarkerContext
): void {
	marker.addListener('click', () => {
		markerConfig.onClick?.();

		if (markerConfig.infoWindow) {
			openInfoWindow(marker, markerConfig, context);
		}
	});
}

/**
 * Open or update an info window for a marker
 */
function openInfoWindow(
	marker: google.maps.marker.AdvancedMarkerElement,
	markerConfig: MapMarker,
	context: MarkerContext
): void {
	const existingInfoWindow = context.infoWindowsRef.get(markerConfig.id);
	if (existingInfoWindow) {
		existingInfoWindow.close();
	}

	const infoWindow = new context.googleMaps.InfoWindow({
		content:
			typeof markerConfig.infoWindow === 'string'
				? sanitizeHtml(markerConfig.infoWindow)
				: renderInfoWindowContent(markerConfig.infoWindow),
	});

	infoWindow.open({
		anchor: marker,
		map: context.map,
	});
	context.infoWindowsRef.set(markerConfig.id, infoWindow);
}

/**
 * Render React content to string for InfoWindow
 *
 * Note: This function should only be called with ReactNode content (not strings).
 * String content should be sanitized separately using sanitizeHtml before being
 * passed to Google Maps InfoWindow.
 */
function renderInfoWindowContent(content: ReactNode): string {
	if (typeof content === 'string') {
		// If a string is passed (which shouldn't happen in normal flow),
		// sanitize it to prevent XSS attacks
		return sanitizeHtml(content);
	}

	const div = document.createElement('div');
	const textContent =
		typeof content === 'object' && content !== null ? JSON.stringify(content) : String(content);
	div.textContent = textContent;
	return div.innerHTML;
}
