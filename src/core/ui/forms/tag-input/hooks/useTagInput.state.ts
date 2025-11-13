import { useCallback, useState } from 'react';

/**
 * Manages tag state (controlled vs uncontrolled)
 */
export function useTagState(
	controlledTags: string[] | undefined,
	defaultTags: string[] | undefined
) {
	const isControlled = controlledTags !== undefined;
	const [internalTags, setInternalTags] = useState<string[]>(defaultTags ?? []);
	const tags = isControlled ? controlledTags : internalTags;

	return {
		tags,
		isControlled,
		setInternalTags,
	};
}

/**
 * Manages input value state (controlled vs uncontrolled)
 */
export function useInputValueState(
	controlledValue: string | undefined,
	defaultValue: string | undefined,
	onValueChange: ((value: string) => void) | undefined
) {
	const [inputValue, setInputValue] = useState(controlledValue ?? defaultValue ?? '');

	const handleInputChange = useCallback(
		(newValue: string) => {
			setInputValue(newValue);
			onValueChange?.(newValue);
		},
		[onValueChange]
	);

	return {
		inputValue,
		setInputValue,
		handleInputChange,
	};
}

/**
 * Hook to create a handler for removing tags
 */
export function useRemoveTagHandler(
	tags: readonly string[],
	onChange: ((tags: string[]) => void) | undefined,
	internalState?: {
		isControlled: boolean;
		setInternalTags: (tags: string[]) => void;
	}
) {
	return useCallback(
		(tagToRemove: string) => {
			const newTags = tags.filter(tag => tag !== tagToRemove);
			if (internalState && !internalState.isControlled) {
				internalState.setInternalTags(newTags);
			}
			onChange?.(newTags);
		},
		[tags, onChange, internalState]
	);
}
