/**
 * LoadableFallback Component Tests
 *
 * Tests for the DefaultLoadingFallback component including:
 * - Fallback rendering
 * - Loading states
 * - Error fallbacks (component behavior in error scenarios)
 * - Custom fallback props (component usage as fallback)
 * - Accessibility attributes
 * - Styling and structure
 * - Suspense integration
 */

import { ARIA_LABELS, ARIA_LIVE } from '@core/constants/aria';
import { DefaultLoadingFallback } from '@core/ui/utilities/loadable/components/loadableFallback';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import React, { type ComponentType, lazy, Suspense } from 'react';
import { describe, expect, it, vi } from 'vitest';

const LOADING_TEXT = 'Loading...';
const LOADING_ARIA_LABEL = ARIA_LABELS.LOADING;
const ARIA_LIVE_POLITE_VALUE = ARIA_LIVE.POLITE;
const ARIA_LABEL_ATTR = 'aria-label';

// Helper function to create a mock loader for testing
const createMockLoader = (delay = 10) => {
	return vi.fn(
		() =>
			new Promise<{ default: ComponentType }>(resolve => {
				const TestComponent: ComponentType = () => <div data-testid="loaded">Loaded</div>;
				setTimeout(() => {
					resolve({ default: TestComponent });
				}, delay);
			})
	);
};

describe('DefaultLoadingFallback - Fallback Rendering', () => {
	it('renders loading message', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument();
	});

	it('renders as a ReactNode', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const container = screen.getByLabelText(LOADING_ARIA_LABEL);
		expect(container).toBeInTheDocument();
		expect(container).toBeVisible();
	});

	it('renders with correct DOM structure', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const container = screen.getByLabelText(LOADING_ARIA_LABEL);
		const text = screen.getByText(LOADING_TEXT);

		expect(container).toBeInTheDocument();
		expect(text).toBeInTheDocument();
		expect(container).toContainElement(text);
	});
});

describe('DefaultLoadingFallback - Loading States', () => {
	it('renders correctly as Suspense fallback', async () => {
		const loader = createMockLoader(10);
		const LazyComponent = lazy(loader);

		renderWithProviders(
			<Suspense fallback={<DefaultLoadingFallback />}>
				<LazyComponent />
			</Suspense>
		);

		// Initially should show loading fallback
		expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument();
		expect(screen.queryByTestId('loaded')).not.toBeInTheDocument();

		// After loading, component should appear
		await waitFor(() => {
			expect(screen.getByTestId('loaded')).toBeInTheDocument();
		});

		// Loading fallback should no longer be visible
		expect(screen.queryByText(LOADING_TEXT)).not.toBeInTheDocument();
	});

	it('works correctly with multiple Suspense boundaries', () => {
		renderWithProviders(
			<div>
				<Suspense fallback={<DefaultLoadingFallback />}>
					<div>Content 1</div>
				</Suspense>
				<Suspense fallback={<DefaultLoadingFallback />}>
					<div>Content 2</div>
				</Suspense>
			</div>
		);

		// Both should render (since content is not lazy, fallback won't show)
		expect(screen.getByText('Content 1')).toBeInTheDocument();
		expect(screen.getByText('Content 2')).toBeInTheDocument();
	});

	it('can be used as a function fallback', () => {
		const FallbackWrapper = () => <DefaultLoadingFallback />;

		renderWithProviders(<FallbackWrapper />);
		expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument();
	});
});

describe('DefaultLoadingFallback - Error Fallbacks', () => {
	it('renders correctly even when wrapped in error boundary context', () => {
		// Component should render normally even in error-prone contexts
		renderWithProviders(
			<div>
				<DefaultLoadingFallback />
			</div>
		);

		expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument();
	});

	it('handles being rendered multiple times', () => {
		renderWithProviders(
			<div>
				<DefaultLoadingFallback />
				<DefaultLoadingFallback />
				<DefaultLoadingFallback />
			</div>
		);

		// All instances should render
		const loadingMessages = screen.getAllByText(LOADING_TEXT);
		expect(loadingMessages).toHaveLength(3);
	});

	it('does not throw errors when rendered', () => {
		expect(() => {
			renderWithProviders(<DefaultLoadingFallback />);
		}).not.toThrow();
	});
});

describe('DefaultLoadingFallback - Custom Fallback Props', () => {
	it('works when used as a fallback prop in Loadable', async () => {
		const loader = createMockLoader(10);
		const LazyComponent = lazy(loader);

		renderWithProviders(
			<Suspense fallback={<DefaultLoadingFallback />}>
				<LazyComponent />
			</Suspense>
		);

		// Should show default fallback
		expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument();

		await waitFor(() => {
			expect(screen.getByTestId('loaded')).toBeInTheDocument();
		});
	});

	it('can be used inline as JSX fallback', () => {
		renderWithProviders(
			<Suspense fallback={<DefaultLoadingFallback />}>
				<div>Content</div>
			</Suspense>
		);

		// Since content is not lazy, it renders immediately
		expect(screen.getByText('Content')).toBeInTheDocument();
	});
});

describe('DefaultLoadingFallback - Accessibility', () => {
	it('has correct ARIA attributes', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const container = screen.getByLabelText(LOADING_ARIA_LABEL);

		expect(container).toHaveAttribute('aria-live', ARIA_LIVE_POLITE_VALUE);
		expect(container).toHaveAttribute(ARIA_LABEL_ATTR, LOADING_ARIA_LABEL);
	});

	it('has aria-live set to polite for screen readers', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const container = screen.getByLabelText(LOADING_ARIA_LABEL);

		expect(container).toHaveAttribute('aria-live', ARIA_LIVE_POLITE_VALUE);
	});

	it('has accessible label for screen readers', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const container = screen.getByLabelText(LOADING_ARIA_LABEL);

		expect(container).toHaveAccessibleName();
		expect(container).toHaveAttribute(ARIA_LABEL_ATTR, LOADING_ARIA_LABEL);
	});

	it('provides accessible loading state information', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const container = screen.getByLabelText(LOADING_ARIA_LABEL);

		// Should have both aria-live and aria-label for proper accessibility
		expect(container).toHaveAttribute('aria-live');
		expect(container).toHaveAttribute(ARIA_LABEL_ATTR);
	});
});

describe('DefaultLoadingFallback - Styling and Structure', () => {
	it('has correct CSS classes on container', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const container = screen.getByLabelText(LOADING_ARIA_LABEL);

		expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'p-6');
	});

	it('renders text with correct classes', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const text = screen.getByText(LOADING_TEXT);

		expect(text).toHaveClass('text-text-muted', 'dark:text-text-muted');
		expect(text).toHaveTextContent(LOADING_TEXT);
	});

	it('has correct element hierarchy', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const container = screen.getByLabelText(LOADING_ARIA_LABEL);
		const text = screen.getByText(LOADING_TEXT);

		expect(container).toBeInTheDocument();
		expect(text).toBeInTheDocument();
		expect(container).toContainElement(text);
		expect(text).toHaveTextContent(LOADING_TEXT);
	});

	it('applies flexbox layout classes correctly', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const container = screen.getByLabelText(LOADING_ARIA_LABEL);

		// Should have flex, items-center, justify-center for centering
		expect(container).toHaveClass('flex');
		expect(container).toHaveClass('items-center');
		expect(container).toHaveClass('justify-center');
		expect(container).toHaveClass('p-6');
	});

	it('applies theme-aware text color classes', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const text = screen.getByText(LOADING_TEXT);

		// Should have both light and dark mode classes
		expect(text).toHaveClass('text-text-muted');
		expect(text).toHaveClass('dark:text-text-muted');
	});

	it('renders with correct tag names', () => {
		renderWithProviders(<DefaultLoadingFallback />);
		const container = screen.getByLabelText(LOADING_ARIA_LABEL);
		const text = screen.getByText(LOADING_TEXT);

		expect(container.tagName).toBe('DIV');
		expect(text.tagName).toBe('P');
	});

	it('component returns a valid ReactNode', () => {
		const result = <DefaultLoadingFallback />;
		expect(result).toBeDefined();
		renderWithProviders(result);
		expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument();
	});
});

describe('DefaultLoadingFallback - Component Export', () => {
	it('exports DefaultLoadingFallback as a function', () => {
		expect(typeof DefaultLoadingFallback).toBe('function');
	});

	it('component can be called directly', () => {
		const result = DefaultLoadingFallback();
		expect(result).toBeDefined();
		renderWithProviders(result as React.ReactElement);
		expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument();
	});
});
