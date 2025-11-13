import type { SignaturePadProps } from '@src-types/ui/media';

import { SignaturePadContent } from './SignaturePadContent';
import { useSignaturePadProps } from './useSignaturePad';

/**
 * SignaturePad - Signature capture component
 *
 * Features:
 * - Canvas-based signature capture
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Clear button support
 *
 * @example
 * ```tsx
 * <SignaturePad
 *   label="Signature"
 *   placeholder="Sign here"
 *   required
 *   error={errors.signature}
 *   helperText="Please sign in the box above"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <SignaturePad
 *   label="Digital Signature"
 *   width={600}
 *   height={200}
 *   penColor="#000000"
 *   backgroundColor="#FFFFFF"
 *   showClearButton
 *   onChange={(dataUrl) => console.log('Signature:', dataUrl)}
 * />
 * ```
 */
export default function SignaturePad(props: Readonly<SignaturePadProps>) {
	const { state, canvasProps, label, error, helperText, required, fullWidth, ...rest } =
		useSignaturePadProps({ props });

	return (
		<SignaturePadContent
			state={state}
			canvasProps={canvasProps}
			label={label}
			error={error}
			helperText={helperText}
			required={required}
			fullWidth={fullWidth}
			{...rest}
		/>
	);
}
