/**
 * Video Placeholders Tests
 *
 * Tests for the video placeholder helper functions including:
 * - shouldShowErrorPlaceholder
 * - resolveLoadingPlaceholder
 */

import {
	resolveLoadingPlaceholder,
	shouldShowErrorPlaceholder,
} from '@core/ui/media/video/helpers/video.placeholders';
import type { RenderVideoParams } from '@core/ui/media/video/types/video.types';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

type ErrorPlaceholderParams = Pick<
	RenderVideoParams,
	'hasError' | 'fallbackSrc' | 'errorPlaceholder'
>;

describe('shouldShowErrorPlaceholder', () => {
	it('returns true when hasError is true, errorPlaceholder exists, and no fallbackSrc', () => {
		const params: ErrorPlaceholderParams = {
			hasError: true,
			errorPlaceholder: <div>Error</div>,
			fallbackSrc: undefined,
		};
		expect(shouldShowErrorPlaceholder(params)).toBe(true);
	});

	it('returns false when hasError is false', () => {
		const params: ErrorPlaceholderParams = {
			hasError: false,
			errorPlaceholder: <div>Error</div>,
			fallbackSrc: undefined,
		};
		expect(shouldShowErrorPlaceholder(params)).toBe(false);
	});

	it('returns false when errorPlaceholder is not provided', () => {
		const params: ErrorPlaceholderParams = {
			hasError: true,
			errorPlaceholder: undefined,
			fallbackSrc: undefined,
		};
		expect(shouldShowErrorPlaceholder(params)).toBe(false);
	});

	it('returns false when fallbackSrc is provided', () => {
		const params: ErrorPlaceholderParams = {
			hasError: true,
			errorPlaceholder: <div>Error</div>,
			fallbackSrc: '/fallback.mp4',
		};
		expect(shouldShowErrorPlaceholder(params)).toBe(false);
	});

	it('returns false when all conditions are false', () => {
		const params: ErrorPlaceholderParams = {
			hasError: false,
			errorPlaceholder: undefined,
			fallbackSrc: '/fallback.mp4',
		};
		expect(shouldShowErrorPlaceholder(params)).toBe(false);
	});
});

describe('resolveLoadingPlaceholder', () => {
	it('returns null when not loading', () => {
		const params = {
			isLoading: false,
			showSkeleton: false,
			showSpinner: false,
			className: undefined,
			width: undefined,
			height: undefined,
			loadingPlaceholder: undefined,
		};
		expect(resolveLoadingPlaceholder(params)).toBeNull();
	});

	it('returns skeleton when isLoading is true and showSkeleton is true', () => {
		const params = {
			isLoading: true,
			showSkeleton: true,
			showSpinner: false,
			className: 'custom-class',
			width: 800,
			height: 600,
			loadingPlaceholder: undefined,
		};
		const result = resolveLoadingPlaceholder(params);
		expect(result).not.toBeNull();

		const { container } = renderWithProviders(<>{result}</>);
		const skeleton = container.querySelector('[aria-hidden="true"]');
		expect(skeleton).toBeInTheDocument();
		expect(skeleton).toHaveClass('custom-class');
		expect(skeleton).toHaveClass('animate-pulse');
		expect(skeleton).toHaveStyle({ width: '800px', height: '600px' });
	});

	it('returns custom loading placeholder when isLoading is true and loadingPlaceholder is provided', () => {
		const params = {
			isLoading: true,
			showSkeleton: false,
			showSpinner: false,
			className: 'custom-class',
			width: undefined,
			height: undefined,
			loadingPlaceholder: <div data-testid="loading">Loading...</div>,
		};
		const result = resolveLoadingPlaceholder(params);
		expect(result).not.toBeNull();

		const { container } = renderWithProviders(<>{result}</>);
		const placeholder = container.querySelector('[data-testid="loading"]');
		expect(placeholder).toBeInTheDocument();
		expect(placeholder).toHaveTextContent('Loading...');
		expect(placeholder?.parentElement).toHaveClass('custom-class');
	});

	it('prioritizes skeleton over custom loading placeholder', () => {
		const params = {
			isLoading: true,
			showSkeleton: true,
			showSpinner: false,
			className: undefined,
			width: undefined,
			height: undefined,
			loadingPlaceholder: <div data-testid="loading">Loading...</div>,
		};
		const result = resolveLoadingPlaceholder(params);
		expect(result).not.toBeNull();

		const { container } = renderWithProviders(<>{result}</>);
		expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
		expect(container.querySelector('[data-testid="loading"]')).not.toBeInTheDocument();
	});

	it('returns spinner when isLoading is true and showSpinner is true', () => {
		const params = {
			isLoading: true,
			showSkeleton: false,
			showSpinner: true,
			className: 'custom-class',
			width: 800,
			height: 600,
			loadingPlaceholder: undefined,
		};
		const result = resolveLoadingPlaceholder(params);
		expect(result).not.toBeNull();

		const { container } = renderWithProviders(<>{result}</>);
		const spinnerContainer = container.querySelector('.flex.items-center.justify-center');
		expect(spinnerContainer).toBeInTheDocument();
		expect(spinnerContainer).toHaveClass('custom-class');
		expect(spinnerContainer).toHaveStyle({ width: '800px', height: '600px' });
	});

	it('prioritizes skeleton over spinner', () => {
		const params = {
			isLoading: true,
			showSkeleton: true,
			showSpinner: true,
			className: undefined,
			width: undefined,
			height: undefined,
			loadingPlaceholder: undefined,
		};
		const result = resolveLoadingPlaceholder(params);
		expect(result).not.toBeNull();

		const { container } = renderWithProviders(<>{result}</>);
		expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
		expect(container.querySelector('.flex.items-center.justify-center')).not.toBeInTheDocument();
	});

	it('prioritizes custom loading placeholder over spinner', () => {
		const params = {
			isLoading: true,
			showSkeleton: false,
			showSpinner: true,
			className: undefined,
			width: undefined,
			height: undefined,
			loadingPlaceholder: <div data-testid="loading">Loading...</div>,
		};
		const result = resolveLoadingPlaceholder(params);
		expect(result).not.toBeNull();

		const { container } = renderWithProviders(<>{result}</>);
		expect(container.querySelector('[data-testid="loading"]')).toBeInTheDocument();
		expect(container.querySelector('.flex.items-center.justify-center')).not.toBeInTheDocument();
	});

	it('returns null when isLoading is true but no placeholder options are enabled', () => {
		const params = {
			isLoading: true,
			showSkeleton: false,
			showSpinner: false,
			className: undefined,
			width: undefined,
			height: undefined,
			loadingPlaceholder: undefined,
		};
		expect(resolveLoadingPlaceholder(params)).toBeNull();
	});

	it('handles undefined className gracefully', () => {
		const params = {
			isLoading: true,
			showSkeleton: true,
			showSpinner: false,
			className: undefined,
			width: 800,
			height: 600,
			loadingPlaceholder: undefined,
		};
		const result = resolveLoadingPlaceholder(params);
		expect(result).not.toBeNull();

		const { container } = renderWithProviders(<>{result}</>);
		const skeleton = container.querySelector('[aria-hidden="true"]');
		expect(skeleton).toBeInTheDocument();
	});

	it('handles undefined width and height gracefully', () => {
		const params = {
			isLoading: true,
			showSkeleton: true,
			showSpinner: false,
			className: 'custom-class',
			width: undefined,
			height: undefined,
			loadingPlaceholder: undefined,
		};
		const result = resolveLoadingPlaceholder(params);
		expect(result).not.toBeNull();

		const { container } = renderWithProviders(<>{result}</>);
		const skeleton = container.querySelector('[aria-hidden="true"]');
		expect(skeleton).toBeInTheDocument();
	});
});
