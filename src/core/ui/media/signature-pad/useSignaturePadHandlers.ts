import { type RefObject, useCallback } from 'react';
import type SignatureCanvas from 'react-signature-canvas';

export interface UseSignaturePadHandlersOptions {
	readonly canvasRef: RefObject<SignatureCanvas | null>;
	readonly onChange?: ((dataUrl: string | null) => void) | undefined;
	readonly onClear?: (() => void) | undefined;
}

export interface UseSignaturePadHandlersReturn {
	readonly handleEnd: () => void;
	readonly handleClear: () => void;
}

/**
 * Hook to create signature pad event handlers
 */
export function useSignaturePadHandlers({
	canvasRef,
	onChange,
	onClear,
}: Readonly<UseSignaturePadHandlersOptions>): UseSignaturePadHandlersReturn {
	const handleEnd = useCallback(() => {
		if (!canvasRef.current || !onChange) {
			return;
		}
		const dataUrl = canvasRef.current.isEmpty() ? null : canvasRef.current.toDataURL();
		onChange(dataUrl);
	}, [canvasRef, onChange]);

	const handleClear = useCallback(() => {
		if (!canvasRef.current) {
			return;
		}
		canvasRef.current.clear();
		onChange?.(null);
		onClear?.();
	}, [canvasRef, onChange, onClear]);

	return { handleEnd, handleClear };
}
