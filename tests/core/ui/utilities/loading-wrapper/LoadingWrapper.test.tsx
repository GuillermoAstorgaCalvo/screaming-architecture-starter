/**
 * LoadingWrapper Component Tests
 *
 * Tests for the LoadingWrapper component including:
 * - Loading state rendering
 * - Error state rendering
 * - Empty state rendering
 * - Success state rendering
 * - State priority (error > loading > empty > success)
 * - Custom components
 * - Accessibility
 */

import { ARIA_LABELS, ARIA_LIVE } from '@core/constants/aria';
import LoadingWrapper from '@core/ui/utilities/loading-wrapper/LoadingWrapper';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('LoadingWrapper - Loading Rendering', () => {
	it('renders loading spinner when isLoading is true', () => {
		renderWithProviders(
			<LoadingWrapper isLoading>
				<div>Content</div>
			</LoadingWrapper>
		);

		// Spinner has nested elements with same aria-label, so get all and check first
		const loadingElements = screen.getAllByLabelText(ARIA_LABELS.LOADING);
		expect(loadingElements.length).toBeGreaterThan(0);
		expect(loadingElements[0]).toHaveAttribute('aria-live', ARIA_LIVE.POLITE);
	});

	it('renders custom loading component when provided', () => {
		renderWithProviders(
			<LoadingWrapper
				isLoading
				loadingComponent={<div data-testid="custom-loading">Custom Loading</div>}
			>
				<div>Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
		expect(screen.getByText('Custom Loading')).toBeInTheDocument();
	});

	it('renders skeleton when useSkeleton is true', () => {
		renderWithProviders(
			<LoadingWrapper isLoading useSkeleton>
				<div>Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('skeleton-wrapper')).toBeInTheDocument();
	});

	it('renders custom skeleton component when provided', () => {
		renderWithProviders(
			<LoadingWrapper
				isLoading
				useSkeleton
				skeletonComponent={<div data-testid="custom-skeleton">Custom Skeleton</div>}
			>
				<div>Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
		expect(screen.getByText('Custom Skeleton')).toBeInTheDocument();
	});
});

describe('LoadingWrapper - Loading Text and Children', () => {
	it('renders loading text when provided', () => {
		renderWithProviders(
			<LoadingWrapper isLoading loadingText="Loading data...">
				<div>Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByText('Loading data...')).toBeInTheDocument();
	});

	it('does not render children when loading', () => {
		renderWithProviders(
			<LoadingWrapper isLoading>
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		expect(screen.queryByTestId('content')).not.toBeInTheDocument();
	});
});

describe('LoadingWrapper - Error Message Rendering', () => {
	it('renders error message when error is a string', () => {
		renderWithProviders(
			<LoadingWrapper error="Something went wrong">
				<div>Content</div>
			</LoadingWrapper>
		);

		const errorElement = screen.getByText('Something went wrong');
		expect(errorElement).toBeInTheDocument();
		expect(errorElement).toHaveClass('text-destructive');
	});

	it('renders error message when error is an Error object', () => {
		const error = new Error('Network error');
		renderWithProviders(
			<LoadingWrapper error={error}>
				<div>Content</div>
			</LoadingWrapper>
		);

		const errorElement = screen.getByText('Network error');
		expect(errorElement).toBeInTheDocument();
		expect(errorElement).toHaveClass('text-destructive');
	});

	it('renders custom error component when provided', () => {
		renderWithProviders(
			<LoadingWrapper
				error="Error"
				errorComponent={<div data-testid="custom-error">Custom Error</div>}
			>
				<div>Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('custom-error')).toBeInTheDocument();
		expect(screen.getByText('Custom Error')).toBeInTheDocument();
	});
});

describe('LoadingWrapper - Error Retry Functionality', () => {
	it('renders retry button when onRetry is provided', () => {
		const onRetry = vi.fn();
		renderWithProviders(
			<LoadingWrapper error="Error occurred" onRetry={onRetry}>
				<div>Content</div>
			</LoadingWrapper>
		);

		const retryButton = screen.getByRole('button', { name: /retry/i });
		expect(retryButton).toBeInTheDocument();

		fireEvent.click(retryButton);
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it('does not render retry button when onRetry is not provided', () => {
		renderWithProviders(
			<LoadingWrapper error="Error occurred">
				<div>Content</div>
			</LoadingWrapper>
		);

		expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
	});
});

describe('LoadingWrapper - Error Accessibility and Behavior', () => {
	it('has correct ARIA attributes for error state', () => {
		renderWithProviders(
			<LoadingWrapper error="Error occurred">
				<div>Content</div>
			</LoadingWrapper>
		);

		const errorContainer = screen.getByRole('alert');
		expect(errorContainer).toBeInTheDocument();
		expect(errorContainer).toHaveAttribute('aria-live', ARIA_LIVE.ASSERTIVE);
	});

	it('does not render children when error is present', () => {
		renderWithProviders(
			<LoadingWrapper error="Error">
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		expect(screen.queryByTestId('content')).not.toBeInTheDocument();
	});
});

describe('LoadingWrapper - Empty State Rendering', () => {
	it('renders empty state when isEmpty is true', () => {
		renderWithProviders(
			<LoadingWrapper isEmpty>
				<div>Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('empty-state-wrapper')).toBeInTheDocument();
	});

	it('renders empty state with string message', () => {
		renderWithProviders(
			<LoadingWrapper isEmpty emptyMessage="No items found">
				<div>Content</div>
			</LoadingWrapper>
		);

		// EmptyState should render with the message
		expect(screen.getByText('No items found')).toBeInTheDocument();
	});

	it('renders empty state with custom ReactNode message', () => {
		renderWithProviders(
			<LoadingWrapper isEmpty emptyMessage={<div data-testid="custom-empty">Custom Empty</div>}>
				<div>Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
		expect(screen.getByText('Custom Empty')).toBeInTheDocument();
	});
});

describe('LoadingWrapper - Empty State with Title, Description, and Actions', () => {
	it('renders empty state with title and description', () => {
		renderWithProviders(
			<LoadingWrapper isEmpty emptyTitle="No Data" emptyDescription="There is no data to display">
				<div>Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByText('No Data')).toBeInTheDocument();
		expect(screen.getByText('There is no data to display')).toBeInTheDocument();
	});

	it('renders empty state with action button', () => {
		const onEmptyAction = vi.fn();
		renderWithProviders(
			<LoadingWrapper
				isEmpty
				emptyTitle="No Data"
				emptyActionLabel="Add Item"
				onEmptyAction={onEmptyAction}
			>
				<div>Content</div>
			</LoadingWrapper>
		);

		const actionButton = screen.getByRole('button', { name: /add item/i });
		expect(actionButton).toBeInTheDocument();

		fireEvent.click(actionButton);
		expect(onEmptyAction).toHaveBeenCalledTimes(1);
	});

	it('does not render children when empty', () => {
		renderWithProviders(
			<LoadingWrapper isEmpty>
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		expect(screen.queryByTestId('content')).not.toBeInTheDocument();
	});
});

describe('LoadingWrapper - Success State', () => {
	it('renders children when not loading, no error, and not empty', () => {
		renderWithProviders(
			<LoadingWrapper>
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	it('renders multiple children', () => {
		renderWithProviders(
			<LoadingWrapper>
				<div data-testid="content1">Content 1</div>
				<div data-testid="content2">Content 2</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('content1')).toBeInTheDocument();
		expect(screen.getByTestId('content2')).toBeInTheDocument();
	});

	it('renders children with custom className', () => {
		renderWithProviders(
			<LoadingWrapper className="custom-wrapper" data-testid="wrapper">
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		const container = screen.getByTestId('wrapper');
		expect(container).toHaveClass('custom-wrapper');
	});
});

describe('LoadingWrapper - State Priority', () => {
	it('shows error state when both error and loading are present', () => {
		renderWithProviders(
			<LoadingWrapper isLoading error="Error occurred">
				<div>Content</div>
			</LoadingWrapper>
		);

		// Error should take priority
		expect(screen.getByText('Error occurred')).toBeInTheDocument();
		expect(screen.queryByLabelText(ARIA_LABELS.LOADING)).not.toBeInTheDocument();
	});

	it('shows loading state when loading and empty are present', () => {
		renderWithProviders(
			<LoadingWrapper isLoading isEmpty>
				<div>Content</div>
			</LoadingWrapper>
		);

		// Loading should take priority over empty
		const loadingElements = screen.getAllByLabelText(ARIA_LABELS.LOADING);
		expect(loadingElements.length).toBeGreaterThan(0);
	});

	it('shows empty state when empty and success are present', () => {
		renderWithProviders(
			<LoadingWrapper isEmpty>
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		// Empty should take priority over success
		expect(screen.queryByTestId('content')).not.toBeInTheDocument();
	});

	it('shows success state when no error, loading, or empty', () => {
		renderWithProviders(
			<LoadingWrapper>
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});
});

describe('LoadingWrapper - Edge Cases', () => {
	it('handles null error gracefully', () => {
		renderWithProviders(
			<LoadingWrapper error={null}>
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('handles undefined error gracefully', () => {
		renderWithProviders(
			<LoadingWrapper error={undefined}>
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('handles false loading state', () => {
		renderWithProviders(
			<LoadingWrapper isLoading={false}>
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('handles false empty state', () => {
		renderWithProviders(
			<LoadingWrapper isEmpty={false}>
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('handles all states false', () => {
		renderWithProviders(
			<LoadingWrapper isLoading={false} error={null} isEmpty={false}>
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});
});

describe('LoadingWrapper - HTML Attributes', () => {
	it('passes through HTML attributes', () => {
		renderWithProviders(
			<LoadingWrapper data-testid="wrapper" id="test-id" aria-label="Test wrapper">
				<div>Content</div>
			</LoadingWrapper>
		);

		const wrapper = screen.getByTestId('wrapper');
		expect(wrapper).toHaveAttribute('id', 'test-id');
		expect(wrapper).toHaveAttribute('aria-label', 'Test wrapper');
	});

	it('merges custom className with wrapper', () => {
		renderWithProviders(
			<LoadingWrapper className="custom-class" data-testid="wrapper">
				<div data-testid="content">Content</div>
			</LoadingWrapper>
		);

		const container = screen.getByTestId('wrapper');
		expect(container).toHaveClass('custom-class');
	});
});
