import Dialog from '@core/ui/dialog/Dialog';
import type { LightboxProps } from '@src-types/ui/feedback';

import {
	buildDialogProps,
	buildLightboxContent,
	extractLightboxProps,
} from './helpers/Lightbox.helpers';
import { useLightboxId, useLightboxKeyboard, useLightboxState } from './hooks/useLightbox';

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
