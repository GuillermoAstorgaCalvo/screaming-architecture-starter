import { InvalidResourceFormatError, ResourceLoaderNotFoundError } from '@core/i18n/errors';
import { describe, expect, it } from 'vitest';

const TEST_NAMESPACE = 'test-namespace';

function describeResourceLoaderNotFoundError() {
	describe('ResourceLoaderNotFoundError', () => {
		it('should create error with correct message', () => {
			const error = new ResourceLoaderNotFoundError(TEST_NAMESPACE);
			expect(error.message).toBe('No resource loader registered for namespace: test-namespace');
			expect(error.name).toBe('ResourceLoaderNotFoundError');
		});

		it('should be an instance of Error', () => {
			const error = new ResourceLoaderNotFoundError(TEST_NAMESPACE);
			expect(error).toBeInstanceOf(Error);
		});

		it('should include namespace in message', () => {
			const namespace = 'my-namespace';
			const error = new ResourceLoaderNotFoundError(namespace);
			expect(error.message).toContain(namespace);
		});

		it('should have correct error name', () => {
			const error = new ResourceLoaderNotFoundError('test');
			expect(error.name).toBe('ResourceLoaderNotFoundError');
		});
	});
}

function describeInvalidResourceFormatError() {
	describe('InvalidResourceFormatError', () => {
		it('should create error with correct message without reason', () => {
			const error = new InvalidResourceFormatError(TEST_NAMESPACE, 'en');
			expect(error.message).toBe(
				'Invalid resource format for namespace "test-namespace", language "en"'
			);
			expect(error.name).toBe('InvalidResourceFormatError');
		});

		it('should create error with correct message with reason', () => {
			const reason = 'Missing default export';
			const error = new InvalidResourceFormatError(TEST_NAMESPACE, 'en', reason);
			expect(error.message).toBe(
				`Invalid resource format for namespace "test-namespace", language "en": ${reason}`
			);
			expect(error.name).toBe('InvalidResourceFormatError');
		});

		it('should be an instance of Error', () => {
			const error = new InvalidResourceFormatError(TEST_NAMESPACE, 'en');
			expect(error).toBeInstanceOf(Error);
		});

		it('should include namespace and language in message', () => {
			const namespace = 'my-namespace';
			const language = 'es';
			const error = new InvalidResourceFormatError(namespace, language);
			expect(error.message).toContain(namespace);
			expect(error.message).toContain(language);
		});

		it('should include reason when provided', () => {
			const reason = 'Invalid JSON structure';
			const error = new InvalidResourceFormatError('test', 'en', reason);
			expect(error.message).toContain(reason);
		});

		it('should have correct error name', () => {
			const error = new InvalidResourceFormatError('test', 'en');
			expect(error.name).toBe('InvalidResourceFormatError');
		});

		it('should handle empty reason', () => {
			const error = new InvalidResourceFormatError('test', 'en', '');
			// Empty reason should not append colon and empty string
			expect(error.message).toBe('Invalid resource format for namespace "test", language "en"');
		});
	});
}

describe('i18n errors', () => {
	describeResourceLoaderNotFoundError();
	describeInvalidResourceFormatError();
});
