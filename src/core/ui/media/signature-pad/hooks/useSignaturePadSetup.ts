import { getCanvasProps } from '@core/ui/media/signature-pad/helpers/SignaturePadCanvasHelpers';
import { useSignaturePadHandlers } from '@core/ui/media/signature-pad/hooks/useSignaturePadHandlers';
import { useSignaturePadValue } from '@core/ui/media/signature-pad/hooks/useSignaturePadValue';
import { type RefObject, useRef } from 'react';
import type SignatureCanvas from 'react-signature-canvas';

export interface UseSignaturePadSetupOptions {
	readonly id: string | undefined;
	readonly width: number;
	readonly height: number;
	readonly canvasClassName?: string | undefined;
	readonly backgroundColor: string;
	readonly disabled: boolean;
	readonly value?: string | null | undefined;
	readonly defaultValue?: string | null | undefined;
	readonly onChange?: ((dataUrl: string | null) => void) | undefined;
	readonly onClear?: (() => void) | undefined;
}

export interface UseSignaturePadSetupReturn {
	readonly canvasRef: RefObject<SignatureCanvas | null>;
	readonly canvasProps: ReturnType<typeof getCanvasProps>;
	readonly handleEnd: () => void;
	readonly handleClear: () => void;
}

/**
 * Hook to set up signature pad canvas, handlers, and props
 */
export function useSignaturePadSetup({
	id,
	width,
	height,
	canvasClassName,
	backgroundColor,
	disabled,
	value,
	defaultValue,
	onChange,
	onClear,
}: Readonly<UseSignaturePadSetupOptions>): UseSignaturePadSetupReturn {
	const canvasRef = useRef<SignatureCanvas>(null);

	useSignaturePadValue({ canvasRef, value, defaultValue });

	const { handleEnd, handleClear } = useSignaturePadHandlers({
		canvasRef,
		onChange,
		onClear,
	});

	const canvasProps = getCanvasProps({
		id,
		width,
		height,
		canvasClassName,
		backgroundColor,
		disabled,
	});

	return { canvasRef, canvasProps, handleEnd, handleClear };
}
