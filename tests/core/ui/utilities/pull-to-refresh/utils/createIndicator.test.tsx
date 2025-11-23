/**
 * createIndicator Utility Tests
 *
 * Tests for the createIndicator utility function:
 * - Indicator style creation
 * - Indicator node creation
 * - Integration with helper functions
 */

import { getIndicatorStyle } from '@core/ui/utilities/pull-to-refresh/helpers/PullToRefreshHelpers';
import { createIndicator } from '@core/ui/utilities/pull-to-refresh/utils/createIndicator';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('createIndicator - Indicator Style Creation', () => {
	it('creates indicator with correct style when idle', () => {
		const result = createIndicator({
			isIdle: true,
			isRefreshing: false,
			canRelease: false,
		});

		expect(result.style).toEqual(getIndicatorStyle(true));
		expect(result.style.transform).toBe('translateY(-100%)');
		expect(result.style.opacity).toBe(0);
	});

	it('creates indicator with correct style when not idle', () => {
		const result = createIndicator({
			isIdle: false,
			isRefreshing: false,
			canRelease: false,
		});

		expect(result.style).toEqual(getIndicatorStyle(false));
		expect(result.style.transform).toBe('translateY(0)');
		expect(result.style.opacity).toBe(1);
	});
});

describe('createIndicator - Indicator Node Creation', () => {
	it('creates pull indicator node', () => {
		const result = createIndicator({
			isIdle: false,
			isRefreshing: false,
			canRelease: false,
		});

		render(<div>{result.node}</div>);

		expect(screen.getByText('Pull to refresh')).toBeInTheDocument();
	});

	it('creates release indicator node', () => {
		const result = createIndicator({
			isIdle: false,
			isRefreshing: false,
			canRelease: true,
		});

		render(<div>{result.node}</div>);

		expect(screen.getByText('Release to refresh')).toBeInTheDocument();
	});

	it('creates refreshing indicator node', () => {
		const result = createIndicator({
			isIdle: false,
			isRefreshing: true,
			canRelease: false,
		});

		render(<div>{result.node}</div>);

		expect(screen.getByRole('status')).toBeInTheDocument();
	});
});

describe('createIndicator - Custom Indicator Usage', () => {
	it('uses custom pull indicator', () => {
		const customPull = <div data-testid="custom-pull">Custom Pull</div>;
		const result = createIndicator({
			isIdle: false,
			isRefreshing: false,
			canRelease: false,
			pullIndicator: customPull,
		});

		render(<div>{result.node}</div>);

		expect(screen.getByTestId('custom-pull')).toBeInTheDocument();
	});

	it('uses custom release indicator', () => {
		const customRelease = <div data-testid="custom-release">Custom Release</div>;
		const result = createIndicator({
			isIdle: false,
			isRefreshing: false,
			canRelease: true,
			releaseIndicator: customRelease,
		});

		render(<div>{result.node}</div>);

		expect(screen.getByTestId('custom-release')).toBeInTheDocument();
	});

	it('uses custom refreshing indicator', () => {
		const customRefreshing = <div data-testid="custom-refreshing">Custom Refreshing</div>;
		const result = createIndicator({
			isIdle: false,
			isRefreshing: true,
			canRelease: false,
			refreshingIndicator: customRefreshing,
		});

		render(<div>{result.node}</div>);

		expect(screen.getByTestId('custom-refreshing')).toBeInTheDocument();
	});
});
