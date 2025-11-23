/**
 * InfiniteScrollRenderers Tests
 *
 * Tests for the InfiniteScrollRenderers helper functions including:
 * - renderInfiniteScroll function
 * - shouldShowEmptyState logic (tested indirectly)
 * - Empty state rendering
 * - Container rendering
 * - Edge cases (null/undefined handling)
 */

import { renderInfiniteScrollContainer } from '@core/ui/utilities/infinite-scroll/components/InfiniteScrollContainerRenderer';
import { renderEmptyState } from '@core/ui/utilities/infinite-scroll/components/InfiniteScrollStateRenderers';
import {
	buildContainerRenderProps,
	buildEmptyStateProps,
} from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollBuilders';
import { renderInfiniteScroll } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollRenderers';
import type { InfiniteScrollProps } from '@core/ui/utilities/infinite-scroll/types/InfiniteScrollRenderers.types';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/utilities/infinite-scroll/components/InfiniteScrollContainerRenderer', () => ({
	renderInfiniteScrollContainer: vi.fn(),
}));

vi.mock('@core/ui/utilities/infinite-scroll/components/InfiniteScrollStateRenderers', () => ({
	renderEmptyState: vi.fn(),
}));

vi.mock('@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollBuilders', () => ({
	buildContainerRenderProps: vi.fn(),
	buildEmptyStateProps: vi.fn(),
}));

const mockRenderInfiniteScrollContainer = vi.mocked(renderInfiniteScrollContainer);
const mockRenderEmptyState = vi.mocked(renderEmptyState);
const mockBuildContainerRenderProps = vi.mocked(buildContainerRenderProps);
const mockBuildEmptyStateProps = vi.mocked(buildEmptyStateProps);

// Helper function to create base params
function createBaseParams(overrides?: Partial<InfiniteScrollProps>): InfiniteScrollProps {
	return {
		showEmpty: false,
		children: <div data-testid="children">Children</div>,
		emptyComponent: undefined,
		infiniteScrollId: 'test-infinite-scroll',
		containerClasses: 'test-container-class',
		restProps: {},
		hasError: false,
		errorMessage: undefined,
		onRetry: undefined,
		isLoading: false,
		loadingComponent: undefined,
		loadingText: undefined,
		hasMore: true,
		endMessage: undefined,
		sentinelRef: createRef<HTMLDivElement>(),
		sentinelClasses: 'test-sentinel-class',
		...overrides,
	};
}

describe('renderInfiniteScroll', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('empty state rendering', () => {
		it('renders empty state when showEmpty is true and children is null', () => {
			const emptyStateProps = {
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				emptyComponent: undefined,
				props: {},
			};
			const emptyStateElement = <div data-testid="empty-state">Empty State</div>;

			mockBuildEmptyStateProps.mockReturnValue(emptyStateProps);
			mockRenderEmptyState.mockReturnValue(emptyStateElement);

			const params = createBaseParams({
				showEmpty: true,
				children: null,
			});

			const result = renderInfiniteScroll(params);

			expect(mockBuildEmptyStateProps).toHaveBeenCalledWith(params);
			expect(mockRenderEmptyState).toHaveBeenCalledWith(emptyStateProps);
			expect(mockBuildContainerRenderProps).not.toHaveBeenCalled();
			expect(mockRenderInfiniteScrollContainer).not.toHaveBeenCalled();

			render(<>{result}</>);
			expect(screen.getByTestId('empty-state')).toBeInTheDocument();
		});

		it('renders empty state when showEmpty is true and children is undefined', () => {
			const emptyStateProps = {
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				emptyComponent: undefined,
				props: {},
			};
			const emptyStateElement = <div data-testid="empty-state">Empty State</div>;

			mockBuildEmptyStateProps.mockReturnValue(emptyStateProps);
			mockRenderEmptyState.mockReturnValue(emptyStateElement);

			const params = createBaseParams({
				showEmpty: true,
				children: undefined,
			});

			const result = renderInfiniteScroll(params);

			expect(mockBuildEmptyStateProps).toHaveBeenCalledWith(params);
			expect(mockRenderEmptyState).toHaveBeenCalledWith(emptyStateProps);
			expect(mockBuildContainerRenderProps).not.toHaveBeenCalled();
			expect(mockRenderInfiniteScrollContainer).not.toHaveBeenCalled();

			render(<>{result}</>);
			expect(screen.getByTestId('empty-state')).toBeInTheDocument();
		});

		it('renders empty state when showEmpty is true and children is empty string', () => {
			const emptyStateProps = {
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				emptyComponent: undefined,
				props: {},
			};
			const emptyStateElement = <div data-testid="empty-state">Empty State</div>;

			mockBuildEmptyStateProps.mockReturnValue(emptyStateProps);
			mockRenderEmptyState.mockReturnValue(emptyStateElement);

			const params = createBaseParams({
				showEmpty: true,
				children: '',
			});

			const result = renderInfiniteScroll(params);

			expect(mockBuildEmptyStateProps).toHaveBeenCalledWith(params);
			expect(mockRenderEmptyState).toHaveBeenCalledWith(emptyStateProps);
			expect(mockBuildContainerRenderProps).not.toHaveBeenCalled();
			expect(mockRenderInfiniteScrollContainer).not.toHaveBeenCalled();

			render(<>{result}</>);
			expect(screen.getByTestId('empty-state')).toBeInTheDocument();
		});

		it('renders empty state with custom emptyComponent when provided', () => {
			const customEmptyComponent = <div data-testid="custom-empty">Custom Empty</div>;
			const emptyStateProps = {
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				emptyComponent: customEmptyComponent,
				props: {},
			};
			const emptyStateElement = <div data-testid="empty-state">Empty State</div>;

			mockBuildEmptyStateProps.mockReturnValue(emptyStateProps);
			mockRenderEmptyState.mockReturnValue(emptyStateElement);

			const params = createBaseParams({
				showEmpty: true,
				children: null,
				emptyComponent: customEmptyComponent,
			});

			const result = renderInfiniteScroll(params);

			expect(mockBuildEmptyStateProps).toHaveBeenCalledWith(params);
			expect(mockRenderEmptyState).toHaveBeenCalledWith(emptyStateProps);

			render(<>{result}</>);
			expect(screen.getByTestId('empty-state')).toBeInTheDocument();
		});
	});

	describe('container rendering', () => {
		it('renders container when showEmpty is false', () => {
			const containerProps = {
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				props: {},
				children: <div data-testid="children">Children</div>,
				hasError: false,
				errorMessage: undefined,
				onRetry: undefined,
				isLoading: false,
				loadingComponent: undefined,
				loadingText: undefined,
				hasMore: true,
				endMessage: undefined,
				sentinelRef: createRef<HTMLDivElement>(),
				sentinelClasses: 'test-sentinel-class',
			};
			const containerElement = <div data-testid="container">Container</div>;

			mockBuildContainerRenderProps.mockReturnValue(containerProps);
			mockRenderInfiniteScrollContainer.mockReturnValue(containerElement);

			const params = createBaseParams({
				showEmpty: false,
			});

			const result = renderInfiniteScroll(params);

			expect(mockBuildContainerRenderProps).toHaveBeenCalledWith(params);
			expect(mockRenderInfiniteScrollContainer).toHaveBeenCalledWith(containerProps);
			expect(mockBuildEmptyStateProps).not.toHaveBeenCalled();
			expect(mockRenderEmptyState).not.toHaveBeenCalled();

			render(<>{result}</>);
			expect(screen.getByTestId('container')).toBeInTheDocument();
		});

		it('renders container when showEmpty is true but children exist', () => {
			const containerProps = {
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				props: {},
				children: <div data-testid="children">Children</div>,
				hasError: false,
				errorMessage: undefined,
				onRetry: undefined,
				isLoading: false,
				loadingComponent: undefined,
				loadingText: undefined,
				hasMore: true,
				endMessage: undefined,
				sentinelRef: createRef<HTMLDivElement>(),
				sentinelClasses: 'test-sentinel-class',
			};
			const containerElement = <div data-testid="container">Container</div>;

			mockBuildContainerRenderProps.mockReturnValue(containerProps);
			mockRenderInfiniteScrollContainer.mockReturnValue(containerElement);

			const params = createBaseParams({
				showEmpty: true,
				children: <div data-testid="children">Children</div>,
			});

			const result = renderInfiniteScroll(params);

			expect(mockBuildContainerRenderProps).toHaveBeenCalledWith(params);
			expect(mockRenderInfiniteScrollContainer).toHaveBeenCalledWith(containerProps);
			expect(mockBuildEmptyStateProps).not.toHaveBeenCalled();
			expect(mockRenderEmptyState).not.toHaveBeenCalled();

			render(<>{result}</>);
			expect(screen.getByTestId('container')).toBeInTheDocument();
		});

		it('renders container with all props passed correctly', () => {
			const onRetry = vi.fn();
			const loadingComponent = <div>Loading</div>;
			const errorMessage = <div>Error</div>;
			const endMessage = <div>End</div>;
			const sentinelRef = createRef<HTMLDivElement>();

			const containerProps = {
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				props: { 'data-testid': 'custom-container' },
				children: <div data-testid="children">Children</div>,
				hasError: true,
				errorMessage,
				onRetry,
				isLoading: true,
				loadingComponent,
				loadingText: 'Loading...',
				hasMore: false,
				endMessage,
				sentinelRef,
				sentinelClasses: 'test-sentinel-class',
			};
			const containerElement = <div data-testid="container">Container</div>;

			mockBuildContainerRenderProps.mockReturnValue(containerProps);
			mockRenderInfiniteScrollContainer.mockReturnValue(containerElement);

			const params = createBaseParams({
				showEmpty: false,
				restProps: { 'data-testid': 'custom-container' },
				hasError: true,
				errorMessage,
				onRetry,
				isLoading: true,
				loadingComponent,
				loadingText: 'Loading...',
				hasMore: false,
				endMessage,
				sentinelRef,
			});

			const result = renderInfiniteScroll(params);

			expect(mockBuildContainerRenderProps).toHaveBeenCalledWith(params);
			expect(mockRenderInfiniteScrollContainer).toHaveBeenCalledWith(containerProps);

			render(<>{result}</>);
			expect(screen.getByTestId('container')).toBeInTheDocument();
		});
	});

	describe('edge cases', () => {
		it('handles showEmpty false with null children', () => {
			const containerProps = {
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				props: {},
				children: null,
				hasError: false,
				errorMessage: undefined,
				onRetry: undefined,
				isLoading: false,
				loadingComponent: undefined,
				loadingText: undefined,
				hasMore: true,
				endMessage: undefined,
				sentinelRef: createRef<HTMLDivElement>(),
				sentinelClasses: 'test-sentinel-class',
			};
			const containerElement = <div data-testid="container">Container</div>;

			mockBuildContainerRenderProps.mockReturnValue(containerProps);
			mockRenderInfiniteScrollContainer.mockReturnValue(containerElement);

			const params = createBaseParams({
				showEmpty: false,
				children: null,
			});

			const result = renderInfiniteScroll(params);

			expect(mockBuildContainerRenderProps).toHaveBeenCalledWith(params);
			expect(mockRenderInfiniteScrollContainer).toHaveBeenCalledWith(containerProps);
			expect(mockBuildEmptyStateProps).not.toHaveBeenCalled();

			render(<>{result}</>);
			expect(screen.getByTestId('container')).toBeInTheDocument();
		});

		it('handles showEmpty false with undefined children', () => {
			const containerProps = {
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				props: {},
				children: undefined,
				hasError: false,
				errorMessage: undefined,
				onRetry: undefined,
				isLoading: false,
				loadingComponent: undefined,
				loadingText: undefined,
				hasMore: true,
				endMessage: undefined,
				sentinelRef: createRef<HTMLDivElement>(),
				sentinelClasses: 'test-sentinel-class',
			};
			const containerElement = <div data-testid="container">Container</div>;

			mockBuildContainerRenderProps.mockReturnValue(containerProps);
			mockRenderInfiniteScrollContainer.mockReturnValue(containerElement);

			const params = createBaseParams({
				showEmpty: false,
				children: undefined,
			});

			const result = renderInfiniteScroll(params);

			expect(mockBuildContainerRenderProps).toHaveBeenCalledWith(params);
			expect(mockRenderInfiniteScrollContainer).toHaveBeenCalledWith(containerProps);
			expect(mockBuildEmptyStateProps).not.toHaveBeenCalled();

			render(<>{result}</>);
			expect(screen.getByTestId('container')).toBeInTheDocument();
		});

		it('handles empty string children with showEmpty true', () => {
			const emptyStateProps = {
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				emptyComponent: undefined,
				props: {},
			};
			const emptyStateElement = <div data-testid="empty-state">Empty State</div>;

			mockBuildEmptyStateProps.mockReturnValue(emptyStateProps);
			mockRenderEmptyState.mockReturnValue(emptyStateElement);

			const params = createBaseParams({
				showEmpty: true,
				children: '',
			});

			const result = renderInfiniteScroll(params);

			expect(mockBuildEmptyStateProps).toHaveBeenCalledWith(params);
			expect(mockRenderEmptyState).toHaveBeenCalledWith(emptyStateProps);

			render(<>{result}</>);
			expect(screen.getByTestId('empty-state')).toBeInTheDocument();
		});
	});
});
