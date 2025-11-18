import { useFormAdapter } from '@core/forms/formAdapter';
import { useController } from '@core/forms/useController';
import { renderHook } from '@testing-library/react';
import { type ReactNode, useLayoutEffect } from 'react';

export const EMAIL_ERROR_MESSAGE = 'Invalid email address';
export const MIN_LENGTH_ERROR_MESSAGE = 'Name must be at least 3 characters';
export const INVALID_CODE_MESSAGE = 'Invalid code';

/**
 * Test helper to render useController hook with form context
 */
export function renderUseController<T extends Record<string, unknown>>(
	controllerProps: Parameters<typeof useController<T>>[0],
	formOptions?: Parameters<typeof useFormAdapter<T>>[0]
) {
	const formControlsRef: { current: ReturnType<typeof useFormAdapter<T>> | null } = {
		current: null,
	};

	const Wrapper = ({ children }: { children: ReactNode }) => {
		const formControls = useFormAdapter<T>(formOptions);

		// Use useLayoutEffect to update refs synchronously before paint
		// This ensures formControlsRef is set before the hook callback runs
		// useLayoutEffect runs synchronously, so the ref will be available
		// when renderHook calls the hook callback
		useLayoutEffect(() => {
			formControlsRef.current = formControls;
		}, [formControls]);

		// Set ref synchronously for immediate access in test helper
		// This is necessary because renderHook calls the hook callback during render,
		// before useLayoutEffect runs. In test helpers, this pattern is acceptable.
		// Suppress lint: test helpers need to modify external refs for test setup
		// This is a known pattern in React testing libraries for sharing state between wrapper and hook
		// eslint-disable-next-line -- Test helper pattern: need to share ref between wrapper and hook callback
		formControlsRef.current = formControls;

		return children;
	};

	const { result, rerender } = renderHook(
		() => {
			if (!formControlsRef.current) {
				throw new Error('Form controls not initialized');
			}
			return useController<T>({
				...controllerProps,
				control: formControlsRef.current.control,
			});
		},
		{ wrapper: Wrapper }
	);

	// Wait for form controls to be initialized
	if (!formControlsRef.current) {
		// In test environment, useLayoutEffect should have run synchronously
		// But if not, we'll wait a tick
		throw new Error('Form controls not initialized');
	}

	const typedFormControls: ReturnType<typeof useFormAdapter<T>> = formControlsRef.current;

	return {
		result,
		rerender,
		formControls: typedFormControls,
	};
}
