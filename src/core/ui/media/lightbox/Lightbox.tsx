import Dialog from '@core/ui/dialog/Dialog';
import type { LightboxImage, LightboxProps } from '@src-types/ui/feedback';
import type { KeyboardEvent, ReactNode } from 'react';

import {
	LightboxHeader,
	LightboxImageDisplay,
	LightboxNavigationArrows,
} from './components/LightboxComponents';
import { useLightboxId, useLightboxKeyboard, useLightboxState } from './hooks/useLightbox';

interface ExtractedLightboxProps {
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

function extractLightboxProps(props: Readonly<LightboxProps>): ExtractedLightboxProps {
	return {
		isOpen: props.isOpen,
		onClose: props.onClose,
		images: props.images,
		controlledIndex: props.currentIndex,
		initialIndex: props.initialIndex ?? 0,
		loop: props.loop ?? false,
		onIndexChange: props.onIndexChange,
		showArrows: props.showArrows ?? true,
		showCounter: props.showCounter ?? true,
		showCaption: props.showCaption ?? true,
		closeOnOverlayClick: props.closeOnOverlayClick ?? true,
		closeOnEscape: props.closeOnEscape ?? true,
		prevArrow: props.prevArrow,
		nextArrow: props.nextArrow,
		className: props.className,
		lightboxId: props.lightboxId,
	};
}

interface LightboxContentParams {
	readonly extractedProps: ExtractedLightboxProps;
	readonly currentIndex: number;
	readonly totalImages: number;
	readonly goToPrevious: () => void;
	readonly goToNext: () => void;
	readonly handleKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
}

interface LightboxNavigationParams {
	readonly extractedProps: ExtractedLightboxProps;
	readonly hasMultipleImages: boolean;
	readonly canGoPrevious: boolean;
	readonly canGoNext: boolean;
	readonly goToPrevious: () => void;
	readonly goToNext: () => void;
}

function buildLightboxNavigation(params: LightboxNavigationParams) {
	const { extractedProps, hasMultipleImages, canGoPrevious, canGoNext, goToPrevious, goToNext } =
		params;
	return (
		<LightboxNavigationArrows
			showArrows={extractedProps.showArrows}
			hasMultipleImages={hasMultipleImages}
			canGoPrevious={canGoPrevious}
			canGoNext={canGoNext}
			onPrevious={goToPrevious}
			onNext={goToNext}
			prevArrow={extractedProps.prevArrow}
			nextArrow={extractedProps.nextArrow}
		/>
	);
}

function buildLightboxContent(params: LightboxContentParams) {
	const { extractedProps, currentIndex, totalImages, goToPrevious, goToNext, handleKeyDown } =
		params;
	const currentImage = extractedProps.images[currentIndex];
	if (!currentImage) {
		return null;
	}

	const hasMultipleImages = totalImages > 1;
	const canGoPrevious = extractedProps.loop || currentIndex > 0;
	const canGoNext = extractedProps.loop || currentIndex < totalImages - 1;

	return (
		<button
			type="button"
			className="relative flex h-full w-full flex-col bg-black focus:outline-none"
			onKeyDown={handleKeyDown as (e: KeyboardEvent<HTMLButtonElement>) => void}
			aria-label="Image gallery"
		>
			<LightboxHeader
				onClose={extractedProps.onClose}
				currentIndex={currentIndex}
				totalImages={totalImages}
				showCounter={extractedProps.showCounter}
				image={currentImage}
				showCaption={extractedProps.showCaption}
			/>
			<div className="relative flex flex-1 items-center justify-center">
				<LightboxImageDisplay image={currentImage} />
				{buildLightboxNavigation({
					extractedProps,
					hasMultipleImages,
					canGoPrevious,
					canGoNext,
					goToPrevious,
					goToNext,
				})}
			</div>
		</button>
	);
}

/**
 * Lightbox - Fullscreen image gallery viewer with navigation
 *
 * Features:
 * - Fullscreen modal display using Dialog component
 * - Image navigation with previous/next arrows
 * - Keyboard navigation (Arrow keys, Escape)
 * - Image counter display (e.g., "1 / 5")
 * - Optional image captions
 * - Loop support for continuous navigation
 * - Accessible ARIA attributes
 * - Dark mode support
 * - Customizable navigation arrows
 * - Integrates with Image component for optimized loading
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const [currentIndex, setCurrentIndex] = useState(0);
 *
 * const images = [
 *   { src: '/image1.jpg', alt: 'Image 1', caption: 'First image' },
 *   { src: '/image2.jpg', alt: 'Image 2', caption: 'Second image' },
 * ];
 *
 * <Lightbox
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   images={images}
 *   currentIndex={currentIndex}
 *   onIndexChange={setCurrentIndex}
 *   showCounter
 *   showCaption
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Uncontrolled usage
 * <Lightbox
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   images={images}
 *   initialIndex={2}
 *   loop
 * />
 * ```
 */
function buildDialogProps(
	extractedProps: ExtractedLightboxProps,
	lightboxId: string,
	children: ReactNode
): Parameters<typeof Dialog>[0] {
	return {
		isOpen: extractedProps.isOpen,
		onClose: extractedProps.onClose,
		title: '',
		variant: 'fullscreen' as const,
		size: 'full' as const,
		showCloseButton: false,
		closeOnOverlayClick: extractedProps.closeOnOverlayClick,
		closeOnEscape: extractedProps.closeOnEscape,
		dialogId: lightboxId,
		children,
		...(extractedProps.className !== undefined && { className: extractedProps.className }),
	};
}

export default function Lightbox(props: Readonly<LightboxProps>) {
	const extractedProps = extractLightboxProps(props);
	const lightboxId = useLightboxId(extractedProps.lightboxId);

	const { currentIndex, goToPrevious, goToNext, totalImages } = useLightboxState({
		images: extractedProps.images,
		controlledIndex: extractedProps.controlledIndex,
		initialIndex: extractedProps.initialIndex,
		loop: extractedProps.loop,
		onIndexChange: extractedProps.onIndexChange,
	});

	const handleKeyDown = useLightboxKeyboard({
		goToPrevious,
		goToNext,
		onClose: extractedProps.onClose,
		closeOnEscape: extractedProps.closeOnEscape,
	});

	if (!extractedProps.isOpen || extractedProps.images.length === 0) {
		return null;
	}

	const content = buildLightboxContent({
		extractedProps,
		currentIndex,
		totalImages,
		goToPrevious,
		goToNext,
		handleKeyDown,
	});

	if (!content) {
		return null;
	}

	return <Dialog {...buildDialogProps(extractedProps, lightboxId, content)} />;
}
