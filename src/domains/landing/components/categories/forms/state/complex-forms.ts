import { useState } from 'react';

/**
 * State hook for complex form controls (inline edit, transfer)
 */
export function useComplexFormsState() {
	const [inlineEditValue, setInlineEditValue] = useState('Click to edit');
	const [transferValue, setTransferValue] = useState<string[]>([]);

	return {
		inlineEditValue,
		setInlineEditValue,
		transferValue,
		setTransferValue,
	};
}
