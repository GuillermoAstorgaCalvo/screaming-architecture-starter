import type { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { expect } from 'vitest';

export const TEST_DATE_STRING = '2024-01-01T00:00:00Z';
export const UNSERIALIZABLE_PLACEHOLDER = '[Unserializable]';

export function assertRequestUrlContains(http: MockHttpAdapter, ...substrings: string[]) {
	expect(http.requests).toHaveLength(1);
	for (const substring of substrings) {
		expect(http.requests[0]?.url).toContain(substring);
	}
}

export function assertRequestUrlEquals(http: MockHttpAdapter, expectedUrl: string) {
	expect(http.requests).toHaveLength(1);
	expect(http.requests[0]?.url).toBe(expectedUrl);
}
