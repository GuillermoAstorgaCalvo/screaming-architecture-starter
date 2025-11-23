/**
 * Tests for InfiniteScrollBuilders helper functions
 *
 * Tests builder functions:
 * - buildContainerElementProps
 * - buildContentProps
 * - buildEmptyStateProps
 * - buildContainerRenderProps
 */

import {
	buildContainerElementProps,
	buildContainerRenderProps,
	buildContentProps,
	buildEmptyStateProps,
} from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollBuilders';
import type {
	InfiniteScrollContainerProps,
	InfiniteScrollProps,
} from '@core/ui/utilities/infinite-scroll/types/InfiniteScrollRenderers.types';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

describe('InfiniteScrollBuilders - buildContainerElementProps', () => {
	it('builds props with id, className, and additional props', () => {
		const result = buildContainerElementProps({
			infiniteScrollId: 'test-scroll-1',
			containerClasses: 'custom-class another-class',
			props: { 'data-testid': 'container', role: 'list' },
		});

		expect(result).toEqual({
			id: 'test-scroll-1',
			className: 'custom-class another-class',
			'data-testid': 'container',
			role: 'list',
		});
	});

	it('handles empty props object', () => {
		const result = buildContainerElementProps({
			infiniteScrollId: 'test-scroll-2',
			containerClasses: 'container-class',
			props: {},
		});

		expect(result).toEqual({
			id: 'test-scroll-2',
			className: 'container-class',
		});
	});

	it('handles empty className', () => {
		const result = buildContainerElementProps({
			infiniteScrollId: 'test-scroll-3',
			containerClasses: '',
			props: { 'data-testid': 'empty-class' },
		});

		expect(result).toEqual({
			id: 'test-scroll-3',
			className: '',
			'data-testid': 'empty-class',
		});
	});

	it('merges additional props correctly', () => {
		const result = buildContainerElementProps({
			infiniteScrollId: 'test-scroll-4',
			containerClasses: 'base-class',
			props: {
				'aria-label': 'Infinite scroll container',
				tabIndex: 0,
				style: { height: '100vh' },
			},
		});

		expect(result).toEqual({
			id: 'test-scroll-4',
			className: 'base-class',
			'aria-label': 'Infinite scroll container',
			tabIndex: 0,
			style: { height: '100vh' },
		});
	});

	it('preserves all props when spreading', () => {
		const complexProps = {
			'data-id': '123',
			'data-type': 'infinite-scroll',
			onClick: () => {},
			nested: { key: 'value' },
		};

		const result = buildContainerElementProps({
			infiniteScrollId: 'test-scroll-5',
			containerClasses: 'test-class',
			props: complexProps,
		});

		expect(result.id).toBe('test-scroll-5');
		expect(result.className).toBe('test-class');
		expect((result as Record<string, unknown>)['data-id']).toBe('123');
		expect((result as Record<string, unknown>)['data-type']).toBe('infinite-scroll');
		expect((result as Record<string, unknown>).onClick).toBe(complexProps.onClick);
		expect((result as Record<string, unknown>).nested).toEqual({ key: 'value' });
	});
});

describe('InfiniteScrollBuilders - buildContentProps', () => {
	const createMockContainerProps = (
		overrides?: Partial<InfiniteScrollContainerProps>
	): InfiniteScrollContainerProps => ({
		children: <div>Test Content</div>,
		hasError: false,
		errorMessage: undefined,
		onRetry: undefined,
		isLoading: false,
		loadingComponent: undefined,
		loadingText: undefined,
		hasMore: true,
		endMessage: undefined,
		sentinelRef: createRef<HTMLDivElement>(),
		sentinelClasses: 'sentinel-class',
		infiniteScrollId: 'test-id',
		containerClasses: 'container-class',
		props: {},
		...overrides,
	});

	it('builds content props with all properties', () => {
		const mockOnRetry = () => {};
		const mockLoadingComponent = <div>Loading...</div>;
		const mockEndMessage = <div>End of content</div>;
		const mockErrorMessage = <div>Error occurred</div>;
		const sentinelRef = createRef<HTMLDivElement>();

		const input = createMockContainerProps({
			children: <div>Content</div>,
			hasError: true,
			errorMessage: mockErrorMessage,
			onRetry: mockOnRetry,
			isLoading: true,
			loadingComponent: mockLoadingComponent,
			loadingText: 'Loading more...',
			hasMore: false,
			endMessage: mockEndMessage,
			sentinelRef,
			sentinelClasses: 'custom-sentinel',
		});

		const result = buildContentProps(input);

		expect(result).toEqual({
			children: input.children,
			hasError: true,
			errorMessage: mockErrorMessage,
			onRetry: mockOnRetry,
			isLoading: true,
			loadingComponent: mockLoadingComponent,
			loadingText: 'Loading more...',
			hasMore: false,
			endMessage: mockEndMessage,
			sentinelRef,
			sentinelClasses: 'custom-sentinel',
		});
	});

	it('builds content props with minimal values', () => {
		const input = createMockContainerProps({
			children: null,
			hasError: false,
			errorMessage: undefined,
			onRetry: undefined,
			isLoading: false,
			loadingComponent: undefined,
			loadingText: undefined,
			hasMore: true,
			endMessage: undefined,
			sentinelClasses: '',
		});

		const result = buildContentProps(input);

		expect(result).toEqual({
			children: null,
			hasError: false,
			errorMessage: undefined,
			onRetry: undefined,
			isLoading: false,
			loadingComponent: undefined,
			loadingText: undefined,
			hasMore: true,
			endMessage: undefined,
			sentinelRef: input.sentinelRef,
			sentinelClasses: '',
		});
	});

	it('preserves all boolean flags correctly', () => {
		const input1 = createMockContainerProps({
			hasError: true,
			isLoading: true,
			hasMore: false,
		});

		const result1 = buildContentProps(input1);
		expect(result1.hasError).toBe(true);
		expect(result1.isLoading).toBe(true);
		expect(result1.hasMore).toBe(false);

		const input2 = createMockContainerProps({
			hasError: false,
			isLoading: false,
			hasMore: true,
		});

		const result2 = buildContentProps(input2);
		expect(result2.hasError).toBe(false);
		expect(result2.isLoading).toBe(false);
		expect(result2.hasMore).toBe(true);
	});

	it('preserves sentinel ref and classes', () => {
		const sentinelRef = createRef<HTMLDivElement>();
		const input = createMockContainerProps({
			sentinelRef,
			sentinelClasses: 'my-sentinel-class',
		});

		const result = buildContentProps(input);

		expect(result.sentinelRef).toBe(sentinelRef);
		expect(result.sentinelClasses).toBe('my-sentinel-class');
	});

	it('preserves callback functions', () => {
		const mockOnRetry = () => {
			console.log('retry');
		};

		const input = createMockContainerProps({
			onRetry: mockOnRetry,
		});

		const result = buildContentProps(input);

		expect(result.onRetry).toBe(mockOnRetry);
	});
});

describe('InfiniteScrollBuilders - buildEmptyStateProps', () => {
	const createMockInfiniteScrollProps = (
		overrides?: Partial<InfiniteScrollProps>
	): InfiniteScrollProps => ({
		showEmpty: true,
		children: <div>Content</div>,
		emptyComponent: undefined,
		infiniteScrollId: 'test-id',
		containerClasses: 'container-class',
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
		sentinelClasses: 'sentinel-class',
		...overrides,
	});

	it('builds empty state props with all properties', () => {
		const mockEmptyComponent = <div>No items found</div>;
		const mockRestProps = {
			'data-testid': 'empty-state',
			role: 'status',
		};

		const input = createMockInfiniteScrollProps({
			infiniteScrollId: 'empty-scroll-1',
			containerClasses: 'empty-container',
			emptyComponent: mockEmptyComponent,
			restProps: mockRestProps,
		});

		const result = buildEmptyStateProps(input);

		expect(result).toEqual({
			infiniteScrollId: 'empty-scroll-1',
			containerClasses: 'empty-container',
			emptyComponent: mockEmptyComponent,
			props: mockRestProps,
		});
	});

	it('handles undefined emptyComponent', () => {
		const input = createMockInfiniteScrollProps({
			emptyComponent: undefined,
		});

		const result = buildEmptyStateProps(input);

		expect(result.emptyComponent).toBeUndefined();
		expect(result.infiniteScrollId).toBe('test-id');
		expect(result.containerClasses).toBe('container-class');
	});

	it('handles empty restProps', () => {
		const input = createMockInfiniteScrollProps({
			restProps: {},
		});

		const result = buildEmptyStateProps(input);

		expect(result.props).toEqual({});
	});

	it('preserves complex restProps', () => {
		const complexProps = {
			'data-id': '123',
			style: { padding: '20px' },
			onClick: () => {},
			nested: { key: 'value' },
		};

		const input = createMockInfiniteScrollProps({
			restProps: complexProps,
		});

		const result = buildEmptyStateProps(input);

		expect(result.props).toEqual(complexProps);
		expect(result.props['data-id']).toBe('123');
		expect(result.props.style).toEqual({ padding: '20px' });
	});

	it('preserves emptyComponent ReactNode', () => {
		const emptyComponent = (
			<div>
				<p>No results</p>
				<button>Refresh</button>
			</div>
		);

		const input = createMockInfiniteScrollProps({
			emptyComponent,
		});

		const result = buildEmptyStateProps(input);

		expect(result.emptyComponent).toBe(emptyComponent);
	});
});

describe('InfiniteScrollBuilders - buildContainerRenderProps', () => {
	const createMockInfiniteScrollProps = (
		overrides?: Partial<InfiniteScrollProps>
	): InfiniteScrollProps => ({
		showEmpty: false,
		children: <div>Content</div>,
		emptyComponent: undefined,
		infiniteScrollId: 'test-id',
		containerClasses: 'container-class',
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
		sentinelClasses: 'sentinel-class',
		...overrides,
	});

	it('builds container render props with all properties', () => {
		const mockOnRetry = () => {};
		const mockLoadingComponent = <div>Loading...</div>;
		const mockEndMessage = <div>End</div>;
		const mockErrorMessage = <div>Error</div>;
		const sentinelRef = createRef<HTMLDivElement>();
		const mockRestProps = { 'data-testid': 'container' };

		const input = createMockInfiniteScrollProps({
			infiniteScrollId: 'render-scroll-1',
			containerClasses: 'render-container',
			restProps: mockRestProps,
			children: <div>Test Children</div>,
			hasError: true,
			errorMessage: mockErrorMessage,
			onRetry: mockOnRetry,
			isLoading: true,
			loadingComponent: mockLoadingComponent,
			loadingText: 'Loading...',
			hasMore: false,
			endMessage: mockEndMessage,
			sentinelRef,
			sentinelClasses: 'render-sentinel',
		});

		const result = buildContainerRenderProps(input);

		expect(result).toEqual({
			infiniteScrollId: 'render-scroll-1',
			containerClasses: 'render-container',
			props: mockRestProps,
			children: <div>Test Children</div>,
			hasError: true,
			errorMessage: mockErrorMessage,
			onRetry: mockOnRetry,
			isLoading: true,
			loadingComponent: mockLoadingComponent,
			loadingText: 'Loading...',
			hasMore: false,
			endMessage: mockEndMessage,
			sentinelRef,
			sentinelClasses: 'render-sentinel',
		});
	});

	it('maps restProps to props correctly', () => {
		const mockRestProps = {
			'data-testid': 'test',
			role: 'list',
		};

		const input = createMockInfiniteScrollProps({
			restProps: mockRestProps,
		});

		const result = buildContainerRenderProps(input);

		expect(result.props).toBe(mockRestProps);
		expect(result.props).toEqual(mockRestProps);
	});

	it('handles minimal props', () => {
		const input = createMockInfiniteScrollProps({
			children: null,
			hasError: false,
			errorMessage: undefined,
			onRetry: undefined,
			isLoading: false,
			loadingComponent: undefined,
			loadingText: undefined,
			hasMore: true,
			endMessage: undefined,
			restProps: {},
		});

		const result = buildContainerRenderProps(input);

		expect(result.infiniteScrollId).toBe('test-id');
		expect(result.containerClasses).toBe('container-class');
		expect(result.props).toEqual({});
		expect(result.children).toBeNull();
		expect(result.hasError).toBe(false);
		expect(result.isLoading).toBe(false);
		expect(result.hasMore).toBe(true);
	});

	it('preserves all boolean and state values', () => {
		const input = createMockInfiniteScrollProps({
			hasError: true,
			isLoading: true,
			hasMore: false,
		});

		const result = buildContainerRenderProps(input);

		expect(result.hasError).toBe(true);
		expect(result.isLoading).toBe(true);
		expect(result.hasMore).toBe(false);
	});

	it('preserves refs and callback functions', () => {
		const sentinelRef = createRef<HTMLDivElement>();
		const mockOnRetry = () => {
			console.log('retry');
		};

		const input = createMockInfiniteScrollProps({
			sentinelRef,
			onRetry: mockOnRetry,
		});

		const result = buildContainerRenderProps(input);

		expect(result.sentinelRef).toBe(sentinelRef);
		expect(result.onRetry).toBe(mockOnRetry);
	});

	it('preserves ReactNode values', () => {
		const mockChildren = (
			<div>
				<p>Item 1</p>
				<p>Item 2</p>
			</div>
		);
		const mockLoadingComponent = <div>Loading component</div>;
		const mockEndMessage = <div>End message</div>;
		const mockErrorMessage = <div>Error message</div>;

		const input = createMockInfiniteScrollProps({
			children: mockChildren,
			loadingComponent: mockLoadingComponent,
			endMessage: mockEndMessage,
			errorMessage: mockErrorMessage,
		});

		const result = buildContainerRenderProps(input);

		expect(result.children).toBe(mockChildren);
		expect(result.loadingComponent).toBe(mockLoadingComponent);
		expect(result.endMessage).toBe(mockEndMessage);
		expect(result.errorMessage).toBe(mockErrorMessage);
	});

	it('preserves string values', () => {
		const input = createMockInfiniteScrollProps({
			infiniteScrollId: 'custom-id-123',
			containerClasses: 'custom-class-1 custom-class-2',
			loadingText: 'Custom loading text',
			sentinelClasses: 'custom-sentinel-class',
		});

		const result = buildContainerRenderProps(input);

		expect(result.infiniteScrollId).toBe('custom-id-123');
		expect(result.containerClasses).toBe('custom-class-1 custom-class-2');
		expect(result.loadingText).toBe('Custom loading text');
		expect(result.sentinelClasses).toBe('custom-sentinel-class');
	});
});
