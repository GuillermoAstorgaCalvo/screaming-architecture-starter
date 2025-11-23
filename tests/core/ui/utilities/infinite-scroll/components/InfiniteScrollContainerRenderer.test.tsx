/**
 * InfiniteScrollContainerRenderer Tests
 *
 * Tests for the InfiniteScrollContainerRenderer component including:
 * - renderInfiniteScrollContainer function
 * - Container wrapper rendering
 * - Integration with builders and content renderer
 * - Props passing and merging
 * - Edge cases (empty props, null content, etc.)
 */

import { renderInfiniteScrollContainer } from '@core/ui/utilities/infinite-scroll/components/InfiniteScrollContainerRenderer';
import { renderInfiniteScrollContent } from '@core/ui/utilities/infinite-scroll/components/InfiniteScrollContentRenderer';
import {
	buildContainerElementProps,
	buildContentProps,
} from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollBuilders';
import type { InfiniteScrollContainerProps } from '@core/ui/utilities/infinite-scroll/types/InfiniteScrollRenderers.types';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/utilities/infinite-scroll/components/InfiniteScrollContentRenderer', () => ({
	renderInfiniteScrollContent: vi.fn(),
}));

vi.mock('@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollBuilders', () => ({
	buildContainerElementProps: vi.fn(),
	buildContentProps: vi.fn(),
}));

const mockRenderInfiniteScrollContent = vi.mocked(renderInfiniteScrollContent);
const mockBuildContainerElementProps = vi.mocked(buildContainerElementProps);
const mockBuildContentProps = vi.mocked(buildContentProps);

// Helper function to create base params
function createBaseParams(
	overrides?: Partial<InfiniteScrollContainerProps>
): InfiniteScrollContainerProps {
	return {
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
		...overrides,
	};
}

describe('renderInfiniteScrollContainer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('container element props building', () => {
		it('calls buildContainerElementProps with correct parameters', () => {
			const containerProps = {
				id: 'test-infinite-scroll',
				className: 'test-container-class',
			};

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue({
				children: <div>Children</div>,
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
			});
			mockRenderInfiniteScrollContent.mockReturnValue(<div data-testid="content">Content</div>);

			const params = createBaseParams();

			renderInfiniteScrollContainer(params);

			expect(mockBuildContainerElementProps).toHaveBeenCalledWith({
				infiniteScrollId: params.infiniteScrollId,
				containerClasses: params.containerClasses,
				props: params.props,
			});
		});

		it('passes all container props correctly', () => {
			const customProps = {
				'data-testid': 'custom-container',
				role: 'list',
				'aria-label': 'Infinite scroll list',
			};

			const containerProps = {
				id: 'test-infinite-scroll',
				className: 'test-container-class',
				...customProps,
			};

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue({
				children: <div>Children</div>,
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
			});
			mockRenderInfiniteScrollContent.mockReturnValue(<div data-testid="content">Content</div>);

			const params = createBaseParams({
				props: customProps,
			});

			renderInfiniteScrollContainer(params);

			expect(mockBuildContainerElementProps).toHaveBeenCalledWith({
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				props: customProps,
			});
		});

		it('handles empty props object', () => {
			const containerProps = {
				id: 'test-infinite-scroll',
				className: 'test-container-class',
			};

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue({
				children: <div>Children</div>,
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
			});
			mockRenderInfiniteScrollContent.mockReturnValue(<div data-testid="content">Content</div>);

			const params = createBaseParams({
				props: {},
			});

			renderInfiniteScrollContainer(params);

			expect(mockBuildContainerElementProps).toHaveBeenCalledWith({
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				props: {},
			});
		});
	});

	describe('content props building', () => {
		it('calls buildContentProps with all parameters', () => {
			const contentProps = {
				children: <div>Children</div>,
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

			mockBuildContainerElementProps.mockReturnValue({
				id: 'test-infinite-scroll',
				className: 'test-container-class',
			});
			mockBuildContentProps.mockReturnValue(contentProps);
			mockRenderInfiniteScrollContent.mockReturnValue(<div data-testid="content">Content</div>);

			const params = createBaseParams();

			renderInfiniteScrollContainer(params);

			expect(mockBuildContentProps).toHaveBeenCalledWith(params);
		});

		it('passes all content-related props correctly', () => {
			const onRetry = vi.fn();
			const loadingComponent = <div>Loading...</div>;
			const errorMessage = <div>Error occurred</div>;
			const endMessage = <div>End of content</div>;
			const sentinelRef = createRef<HTMLDivElement>();

			const contentProps = {
				children: <div>Children</div>,
				hasError: true,
				errorMessage,
				onRetry,
				isLoading: true,
				loadingComponent,
				loadingText: 'Loading more...',
				hasMore: false,
				endMessage,
				sentinelRef,
				sentinelClasses: 'custom-sentinel',
			};

			mockBuildContainerElementProps.mockReturnValue({
				id: 'test-infinite-scroll',
				className: 'test-container-class',
			});
			mockBuildContentProps.mockReturnValue(contentProps);
			mockRenderInfiniteScrollContent.mockReturnValue(<div data-testid="content">Content</div>);

			const params = createBaseParams({
				children: <div>Children</div>,
				hasError: true,
				errorMessage,
				onRetry,
				isLoading: true,
				loadingComponent,
				loadingText: 'Loading more...',
				hasMore: false,
				endMessage,
				sentinelRef,
				sentinelClasses: 'custom-sentinel',
			});

			renderInfiniteScrollContainer(params);

			expect(mockBuildContentProps).toHaveBeenCalledWith(params);
		});
	});

	describe('content rendering', () => {
		it('calls renderInfiniteScrollContent with built content props', () => {
			const contentProps = {
				children: <div>Children</div>,
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

			const renderedContent = <div data-testid="content">Content</div>;

			mockBuildContainerElementProps.mockReturnValue({
				id: 'test-infinite-scroll',
				className: 'test-container-class',
			});
			mockBuildContentProps.mockReturnValue(contentProps);
			mockRenderInfiniteScrollContent.mockReturnValue(renderedContent);

			const params = createBaseParams();

			renderInfiniteScrollContainer(params);

			expect(mockRenderInfiniteScrollContent).toHaveBeenCalledWith(contentProps);
		});

		it('renders the content returned by renderInfiniteScrollContent', () => {
			const renderedContent = (
				<div data-testid="content">
					<div data-testid="children">Children</div>
					<div data-testid="sentinel">Sentinel</div>
				</div>
			);

			mockBuildContainerElementProps.mockReturnValue({
				id: 'test-infinite-scroll',
				className: 'test-container-class',
			});
			mockBuildContentProps.mockReturnValue({
				children: <div>Children</div>,
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
			});
			mockRenderInfiniteScrollContent.mockReturnValue(renderedContent);

			const params = createBaseParams();
			const result = renderInfiniteScrollContainer(params);

			render(<>{result}</>);

			expect(screen.getByTestId('content')).toBeInTheDocument();
			expect(screen.getByTestId('children')).toBeInTheDocument();
			expect(screen.getByTestId('sentinel')).toBeInTheDocument();
		});
	});

	describe('container wrapper rendering', () => {
		it('renders a div with container props and content', () => {
			const containerProps = {
				id: 'test-infinite-scroll',
				className: 'test-container-class',
				'data-testid': 'container',
			};

			const renderedContent = <div data-testid="content">Content</div>;

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue({
				children: <div>Children</div>,
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
			});
			mockRenderInfiniteScrollContent.mockReturnValue(renderedContent);

			const params = createBaseParams();
			const result = renderInfiniteScrollContainer(params);

			render(<>{result}</>);

			const container = screen.getByTestId('container');
			expect(container).toBeInTheDocument();
			expect(container.tagName).toBe('DIV');
			expect(container).toHaveAttribute('id', 'test-infinite-scroll');
			expect(container).toHaveClass('test-container-class');
			expect(screen.getByTestId('content')).toBeInTheDocument();
		});

		it('applies all container props to the wrapper div', () => {
			const containerProps = {
				id: 'custom-scroll-id',
				className: 'custom-class another-class',
				'data-testid': 'custom-container',
				role: 'list',
				'aria-label': 'Infinite scroll list',
				tabIndex: 0,
			};

			const renderedContent = <div data-testid="content">Content</div>;

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue({
				children: <div>Children</div>,
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
			});
			mockRenderInfiniteScrollContent.mockReturnValue(renderedContent);

			const params = createBaseParams({
				infiniteScrollId: 'custom-scroll-id',
				containerClasses: 'custom-class another-class',
				props: {
					'data-testid': 'custom-container',
					role: 'list',
					'aria-label': 'Infinite scroll list',
					tabIndex: 0,
				},
			});

			const result = renderInfiniteScrollContainer(params);

			render(<>{result}</>);

			const container = screen.getByTestId('custom-container');
			expect(container).toHaveAttribute('id', 'custom-scroll-id');
			expect(container).toHaveClass('custom-class');
			expect(container).toHaveClass('another-class');
			expect(container).toHaveAttribute('role', 'list');
			expect(container).toHaveAttribute('aria-label', 'Infinite scroll list');
			expect(container).toHaveAttribute('tabIndex', '0');
		});

		it('renders content inside the container wrapper', () => {
			const containerProps = {
				id: 'test-infinite-scroll',
				className: 'test-container-class',
				'data-testid': 'container',
			};

			const renderedContent = (
				<>
					<div data-testid="children">Children</div>
					<div data-testid="loading">Loading</div>
					<div data-testid="sentinel">Sentinel</div>
				</>
			);

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue({
				children: <div>Children</div>,
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
			});
			mockRenderInfiniteScrollContent.mockReturnValue(renderedContent);

			const params = createBaseParams();
			const result = renderInfiniteScrollContainer(params);

			render(<>{result}</>);

			const container = screen.getByTestId('container');
			expect(container).toBeInTheDocument();
			expect(screen.getByTestId('children')).toBeInTheDocument();
			expect(screen.getByTestId('loading')).toBeInTheDocument();
			expect(screen.getByTestId('sentinel')).toBeInTheDocument();

			// Verify content is inside container
			expect(container).toContainElement(screen.getByTestId('children'));
			expect(container).toContainElement(screen.getByTestId('loading'));
			expect(container).toContainElement(screen.getByTestId('sentinel'));
		});
	});

	describe('integration', () => {
		it('calls all functions in correct order', () => {
			const containerProps = {
				id: 'test-infinite-scroll',
				className: 'test-container-class',
			};

			const contentProps = {
				children: <div>Children</div>,
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

			const renderedContent = <div data-testid="content">Content</div>;

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue(contentProps);
			mockRenderInfiniteScrollContent.mockReturnValue(renderedContent);

			const params = createBaseParams();

			renderInfiniteScrollContainer(params);

			// Verify call order
			expect(mockBuildContainerElementProps).toHaveBeenCalledBefore(
				mockBuildContentProps as unknown as ReturnType<typeof vi.fn>
			);
			expect(mockBuildContentProps).toHaveBeenCalledBefore(
				mockRenderInfiniteScrollContent as unknown as ReturnType<typeof vi.fn>
			);
		});

		it('handles complete flow with all props', () => {
			const onRetry = vi.fn();
			const loadingComponent = <div>Loading...</div>;
			const errorMessage = <div>Error occurred</div>;
			const endMessage = <div>End of content</div>;
			const sentinelRef = createRef<HTMLDivElement>();
			const customProps = {
				'data-testid': 'custom-container',
				role: 'list',
			};

			const containerProps = {
				id: 'test-infinite-scroll',
				className: 'test-container-class',
				...customProps,
			};

			const contentProps = {
				children: <div data-testid="children">Children</div>,
				hasError: true,
				errorMessage,
				onRetry,
				isLoading: true,
				loadingComponent,
				loadingText: 'Loading more...',
				hasMore: false,
				endMessage,
				sentinelRef,
				sentinelClasses: 'custom-sentinel',
			};

			const renderedContent = (
				<>
					<div data-testid="children">Children</div>
					<div data-testid="error">Error</div>
					<div data-testid="loading">Loading</div>
					<div data-testid="end">End</div>
					<div data-testid="sentinel">Sentinel</div>
				</>
			);

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue(contentProps);
			mockRenderInfiniteScrollContent.mockReturnValue(renderedContent);

			const params = createBaseParams({
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				props: customProps,
				children: <div data-testid="children">Children</div>,
				hasError: true,
				errorMessage,
				onRetry,
				isLoading: true,
				loadingComponent,
				loadingText: 'Loading more...',
				hasMore: false,
				endMessage,
				sentinelRef,
				sentinelClasses: 'custom-sentinel',
			});

			const result = renderInfiniteScrollContainer(params);

			render(<>{result}</>);

			// Verify container
			const container = screen.getByTestId('custom-container');
			expect(container).toBeInTheDocument();
			expect(container).toHaveAttribute('id', 'test-infinite-scroll');
			expect(container).toHaveClass('test-container-class');
			expect(container).toHaveAttribute('role', 'list');

			// Verify all content is rendered
			expect(screen.getByTestId('children')).toBeInTheDocument();
			expect(screen.getByTestId('error')).toBeInTheDocument();
			expect(screen.getByTestId('loading')).toBeInTheDocument();
			expect(screen.getByTestId('end')).toBeInTheDocument();
			expect(screen.getByTestId('sentinel')).toBeInTheDocument();
		});
	});

	describe('edge cases', () => {
		it('handles null children', () => {
			const containerProps = {
				id: 'test-infinite-scroll',
				className: 'test-container-class',
			};

			const contentProps = {
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

			const renderedContent = <div data-testid="content">Content</div>;

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue(contentProps);
			mockRenderInfiniteScrollContent.mockReturnValue(renderedContent);

			const params = createBaseParams({
				children: null,
			});

			const result = renderInfiniteScrollContainer(params);

			render(<>{result}</>);

			expect(screen.getByTestId('content')).toBeInTheDocument();
		});

		it('handles undefined children', () => {
			const containerProps = {
				id: 'test-infinite-scroll',
				className: 'test-container-class',
			};

			const contentProps = {
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

			const renderedContent = <div data-testid="content">Content</div>;

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue(contentProps);
			mockRenderInfiniteScrollContent.mockReturnValue(renderedContent);

			const params = createBaseParams({
				children: undefined,
			});

			const result = renderInfiniteScrollContainer(params);

			render(<>{result}</>);

			expect(screen.getByTestId('content')).toBeInTheDocument();
		});

		it('handles empty string container classes', () => {
			const containerProps = {
				id: 'test-infinite-scroll',
				className: '',
			};

			const renderedContent = <div data-testid="content">Content</div>;

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue({
				children: <div>Children</div>,
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
			});
			mockRenderInfiniteScrollContent.mockReturnValue(renderedContent);

			const params = createBaseParams({
				containerClasses: '',
			});

			const result = renderInfiniteScrollContainer(params);

			render(<>{result}</>);

			const container = screen.getByTestId('content').parentElement;
			expect(container).toBeInTheDocument();
			expect(container).toHaveAttribute('id', 'test-infinite-scroll');
		});

		it('handles complex nested props', () => {
			const complexProps = {
				'data-id': '123',
				style: { height: '100vh', padding: '20px' },
				onClick: vi.fn(),
				nested: { key: 'value' },
			};

			const containerProps = {
				id: 'test-infinite-scroll',
				className: 'test-container-class',
				...complexProps,
			};

			const renderedContent = <div data-testid="content">Content</div>;

			mockBuildContainerElementProps.mockReturnValue(containerProps);
			mockBuildContentProps.mockReturnValue({
				children: <div>Children</div>,
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
			});
			mockRenderInfiniteScrollContent.mockReturnValue(renderedContent);

			const params = createBaseParams({
				props: complexProps,
			});

			renderInfiniteScrollContainer(params);

			expect(mockBuildContainerElementProps).toHaveBeenCalledWith({
				infiniteScrollId: 'test-infinite-scroll',
				containerClasses: 'test-container-class',
				props: complexProps,
			});
		});
	});
});
