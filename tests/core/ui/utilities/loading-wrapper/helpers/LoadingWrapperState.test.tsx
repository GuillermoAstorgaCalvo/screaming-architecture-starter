/**
 * LoadingWrapperState Tests
 *
 * Tests for the LoadingWrapperState helper functions including:
 * - renderErrorStateIfPresent function
 * - renderLoadingStateIfPresent function
 * - renderEmptyStateIfPresent function
 * - renderState function (main state renderer)
 * - State transitions and conditional rendering
 * - All edge cases (null/undefined handling)
 */

import { ARIA_LABELS } from '@core/constants/aria';
import {
	renderEmptyStateIfPresent,
	renderErrorStateIfPresent,
	renderLoadingStateIfPresent,
	renderState,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperState';
import type { LoadingWrapperStateParams } from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const DEFAULT_EMPTY_TITLE = 'No Data';
const ERROR_MESSAGE = 'Error occurred';
const TEST_ID_ERROR = 'loading-wrapper-error';
const TEST_ID_LOADING = 'loading-wrapper-loading';
const TEST_ID_SKELETON = 'skeleton-wrapper';
const TEST_ID_EMPTY = 'empty-state-wrapper';
const TEST_ID_SUCCESS = 'success-wrapper';
const CUSTOM_ERROR_CLASS = 'custom-error-class';
const CUSTOM_LOADING_CLASS = 'custom-loading-class';
const CUSTOM_EMPTY_CLASS = 'custom-empty-class';
const CUSTOM_SUCCESS_CLASS = 'custom-success-class';

// Helper function to create base params
function createBaseParams(
	overrides?: Partial<LoadingWrapperStateParams>
): LoadingWrapperStateParams {
	return {
		isLoading: false,
		error: null,
		isEmpty: false,
		useSkeleton: false,
		emptyTitle: DEFAULT_EMPTY_TITLE,
		props: {},
		...overrides,
	};
}

describe('renderErrorStateIfPresent', () => {
	describe('null/undefined handling', () => {
		it('returns null when error is null', () => {
			const params = createBaseParams({ error: null });
			const view = renderErrorStateIfPresent(params);
			expect(view).toBeNull();
		});

		it('returns null when error is undefined', () => {
			const params = createBaseParams({ error: undefined as unknown as null });
			const view = renderErrorStateIfPresent(params);
			expect(view).toBeNull();
		});
	});

	describe('error type rendering', () => {
		it('renders error state when error is a string', () => {
			const params = createBaseParams({
				error: ERROR_MESSAGE,
				props: { 'data-testid': TEST_ID_ERROR },
			});

			render(<>{renderErrorStateIfPresent(params)}</>);
			expect(screen.getByTestId(TEST_ID_ERROR)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it('renders error state when error is an Error object', () => {
			const error = new Error('Test error');
			const params = createBaseParams({
				error,
				props: { 'data-testid': TEST_ID_ERROR },
			});

			render(<>{renderErrorStateIfPresent(params)}</>);
			expect(screen.getByTestId(TEST_ID_ERROR)).toBeInTheDocument();
			expect(screen.getByText('Test error')).toBeInTheDocument();
		});

		it('renders error state when error is a ReactNode', () => {
			const errorNode = <div data-testid="error-node">Custom Error</div>;
			const params = createBaseParams({
				error: errorNode,
				props: { 'data-testid': TEST_ID_ERROR },
			});

			render(<>{renderErrorStateIfPresent(params)}</>);
			expect(screen.getByTestId(TEST_ID_ERROR)).toBeInTheDocument();
			expect(screen.getByTestId('error-node')).toBeInTheDocument();
		});
	});
});

describe('renderErrorStateIfPresent - optional properties', () => {
	it('includes errorComponent when provided', () => {
		const errorComponent = <div data-testid="custom-error">Custom Error Component</div>;
		const params = createBaseParams({
			error: ERROR_MESSAGE,
			errorComponent,
			props: { 'data-testid': TEST_ID_ERROR },
		});

		render(<>{renderErrorStateIfPresent(params)}</>);
		expect(screen.getByTestId('custom-error')).toBeInTheDocument();
	});

	it('includes onRetry callback when provided', () => {
		const onRetry = vi.fn();
		const params = createBaseParams({
			error: ERROR_MESSAGE,
			onRetry,
			props: { 'data-testid': TEST_ID_ERROR },
		});

		render(<>{renderErrorStateIfPresent(params)}</>);
		const retryButton = screen.getByRole('button', { name: /retry/i });
		expect(retryButton).toBeInTheDocument();

		retryButton.click();
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it('includes className for error state when provided', () => {
		const params = createBaseParams({
			error: ERROR_MESSAGE,
			className: CUSTOM_ERROR_CLASS,
			props: { 'data-testid': TEST_ID_ERROR },
		});

		render(<>{renderErrorStateIfPresent(params)}</>);
		const errorContainer = screen.getByTestId(TEST_ID_ERROR);
		expect(errorContainer).toHaveClass(CUSTOM_ERROR_CLASS);
	});

	it('works without optional error properties', () => {
		const params = createBaseParams({
			error: ERROR_MESSAGE,
			props: { 'data-testid': TEST_ID_ERROR },
		});

		render(<>{renderErrorStateIfPresent(params)}</>);
		expect(screen.getByTestId(TEST_ID_ERROR)).toBeInTheDocument();
	});
});

describe('renderLoadingStateIfPresent', () => {
	describe('loading state handling', () => {
		it('returns null when isLoading is false', () => {
			const params = createBaseParams({ isLoading: false });
			const view = renderLoadingStateIfPresent(params);
			expect(view).toBeNull();
		});

		it('renders loading state when isLoading is true', () => {
			const params = createBaseParams({
				isLoading: true,
				props: { 'data-testid': TEST_ID_LOADING },
			});

			render(<>{renderLoadingStateIfPresent(params)}</>);
			expect(screen.getByTestId(TEST_ID_LOADING)).toBeInTheDocument();
			const loadingElements = screen.getAllByLabelText(ARIA_LABELS.LOADING);
			expect(loadingElements.length).toBeGreaterThan(0);
		});
	});

	describe('loading components', () => {
		it('renders custom loading component when provided', () => {
			const loadingComponent = <div data-testid="custom-loading">Custom Loading</div>;
			const params = createBaseParams({
				isLoading: true,
				loadingComponent,
				props: { 'data-testid': TEST_ID_LOADING },
			});

			render(<>{renderLoadingStateIfPresent(params)}</>);
			expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
			expect(screen.getByText('Custom Loading')).toBeInTheDocument();
		});

		it('renders skeleton when useSkeleton is true', () => {
			const params = createBaseParams({
				isLoading: true,
				useSkeleton: true,
				props: { 'data-testid': TEST_ID_SKELETON },
			});

			render(<>{renderLoadingStateIfPresent(params)}</>);
			expect(screen.getByTestId(TEST_ID_SKELETON)).toBeInTheDocument();
		});

		it('renders custom skeleton component when provided', () => {
			const skeletonComponent = <div data-testid="custom-skeleton">Custom Skeleton</div>;
			const params = createBaseParams({
				isLoading: true,
				useSkeleton: true,
				skeletonComponent,
				props: { 'data-testid': TEST_ID_SKELETON },
			});

			render(<>{renderLoadingStateIfPresent(params)}</>);
			expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
		});
	});
});

describe('renderLoadingStateIfPresent - loading options', () => {
	it('renders loading text when provided', () => {
		const params = createBaseParams({
			isLoading: true,
			loadingText: 'Loading data...',
			props: { 'data-testid': TEST_ID_LOADING },
		});

		render(<>{renderLoadingStateIfPresent(params)}</>);
		expect(screen.getByText('Loading data...')).toBeInTheDocument();
	});

	it('includes className for loading state when provided', () => {
		const params = createBaseParams({
			isLoading: true,
			className: CUSTOM_LOADING_CLASS,
			props: { 'data-testid': TEST_ID_LOADING },
		});

		render(<>{renderLoadingStateIfPresent(params)}</>);
		const loadingContainer = screen.getByTestId(TEST_ID_LOADING);
		expect(loadingContainer).toHaveClass(CUSTOM_LOADING_CLASS);
	});

	it('works without optional loading properties', () => {
		const params = createBaseParams({
			isLoading: true,
			props: { 'data-testid': TEST_ID_LOADING },
		});

		render(<>{renderLoadingStateIfPresent(params)}</>);
		expect(screen.getByTestId(TEST_ID_LOADING)).toBeInTheDocument();
	});
});

describe('renderEmptyStateIfPresent', () => {
	describe('empty state handling', () => {
		it('returns null when isEmpty is false', () => {
			const params = createBaseParams({ isEmpty: false });
			const view = renderEmptyStateIfPresent(params);
			expect(view).toBeNull();
		});

		it('renders empty state when isEmpty is true', () => {
			const params = createBaseParams({ isEmpty: true });

			render(<>{renderEmptyStateIfPresent(params)}</>);
			expect(screen.getByTestId(TEST_ID_EMPTY)).toBeInTheDocument();
			expect(screen.getByText(DEFAULT_EMPTY_TITLE)).toBeInTheDocument();
		});
	});

	describe('empty message options', () => {
		it('includes emptyMessage when provided as string', () => {
			const params = createBaseParams({
				isEmpty: true,
				emptyMessage: 'No items found',
			});

			render(<>{renderEmptyStateIfPresent(params)}</>);
			expect(screen.getByText('No items found')).toBeInTheDocument();
		});

		it('includes emptyMessage when provided as ReactNode', () => {
			const emptyMessage = <div data-testid="custom-empty-message">Custom Empty</div>;
			const params = createBaseParams({
				isEmpty: true,
				emptyMessage,
			});

			render(<>{renderEmptyStateIfPresent(params)}</>);
			expect(screen.getByTestId('custom-empty-message')).toBeInTheDocument();
		});
	});
});

describe('renderEmptyStateIfPresent - empty state options', () => {
	it('includes emptyDescription when provided', () => {
		const params = createBaseParams({
			isEmpty: true,
			emptyDescription: 'Try adjusting your filters',
		});

		render(<>{renderEmptyStateIfPresent(params)}</>);
		expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
	});

	it('includes emptyActionLabel and onEmptyAction when provided', () => {
		const onEmptyAction = vi.fn();
		const params = createBaseParams({
			isEmpty: true,
			emptyActionLabel: 'Create Item',
			onEmptyAction,
		});

		render(<>{renderEmptyStateIfPresent(params)}</>);
		const actionButton = screen.getByRole('button', { name: /create item/i });
		expect(actionButton).toBeInTheDocument();

		actionButton.click();
		expect(onEmptyAction).toHaveBeenCalledTimes(1);
	});

	it('includes className for empty state when provided', () => {
		const params = createBaseParams({
			isEmpty: true,
			className: CUSTOM_EMPTY_CLASS,
		});

		render(<>{renderEmptyStateIfPresent(params)}</>);
		const emptyContainer = screen.getByTestId(TEST_ID_EMPTY);
		expect(emptyContainer).toHaveClass(CUSTOM_EMPTY_CLASS);
	});

	it('works without optional empty properties', () => {
		const params = createBaseParams({ isEmpty: true });

		render(<>{renderEmptyStateIfPresent(params)}</>);
		expect(screen.getByTestId(TEST_ID_EMPTY)).toBeInTheDocument();
	});
});

describe('renderState', () => {
	describe('individual state rendering', () => {
		it('renders error state when error is present', () => {
			const params = createBaseParams({
				error: ERROR_MESSAGE,
				props: { 'data-testid': TEST_ID_ERROR },
			});

			render(<>{renderState(params)}</>);
			expect(screen.getByTestId(TEST_ID_ERROR)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it('renders loading state when loading and no error', () => {
			const params = createBaseParams({
				isLoading: true,
				props: { 'data-testid': TEST_ID_LOADING },
			});

			render(<>{renderState(params)}</>);
			expect(screen.getByTestId(TEST_ID_LOADING)).toBeInTheDocument();
		});

		it('renders empty state when empty and no error or loading', () => {
			const params = createBaseParams({ isEmpty: true });

			render(<>{renderState(params)}</>);
			expect(screen.getByTestId(TEST_ID_EMPTY)).toBeInTheDocument();
		});

		it('renders success state when no error, loading, or empty', () => {
			const params = createBaseParams({
				children: <div data-testid="content">Content</div>,
			});

			render(<>{renderState(params)}</>);
			expect(screen.getByTestId('content')).toBeInTheDocument();
			expect(screen.getByText('Content')).toBeInTheDocument();
		});
	});
});

describe('renderState - state priority', () => {
	it('prioritizes error over loading', () => {
		const params = createBaseParams({
			isLoading: true,
			error: ERROR_MESSAGE,
			props: { 'data-testid': TEST_ID_ERROR },
		});

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId(TEST_ID_ERROR)).toBeInTheDocument();
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.queryByTestId(TEST_ID_LOADING)).not.toBeInTheDocument();
	});

	it('prioritizes error over empty', () => {
		const params = createBaseParams({
			error: ERROR_MESSAGE,
			isEmpty: true,
			props: { 'data-testid': TEST_ID_ERROR },
		});

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId(TEST_ID_ERROR)).toBeInTheDocument();
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.queryByTestId(TEST_ID_EMPTY)).not.toBeInTheDocument();
	});

	it('prioritizes loading over empty', () => {
		const params = createBaseParams({
			isLoading: true,
			isEmpty: true,
			props: { 'data-testid': TEST_ID_LOADING },
		});

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId(TEST_ID_LOADING)).toBeInTheDocument();
		expect(screen.queryByTestId(TEST_ID_EMPTY)).not.toBeInTheDocument();
	});

	it('prioritizes error over loading and empty', () => {
		const params = createBaseParams({
			isLoading: true,
			error: ERROR_MESSAGE,
			isEmpty: true,
			props: { 'data-testid': TEST_ID_ERROR },
		});

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId(TEST_ID_ERROR)).toBeInTheDocument();
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.queryByTestId(TEST_ID_LOADING)).not.toBeInTheDocument();
		expect(screen.queryByTestId(TEST_ID_EMPTY)).not.toBeInTheDocument();
	});
});

describe('renderState - edge cases', () => {
	it('handles null error gracefully', () => {
		const params = createBaseParams({
			children: <div data-testid="content">Content</div>,
		});

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('handles undefined error gracefully', () => {
		const params = createBaseParams({
			error: undefined as unknown as null,
			children: <div data-testid="content">Content</div>,
		});

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('handles false loading state', () => {
		const params = createBaseParams({
			children: <div data-testid="content">Content</div>,
		});

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('handles false empty state', () => {
		const params = createBaseParams({
			children: <div data-testid="content">Content</div>,
		});

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('handles all states false', () => {
		const params = createBaseParams({
			children: <div data-testid="content">Content</div>,
		});

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId('content')).toBeInTheDocument();
	});
});

describe('renderState - success state options', () => {
	it('renders success state with className when provided', () => {
		const params = createBaseParams({
			children: <div data-testid="content">Content</div>,
			className: CUSTOM_SUCCESS_CLASS,
			props: { 'data-testid': TEST_ID_SUCCESS },
		});

		render(<>{renderState(params)}</>);
		const successContainer = screen.getByTestId(TEST_ID_SUCCESS);
		expect(successContainer).toHaveClass(CUSTOM_SUCCESS_CLASS);
		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('renders success state without children when children is undefined', () => {
		const params = createBaseParams({
			children: undefined,
			props: { 'data-testid': TEST_ID_SUCCESS },
		});

		render(<>{renderState(params)}</>);
		const successContainer = screen.getByTestId(TEST_ID_SUCCESS);
		expect(successContainer).toBeInTheDocument();
		expect(successContainer).toBeEmptyDOMElement();
	});
});
