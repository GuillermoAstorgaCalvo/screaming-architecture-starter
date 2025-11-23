/**
 * Tests for InfiniteScroll component
 *
 * Tests the InfiniteScroll component integration:
 * - Props normalization flow
 * - Hook setup integration
 * - Render params preparation
 * - Render function invocation
 * - Different prop combinations
 * - Edge cases and error handling
 */

import { normalizeInfiniteScrollProps } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollNormalizers';
import { prepareRenderParams } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollParams';
import { renderInfiniteScroll } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollRenderers';
import { useInfiniteScrollSetup } from '@core/ui/utilities/infinite-scroll/hooks/useInfiniteScrollSetup';
import InfiniteScroll from '@core/ui/utilities/infinite-scroll/InfiniteScroll';
import type { InfiniteScrollProps } from '@src-types/ui/data/infinite-scroll';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollNormalizers');
vi.mock('@core/ui/utilities/infinite-scroll/hooks/useInfiniteScrollSetup');
vi.mock('@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollParams');
vi.mock('@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollRenderers');

const mockNormalizeInfiniteScrollProps = vi.mocked(normalizeInfiniteScrollProps);
const mockUseInfiniteScrollSetup = vi.mocked(useInfiniteScrollSetup);
const mockPrepareRenderParams = vi.mocked(prepareRenderParams);
const mockRenderInfiniteScroll = vi.mocked(renderInfiniteScroll);

describe('InfiniteScroll', () => {
	const defaultProps: InfiniteScrollProps = {
		isLoading: false,
		hasMore: true,
		onLoadMore: vi.fn(),
		children: <div data-testid="children">Test Content</div>,
	};

	const defaultNormalizedProps = {
		children: defaultProps.children,
		isLoading: false,
		hasMore: true,
		onLoadMore: defaultProps.onLoadMore,
		loadingComponent: undefined,
		loadingText: undefined,
		endMessage: undefined,
		errorMessage: undefined,
		hasError: false,
		onRetry: undefined,
		threshold: 100,
		rootMargin: 'var(--spacing-4xl)',
		emptyComponent: undefined,
		showEmpty: false,
		className: undefined,
		restProps: {},
	};

	const defaultSetupValues = {
		infiniteScrollId: 'test-infinite-scroll-id',
		sentinelRef: createRef<HTMLDivElement>(),
		containerClasses: 'w-full',
		sentinelClasses: 'h-1 w-full',
	};

	const defaultRenderParams = {
		showEmpty: false,
		children: defaultProps.children,
		emptyComponent: undefined,
		infiniteScrollId: 'test-infinite-scroll-id',
		containerClasses: 'w-full',
		restProps: {},
		hasError: false,
		errorMessage: undefined,
		onRetry: undefined,
		isLoading: false,
		loadingComponent: undefined,
		loadingText: undefined,
		hasMore: true,
		endMessage: undefined,
		sentinelRef: defaultSetupValues.sentinelRef,
		sentinelClasses: 'h-1 w-full',
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Setup default mock return values
		mockNormalizeInfiniteScrollProps.mockReturnValue(defaultNormalizedProps);
		mockUseInfiniteScrollSetup.mockReturnValue(defaultSetupValues);
		mockPrepareRenderParams.mockReturnValue(defaultRenderParams);
		mockRenderInfiniteScroll.mockReturnValue(
			<div data-testid="infinite-scroll-container">Infinite Scroll</div>
		);
	});

	describe('component integration', () => {
		it('should normalize props correctly', () => {
			render(<InfiniteScroll {...defaultProps} />);

			expect(mockNormalizeInfiniteScrollProps).toHaveBeenCalledWith(defaultProps);
		});

		it('should call useInfiniteScrollSetup with normalized props', () => {
			render(<InfiniteScroll {...defaultProps} />);

			expect(mockUseInfiniteScrollSetup).toHaveBeenCalledWith({
				isLoading: defaultNormalizedProps.isLoading,
				hasMore: defaultNormalizedProps.hasMore,
				onLoadMore: defaultNormalizedProps.onLoadMore,
				threshold: defaultNormalizedProps.threshold,
				rootMargin: defaultNormalizedProps.rootMargin,
				hasError: defaultNormalizedProps.hasError,
				className: defaultNormalizedProps.className,
			});
		});

		it('should prepare render params with normalized props and setup values', () => {
			render(<InfiniteScroll {...defaultProps} />);

			expect(mockPrepareRenderParams).toHaveBeenCalledWith(
				defaultNormalizedProps,
				defaultSetupValues
			);
		});

		it('should render using renderInfiniteScroll with prepared params', () => {
			render(<InfiniteScroll {...defaultProps} />);

			expect(mockRenderInfiniteScroll).toHaveBeenCalledWith(defaultRenderParams);
		});

		it('should render the result from renderInfiniteScroll', () => {
			const { container } = render(<InfiniteScroll {...defaultProps} />);

			expect(screen.getByTestId('infinite-scroll-container')).toBeInTheDocument();
			expect(container).toHaveTextContent('Infinite Scroll');
		});
	});

	describe('prop passing', () => {
		it('should pass all required props correctly', () => {
			const onLoadMore = vi.fn();
			const props: InfiniteScrollProps = {
				isLoading: true,
				hasMore: false,
				onLoadMore,
				children: <div>Content</div>,
			};

			render(<InfiniteScroll {...props} />);

			expect(mockNormalizeInfiniteScrollProps).toHaveBeenCalledWith(props);
		});

		it('should pass optional props correctly', () => {
			const onLoadMore = vi.fn();
			const onRetry = vi.fn();
			const loadingComponent = <div>Loading...</div>;
			const errorMessage = <div>Error occurred</div>;
			const endMessage = <div>No more items</div>;
			const emptyComponent = <div>Empty state</div>;

			const props: InfiniteScrollProps = {
				isLoading: true,
				hasMore: false,
				onLoadMore,
				children: <div>Content</div>,
				loadingComponent,
				loadingText: 'Loading items...',
				errorMessage,
				hasError: true,
				onRetry,
				endMessage,
				emptyComponent,
				showEmpty: true,
				threshold: 200,
				rootMargin: '50px',
				className: 'custom-class',
			};

			render(<InfiniteScroll {...props} />);

			expect(mockNormalizeInfiniteScrollProps).toHaveBeenCalledWith(props);
		});

		it('should pass HTML attributes as restProps', () => {
			const props = {
				isLoading: false,
				hasMore: true,
				onLoadMore: vi.fn(),
				children: <div>Content</div>,
				'data-testid': 'custom-infinite-scroll',
				'aria-label': 'Infinite scroll list',
				className: 'my-custom-class',
			} as InfiniteScrollProps & { 'data-testid'?: string; 'aria-label'?: string };

			render(<InfiniteScroll {...props} />);

			expect(mockNormalizeInfiniteScrollProps).toHaveBeenCalledWith(props);
		});
	});

	describe('different prop combinations', () => {
		it('should handle loading state', () => {
			const props: InfiniteScrollProps = {
				isLoading: true,
				hasMore: true,
				onLoadMore: vi.fn(),
				children: <div>Content</div>,
			};

			const normalizedProps = {
				...defaultNormalizedProps,
				isLoading: true,
			};

			mockNormalizeInfiniteScrollProps.mockReturnValue(normalizedProps);

			render(<InfiniteScroll {...props} />);

			expect(mockUseInfiniteScrollSetup).toHaveBeenCalledWith(
				expect.objectContaining({
					isLoading: true,
				})
			);
		});

		it('should handle no more data state', () => {
			const props: InfiniteScrollProps = {
				isLoading: false,
				hasMore: false,
				onLoadMore: vi.fn(),
				children: <div>Content</div>,
			};

			const normalizedProps = {
				...defaultNormalizedProps,
				hasMore: false,
			};

			mockNormalizeInfiniteScrollProps.mockReturnValue(normalizedProps);

			render(<InfiniteScroll {...props} />);

			expect(mockUseInfiniteScrollSetup).toHaveBeenCalledWith(
				expect.objectContaining({
					hasMore: false,
				})
			);
		});

		it('should handle error state', () => {
			const onRetry = vi.fn();
			const props: InfiniteScrollProps = {
				isLoading: false,
				hasMore: true,
				onLoadMore: vi.fn(),
				children: <div>Content</div>,
				hasError: true,
				onRetry,
				errorMessage: <div>Error message</div>,
			};

			const normalizedProps = {
				...defaultNormalizedProps,
				hasError: true,
				onRetry,
				errorMessage: <div>Error message</div>,
			};

			mockNormalizeInfiniteScrollProps.mockReturnValue(normalizedProps);

			render(<InfiniteScroll {...props} />);

			expect(mockUseInfiniteScrollSetup).toHaveBeenCalledWith(
				expect.objectContaining({
					hasError: true,
				})
			);
		});

		it('should handle custom threshold and rootMargin', () => {
			const props: InfiniteScrollProps = {
				isLoading: false,
				hasMore: true,
				onLoadMore: vi.fn(),
				children: <div>Content</div>,
				threshold: 500,
				rootMargin: '200px',
			};

			const normalizedProps = {
				...defaultNormalizedProps,
				threshold: 500,
				rootMargin: '200px',
			};

			mockNormalizeInfiniteScrollProps.mockReturnValue(normalizedProps);

			render(<InfiniteScroll {...props} />);

			expect(mockUseInfiniteScrollSetup).toHaveBeenCalledWith(
				expect.objectContaining({
					threshold: 500,
					rootMargin: '200px',
				})
			);
		});

		it('should handle custom className', () => {
			const props: InfiniteScrollProps = {
				isLoading: false,
				hasMore: true,
				onLoadMore: vi.fn(),
				children: <div>Content</div>,
				className: 'my-custom-class',
			};

			const normalizedProps = {
				...defaultNormalizedProps,
				className: 'my-custom-class',
			};

			mockNormalizeInfiniteScrollProps.mockReturnValue(normalizedProps);

			render(<InfiniteScroll {...props} />);

			expect(mockUseInfiniteScrollSetup).toHaveBeenCalledWith(
				expect.objectContaining({
					className: 'my-custom-class',
				})
			);
		});

		it('should handle empty state', () => {
			const props: InfiniteScrollProps = {
				isLoading: false,
				hasMore: false,
				onLoadMore: vi.fn(),
				children: null,
				showEmpty: true,
				emptyComponent: <div>No items found</div>,
			};

			const normalizedProps = {
				...defaultNormalizedProps,
				showEmpty: true,
				children: null,
				emptyComponent: <div>No items found</div>,
				hasMore: false,
			};

			mockNormalizeInfiniteScrollProps.mockReturnValue(normalizedProps);

			render(<InfiniteScroll {...props} />);

			expect(mockPrepareRenderParams).toHaveBeenCalledWith(normalizedProps, defaultSetupValues);
		});
	});

	describe('async onLoadMore callback', () => {
		it('should handle async onLoadMore function', async () => {
			const asyncOnLoadMore = vi.fn(async () => {
				await Promise.resolve();
			});

			const props: InfiniteScrollProps = {
				isLoading: false,
				hasMore: true,
				onLoadMore: asyncOnLoadMore,
				children: <div>Content</div>,
			};

			const normalizedProps = {
				...defaultNormalizedProps,
				onLoadMore: asyncOnLoadMore,
			};

			mockNormalizeInfiniteScrollProps.mockReturnValue(normalizedProps);

			render(<InfiniteScroll {...props} />);

			expect(mockUseInfiniteScrollSetup).toHaveBeenCalledWith(
				expect.objectContaining({
					onLoadMore: asyncOnLoadMore,
				})
			);
		});

		it('should handle sync onLoadMore function', () => {
			const syncOnLoadMore = vi.fn(() => {
				// Sync function
			});

			const props: InfiniteScrollProps = {
				isLoading: false,
				hasMore: true,
				onLoadMore: syncOnLoadMore,
				children: <div>Content</div>,
			};

			const normalizedProps = {
				...defaultNormalizedProps,
				onLoadMore: syncOnLoadMore,
			};

			mockNormalizeInfiniteScrollProps.mockReturnValue(normalizedProps);

			render(<InfiniteScroll {...props} />);

			expect(mockUseInfiniteScrollSetup).toHaveBeenCalledWith(
				expect.objectContaining({
					onLoadMore: syncOnLoadMore,
				})
			);
		});
	});

	describe('re-rendering', () => {
		it('should re-render when props change', () => {
			const { rerender } = render(<InfiniteScroll {...defaultProps} />);

			expect(mockNormalizeInfiniteScrollProps).toHaveBeenCalledTimes(1);

			const newProps: InfiniteScrollProps = {
				...defaultProps,
				isLoading: true,
			};

			rerender(<InfiniteScroll {...newProps} />);

			expect(mockNormalizeInfiniteScrollProps).toHaveBeenCalledTimes(2);
			expect(mockNormalizeInfiniteScrollProps).toHaveBeenLastCalledWith(newProps);
		});

		it('should maintain correct flow on re-render', () => {
			const { rerender } = render(<InfiniteScroll {...defaultProps} />);

			vi.clearAllMocks();

			const newProps: InfiniteScrollProps = {
				...defaultProps,
				hasMore: false,
			};

			const newNormalizedProps = {
				...defaultNormalizedProps,
				hasMore: false,
			};

			mockNormalizeInfiniteScrollProps.mockReturnValue(newNormalizedProps);

			rerender(<InfiniteScroll {...newProps} />);

			expect(mockNormalizeInfiniteScrollProps).toHaveBeenCalledWith(newProps);
			expect(mockUseInfiniteScrollSetup).toHaveBeenCalled();
			expect(mockPrepareRenderParams).toHaveBeenCalled();
			expect(mockRenderInfiniteScroll).toHaveBeenCalled();
		});
	});

	describe('edge cases', () => {
		it('should handle undefined children', () => {
			const props: InfiniteScrollProps = {
				isLoading: false,
				hasMore: true,
				onLoadMore: vi.fn(),
				children: undefined,
			};

			render(<InfiniteScroll {...props} />);

			expect(mockNormalizeInfiniteScrollProps).toHaveBeenCalledWith(props);
		});

		it('should handle null children', () => {
			const props: InfiniteScrollProps = {
				isLoading: false,
				hasMore: true,
				onLoadMore: vi.fn(),
				children: null,
			};

			render(<InfiniteScroll {...props} />);

			expect(mockNormalizeInfiniteScrollProps).toHaveBeenCalledWith(props);
		});

		it('should handle empty string children', () => {
			const props: InfiniteScrollProps = {
				isLoading: false,
				hasMore: true,
				onLoadMore: vi.fn(),
				children: '',
			};

			render(<InfiniteScroll {...props} />);

			expect(mockNormalizeInfiniteScrollProps).toHaveBeenCalledWith(props);
		});

		it('should handle all optional props as undefined', () => {
			const props: InfiniteScrollProps = {
				isLoading: false,
				hasMore: true,
				onLoadMore: vi.fn(),
				children: <div>Content</div>,
			};

			render(<InfiniteScroll {...props} />);

			expect(mockNormalizeInfiniteScrollProps).toHaveBeenCalledWith(props);
		});
	});

	describe('render output', () => {
		it('should render empty state when renderInfiniteScroll returns empty state', () => {
			const emptyStateElement = <div data-testid="empty-state">Empty State</div>;
			mockRenderInfiniteScroll.mockReturnValue(emptyStateElement);

			render(<InfiniteScroll {...defaultProps} />);

			expect(screen.getByTestId('empty-state')).toBeInTheDocument();
		});

		it('should render container when renderInfiniteScroll returns container', () => {
			const containerElement = (
				<div data-testid="container">
					<div data-testid="children">Test Content</div>
				</div>
			);
			mockRenderInfiniteScroll.mockReturnValue(containerElement);

			render(<InfiniteScroll {...defaultProps} />);

			expect(screen.getByTestId('container')).toBeInTheDocument();
			expect(screen.getByTestId('children')).toBeInTheDocument();
		});
	});
});
