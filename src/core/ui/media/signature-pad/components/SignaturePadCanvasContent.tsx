import { SignaturePadClearButton } from '@core/ui/media/signature-pad/components/SignaturePadClearButton';
import type { getCanvasProps } from '@core/ui/media/signature-pad/helpers/SignaturePadCanvasHelpers';
import type { RefObject } from 'react';
import SignatureCanvas from 'react-signature-canvas';

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
			{/* @ts-expect-error - react-signature-canvas alpha (1.1.0-alpha.2) has incompatible React component types with @types/react-signature-canvas (^1.0.7). The componentDidMount type signature doesn't match React's expected Component type. This is a known issue with the library's type definitions. The component works correctly at runtime. */}
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
