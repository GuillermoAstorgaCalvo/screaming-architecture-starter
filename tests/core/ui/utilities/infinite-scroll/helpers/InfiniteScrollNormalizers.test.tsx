/**
 * InfiniteScrollNormalizers Tests
 *
 * Tests for the normalizeInfiniteScrollProps function:
 * - Default values
 * - Provided values
 * - Optional props handling
 * - Rest props preservation
 */

import { normalizeInfiniteScrollProps } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollNormalizers';
import type { InfiniteScrollProps } from '@src-types/ui/data/infinite-scroll';
import { describe, expect, it, vi } from 'vitest';

describe('normalizeInfiniteScrollProps - default values', () => {
	it('applies default values for optional props', () => {
		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: true,
			onLoadMore: vi.fn(),
		};

		const result = normalizeInfiniteScrollProps(props);

		expect(result.children).toBe(props.children);
		expect(result.isLoading).toBe(false);
		expect(result.hasMore).toBe(true);
		expect(result.onLoadMore).toBe(props.onLoadMore);
		expect(result.hasError).toBe(false);
		expect(result.threshold).toBe(100);
		expect(result.rootMargin).toBe('var(--spacing-4xl)');
		expect(result.showEmpty).toBe(false);
		expect(result.loadingComponent).toBeUndefined();
		expect(result.loadingText).toBeUndefined();
		expect(result.endMessage).toBeUndefined();
		expect(result.errorMessage).toBeUndefined();
		expect(result.onRetry).toBeUndefined();
		expect(result.emptyComponent).toBeUndefined();
		expect(result.className).toBeUndefined();
		expect(result.restProps).toEqual({});
	});
});

describe('normalizeInfiniteScrollProps - provided values', () => {
	it('preserves all provided values', () => {
		const onLoadMore = vi.fn();
		const onRetry = vi.fn();
		const loadingComponent = <div>Loading...</div>;
		const endMessage = <div>End of list</div>;
		const errorMessage = <div>Error occurred</div>;
		const emptyComponent = <div>No items</div>;

		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: true,
			hasMore: false,
			onLoadMore,
			loadingComponent,
			loadingText: 'Loading data...',
			endMessage,
			errorMessage,
			hasError: true,
			onRetry,
			threshold: 200,
			rootMargin: '50px',
			emptyComponent,
			showEmpty: true,
			className: 'custom-scroll',
		};

		const result = normalizeInfiniteScrollProps(props);

		expect(result.children).toBe(props.children);
		expect(result.isLoading).toBe(true);
		expect(result.hasMore).toBe(false);
		expect(result.onLoadMore).toBe(onLoadMore);
		expect(result.loadingComponent).toBe(loadingComponent);
		expect(result.loadingText).toBe('Loading data...');
		expect(result.endMessage).toBe(endMessage);
		expect(result.errorMessage).toBe(errorMessage);
		expect(result.hasError).toBe(true);
		expect(result.onRetry).toBe(onRetry);
		expect(result.threshold).toBe(200);
		expect(result.rootMargin).toBe('50px');
		expect(result.emptyComponent).toBe(emptyComponent);
		expect(result.showEmpty).toBe(true);
		expect(result.className).toBe('custom-scroll');
	});
});

describe('normalizeInfiniteScrollProps - optional props', () => {
	it('handles undefined optional props', () => {
		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: true,
			onLoadMore: vi.fn(),
		};

		const result = normalizeInfiniteScrollProps(props);

		expect(result.loadingComponent).toBeUndefined();
		expect(result.loadingText).toBeUndefined();
		expect(result.endMessage).toBeUndefined();
		expect(result.errorMessage).toBeUndefined();
		expect(result.onRetry).toBeUndefined();
		expect(result.emptyComponent).toBeUndefined();
		expect(result.className).toBeUndefined();
	});

	it('handles provided optional props', () => {
		const onRetry = vi.fn();
		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: true,
			onLoadMore: vi.fn(),
			loadingText: 'Loading...',
			onRetry,
			className: 'my-class',
		};

		const result = normalizeInfiniteScrollProps(props);

		expect(result.loadingText).toBe('Loading...');
		expect(result.onRetry).toBe(onRetry);
		expect(result.className).toBe('my-class');
	});
});

describe('normalizeInfiniteScrollProps - rest props', () => {
	it('preserves rest props from HTMLAttributes', () => {
		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: true,
			onLoadMore: vi.fn(),
			id: 'infinite-scroll',
			'data-testid': 'scroll-container',
			'aria-label': 'Infinite scroll list',
		} as InfiniteScrollProps & { 'data-testid'?: string; 'aria-label'?: string };

		const result = normalizeInfiniteScrollProps(props);

		expect(result.restProps.id).toBe('infinite-scroll');
		expect(result.restProps['data-testid']).toBe('scroll-container');
		expect(result.restProps['aria-label']).toBe('Infinite scroll list');
	});

	it('handles empty rest props', () => {
		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: true,
			onLoadMore: vi.fn(),
		};

		const result = normalizeInfiniteScrollProps(props);

		expect(result.restProps).toEqual({});
	});

	it('preserves multiple HTML attributes', () => {
		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: true,
			onLoadMore: vi.fn(),
			className: 'custom-class',
			id: 'scroll-id',
			role: 'list',
			tabIndex: 0,
			onClick: vi.fn(),
		};

		const result = normalizeInfiniteScrollProps(props);

		expect(result.className).toBe('custom-class');
		expect(result.restProps.id).toBe('scroll-id');
		expect(result.restProps.role).toBe('list');
		expect(result.restProps.tabIndex).toBe(0);
		expect(result.restProps.onClick).toBeDefined();
	});
});

describe('normalizeInfiniteScrollProps - edge cases', () => {
	it('handles async onLoadMore function', () => {
		const asyncOnLoadMore = async () => {
			await new Promise(resolve => setTimeout(resolve, 100));
		};

		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: true,
			onLoadMore: asyncOnLoadMore,
		};

		const result = normalizeInfiniteScrollProps(props);

		expect(result.onLoadMore).toBe(asyncOnLoadMore);
		expect(typeof result.onLoadMore).toBe('function');
	});

	it('handles zero threshold', () => {
		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: true,
			onLoadMore: vi.fn(),
			threshold: 0,
		};

		const result = normalizeInfiniteScrollProps(props);

		expect(result.threshold).toBe(0);
	});

	it('handles custom rootMargin values', () => {
		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: true,
			onLoadMore: vi.fn(),
			rootMargin: '100px 50px',
		};

		const result = normalizeInfiniteScrollProps(props);

		expect(result.rootMargin).toBe('100px 50px');
	});

	it('handles showEmpty as true', () => {
		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: false,
			onLoadMore: vi.fn(),
			showEmpty: true,
		};

		const result = normalizeInfiniteScrollProps(props);

		expect(result.showEmpty).toBe(true);
	});

	it('handles hasError as true', () => {
		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: true,
			onLoadMore: vi.fn(),
			hasError: true,
		};

		const result = normalizeInfiniteScrollProps(props);

		expect(result.hasError).toBe(true);
	});
});

describe('normalizeInfiniteScrollProps - type safety', () => {
	it('returns NormalizedInfiniteScrollProps with correct structure', () => {
		const props: InfiniteScrollProps = {
			children: <div>Content</div>,
			isLoading: false,
			hasMore: true,
			onLoadMore: vi.fn(),
		};

		const result = normalizeInfiniteScrollProps(props);

		// Verify all required properties exist
		expect(result).toHaveProperty('children');
		expect(result).toHaveProperty('isLoading');
		expect(result).toHaveProperty('hasMore');
		expect(result).toHaveProperty('onLoadMore');
		expect(result).toHaveProperty('loadingComponent');
		expect(result).toHaveProperty('loadingText');
		expect(result).toHaveProperty('endMessage');
		expect(result).toHaveProperty('errorMessage');
		expect(result).toHaveProperty('hasError');
		expect(result).toHaveProperty('onRetry');
		expect(result).toHaveProperty('threshold');
		expect(result).toHaveProperty('rootMargin');
		expect(result).toHaveProperty('emptyComponent');
		expect(result).toHaveProperty('showEmpty');
		expect(result).toHaveProperty('className');
		expect(result).toHaveProperty('restProps');
	});
});
