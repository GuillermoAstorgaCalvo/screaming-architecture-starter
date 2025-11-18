import { initConfig } from '@core/config/init';
import { getRuntimeConfig } from '@core/config/runtime';
import { httpClient } from '@core/lib/http/httpClient';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@core/config/runtime', () => ({
	getRuntimeConfig: vi.fn(),
}));

vi.mock('@core/lib/http/httpClient', () => ({
	httpClient: {
		setDefaultConfig: vi.fn(),
	},
}));

const mockedGetRuntimeConfig = vi.mocked(getRuntimeConfig);
const mockedHttpClient = vi.mocked(httpClient);

describe('initConfig', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('loads runtime config before configuring the httpClient defaults', async () => {
		const runtimeConfig = { API_BASE_URL: 'https://api.example.com' };
		mockedGetRuntimeConfig.mockResolvedValue(runtimeConfig);

		await initConfig();

		expect(mockedGetRuntimeConfig).toHaveBeenCalledTimes(1);
		expect(mockedHttpClient.setDefaultConfig).toHaveBeenCalledWith({
			baseURL: runtimeConfig.API_BASE_URL,
		});

		const [getRuntimeCallOrder = 0] = mockedGetRuntimeConfig.mock.invocationCallOrder;
		const [httpClientCallOrder = 0] = mockedHttpClient.setDefaultConfig.mock.invocationCallOrder;
		expect(httpClientCallOrder).toBeGreaterThan(getRuntimeCallOrder);
	});

	it('skips httpClient configuration when API_BASE_URL is not provided', async () => {
		mockedGetRuntimeConfig.mockResolvedValue({});

		await initConfig();

		expect(mockedHttpClient.setDefaultConfig).not.toHaveBeenCalled();
	});

	it('logs and swallows errors thrown during initialization', async () => {
		const error = new Error('load failure');
		mockedGetRuntimeConfig.mockRejectedValue(error);

		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		await expect(initConfig()).resolves.toBeUndefined();
		expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize configuration:', error);
		expect(mockedHttpClient.setDefaultConfig).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
	});
});
