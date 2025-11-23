import { InvalidResourceFormatError, ResourceLoaderNotFoundError } from '@core/i18n/errors';
import { describe, expect, it } from 'vitest';

describe('ResourceLoaderNotFoundError', () => {
	it('creates error with correct message and name', () => {
		const namespace = 'testNamespace';
		const error = new ResourceLoaderNotFoundError(namespace);

		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe('ResourceLoaderNotFoundError');
		expect(error.message).toBe(`No resource loader registered for namespace: ${namespace}`);
	});

	it('creates error with different namespace', () => {
		const namespace = 'anotherNamespace';
		const error = new ResourceLoaderNotFoundError(namespace);

		expect(error.message).toBe(`No resource loader registered for namespace: ${namespace}`);
	});

	it('has correct error name', () => {
		const error = new ResourceLoaderNotFoundError('test');
		expect(error.name).toBe('ResourceLoaderNotFoundError');
	});
});

describe('InvalidResourceFormatError', () => {
	it('creates error with correct message and name when reason is provided', () => {
		const namespace = 'testNamespace';
		const language = 'en';
		const reason = 'Invalid JSON format';
		const error = new InvalidResourceFormatError(namespace, language, reason);

		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe('InvalidResourceFormatError');
		expect(error.message).toBe(
			`Invalid resource format for namespace "${namespace}", language "${language}": ${reason}`
		);
	});

	it('creates error with correct message when reason is not provided', () => {
		const namespace = 'testNamespace';
		const language = 'en';
		const error = new InvalidResourceFormatError(namespace, language);

		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe('InvalidResourceFormatError');
		expect(error.message).toBe(
			`Invalid resource format for namespace "${namespace}", language "${language}"`
		);
	});

	it('creates error with different namespace and language', () => {
		const namespace = 'anotherNamespace';
		const language = 'fr';
		const reason = 'Missing required fields';
		const error = new InvalidResourceFormatError(namespace, language, reason);

		expect(error.message).toBe(
			`Invalid resource format for namespace "${namespace}", language "${language}": ${reason}`
		);
	});

	it('handles empty reason string as undefined', () => {
		const namespace = 'testNamespace';
		const language = 'en';
		const reason = '';
		const error = new InvalidResourceFormatError(namespace, language, reason);

		// Empty string is falsy, so it's treated as undefined
		expect(error.message).toBe(
			`Invalid resource format for namespace "${namespace}", language "${language}"`
		);
	});

	it('has correct error name', () => {
		const error = new InvalidResourceFormatError('test', 'en');
		expect(error.name).toBe('InvalidResourceFormatError');
	});
});
