import type { ResizableProps } from '@src-types/ui/overlays/containers';

export type SizeValue = string | number;

/**
 * Parses a size value (string or number) to pixels
 */
export function parseSize(size: SizeValue): number {
	if (typeof size === 'number') {
		return size;
	}
	// Remove 'px' or '%' and parse
	return Number.parseFloat(size);
}

/**
 * Gets optional props object, only including defined values
 */
export function getOptionalProps(
	className: string | undefined,
	handleClassName: string | undefined,
	style: ResizableProps['style']
) {
	return {
		...(className !== undefined && { className }),
		...(handleClassName !== undefined && { handleClassName }),
		...(style !== undefined && { style }),
	};
}
