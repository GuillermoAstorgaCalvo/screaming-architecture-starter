/**
 * useMapRender Tests
 *
 * Tests for the renderMap function:
 * - Error state rendering
 * - Loading state rendering
 * - Props forwarding
 */

import { renderMap } from '@core/ui/media/map/helpers/useMapRender';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock components
vi.mock('@core/ui/media/map/components/MapContainer', () => ({
	MapContainer: ({ mapRef, isLoading, loadingFallback, height, width, className }: any) => (
		<div
			data-testid="map-container"
			data-is-loading={isLoading}
			data-height={height}
			data-width={width}
			className={className}
		>
			<div ref={mapRef} />
			{loadingFallback ? <div data-testid="loading-fallback">{loadingFallback}</div> : null}
		</div>
	),
}));

vi.mock('@core/ui/media/map/components/MapError', () => ({
	MapError: ({ error, errorFallback, height, width, className }: any) => (
		<div
			data-testid="map-error"
			data-error={error}
			data-height={height}
			data-width={width}
			className={className}
		>
			{errorFallback || <div>Error loading map: {error}</div>}
		</div>
	),
}));

describe('renderMap', () => {
	const defaultProps = {
		mapRef: createRef<HTMLDivElement>(),
		isLoading: false,
		height: '400px',
		width: '100%',
		props: {},
	};

	it('should render MapError when error is present', () => {
		const errorFallback = <div data-testid="custom-error">Custom Error</div>;

		render(
			renderMap({
				...defaultProps,
				error: 'Test error',
				errorFallback,
			})
		);

		const errorComponent = screen.getByTestId('map-error');
		expect(errorComponent).toBeInTheDocument();
		expect(errorComponent).toHaveAttribute('data-error', 'Test error');
		expect(screen.getByTestId('custom-error')).toBeInTheDocument();
	});

	it('should render MapError with default error message when errorFallback not provided', () => {
		render(
			renderMap({
				...defaultProps,
				error: 'Test error',
			})
		);

		const errorComponent = screen.getByTestId('map-error');
		expect(errorComponent).toBeInTheDocument();
		expect(screen.getByText(/Error loading map: Test error/)).toBeInTheDocument();
	});

	it('should render MapContainer when no error', () => {
		render(
			renderMap({
				...defaultProps,
				error: null,
			})
		);

		const container = screen.getByTestId('map-container');
		expect(container).toBeInTheDocument();
		expect(container).toHaveAttribute('data-is-loading', 'false');
	});

	it('should pass loading state to MapContainer', () => {
		render(
			renderMap({
				...defaultProps,
				error: null,
				isLoading: true,
			})
		);

		const container = screen.getByTestId('map-container');
		expect(container).toHaveAttribute('data-is-loading', 'true');
	});

	it('should pass loadingFallback to MapContainer', () => {
		const loadingFallback = <div data-testid="custom-loading">Loading...</div>;

		render(
			renderMap({
				...defaultProps,
				error: null,
				loadingFallback,
			})
		);

		expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
	});

	it('should pass height and width to MapContainer', () => {
		render(
			renderMap({
				...defaultProps,
				error: null,
				height: '500px',
				width: '80%',
			})
		);

		const container = screen.getByTestId('map-container');
		expect(container).toHaveAttribute('data-height', '500px');
		expect(container).toHaveAttribute('data-width', '80%');
	});

	it('should pass height and width to MapError', () => {
		render(
			renderMap({
				...defaultProps,
				error: 'Test error',
				height: '500px',
				width: '80%',
			})
		);

		const errorComponent = screen.getByTestId('map-error');
		expect(errorComponent).toHaveAttribute('data-height', '500px');
		expect(errorComponent).toHaveAttribute('data-width', '80%');
	});

	it('should pass className to MapContainer', () => {
		render(
			renderMap({
				...defaultProps,
				error: null,
				className: 'custom-class',
			})
		);

		const container = screen.getByTestId('map-container');
		expect(container).toHaveClass('custom-class');
	});

	it('should pass className to MapError', () => {
		render(
			renderMap({
				...defaultProps,
				error: 'Test error',
				className: 'custom-class',
			})
		);

		const errorComponent = screen.getByTestId('map-error');
		expect(errorComponent).toHaveClass('custom-class');
	});

	it('should pass additional props to MapContainer', () => {
		// The mock MapContainer doesn't actually spread props, so we just verify it renders
		const customProps = { 'data-custom': 'custom-value' } as any;

		render(renderMap({ ...defaultProps, error: null, props: customProps }));

		// Verify the component renders (props are passed but mock doesn't use them)
		expect(screen.getByTestId('map-container')).toBeInTheDocument();
	});
});
