/**
 * InfiniteScrollStateRenderers Tests
 *
 * Tests for the InfiniteScrollStateRenderers helper functions including:
 * - renderEmptyState
 * - renderLoadingState
 * - renderErrorState
 * - renderEndMessage
 * - renderSentinel
 */

import { ARIA_LABELS } from '@core/constants/aria';
import {
	renderEmptyState,
	renderEndMessage,
	renderErrorState,
	renderLoadingState,
	renderSentinel,
} from '@core/ui/utilities/infinite-scroll/components/InfiniteScrollStateRenderers';
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('renderEmptyState', () => {
	it('renders default empty message when emptyComponent is undefined', () => {
		const props = {
			infiniteScrollId: 'test-infinite-scroll',
			containerClasses: 'test-container-class',
			emptyComponent: undefined,
			props: {},
		};

		const { container } = renderWithProviders(<>{renderEmptyState(props)}</>);

		const emptyContainer = container.querySelector('#test-infinite-scroll');
		expect(emptyContainer).toBeInTheDocument();
		expect(emptyContainer).toHaveClass('test-container-class');
		// Check for translation key or translated text (i18n may not be fully loaded)
		const textContent = container.textContent || '';
		expect(
			textContent.includes('noDataAvailable') || textContent.includes('No data available')
		).toBe(true);
	});

	it('renders custom empty component when provided', () => {
		const customEmpty = <div data-testid="custom-empty">Custom Empty State</div>;
		const props = {
			infiniteScrollId: 'test-infinite-scroll',
			containerClasses: 'test-container-class',
			emptyComponent: customEmpty,
			props: {},
		};

		renderWithProviders(<>{renderEmptyState(props)}</>);

		expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
		expect(screen.getByText('Custom Empty State')).toBeInTheDocument();
		expect(screen.queryByText(/no data available/i)).not.toBeInTheDocument();
	});

	it('applies container classes correctly', () => {
		const props = {
			infiniteScrollId: 'test-infinite-scroll',
			containerClasses: 'custom-class another-class',
			emptyComponent: undefined,
			props: {},
		};

		const { container } = renderWithProviders(<>{renderEmptyState(props)}</>);

		const emptyContainer = container.querySelector('#test-infinite-scroll');
		expect(emptyContainer).toHaveClass('custom-class');
		expect(emptyContainer).toHaveClass('another-class');
	});

	it('spreads additional props to container', () => {
		const props = {
			infiniteScrollId: 'test-infinite-scroll',
			containerClasses: 'test-container-class',
			emptyComponent: undefined,
			props: {
				'data-testid': 'empty-container',
				'data-custom': 'value',
			},
		};

		renderWithProviders(<>{renderEmptyState(props)}</>);

		const container = screen.getByTestId('empty-container');
		expect(container).toBeInTheDocument();
		expect(container).toHaveAttribute('data-custom', 'value');
		expect(container).toHaveAttribute('id', 'test-infinite-scroll');
	});

	it('renders empty state with ReactNode emptyComponent', () => {
		const emptyNode = (
			<div>
				<p data-testid="empty-text">No items found</p>
				<button data-testid="empty-button">Refresh</button>
			</div>
		);
		const props = {
			infiniteScrollId: 'test-infinite-scroll',
			containerClasses: 'test-container-class',
			emptyComponent: emptyNode,
			props: {},
		};

		renderWithProviders(<>{renderEmptyState(props)}</>);

		expect(screen.getByTestId('empty-text')).toBeInTheDocument();
		expect(screen.getByTestId('empty-button')).toBeInTheDocument();
	});
});

describe('renderLoadingState', () => {
	it('returns DefaultLoadingComponent when loadingComponent and loadingText are undefined', () => {
		const result = renderLoadingState(undefined, undefined);

		renderWithProviders(<>{result}</>);

		// DefaultLoadingComponent should render a Spinner
		expect(screen.getByLabelText(ARIA_LABELS.LOADING)).toBeInTheDocument();
	});

	it('returns custom loadingComponent when provided', () => {
		const customLoading = <div data-testid="custom-loading">Loading...</div>;
		const result = renderLoadingState(customLoading, undefined);

		renderWithProviders(<>{result}</>);

		expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
		expect(screen.getByText('Loading...')).toBeInTheDocument();
		expect(screen.queryByLabelText(ARIA_LABELS.LOADING)).not.toBeInTheDocument();
	});

	it('returns DefaultLoadingComponent with loadingText when loadingText is provided', () => {
		const result = renderLoadingState(undefined, 'Loading items...');

		renderWithProviders(<>{result}</>);

		expect(screen.getByLabelText(ARIA_LABELS.LOADING)).toBeInTheDocument();
		expect(screen.getByText('Loading items...')).toBeInTheDocument();
	});

	it('returns DefaultLoadingComponent when loadingComponent is undefined and loadingText is empty string', () => {
		const result = renderLoadingState(undefined, '');

		renderWithProviders(<>{result}</>);

		expect(screen.getByLabelText(ARIA_LABELS.LOADING)).toBeInTheDocument();
	});

	it('prioritizes custom loadingComponent over loadingText', () => {
		const customLoading = <div data-testid="custom-loading">Custom</div>;
		const result = renderLoadingState(customLoading, 'Loading text');

		renderWithProviders(<>{result}</>);

		expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
		expect(screen.queryByText('Loading text')).not.toBeInTheDocument();
	});
});

describe('renderErrorState', () => {
	it('returns null when hasError is false', () => {
		const result = renderErrorState(false, undefined, undefined);

		expect(result).toBeNull();
	});

	it('renders DefaultErrorComponent when hasError is true and errorMessage is undefined', () => {
		const result = renderErrorState(true, undefined, undefined);

		renderWithProviders(<>{result}</>);

		// DefaultErrorComponent should render default error message
		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText(/failed to load more items/i)).toBeInTheDocument();
	});

	it('renders DefaultErrorComponent with string errorMessage', () => {
		const result = renderErrorState(true, 'Custom error message', undefined);

		renderWithProviders(<>{result}</>);

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText('Custom error message')).toBeInTheDocument();
	});

	it('renders DefaultErrorComponent with ReactNode errorMessage', () => {
		const errorNode = <div data-testid="error-node">Error occurred</div>;
		const result = renderErrorState(true, errorNode, undefined);

		renderWithProviders(<>{result}</>);

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByTestId('error-node')).toBeInTheDocument();
	});

	it('renders retry button when onRetry is provided', () => {
		const onRetry = vi.fn();
		const result = renderErrorState(true, 'Error message', onRetry);

		renderWithProviders(<>{result}</>);

		const retryButton = screen.getByRole('button', { name: /retry/i });
		expect(retryButton).toBeInTheDocument();

		retryButton.click();
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it('does not render retry button when onRetry is undefined', () => {
		const result = renderErrorState(true, 'Error message', undefined);

		renderWithProviders(<>{result}</>);

		expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
	});

	it('has correct ARIA attributes', () => {
		const result = renderErrorState(true, 'Error message', undefined);

		renderWithProviders(<>{result}</>);

		const alert = screen.getByRole('alert');
		expect(alert).toHaveAttribute('aria-live', 'assertive');
	});
});

describe('renderEndMessage', () => {
	it('returns null when hasMore is true', () => {
		const result = renderEndMessage({
			hasMore: true,
			isLoading: false,
			hasError: false,
			endMessage: undefined,
		});

		expect(result).toBeNull();
	});

	it('returns null when isLoading is true', () => {
		const result = renderEndMessage({
			hasMore: false,
			isLoading: true,
			hasError: false,
			endMessage: undefined,
		});

		expect(result).toBeNull();
	});

	it('returns null when hasError is true', () => {
		const result = renderEndMessage({
			hasMore: false,
			isLoading: false,
			hasError: true,
			endMessage: undefined,
		});

		expect(result).toBeNull();
	});

	it('returns null when hasMore is true even if isLoading is false', () => {
		const result = renderEndMessage({
			hasMore: true,
			isLoading: false,
			hasError: false,
			endMessage: 'End message',
		});

		expect(result).toBeNull();
	});

	it('renders DefaultEndMessage when all conditions are met and endMessage is undefined', () => {
		const result = renderEndMessage({
			hasMore: false,
			isLoading: false,
			hasError: false,
			endMessage: undefined,
		});

		renderWithProviders(<>{result}</>);

		// DefaultEndMessage component returns null when endMessage is undefined
		// but renderEndMessage returns the component, not null
		expect(result).not.toBeNull();
		// The rendered output should be empty/null
		expect(screen.queryByText(/no more/i)).not.toBeInTheDocument();
	});

	it('renders DefaultEndMessage with string endMessage', () => {
		const result = renderEndMessage({
			hasMore: false,
			isLoading: false,
			hasError: false,
			endMessage: 'No more items',
		});

		const { container } = renderWithProviders(<>{result}</>);

		expect(screen.getByText('No more items')).toBeInTheDocument();
		// aria-live is on the container div, not the text element
		const endMessageContainer = container.querySelector('[aria-live="polite"]');
		expect(endMessageContainer).toBeInTheDocument();
		expect(endMessageContainer).toContainElement(screen.getByText('No more items'));
	});

	it('renders DefaultEndMessage with ReactNode endMessage', () => {
		const endNode = <div data-testid="end-node">End of list</div>;
		const result = renderEndMessage({
			hasMore: false,
			isLoading: false,
			hasError: false,
			endMessage: endNode,
		});

		renderWithProviders(<>{result}</>);

		expect(screen.getByTestId('end-node')).toBeInTheDocument();
	});

	it('returns null when hasMore is false but isLoading is true', () => {
		const result = renderEndMessage({
			hasMore: false,
			isLoading: true,
			hasError: false,
			endMessage: 'End message',
		});

		expect(result).toBeNull();
	});

	it('returns null when hasMore is false but hasError is true', () => {
		const result = renderEndMessage({
			hasMore: false,
			isLoading: false,
			hasError: true,
			endMessage: 'End message',
		});

		expect(result).toBeNull();
	});
});

describe('renderSentinel', () => {
	it('returns null when hasMore is false', () => {
		const sentinelRef = createRef<HTMLDivElement>();
		const result = renderSentinel({
			hasMore: false,
			hasError: false,
			sentinelRef,
			sentinelClasses: 'test-sentinel-class',
		});

		expect(result).toBeNull();
	});

	it('returns null when hasError is true', () => {
		const sentinelRef = createRef<HTMLDivElement>();
		const result = renderSentinel({
			hasMore: true,
			hasError: true,
			sentinelRef,
			sentinelClasses: 'test-sentinel-class',
		});

		expect(result).toBeNull();
	});

	it('returns null when hasMore is false and hasError is true', () => {
		const sentinelRef = createRef<HTMLDivElement>();
		const result = renderSentinel({
			hasMore: false,
			hasError: true,
			sentinelRef,
			sentinelClasses: 'test-sentinel-class',
		});

		expect(result).toBeNull();
	});

	it('renders sentinel element when hasMore is true and hasError is false', () => {
		const sentinelRef = createRef<HTMLDivElement>();
		const result = renderSentinel({
			hasMore: true,
			hasError: false,
			sentinelRef,
			sentinelClasses: 'test-sentinel-class',
		});

		render(<>{result}</>);

		const sentinel = sentinelRef.current;
		expect(sentinel).toBeInTheDocument();
		expect(sentinel).toHaveClass('test-sentinel-class');
		expect(sentinel).toHaveAttribute('aria-hidden', 'true');
	});

	it('applies sentinel classes correctly', () => {
		const sentinelRef = createRef<HTMLDivElement>();
		const result = renderSentinel({
			hasMore: true,
			hasError: false,
			sentinelRef,
			sentinelClasses: 'h-1 w-full custom-class',
		});

		render(<>{result}</>);

		const sentinel = sentinelRef.current;
		expect(sentinel).toHaveClass('h-1');
		expect(sentinel).toHaveClass('w-full');
		expect(sentinel).toHaveClass('custom-class');
	});

	it('sets aria-hidden attribute to true', () => {
		const sentinelRef = createRef<HTMLDivElement>();
		const result = renderSentinel({
			hasMore: true,
			hasError: false,
			sentinelRef,
			sentinelClasses: 'test-sentinel-class',
		});

		render(<>{result}</>);

		const sentinel = sentinelRef.current;
		expect(sentinel).toHaveAttribute('aria-hidden', 'true');
	});

	it('attaches ref correctly to sentinel element', () => {
		const sentinelRef = createRef<HTMLDivElement>();
		const result = renderSentinel({
			hasMore: true,
			hasError: false,
			sentinelRef,
			sentinelClasses: 'test-sentinel-class',
		});

		render(<>{result}</>);

		expect(sentinelRef.current).toBeInstanceOf(HTMLDivElement);
		expect(sentinelRef.current).not.toBeNull();
	});
});
