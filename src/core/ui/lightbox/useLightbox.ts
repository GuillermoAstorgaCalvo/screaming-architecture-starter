import type { LightboxImage } from '@src-types/ui/feedback';
import { type KeyboardEvent, useCallback, useEffect, useId, useState } from 'react';

interface UseLightboxStateParams {
	readonly images: readonly LightboxImage[];
	readonly controlledIndex: number | undefined;
	readonly initialIndex: number;
	readonly loop: boolean;
	readonly onIndexChange: ((index: number) => void) | undefined;
}

function calculateNewIndex(index: number, totalImages: number, loop: boolean): number {
	if (index < 0) {
		return loop ? totalImages - 1 : 0;
	}
	if (index >= totalImages) {
		return loop ? 0 : totalImages - 1;
	}
	return index;
}

function useLightboxIndexState({
	controlledIndex,
	initialIndex,
	totalImages,
	loop,
	onIndexChange,
}: {
	readonly controlledIndex: number | undefined;
	readonly initialIndex: number;
	readonly totalImages: number;
	readonly loop: boolean;
	readonly onIndexChange: ((index: number) => void) | undefined;
}) {
	const [internalIndex, setInternalIndex] = useState(initialIndex);
	const isControlled = controlledIndex !== undefined;
	const currentIndex = isControlled ? controlledIndex : internalIndex;

	const updateIndex = useCallback(
		(newIndex: number) => {
			const normalizedIndex = calculateNewIndex(newIndex, totalImages, loop);
			if (!isControlled) {
				setInternalIndex(normalizedIndex);
			}
			onIndexChange?.(normalizedIndex);
		},
		[isControlled, onIndexChange, totalImages, loop]
	);

	const goToPrevious = useCallback(() => {
		updateIndex(currentIndex - 1);
	}, [updateIndex, currentIndex]);

	const goToNext = useCallback(() => {
		updateIndex(currentIndex + 1);
	}, [updateIndex, currentIndex]);

	return { currentIndex, updateIndex, goToPrevious, goToNext, isControlled, setInternalIndex };
}

function useLightboxIndexReset({
	isControlled,
	initialIndex,
	totalImages,
	setInternalIndex,
}: {
	readonly isControlled: boolean;
	readonly initialIndex: number;
	readonly totalImages: number;
	readonly setInternalIndex: (index: number) => void;
}) {
	useEffect(() => {
		if (!isControlled && initialIndex >= 0 && initialIndex < totalImages) {
			const timeoutId = setTimeout(() => {
				setInternalIndex(initialIndex);
			}, 0);
			return () => {
				clearTimeout(timeoutId);
			};
		}
		return undefined;
	}, [initialIndex, totalImages, isControlled, setInternalIndex]);
}

export function useLightboxState({
	images,
	controlledIndex,
	initialIndex,
	loop,
	onIndexChange,
}: UseLightboxStateParams) {
	const totalImages = images.length;
	const { currentIndex, goToPrevious, goToNext, isControlled, setInternalIndex } =
		useLightboxIndexState({
			controlledIndex,
			initialIndex,
			totalImages,
			loop,
			onIndexChange,
		});

	useLightboxIndexReset({
		isControlled,
		initialIndex,
		totalImages,
		setInternalIndex,
	});

	const goToIndex = useCallback(
		(index: number) => {
			const normalizedIndex = calculateNewIndex(index, totalImages, loop);
			if (!isControlled) {
				setInternalIndex(normalizedIndex);
			}
			onIndexChange?.(normalizedIndex);
		},
		[isControlled, onIndexChange, totalImages, loop, setInternalIndex]
	);

	return { currentIndex, goToIndex, goToPrevious, goToNext, totalImages };
}

interface UseLightboxKeyboardParams {
	readonly goToPrevious: () => void;
	readonly goToNext: () => void;
	readonly onClose: () => void;
	readonly closeOnEscape: boolean;
}

export function useLightboxKeyboard({
	goToPrevious,
	goToNext,
	onClose,
	closeOnEscape,
}: UseLightboxKeyboardParams) {
	return useCallback(
		(e: KeyboardEvent<HTMLElement>) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				goToPrevious();
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				goToNext();
			} else if (e.key === 'Escape' && closeOnEscape) {
				e.preventDefault();
				onClose();
			}
		},
		[goToPrevious, goToNext, onClose, closeOnEscape]
	);
}

export function useLightboxId(lightboxId?: string) {
	const generatedId = useId();
	return lightboxId ?? `lightbox-${generatedId}`;
}
