import type { RefObject } from 'react';
import SignatureCanvas from 'react-signature-canvas';

import type { getCanvasProps } from './SignaturePadCanvasHelpers';
import { SignaturePadClearButton } from './SignaturePadClearButton';

export interface SignaturePadCanvasContentProps {
	readonly canvasRef: RefObject<SignatureCanvas | null>;
	readonly canvasProps: ReturnType<typeof getCanvasProps>;
	readonly backgroundColor: string;
	readonly penColor: string;
	readonly velocityFilterWeight: number;
	readonly minWidth: number;
	readonly maxWidth: number;
	readonly throttle: number;
	readonly onEnd: () => void;
	readonly showClearButton: boolean;
	readonly disabled: boolean;
	readonly clearButtonText: string;
	readonly onClear: () => void;
}

/**
 * Signature pad content component
 */
export function SignaturePadCanvasContent({
	canvasRef,
	canvasProps,
	backgroundColor,
	penColor,
	velocityFilterWeight,
	minWidth,
	maxWidth,
	throttle,
	onEnd,
	showClearButton,
	disabled,
	clearButtonText,
	onClear,
}: Readonly<SignaturePadCanvasContentProps>) {
	return (
		<div className="relative inline-block">
			{/* @ts-expect-error - react-signature-canvas has incompatible types */}
			<SignatureCanvas
				ref={canvasRef}
				canvasProps={canvasProps}
				backgroundColor={backgroundColor}
				penColor={penColor}
				velocityFilterWeight={velocityFilterWeight}
				minWidth={minWidth}
				maxWidth={maxWidth}
				throttle={throttle}
				onEnd={onEnd}
			/>
			{showClearButton && !disabled ? (
				<SignaturePadClearButton onClick={onClear} label={clearButtonText} />
			) : null}
		</div>
	);
}
