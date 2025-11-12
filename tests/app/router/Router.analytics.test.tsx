import Router from '@app/router';
import { act, waitFor } from '@testing-library/react';
import { MockAnalyticsAdapter } from '@tests/utils/mocks/MockAnalyticsAdapter';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Router analytics tracking', () => {
	it('tracks page views on initial load and navigation changes', async () => {
		const analytics = new MockAnalyticsAdapter();

		renderWithProviders(<Router />, { analytics });

		await waitFor(() => {
			expect(analytics.pageViews.length).toBeGreaterThanOrEqual(1);
		});

		expect(analytics.pageViews[0]).toMatchObject({
			path: '/',
		});

		act(() => {
			globalThis.history.pushState({}, '', '/missing');
			globalThis.dispatchEvent(new PopStateEvent('popstate'));
		});

		await waitFor(() => {
			expect(analytics.pageViews.length).toBeGreaterThanOrEqual(2);
		});

		expect(analytics.pageViews.at(-1)).toMatchObject({
			path: '/missing',
		});
	});
});
