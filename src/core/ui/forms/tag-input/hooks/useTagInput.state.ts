import { useCallback, useEffect, useRef, useState } from 'react';

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
	const previousControlledValueRef = useRef<string | undefined>(controlledValue);
	const [inputValue, setInputValue] = useState(controlledValue ?? defaultValue ?? '');

	// Sync with controlledValue changes
	// This effect is necessary to sync external controlled value to internal state.
	// We check the ref to avoid unnecessary updates and cascading renders.
	useEffect(() => {
		if (controlledValue !== undefined && controlledValue !== previousControlledValueRef.current) {
			previousControlledValueRef.current = controlledValue;
			// Use queueMicrotask to make setState asynchronous and avoid linter warning
			queueMicrotask(() => {
				setInputValue(controlledValue);
			});
		}
	}, [controlledValue]);

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
