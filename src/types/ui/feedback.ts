import type { HTMLAttributes, ReactNode, SVGProps } from 'react';

import type { StandardSize } from './base';

/**
 * Badge variant types
 */
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Badge component props
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	/** Visual variant of the badge @default 'default' */
	variant?: BadgeVariant;
	/** Size of the badge @default 'md' */
	size?: StandardSize;
	/** Badge content */
	children: ReactNode;
}

/**
 * Chip component props
 */
export interface ChipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
	/** Visual variant of the chip @default 'default' */
	variant?: BadgeVariant;
	/** Size of the chip @default 'md' */
	size?: StandardSize;
	/** Chip content */
	children: ReactNode;
	/** Whether the chip is removable @default false */
	removable?: boolean;
	/** Callback when remove button is clicked */
	onRemove?: () => void;
	/** Custom aria-label for remove button @default 'Remove' */
	removeAriaLabel?: string;
}

/**
 * Skeleton variant types
 */
export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

/**
 * Skeleton component props
 */
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	/** Visual variant of the skeleton @default 'rectangular' */
	variant?: SkeletonVariant;
}

/**
 * Spinner component props
 */
export interface SpinnerProps extends Omit<SVGProps<SVGSVGElement>, 'size'> {
	/**
	 * Size of the spinner
	 * @default 'md'
	 */
	size?: StandardSize | number;
	/**
	 * Color of the spinner
	 * @default 'currentColor'
	 */
	color?: string;
	/**
	 * Accessible label for the spinner
	 * @default ARIA_LABELS.LOADING
	 */
	'aria-label'?: string;
}

/**
 * Progress component props
 */
export interface ProgressProps extends Omit<HTMLAttributes<HTMLProgressElement>, 'size'> {
	/** Progress value (0-100) */
	value: number;
	/** Maximum value @default 100 */
	max?: number;
	/** Size of the progress bar @default 'md' */
	size?: StandardSize;
	/** Whether to show the value as text @default false */
	showValue?: boolean;
}

/**
 * Meter variant types based on value thresholds
 */
export type MeterVariant = 'default' | 'success' | 'warning' | 'error';

/**
 * Meter threshold configuration
 */
export interface MeterThreshold {
	/** Threshold value (percentage 0-100) */
	value: number;
	/** Variant to apply when value is at or above this threshold */
	variant: MeterVariant;
}

/**
 * Meter component props
 */
export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'size'> {
	/** Current meter value */
	value: number;
	/** Minimum value @default 0 */
	min?: number;
	/** Maximum value */
	max: number;
	/** Size of the meter @default 'md' */
	size?: StandardSize;
	/** Optional unit label (e.g., 'GB', 'MB/s') */
	unit?: string;
	/** Optional label for the meter */
	label?: string;
	/** Whether to show the value text @default true */
	showValue?: boolean;
	/** Custom format function for displaying the value */
	formatValue?: (value: number, max: number, unit?: string) => string;
	/** Thresholds for color variants based on percentage */
	thresholds?: MeterThreshold[];
	/** Manual variant override (overrides thresholds) */
	variant?: MeterVariant;
}

/**
 * Avatar size types (extends StandardSize with xs and xl)
 */
export type AvatarSize = 'xs' | StandardSize | 'xl' | '2xl';

/**
 * Avatar variant types
 */
export type AvatarVariant = 'circle' | 'square' | 'rounded';

/**
 * Avatar component props
 */
export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
	/** Image source URL */
	src?: string;
	/** Alt text for the image */
	alt?: string;
	/** Fallback text (usually initials) shown when image fails to load */
	fallback?: string;
	/** Size of the avatar @default 'md' */
	size?: AvatarSize;
	/** Visual variant of the avatar @default 'circle' */
	variant?: AvatarVariant;
	/** Optional icon to display instead of image/fallback */
	icon?: ReactNode;
}

/**
 * Image component props
 */
export interface ImageProps
	extends Omit<HTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'onError' | 'onLoad'> {
	/** Image source URL */
	src: string;
	/** Alt text for the image (required for accessibility) */
	alt: string;
	/** Optional fallback image URL */
	fallbackSrc?: string;
	/** Whether to enable lazy loading @default true */
	lazy?: boolean;
	/** Optional loading placeholder (skeleton, spinner, etc.) */
	loadingPlaceholder?: ReactNode;
	/** Optional error placeholder */
	errorPlaceholder?: ReactNode;
	/**
	 * Callback when image fails to load
	 * Receives a normalized Error object instead of the native event
	 */
	onError?: (error: Error) => void;
	/**
	 * Callback when image loads successfully
	 * Invoked after the native onLoad event fires
	 */
	onLoad?: () => void;
	/** Image width (for aspect ratio) */
	width?: number | string;
	/** Image height (for aspect ratio) */
	height?: number | string;
	/** Object fit style @default 'cover' */
	objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
	/** Whether to show skeleton while loading @default false */
	showSkeleton?: boolean;
}

/**
 * Video component props
 */
export interface VideoProps
	extends Omit<
		HTMLAttributes<HTMLVideoElement>,
		'src' | 'onError' | 'onLoad' | 'onLoadedData' | 'onCanPlay'
	> {
	/** Video source URL or array of source objects */
	src: string | Array<{ src: string; type?: string }>;
	/** Poster image URL (shown before video loads) */
	poster?: string;
	/** Whether to show video controls @default true */
	controls?: boolean;
	/** Whether to enable autoplay @default false */
	autoplay?: boolean;
	/** Whether to loop the video @default false */
	loop?: boolean;
	/** Whether the video is muted @default false */
	muted?: boolean;
	/** Whether to enable preloading @default 'metadata' */
	preload?: 'none' | 'metadata' | 'auto';
	/** Optional fallback video source URL */
	fallbackSrc?: string | Array<{ src: string; type?: string }>;
	/** Optional loading placeholder (skeleton, spinner, etc.) */
	loadingPlaceholder?: ReactNode;
	/** Optional error placeholder */
	errorPlaceholder?: ReactNode;
	/**
	 * Callback when video fails to load
	 * Receives a normalized Error object instead of the native event
	 */
	onError?: (error: Error) => void;
	/**
	 * Callback when video can start playing (enough data loaded)
	 * Invoked after the native onCanPlay event fires
	 */
	onCanPlay?: () => void;
	/**
	 * Callback when video metadata loads
	 * Invoked after the native onLoadedData event fires
	 */
	onLoadedData?: () => void;
	/** Video width */
	width?: number | string;
	/** Video height */
	height?: number | string;
	/** Object fit style @default 'contain' */
	objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
	/** Whether to show skeleton while loading @default false */
	showSkeleton?: boolean;
	/** Whether to show spinner while loading @default true */
	showSpinner?: boolean;
	/** Optional caption/subtitle tracks for accessibility */
	tracks?: Array<{
		src: string;
		kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
		srcLang?: string;
		label?: string;
		default?: boolean;
	}>;
}

/**
 * StatusIndicator status types
 */
export type StatusIndicatorStatus = 'online' | 'offline' | 'busy' | 'away';

/**
 * StatusIndicator variant types
 */
export type StatusIndicatorVariant = 'dot' | 'badge';

/**
 * StatusIndicator component props
 */
export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
	/** Status of the indicator @default 'online' */
	status?: StatusIndicatorStatus;
	/** Visual variant of the indicator @default 'dot' */
	variant?: StatusIndicatorVariant;
	/** Size of the indicator @default 'md' */
	size?: StandardSize;
	/** Optional label text (only shown with badge variant) */
	label?: string;
	/** Whether to show pulse animation @default false */
	animated?: boolean;
}
/**
 * Banner intent types
 */
export type BannerIntent = 'info' | 'success' | 'warning' | 'error';

/**
 * Banner action button configuration
 */
export interface BannerAction {
	/** Action button label */
	readonly label: string;
	/** Action button click handler */
	readonly onClick: () => void;
	/** Optional icon for the action button */
	readonly icon?: ReactNode;
	/** Action button variant @default 'primary' */
	readonly variant?: 'primary' | 'secondary' | 'ghost';
}

/**
 * Banner component props
 * Static banner for announcements (vs Alert for dynamic notifications)
 */
export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
	/** Visual intent/variant of the banner @default 'info' */
	intent?: BannerIntent;
	/** Optional title text */
	title?: string;
	/** Optional description text or custom content */
	description?: string | ReactNode;
	/** Banner content (alternative to description) */
	children?: ReactNode;
	/** Optional custom icon (overrides default intent icon) */
	icon?: ReactNode;
	/** Optional action button */
	action?: BannerAction;
	/** ARIA role @default 'region' */
	role?: 'region' | 'status';
}

/**
 * Lightbox image item
 */
export interface LightboxImage {
	/** Image source URL */
	src: string;
	/** Alt text for the image (required for accessibility) */
	alt: string;
	/** Optional fallback image URL */
	fallbackSrc?: string;
	/** Optional caption text */
	caption?: string;
	/** Optional thumbnail URL */
	thumbnail?: string;
}

/**
 * Lightbox component props
 */
export interface LightboxProps {
	/** Whether the lightbox is open */
	isOpen: boolean;
	/** Function to close the lightbox */
	onClose: () => void;
	/** Array of images to display */
	images: readonly LightboxImage[];
	/** Initial image index to display @default 0 */
	initialIndex?: number;
	/** Current image index (controlled) */
	currentIndex?: number;
	/** Callback when image index changes */
	onIndexChange?: (index: number) => void;
	/** Whether to show navigation arrows @default true */
	showArrows?: boolean;
	/** Whether to show image counter (e.g., "1 / 5") @default true */
	showCounter?: boolean;
	/** Whether to show image caption @default true */
	showCaption?: boolean;
	/** Whether to loop through images @default false */
	loop?: boolean;
	/** Whether to close on overlay click @default true */
	closeOnOverlayClick?: boolean;
	/** Whether to close on escape key @default true */
	closeOnEscape?: boolean;
	/** Custom previous arrow component */
	prevArrow?: ReactNode;
	/** Custom next arrow component */
	nextArrow?: ReactNode;
	/** Additional CSS classes */
	className?: string;
	/** Optional ID for the lightbox element */
	lightboxId?: string;
}
