import type { SVGProps } from 'react';

/**
 * Standard size variants used across most UI components
 */
export type StandardSize = 'sm' | 'md' | 'lg';

/**
 * Modal size variants (extends StandardSize with xl and full)
 */
export type ModalSize = StandardSize | 'xl' | 'full';

/**
 * Base props for all icon components
 */
export interface BaseIconProps extends SVGProps<SVGSVGElement> {
	/** Size of the icon */
	size?: StandardSize;
}
