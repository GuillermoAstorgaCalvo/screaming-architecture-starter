import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Google Maps marker configuration
 */
export interface MapMarker {
	/** Unique identifier for the marker */
	id: string;
	/** Latitude coordinate */
	lat: number;
	/** Longitude coordinate */
	lng: number;
	/** Optional marker title */
	title?: string;
	/** Optional marker label */
	label?: string;
	/** Optional custom icon URL */
	icon?: string;
	/** Optional click handler */
	onClick?: () => void;
	/** Optional info window content */
	infoWindow?: ReactNode;
}

/**
 * Google Maps map type
 */
export type MapType = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';

/**
 * Google Maps map options
 */
export interface MapOptions {
	/** Initial center coordinates */
	center: {
		lat: number;
		lng: number;
	};
	/** Initial zoom level (0-21) @default 10 */
	zoom?: number;
	/** Map type @default 'roadmap' */
	mapTypeId?: MapType;
	/** Map ID for Advanced Markers (required for AdvancedMarkerElement) */
	mapId?: string;
	/** Whether to enable map controls @default true */
	controls?: boolean;
	/** Whether to enable zoom control @default true */
	zoomControl?: boolean;
	/** Whether to enable street view control @default true */
	streetViewControl?: boolean;
	/** Whether to enable fullscreen control @default true */
	fullscreenControl?: boolean;
	/** Whether to enable map type control @default true */
	mapTypeControl?: boolean;
	/** Whether to enable scale control @default false */
	scaleControl?: boolean;
	/** Whether to enable rotate control @default true */
	rotateControl?: boolean;
	/** Minimum zoom level */
	minZoom?: number;
	/** Maximum zoom level */
	maxZoom?: number;
	/** Whether to disable default UI @default false */
	disableDefaultUI?: boolean;
	/** Custom map styles */
	styles?: google.maps.MapTypeStyle[];
	/** Whether to enable gesture handling @default true */
	gestureHandling?: 'auto' | 'greedy' | 'none' | 'cooperative';
}

/**
 * Map component props
 */
export interface MapProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
	/** Map configuration options */
	options: MapOptions;
	/** Array of markers to display on the map */
	markers?: MapMarker[];
	/** Google Maps API key (if not provided, uses config) */
	apiKey?: string;
	/** Google Maps libraries to load (e.g., ['places', 'geometry']) */
	libraries?: string[];
	/** Callback when map is loaded and ready */
	onMapReady?: (map: google.maps.Map) => void;
	/** Callback when map bounds change */
	onBoundsChanged?: (bounds: google.maps.LatLngBounds | null) => void;
	/** Callback when map center changes */
	onCenterChanged?: (center: google.maps.LatLng | null) => void;
	/** Callback when map zoom changes */
	onZoomChanged?: (zoom: number | null) => void;
	/** Callback when map is clicked */
	onMapClick?: (event: google.maps.MapMouseEvent) => void;
	/** Loading fallback component */
	loadingFallback?: ReactNode;
	/** Error fallback component */
	errorFallback?: ReactNode;
	/** Height of the map container @default '400px' */
	height?: string;
	/** Width of the map container @default '100%' */
	width?: string;
}
