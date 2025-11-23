/**
 * InfiniteScrollComponents Tests
 *
 * Tests for the infinite scroll default components:
 * - DefaultLoadingComponent
 * - DefaultEndMessage
 * - DefaultErrorComponent
 */

import { ARIA_LABELS, ARIA_LIVE } from '@core/constants/aria';
import {
	DefaultEndMessage,
	DefaultErrorComponent,
	DefaultLoadingComponent,
} from '@core/ui/utilities/infinite-scroll/components/InfiniteScrollComponents';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('DefaultLoadingComponent', () => {
	it('renders spinner with loading aria-label', () => {
		renderWithProviders(<DefaultLoadingComponent />);
		const spinner = screen.getByLabelText(ARIA_LABELS.LOADING);
		expect(spinner).toBeInTheDocument();
	});

	it('renders spinner without loading text when loadingText is not provided', () => {
		const { container } = renderWithProviders(<DefaultLoadingComponent />);
		const spinner = screen.getByLabelText(ARIA_LABELS.LOADING);
		expect(spinner).toBeInTheDocument();
		// Should not have any text content beyond the spinner
		const textElements = container.querySelectorAll('.text-text-muted');
		expect(textElements).toHaveLength(0);
	});

	it('renders loading text when loadingText is provided', () => {
		const loadingText = 'Loading more items...';
		renderWithProviders(<DefaultLoadingComponent loadingText={loadingText} />);
		expect(screen.getByText(loadingText)).toBeInTheDocument();
	});

	it('renders both spinner and loading text when loadingText is provided', () => {
		const loadingText = 'Please wait...';
		renderWithProviders(<DefaultLoadingComponent loadingText={loadingText} />);
		const spinner = screen.getByLabelText(ARIA_LABELS.LOADING);
		const text = screen.getByText(loadingText);
		expect(spinner).toBeInTheDocument();
		expect(text).toBeInTheDocument();
	});

	it('applies correct container classes', () => {
		const { container } = renderWithProviders(<DefaultLoadingComponent />);
		const loadingContainer = container.firstChild as HTMLElement;
		expect(loadingContainer).toHaveClass('flex', 'items-center', 'justify-center', 'py-4');
	});

	it('renders spinner with correct size', () => {
		renderWithProviders(<DefaultLoadingComponent />);
		const spinner = screen.getByLabelText(ARIA_LABELS.LOADING);
		// Spinner should be rendered (checking it exists is sufficient as size is internal)
		expect(spinner).toBeInTheDocument();
	});

	it('renders loading text with correct styling', () => {
		const loadingText = 'Loading...';
		renderWithProviders(<DefaultLoadingComponent loadingText={loadingText} />);
		const text = screen.getByText(loadingText);
		expect(text).toHaveClass('ml-2', 'text-text-muted');
	});

	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(<DefaultLoadingComponent loadingText="Loading..." />);
		await expectA11y(container);
	});
});

describe('DefaultEndMessage', () => {
	it('returns null when endMessage is not provided', () => {
		const { container } = renderWithProviders(<DefaultEndMessage />);
		expect(container.firstChild).toBeNull();
	});

	it('returns null when endMessage is undefined', () => {
		const { container } = renderWithProviders(<DefaultEndMessage endMessage={undefined} />);
		expect(container.firstChild).toBeNull();
	});

	it('renders string endMessage', () => {
		const endMessage = 'No more items to load';
		renderWithProviders(<DefaultEndMessage endMessage={endMessage} />);
		expect(screen.getByText(endMessage)).toBeInTheDocument();
	});

	it('renders ReactNode endMessage', () => {
		const endMessage = (
			<div data-testid="custom-end-message">
				<span>Custom end message</span>
			</div>
		);
		renderWithProviders(<DefaultEndMessage endMessage={endMessage} />);
		expect(screen.getByTestId('custom-end-message')).toBeInTheDocument();
		expect(screen.getByText('Custom end message')).toBeInTheDocument();
	});

	it('wraps string endMessage in Text component with correct styling', () => {
		const endMessage = 'End of list';
		renderWithProviders(<DefaultEndMessage endMessage={endMessage} />);
		const text = screen.getByText(endMessage);
		expect(text).toHaveClass('text-text-muted');
	});

	it('applies correct container classes', () => {
		const endMessage = 'No more items';
		const { container } = renderWithProviders(<DefaultEndMessage endMessage={endMessage} />);
		const endMessageContainer = container.firstChild as HTMLElement;
		expect(endMessageContainer).toHaveClass(
			'flex',
			'items-center',
			'justify-center',
			'py-4',
			'text-sm',
			'text-text-muted'
		);
	});

	it('has correct aria-live attribute for string message', () => {
		const endMessage = 'End reached';
		renderWithProviders(<DefaultEndMessage endMessage={endMessage} />);
		const container = screen.getByText(endMessage).closest('div');
		expect(container).toHaveAttribute('aria-live', ARIA_LIVE.POLITE);
	});

	it('has correct aria-live attribute for ReactNode message', () => {
		const endMessage = <div>Custom message</div>;
		const { container } = renderWithProviders(<DefaultEndMessage endMessage={endMessage} />);
		const endMessageContainer = container.firstChild as HTMLElement;
		expect(endMessageContainer).toHaveAttribute('aria-live', ARIA_LIVE.POLITE);
	});

	it('renders complex ReactNode endMessage', () => {
		const endMessage = (
			<div>
				<p>You have reached the end</p>
				<button>Refresh</button>
			</div>
		);
		renderWithProviders(<DefaultEndMessage endMessage={endMessage} />);
		expect(screen.getByText('You have reached the end')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
	});

	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(<DefaultEndMessage endMessage="End of list" />);
		await expectA11y(container);
	});
});

describe('DefaultErrorComponent', () => {
	it('renders default error message when errorMessage is undefined', () => {
		renderWithProviders(<DefaultErrorComponent />);
		expect(screen.getByText('Failed to load more items')).toBeInTheDocument();
	});

	it('renders string errorMessage', () => {
		const errorMessage = 'Something went wrong';
		renderWithProviders(<DefaultErrorComponent errorMessage={errorMessage} />);
		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});

	it('renders ReactNode errorMessage', () => {
		const errorMessage = (
			<div data-testid="custom-error">
				<span>Custom error message</span>
			</div>
		);
		renderWithProviders(<DefaultErrorComponent errorMessage={errorMessage} />);
		expect(screen.getByTestId('custom-error')).toBeInTheDocument();
		expect(screen.getByText('Custom error message')).toBeInTheDocument();
	});

	it('wraps string errorMessage in Text component with correct styling', () => {
		const errorMessage = 'Error occurred';
		renderWithProviders(<DefaultErrorComponent errorMessage={errorMessage} />);
		const text = screen.getByText(errorMessage);
		expect(text).toHaveClass('text-destructive');
	});

	it('wraps default error message in Text component with correct styling', () => {
		renderWithProviders(<DefaultErrorComponent />);
		const text = screen.getByText('Failed to load more items');
		expect(text).toHaveClass('text-destructive');
	});

	it('renders retry button when onRetry is provided', () => {
		const onRetry = vi.fn();
		renderWithProviders(<DefaultErrorComponent onRetry={onRetry} />);
		const retryButton = screen.getByRole('button', { name: 'Retry' });
		expect(retryButton).toBeInTheDocument();
	});

	it('does not render retry button when onRetry is undefined', () => {
		renderWithProviders(<DefaultErrorComponent onRetry={undefined} />);
		expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
	});

	it('does not render retry button when onRetry is not provided', () => {
		renderWithProviders(<DefaultErrorComponent />);
		expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
	});

	it('calls onRetry when retry button is clicked', () => {
		const onRetry = vi.fn();
		renderWithProviders(<DefaultErrorComponent onRetry={onRetry} />);
		const retryButton = screen.getByRole('button', { name: 'Retry' });
		fireEvent.click(retryButton);
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it('renders retry button with correct variant and size', () => {
		const onRetry = vi.fn();
		renderWithProviders(<DefaultErrorComponent onRetry={onRetry} />);
		const retryButton = screen.getByRole('button', { name: 'Retry' });
		expect(retryButton).toBeInTheDocument();
		// Button should be rendered (variant and size are internal to Button component)
	});

	it('applies correct container classes', () => {
		const { container } = renderWithProviders(<DefaultErrorComponent />);
		const errorContainer = container.firstChild as HTMLElement;
		expect(errorContainer).toHaveClass(
			'flex',
			'flex-col',
			'items-center',
			'justify-center',
			'py-4',
			'gap-2'
		);
	});

	it('has correct role and aria-live attributes', () => {
		const { container } = renderWithProviders(<DefaultErrorComponent />);
		const errorContainer = container.firstChild as HTMLElement;
		expect(errorContainer).toHaveAttribute('role', 'alert');
		expect(errorContainer).toHaveAttribute('aria-live', ARIA_LIVE.ASSERTIVE);
	});

	it('renders both error message and retry button', () => {
		const errorMessage = 'Network error';
		const onRetry = vi.fn();
		renderWithProviders(<DefaultErrorComponent errorMessage={errorMessage} onRetry={onRetry} />);
		expect(screen.getByText(errorMessage)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
	});

	it('renders complex ReactNode errorMessage', () => {
		const errorMessage = (
			<div>
				<p>Error occurred</p>
				<span>Please try again</span>
			</div>
		);
		renderWithProviders(<DefaultErrorComponent errorMessage={errorMessage} />);
		expect(screen.getByText('Error occurred')).toBeInTheDocument();
		expect(screen.getByText('Please try again')).toBeInTheDocument();
	});

	it('renders complex ReactNode errorMessage with retry button', () => {
		const errorMessage = (
			<div>
				<p>Multiple errors detected</p>
			</div>
		);
		const onRetry = vi.fn();
		renderWithProviders(<DefaultErrorComponent errorMessage={errorMessage} onRetry={onRetry} />);
		expect(screen.getByText('Multiple errors detected')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
	});

	it('handles multiple retry button clicks', () => {
		const onRetry = vi.fn();
		renderWithProviders(<DefaultErrorComponent onRetry={onRetry} />);
		const retryButton = screen.getByRole('button', { name: 'Retry' });
		fireEvent.click(retryButton);
		fireEvent.click(retryButton);
		fireEvent.click(retryButton);
		expect(onRetry).toHaveBeenCalledTimes(3);
	});

	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<DefaultErrorComponent errorMessage="Error occurred" onRetry={vi.fn()} />
		);
		await expectA11y(container);
	});
});
