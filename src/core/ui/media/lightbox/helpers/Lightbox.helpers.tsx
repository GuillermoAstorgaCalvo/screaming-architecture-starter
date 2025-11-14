import type Dialog from '@core/ui/dialog/Dialog';
import {
	LightboxHeader,
	LightboxImageDisplay,
	LightboxNavigationArrows,
} from '@core/ui/media/lightbox/components/LightboxComponents';
import type {
	ExtractedLightboxProps,
	LightboxContentParams,
	LightboxNavigationParams,
} from '@core/ui/media/lightbox/types/Lightbox.types';
import type { LightboxProps } from '@src-types/ui/feedback';
import type { KeyboardEvent, ReactNode } from 'react';

const withDefault = <T,>(value: T | undefined, fallback: T): T => value ?? fallback;

function pickBaseLightboxProps(props: Readonly<LightboxProps>) {
	const {
		isOpen,
		onClose,
		images,
		currentIndex: controlledIndex,
		onIndexChange,
		prevArrow,
		nextArrow,
		className,
		lightboxId,
	} = props;

	return {
		isOpen,
		onClose,
		images,
		controlledIndex,
		onIndexChange,
		prevArrow,
		nextArrow,
		className,
		lightboxId,
	};
}

function normalizeOptionalLightboxProps(props: Readonly<LightboxProps>) {
	return {
		initialIndex: withDefault(props.initialIndex, 0),
		loop: withDefault(props.loop, false),
		showArrows: withDefault(props.showArrows, true),
		showCounter: withDefault(props.showCounter, true),
		showCaption: withDefault(props.showCaption, true),
		closeOnOverlayClick: withDefault(props.closeOnOverlayClick, true),
		closeOnEscape: withDefault(props.closeOnEscape, true),
	};
}

export function extractLightboxProps(props: Readonly<LightboxProps>): ExtractedLightboxProps {
	return {
		...pickBaseLightboxProps(props),
		...normalizeOptionalLightboxProps(props),
	};
}

export function buildLightboxNavigation(params: LightboxNavigationParams) {
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

export function buildLightboxContent(params: LightboxContentParams) {
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

export function buildDialogProps(
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
