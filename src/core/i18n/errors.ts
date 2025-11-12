/**
 * i18n Error classes
 * Custom error classes for i18n resource loading
 */

/**
 * Error thrown when resource loader is not found
 */
// eslint-disable-next-line max-classes-per-file
export class ResourceLoaderNotFoundError extends Error {
	constructor(namespace: string) {
		super(`No resource loader registered for namespace: ${namespace}`);
		this.name = 'ResourceLoaderNotFoundError';
	}
}

/**
 * Error thrown when resource format is invalid
 */
export class InvalidResourceFormatError extends Error {
	constructor(namespace: string, language: string, reason?: string) {
		const message = `Invalid resource format for namespace "${namespace}", language "${language}"${
			reason ? `: ${reason}` : ''
		}`;
		super(message);
		this.name = 'InvalidResourceFormatError';
	}
}
