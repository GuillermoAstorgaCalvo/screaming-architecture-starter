import type {
	CookieOptions,
	HttpAdapterConfig,
	LoggerAdapterConfig,
	PortAdapterConfig,
	StorageAdapterConfig,
} from '@src-types/ports';
import { describe, expect, it } from 'vitest';

describe('ports types', () => {
	const TEST_ADAPTER_NAME = 'test-adapter';

	describe('PortAdapterConfig', () => {
		it('should allow PortAdapterConfig with all properties', () => {
			const config: PortAdapterConfig = {
				name: TEST_ADAPTER_NAME,
				enabled: true,
				config: { key: 'value' },
			};
			expect(config.name).toBe(TEST_ADAPTER_NAME);
			expect(config.enabled).toBe(true);
			expect(config.config).toEqual({ key: 'value' });
		});

		it('should allow PortAdapterConfig without optional properties', () => {
			const config: PortAdapterConfig = {
				name: TEST_ADAPTER_NAME,
			};
			expect(config.name).toBe(TEST_ADAPTER_NAME);
		});
	});

	describe('StorageAdapterConfig', () => {
		it('should allow StorageAdapterConfig with all properties', () => {
			const config: StorageAdapterConfig = {
				name: 'storage-adapter',
				enabled: true,
				type: 'localStorage',
				keyPrefix: 'app_',
				options: {
					defaultExpiration: 3600000,
					encrypt: true,
				},
			};
			expect(config.name).toBe('storage-adapter');
			expect(config.enabled).toBe(true);
			expect(config.type).toBe('localStorage');
			expect(config.keyPrefix).toBe('app_');
			expect(config.options?.defaultExpiration).toBe(3600000);
			expect(config.options?.encrypt).toBe(true);
		});

		it('should accept all storage types', () => {
			const types: StorageAdapterConfig['type'][] = [
				'localStorage',
				'sessionStorage',
				'cookie',
				'memory',
			];
			expect(types).toHaveLength(4);
		});
	});

	describe('LoggerAdapterConfig', () => {
		it('should allow LoggerAdapterConfig with all properties', () => {
			const config: LoggerAdapterConfig = {
				name: 'logger-adapter',
				enabled: true,
				minLevel: 'info',
				includeTimestamp: true,
				includeStackTrace: true,
				formatter: (level, message, _context) => {
					return `${level}: ${message}`;
				},
			};
			expect(config.name).toBe('logger-adapter');
			expect(config.enabled).toBe(true);
			expect(config.minLevel).toBe('info');
			expect(config.includeTimestamp).toBe(true);
			expect(config.includeStackTrace).toBe(true);
			expect(config.formatter).toBeDefined();
		});

		it('should accept all log levels', () => {
			const levels: LoggerAdapterConfig['minLevel'][] = ['debug', 'info', 'warn', 'error'];
			expect(levels).toHaveLength(4);
		});
	});

	describe('HttpAdapterConfig', () => {
		it('should allow HttpAdapterConfig with all properties', () => {
			const config: HttpAdapterConfig = {
				name: 'http-adapter',
				enabled: true,
				baseURL: 'https://api.example.com',
				defaultTimeout: 5000,
				defaultHeaders: { 'Content-Type': 'application/json' },
				retryOnFailure: true,
				maxRetries: 3,
			};
			expect(config.name).toBe('http-adapter');
			expect(config.enabled).toBe(true);
			expect(config.baseURL).toBe('https://api.example.com');
			expect(config.defaultTimeout).toBe(5000);
			expect(config.defaultHeaders).toEqual({ 'Content-Type': 'application/json' });
			expect(config.retryOnFailure).toBe(true);
			expect(config.maxRetries).toBe(3);
		});
	});

	describe('CookieOptions', () => {
		it('should allow CookieOptions with all properties', () => {
			const options: CookieOptions = {
				expiresDays: 30,
				path: '/',
				sameSite: 'Lax',
				secure: true,
				domain: 'example.com',
			};
			expect(options.expiresDays).toBe(30);
			expect(options.path).toBe('/');
			expect(options.sameSite).toBe('Lax');
			expect(options.secure).toBe(true);
			expect(options.domain).toBe('example.com');
		});

		it('should accept all SameSite values', () => {
			const sameSiteValues: CookieOptions['sameSite'][] = ['Strict', 'Lax', 'None'];
			expect(sameSiteValues).toHaveLength(3);
		});
	});
});
