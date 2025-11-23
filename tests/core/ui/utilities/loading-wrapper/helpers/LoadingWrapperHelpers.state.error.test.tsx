/**
 * LoadingWrapperHelpers.state.error Tests
 *
 * Tests for the error state helper functions including:
 * - buildErrorStateParams
 * - renderErrorStateIfPresent
 */

import {
	buildErrorStateParams,
	renderErrorStateIfPresent,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.error';
import type { LoadingWrapperStateParams } from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const ERROR_OCCURRED = 'Error occurred';

describe('buildErrorStateParams', () => {
	it('builds error state params with all properties', () => {
		const onRetry = () => {};
		const params = buildErrorStateParams({
			error: ERROR_OCCURRED,
			errorComponent: <div>Custom Error</div>,
			onRetry,
			className: 'test-class',
			props: {},
		});

		expect(params.error).toBe(ERROR_OCCURRED);
		expect(params.errorComponent).toBeDefined();
		expect(params.onRetry).toBe(onRetry);
		expect(params.className).toBe('test-class');
		expect(params.props).toEqual({});
	});

	it('filters out undefined properties', () => {
		const params = buildErrorStateParams({
			error: 'Error',
			props: {},
		});

		expect(params.error).toBe('Error');
		expect(params.errorComponent).toBeUndefined();
		expect(params.onRetry).toBeUndefined();
		expect(params.className).toBeUndefined();
	});
});

describe('renderErrorStateIfPresent - basic rendering', () => {
	it('returns null when no error', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: null,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: 'No Data',
			props: {},
		};

		const view = renderErrorStateIfPresent(params);
		expect(view).toBeNull();
	});

	it('renders error state when error is present', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: ERROR_OCCURRED,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: 'No Data',
			props: {},
		};

		const { container } = render(<>{renderErrorStateIfPresent(params)}</>);
		expect(container.textContent).toContain(ERROR_OCCURRED);
	});
});

describe('renderErrorStateIfPresent - custom error component', () => {
	it('renders custom error component when provided', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: 'Error',
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: 'No Data',
			errorComponent: <div data-testid="custom-error">Custom Error</div>,
			props: {},
		};

		render(<>{renderErrorStateIfPresent(params)}</>);
		expect(screen.getByTestId('custom-error')).toBeInTheDocument();
	});
});

describe('renderErrorStateIfPresent - error state styling', () => {
	it('renders error state without className', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: ERROR_OCCURRED,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: 'No Data',
			onRetry: () => {},
			props: {},
		};

		render(<>{renderErrorStateIfPresent(params)}</>);
		const errorContainer = screen.getByRole('alert');
		expect(errorContainer).toBeInTheDocument();
	});

	it('renders error state with className', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: ERROR_OCCURRED,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: 'No Data',
			className: 'custom-error-class',
			props: {},
		};

		render(<>{renderErrorStateIfPresent(params)}</>);
		const errorContainer = screen.getByRole('alert');
		expect(errorContainer).toBeInTheDocument();
		expect(errorContainer).toHaveClass('custom-error-class');
	});
});
