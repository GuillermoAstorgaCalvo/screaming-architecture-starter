/**
 * useResolvedApiKey Tests
 *
 * Tests for the useResolvedApiKey hook:
 * - API key resolution priority (props > runtime > env)
 * - Memoization behavior
 * - Edge cases
 */

import { env } from '@core/config/env.client';
import { getCachedRuntimeConfig } from '@core/config/runtime';
import { useResolvedApiKey } from '@core/ui/media/map/hooks/useResolvedApiKey';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/config/env.client', () => ({
	env: {
		GOOGLE_MAPS_API_KEY: undefined,
	},
}));

vi.mock('@core/config/runtime', () => ({
	getCachedRuntimeConfig: vi.fn(),
}));

describe('useResolvedApiKey', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset env mock
		delete (env as { GOOGLE_MAPS_API_KEY?: string }).GOOGLE_MAPS_API_KEY;
		vi.mocked(getCachedRuntimeConfig).mockReturnValue(null);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should return API key from props when provided', () => {
		const { result } = renderHook(() => useResolvedApiKey('prop-api-key'));

		expect(result.current).toBe('prop-api-key');
	});

	it('should return API key from runtime config when props not provided', () => {
		vi.mocked(getCachedRuntimeConfig).mockReturnValue({
			GOOGLE_MAPS_API_KEY: 'runtime-api-key',
		} as ReturnType<typeof getCachedRuntimeConfig>);

		const { result } = renderHook(() => useResolvedApiKey());

		expect(result.current).toBe('runtime-api-key');
		expect(getCachedRuntimeConfig).toHaveBeenCalled();
	});

	it('should return API key from env when props and runtime not provided', () => {
		(env as { GOOGLE_MAPS_API_KEY?: string }).GOOGLE_MAPS_API_KEY = 'env-api-key';

		const { result } = renderHook(() => useResolvedApiKey());

		expect(result.current).toBe('env-api-key');
	});

	it('should return null when no API key is available', () => {
		const { result } = renderHook(() => useResolvedApiKey());

		expect(result.current).toBeNull();
	});

	it('should prioritize props over runtime config', () => {
		vi.mocked(getCachedRuntimeConfig).mockReturnValue({
			GOOGLE_MAPS_API_KEY: 'runtime-api-key',
		} as ReturnType<typeof getCachedRuntimeConfig>);

		const { result } = renderHook(() => useResolvedApiKey('prop-api-key'));

		expect(result.current).toBe('prop-api-key');
		expect(getCachedRuntimeConfig).not.toHaveBeenCalled();
	});

	it('should prioritize props over env', () => {
		(env as { GOOGLE_MAPS_API_KEY?: string }).GOOGLE_MAPS_API_KEY = 'env-api-key';

		const { result } = renderHook(() => useResolvedApiKey('prop-api-key'));

		expect(result.current).toBe('prop-api-key');
	});

	it('should prioritize runtime config over env', () => {
		vi.mocked(getCachedRuntimeConfig).mockReturnValue({
			GOOGLE_MAPS_API_KEY: 'runtime-api-key',
		} as ReturnType<typeof getCachedRuntimeConfig>);
		(env as { GOOGLE_MAPS_API_KEY?: string }).GOOGLE_MAPS_API_KEY = 'env-api-key';

		const { result } = renderHook(() => useResolvedApiKey());

		expect(result.current).toBe('runtime-api-key');
	});

	it('should memoize result when apiKey prop does not change', () => {
		const { result, rerender } = renderHook(
			({ apiKey }: { apiKey?: string }) => useResolvedApiKey(apiKey),
			{
				initialProps: { apiKey: 'test-key' },
			}
		);

		const firstResult = result.current;

		rerender({ apiKey: 'test-key' });

		expect(result.current).toBe(firstResult);
	});

	it('should update result when apiKey prop changes', () => {
		const { result, rerender } = renderHook(
			({ apiKey }: { apiKey?: string }) => useResolvedApiKey(apiKey),
			{
				initialProps: { apiKey: 'first-key' },
			}
		);

		expect(result.current).toBe('first-key');

		rerender({ apiKey: 'second-key' });

		expect(result.current).toBe('second-key');
	});

	it('should handle undefined apiKey prop', () => {
		const { result } = renderHook(() => useResolvedApiKey());

		expect(result.current).toBeNull();
	});

	it('should handle empty string apiKey prop', () => {
		const { result } = renderHook(() => useResolvedApiKey(''));

		// Empty string is falsy, so it falls through to runtime/env resolution
		expect(result.current).toBeNull();
	});

	it('should handle runtime config with undefined GOOGLE_MAPS_API_KEY', () => {
		vi.mocked(getCachedRuntimeConfig).mockReturnValue({
			GOOGLE_MAPS_API_KEY: undefined,
		} as ReturnType<typeof getCachedRuntimeConfig>);

		const { result } = renderHook(() => useResolvedApiKey());

		expect(result.current).toBeNull();
	});
});
