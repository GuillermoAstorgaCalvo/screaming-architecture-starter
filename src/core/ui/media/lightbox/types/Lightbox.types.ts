import type { LightboxImage } from '@src-types/ui/feedback';
import type { KeyboardEvent, ReactNode } from 'react';

export interface ExtractedLightboxProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly images: readonly LightboxImage[];
	readonly controlledIndex: number | undefined;
	readonly initialIndex: number;
	readonly loop: boolean;
	readonly onIndexChange: ((index: number) => void) | undefined;
	readonly showArrows: boolean;
	readonly showCounter: boolean;
	readonly showCaption: boolean;
	readonly closeOnOverlayClick: boolean;
	readonly closeOnEscape: boolean;
	readonly prevArrow: ReactNode | undefined;
	readonly nextArrow: ReactNode | undefined;
	readonly className: string | undefined;
	readonly lightboxId: string | undefined;
}

export interface LightboxContentParams {
	readonly extractedProps: ExtractedLightboxProps;
	readonly currentIndex: number;
	readonly totalImages: number;
	readonly goToPrevious: () => void;
	readonly goToNext: () => void;
	readonly handleKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
}

export interface LightboxNavigationParams {
	readonly extractedProps: ExtractedLightboxProps;
	readonly hasMultipleImages: boolean;
	readonly canGoPrevious: boolean;
	readonly canGoNext: boolean;
	readonly goToPrevious: () => void;
	readonly goToNext: () => void;
}
