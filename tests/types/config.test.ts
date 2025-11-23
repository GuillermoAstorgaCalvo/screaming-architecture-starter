import type {
	ConfigLoaderOptions,
	ConfigOption,
	ConfigValidationError,
	EnvVar,
	EnvVars,
	FeatureFlag,
	FeatureFlags,
} from '@src-types/config';
import { describe, expect, it } from 'vitest';

describe('config types', () => {
	const API_URL_KEY = 'apiUrl';
	const API_BASE_URL = 'https://api.example.com';
	describe('FeatureFlag', () => {
		it('should allow FeatureFlag with all properties', () => {
			const flag: FeatureFlag = {
				key: 'feature1',
				description: 'Test feature',
				defaultValue: false,
				enabled: true,
			};
			expect(flag.key).toBe('feature1');
			expect(flag.description).toBe('Test feature');
			expect(flag.defaultValue).toBe(false);
			expect(flag.enabled).toBe(true);
		});

		it('should allow FeatureFlag without optional properties', () => {
			const flag: FeatureFlag = {
				key: 'feature2',
				enabled: false,
			};
			expect(flag.key).toBe('feature2');
			expect(flag.enabled).toBe(false);
		});
	});

	describe('FeatureFlags', () => {
		it('should allow FeatureFlags as boolean record', () => {
			const flags: FeatureFlags = {
				feature1: true,
				feature2: false,
			};
			expect(flags.feature1).toBe(true);
			expect(flags.feature2).toBe(false);
		});

		it('should allow FeatureFlags as FeatureFlag record', () => {
			const flags: FeatureFlags = {
				feature1: {
					key: 'feature1',
					enabled: true,
				},
				feature2: {
					key: 'feature2',
					enabled: false,
				},
			};
			expect(flags.feature1).toBeDefined();
			if (typeof flags.feature1 === 'object') {
				expect(flags.feature1.enabled).toBe(true);
			}
			expect(flags.feature2).toBeDefined();
			if (typeof flags.feature2 === 'object') {
				expect(flags.feature2.enabled).toBe(false);
			}
		});

		it('should allow mixed FeatureFlags', () => {
			const flags: FeatureFlags = {
				feature1: true,
				feature2: {
					key: 'feature2',
					enabled: false,
				},
			};
			expect(flags.feature1).toBe(true);
			expect(flags.feature2).toBeDefined();
		});
	});

	describe('ConfigOption', () => {
		it('should allow ConfigOption with all properties', () => {
			const option: ConfigOption<string> = {
				key: API_URL_KEY,
				defaultValue: API_BASE_URL,
				required: true,
				description: 'API base URL',
			};
			expect(option.key).toBe(API_URL_KEY);
			expect(option.defaultValue).toBe(API_BASE_URL);
			expect(option.required).toBe(true);
			expect(option.description).toBe('API base URL');
		});

		it('should allow ConfigOption without optional properties', () => {
			const option: ConfigOption<number> = {
				key: 'timeout',
				defaultValue: 5000,
			};
			expect(option.key).toBe('timeout');
			expect(option.defaultValue).toBe(5000);
		});
	});

	describe('ConfigValidationError', () => {
		it('should allow ConfigValidationError with all properties', () => {
			const error: ConfigValidationError = {
				key: API_URL_KEY,
				message: 'Invalid URL format',
				expected: 'Valid URL string',
				actual: 'not-a-url',
			};
			expect(error.key).toBe(API_URL_KEY);
			expect(error.message).toBe('Invalid URL format');
			expect(error.expected).toBe('Valid URL string');
			expect(error.actual).toBe('not-a-url');
		});

		it('should allow ConfigValidationError without optional properties', () => {
			const error: ConfigValidationError = {
				key: API_URL_KEY,
				message: 'Required field missing',
			};
			expect(error.key).toBe(API_URL_KEY);
			expect(error.message).toBe('Required field missing');
		});
	});

	describe('ConfigLoaderOptions', () => {
		it('should allow ConfigLoaderOptions with all properties', () => {
			const options: ConfigLoaderOptions = {
				validate: true,
				throwOnError: true,
				validator: config => {
					return config ? null : [{ key: 'config', message: 'Invalid' }];
				},
			};
			expect(options.validate).toBe(true);
			expect(options.throwOnError).toBe(true);
			expect(options.validator).toBeDefined();
		});

		it('should allow ConfigLoaderOptions without optional properties', () => {
			const options: ConfigLoaderOptions = {};
			expect(options).toBeDefined();
		});
	});

	describe('EnvVar', () => {
		it('should accept string env var', () => {
			const envVar: EnvVar = 'test-value';
			expect(envVar).toBe('test-value');
		});

		it('should accept number env var', () => {
			const envVar: EnvVar = 42;
			expect(envVar).toBe(42);
		});

		it('should accept boolean env var', () => {
			const envVar: EnvVar = true;
			expect(envVar).toBe(true);
		});

		it('should accept undefined env var', () => {
			const envVar: EnvVar = undefined;
			expect(envVar).toBeUndefined();
		});
	});

	describe('EnvVars', () => {
		it('should accept record of env vars', () => {
			const envVars: EnvVars = {
				API_URL: API_BASE_URL,
				PORT: 3000,
				DEBUG: true,
				OPTIONAL: undefined,
			};
			expect(envVars.API_URL).toBe(API_BASE_URL);
			expect(envVars.PORT).toBe(3000);
			expect(envVars.DEBUG).toBe(true);
			expect(envVars.OPTIONAL).toBeUndefined();
		});
	});
});
