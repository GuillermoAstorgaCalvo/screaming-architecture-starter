import { ARIA_LABELS } from '@core/constants/aria';
import IconButton from '@core/ui/icon-button/IconButton';
import ArrowLeftIcon from '@core/ui/icons/arrow-left-icon/ArrowLeftIcon';
import ArrowRightIcon from '@core/ui/icons/arrow-right-icon/ArrowRightIcon';
import CloseIcon from '@core/ui/icons/close-icon/CloseIcon';
import Image from '@core/ui/image/Image';
import type { LightboxImage } from '@src-types/ui/feedback';
import type { ReactNode } from 'react';

interface LightboxNavigationArrowsProps {
	readonly showArrows: boolean;
	readonly hasMultipleImages: boolean;
	readonly canGoPrevious: boolean;
	readonly canGoNext: boolean;
	readonly onPrevious: () => void;
	readonly onNext: () => void;
	readonly prevArrow?: ReactNode;
	readonly nextArrow?: ReactNode;
}

export function LightboxNavigationArrows({
	showArrows,
	hasMultipleImages,
	canGoPrevious,
	canGoNext,
	onPrevious,
	onNext,
	prevArrow,
	nextArrow,
}: Readonly<LightboxNavigationArrowsProps>) {
	if (!showArrows || !hasMultipleImages) {
		return null;
	}

	return (
		<>
			{canGoPrevious ? (
				<IconButton
					icon={prevArrow ?? <ArrowLeftIcon size="lg" />}
					aria-label={ARIA_LABELS.PREVIOUS}
					onClick={onPrevious}
					className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-opacity hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-white/10 dark:hover:bg-white/20"
					variant="ghost"
					size="lg"
				/>
			) : null}
			{canGoNext ? (
				<IconButton
					icon={nextArrow ?? <ArrowRightIcon size="lg" />}
					aria-label={ARIA_LABELS.NEXT}
					onClick={onNext}
					className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-opacity hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-white/10 dark:hover:bg-white/20"
					variant="ghost"
					size="lg"
				/>
			) : null}
		</>
	);
}

interface LightboxImageDisplayProps {
	readonly image: LightboxImage;
}

export function LightboxImageDisplay({ image }: Readonly<LightboxImageDisplayProps>) {
	const imageProps = {
		src: image.src,
		alt: image.alt,
		objectFit: 'contain' as const,
		className: 'max-h-[90vh] max-w-full object-contain',
		showSkeleton: true,
		lazy: false as const,
		...(image.fallbackSrc !== undefined && { fallbackSrc: image.fallbackSrc }),
	};

	return (
		<div className="flex h-full w-full items-center justify-center p-4">
			<div className="relative max-h-full max-w-full">
				<Image {...imageProps} />
			</div>
		</div>
	);
}

interface LightboxHeaderProps {
	readonly onClose: () => void;
	readonly currentIndex: number;
	readonly totalImages: number;
	readonly showCounter: boolean;
	readonly image: LightboxImage;
	readonly showCaption: boolean;
}

export function LightboxHeader({
	onClose,
	currentIndex,
	totalImages,
	showCounter,
	image,
	showCaption,
}: Readonly<LightboxHeaderProps>) {
	return (
		<div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-linear-to-b from-black/70 to-transparent p-4 backdrop-blur-sm">
			<div className="flex-1">
				{showCaption && image.caption ? (
					<p className="text-sm font-medium text-white">{image.caption}</p>
				) : null}
			</div>
			<div className="flex items-center gap-4">
				{showCounter && totalImages > 1 ? (
					<span className="text-sm text-white" aria-live="polite">
						{currentIndex + 1} / {totalImages}
					</span>
				) : null}
				<IconButton
					icon={<CloseIcon />}
					aria-label={ARIA_LABELS.CLOSE_MODAL}
					onClick={onClose}
					className="rounded-full bg-black/50 p-2 text-white transition-opacity hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-white/10 dark:hover:bg-white/20"
					variant="ghost"
					size="md"
				/>
			</div>
		</div>
	);
}
