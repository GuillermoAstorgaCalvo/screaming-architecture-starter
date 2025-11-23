/**
 * LoadingWrapperHelpers.state.build Tests
 *
 * Tests for the buildStateParams function including:
 * - Default values
 * - Optional props handling
 * - i18n integration
 */

import { buildStateParams } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.build';
import { describe, expect, it } from 'vitest';

describe('buildStateParams - default values', () => {
	it('builds state params with default values', () => {
		const props = {};
		const params = buildStateParams(props);

		expect(params.isLoading).toBe(false);
		expect(params.error).toBe(null);
		expect(params.isEmpty).toBe(false);
		expect(params.useSkeleton).toBe(false);
		expect(params.emptyTitle).toBeDefined();
		expect(params.props).toEqual({});
	});
});

describe('buildStateParams - provided values', () => {
	it('builds state params with provided values', () => {
		const props = {
			isLoading: true,
			error: 'Error',
			isEmpty: true,
			useSkeleton: true,
			emptyTitle: 'Custom Title',
		};
		const params = buildStateParams(props);

		expect(params.isLoading).toBe(true);
		expect(params.error).toBe('Error');
		expect(params.isEmpty).toBe(true);
		expect(params.useSkeleton).toBe(true);
		expect(params.emptyTitle).toBe('Custom Title');
	});
});

describe('buildStateParams - optional props', () => {
	it('handles optional props', () => {
		const props = {
			onRetry: () => {},
			emptyMessage: 'No items',
			loadingComponent: <div>Loading</div>,
			loadingText: 'Loading...',
		};
		const params = buildStateParams(props);

		expect(params.onRetry).toBeDefined();
		expect(params.emptyMessage).toBe('No items');
		expect(params.loadingComponent).toBeDefined();
		expect(params.loadingText).toBe('Loading...');
	});

	it('filters out undefined optional props', () => {
		const props = {
			isLoading: false,
			onRetry: undefined,
			emptyMessage: undefined,
		};
		const params = buildStateParams(props);

		expect(params.isLoading).toBe(false);
		// Optional props should not be included if undefined
		expect(params.onRetry).toBeUndefined();
		expect(params.emptyMessage).toBeUndefined();
	});
});

describe('buildStateParams - rest props', () => {
	it('preserves rest props', () => {
		const props = {
			isLoading: true,
			className: 'custom-class',
			'data-testid': 'wrapper',
		};
		const params = buildStateParams(props);

		expect(params.props.className).toBe('custom-class');
		expect(params.props['data-testid']).toBe('wrapper');
	});
});
