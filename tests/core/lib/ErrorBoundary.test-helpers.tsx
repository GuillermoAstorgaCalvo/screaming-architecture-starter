/**
 * Test helpers for ErrorBoundary tests
 */

// Component that throws an error during render
export function ThrowError({
	shouldThrow,
	errorMessage,
}: {
	readonly shouldThrow?: boolean;
	readonly errorMessage?: string;
}) {
	if (shouldThrow) {
		throw new Error(errorMessage ?? 'Test error');
	}
	return <div>No error</div>;
}

// Component that throws an error with a stack trace
export function ThrowErrorWithStack(): never {
	const error = new Error('Error with stack');
	Error.captureStackTrace?.(error, ThrowErrorWithStack);
	throw error;
}

// Component that throws a non-Error object
export function ThrowNonError(): never {
	// eslint-disable-next-line no-throw-literal
	throw 'String error';
}
