import { SignaturePadCanvasContent } from './SignaturePadCanvasContent';
import { normalizeProps } from './SignaturePadCanvasHelpers';
import type { SignaturePadCanvasProps } from './SignaturePadTypes';
import { useSignaturePadSetup } from './useSignaturePadSetup';

/**
 * SignaturePadCanvas - Canvas component for capturing signatures
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Customizable dimensions, colors, and behavior
 * - Clear button support
 * - Disabled state
 * - Value synchronization
 */
export function SignaturePadCanvas(props: Readonly<SignaturePadCanvasProps>) {
	const normalized = normalizeProps(props);
	const { canvasRef, canvasProps, handleEnd, handleClear } = useSignaturePadSetup({
		id: normalized.id,
		width: normalized.width,
		height: normalized.height,
		canvasClassName: normalized.canvasClassName,
		backgroundColor: normalized.backgroundColor,
		disabled: normalized.disabled,
		value: normalized.value,
		defaultValue: normalized.defaultValue,
		onChange: normalized.onChange,
		onClear: normalized.onClear,
	});

	return (
		<SignaturePadCanvasContent
			canvasRef={canvasRef}
			canvasProps={canvasProps}
			backgroundColor={normalized.backgroundColor}
			penColor={normalized.penColor}
			velocityFilterWeight={normalized.velocityFilterWeight}
			minWidth={normalized.minWidth}
			maxWidth={normalized.maxWidth}
			throttle={normalized.throttle}
			onEnd={handleEnd}
			showClearButton={normalized.showClearButton}
			disabled={normalized.disabled}
			clearButtonText={normalized.clearButtonText}
			onClear={handleClear}
		/>
	);
}
