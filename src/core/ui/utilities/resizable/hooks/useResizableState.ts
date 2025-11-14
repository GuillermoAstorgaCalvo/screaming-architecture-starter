import { parseSize, type SizeValue } from '@core/ui/utilities/resizable/helpers/Resizable.helpers';
import { useState } from 'react';

export interface UseResizableStateParams {
	readonly defaultSize: SizeValue | undefined;
	readonly controlledSize: SizeValue | undefined;
}

export interface UseResizableStateReturn {
	readonly currentSize: number | undefined;
	readonly setInternalSize: (size: number) => void;
	readonly isControlled: boolean;
}

/**
 * Manages resizable component state (controlled vs uncontrolled)
 */
export function useResizableState({
	defaultSize,
	controlledSize,
}: UseResizableStateParams): UseResizableStateReturn {
	const [internalSize, setInternalSize] = useState<number | undefined>(
		defaultSize === undefined ? undefined : parseSize(defaultSize)
	);

	const currentSize = controlledSize === undefined ? internalSize : parseSize(controlledSize);

	return { currentSize, setInternalSize, isControlled: controlledSize !== undefined };
}
