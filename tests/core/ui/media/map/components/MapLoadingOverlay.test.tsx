/**
 * MapLoadingOverlay Component Tests
 *
 * Tests for the MapLoadingOverlay component:
 * - Rendering when loading
 * - Not rendering when not loading
 * - Custom loading fallback
 * - Default spinner fallback
 */

import { MapLoadingOverlay } from '@core/ui/media/map/components/MapLoadingOverlay';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock Spinner component
vi.mock('@core/ui/spinner/Spinner', () => ({
	default: ({ size }: { size: string }) => <div data-testid="spinner" data-size={size} />,
}));

describe('MapLoadingOverlay', () => {
	it('should render when isLoading is true', () => {
		const { container } = render(<MapLoadingOverlay isLoading={true} />);

		expect(container.firstChild).toBeInTheDocument();
	});

	it('should not render when isLoading is false', () => {
		const { container } = render(<MapLoadingOverlay isLoading={false} />);

		expect(container.firstChild).toBeNull();
	});

	it('should render default spinner when loadingFallback is not provided', () => {
		render(<MapLoadingOverlay isLoading={true} />);

		const spinner = screen.getByTestId('spinner');
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveAttribute('data-size', 'lg');
	});

	it('should render custom loadingFallback when provided', () => {
		const customFallback = <div data-testid="custom-loading">Loading...</div>;

		render(<MapLoadingOverlay isLoading={true} loadingFallback={customFallback} />);

		expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
		expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
	});

	it('should have correct CSS classes', () => {
		const { container } = render(<MapLoadingOverlay isLoading={true} />);

		const overlay = container.firstChild as HTMLElement;
		expect(overlay).toHaveClass('absolute', 'inset-0', 'flex', 'items-center', 'justify-center');
		expect(overlay).toHaveClass('bg-surface', 'dark:bg-surface', 'bg-opacity-75');
	});

	it('should not render custom fallback when not loading', () => {
		const customFallback = <div data-testid="custom-loading">Loading...</div>;

		const { container } = render(
			<MapLoadingOverlay isLoading={false} loadingFallback={customFallback} />
		);

		expect(container.firstChild).toBeNull();
	});
});
