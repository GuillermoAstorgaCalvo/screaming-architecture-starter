import { type RefObject, useEffect } from 'react';
import type SignatureCanvas from 'react-signature-canvas';

export interface UseSignaturePadValueOptions {
	readonly canvasRef: RefObject<SignatureCanvas | null>;
	readonly value?: string | null | undefined;
	readonly defaultValue?: string | null | undefined;
}

/**
 * Hook to synchronize signature pad canvas with value and defaultValue props
 */
export function useSignaturePadValue({
	canvasRef,
	value,
	defaultValue,
}: Readonly<UseSignaturePadValueOptions>): void {
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || value === undefined) {
			return;
		}
		if (value === null) {
			canvas.clear();
		} else {
			canvas.fromDataURL(value);
		}
	}, [canvasRef, value]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || defaultValue === undefined || value !== undefined) {
			return;
		}
		if (defaultValue === null) {
			canvas.clear();
		} else {
			canvas.fromDataURL(defaultValue);
		}
	}, [canvasRef, defaultValue, value]);
}
