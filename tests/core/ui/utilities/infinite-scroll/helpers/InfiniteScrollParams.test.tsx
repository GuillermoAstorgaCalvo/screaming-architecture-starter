/**
 * Tests for InfiniteScrollParams helper
 *
 * Tests the prepareRenderParams function:
 * - Combines normalized props and setup values correctly
 * - Maps all properties from both inputs to output
 * - Handles all property types (booleans, strings, ReactNode, refs, etc.)
 * - Preserves all values correctly
 */

import type { NormalizedInfiniteScrollProps } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollNormalizers';
import { prepareRenderParams } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollParams';
import type { InfiniteScrollSetupValues } from '@core/ui/utilities/infinite-scroll/hooks/useInfiniteScrollSetup';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('prepareRenderParams', () => {
	const createMockNormalizedProps = (
		overrides?: Partial<NormalizedInfiniteScrollProps>
	): NormalizedInfiniteScrollProps => ({
		children: 'Test children',
		isLoading: false,
		hasMore: true,
		onLoadMore: vi.fn(),
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
		...overrides,
	});

	const createMockSetupValues = (
		overrides?: Partial<InfiniteScrollSetupValues>
	): InfiniteScrollSetupValues => ({
		infiniteScrollId: 'test-infinite-scroll-id',
		sentinelRef: createRef<HTMLDivElement>(),
		containerClasses: 'w-full',
		sentinelClasses: 'h-1 w-full',
		...overrides,
	});

	it('should combine normalized props and setup values correctly', () => {
		const normalizedProps = createMockNormalizedProps();
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result).toEqual({
			showEmpty: normalizedProps.showEmpty,
			children: normalizedProps.children,
			emptyComponent: normalizedProps.emptyComponent,
			infiniteScrollId: setupValues.infiniteScrollId,
			containerClasses: setupValues.containerClasses,
			restProps: normalizedProps.restProps,
			hasError: normalizedProps.hasError,
			errorMessage: normalizedProps.errorMessage,
			onRetry: normalizedProps.onRetry,
			isLoading: normalizedProps.isLoading,
			loadingComponent: normalizedProps.loadingComponent,
			loadingText: normalizedProps.loadingText,
			hasMore: normalizedProps.hasMore,
			endMessage: normalizedProps.endMessage,
			sentinelRef: setupValues.sentinelRef,
			sentinelClasses: setupValues.sentinelClasses,
		});
	});

	it('should map showEmpty from normalized props', () => {
		const normalizedProps = createMockNormalizedProps({ showEmpty: true });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.showEmpty).toBe(true);
	});

	it('should map children from normalized props', () => {
		const children = <div>Custom children</div>;
		const normalizedProps = createMockNormalizedProps({ children });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.children).toBe(children);
	});

	it('should map emptyComponent from normalized props', () => {
		const emptyComponent = <div>No items</div>;
		const normalizedProps = createMockNormalizedProps({ emptyComponent });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.emptyComponent).toBe(emptyComponent);
	});

	it('should map infiniteScrollId from setup values', () => {
		const normalizedProps = createMockNormalizedProps();
		const setupValues = createMockSetupValues({
			infiniteScrollId: 'custom-scroll-id',
		});

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.infiniteScrollId).toBe('custom-scroll-id');
	});

	it('should map containerClasses from setup values', () => {
		const normalizedProps = createMockNormalizedProps();
		const setupValues = createMockSetupValues({
			containerClasses: 'custom-container-class',
		});

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.containerClasses).toBe('custom-container-class');
	});

	it('should map restProps from normalized props', () => {
		const restProps = { 'data-testid': 'test', 'aria-label': 'test label' };
		const normalizedProps = createMockNormalizedProps({ restProps });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.restProps).toBe(restProps);
	});

	it('should map hasError from normalized props', () => {
		const normalizedProps = createMockNormalizedProps({ hasError: true });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.hasError).toBe(true);
	});

	it('should map errorMessage from normalized props', () => {
		const errorMessage = <div>Error occurred</div>;
		const normalizedProps = createMockNormalizedProps({ errorMessage });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.errorMessage).toBe(errorMessage);
	});

	it('should map onRetry from normalized props', () => {
		const onRetry = vi.fn();
		const normalizedProps = createMockNormalizedProps({ onRetry });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.onRetry).toBe(onRetry);
	});

	it('should map isLoading from normalized props', () => {
		const normalizedProps = createMockNormalizedProps({ isLoading: true });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.isLoading).toBe(true);
	});

	it('should map loadingComponent from normalized props', () => {
		const loadingComponent = <div>Loading...</div>;
		const normalizedProps = createMockNormalizedProps({ loadingComponent });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.loadingComponent).toBe(loadingComponent);
	});

	it('should map loadingText from normalized props', () => {
		const normalizedProps = createMockNormalizedProps({
			loadingText: 'Loading more items...',
		});
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.loadingText).toBe('Loading more items...');
	});

	it('should map hasMore from normalized props', () => {
		const normalizedProps = createMockNormalizedProps({ hasMore: false });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.hasMore).toBe(false);
	});

	it('should map endMessage from normalized props', () => {
		const endMessage = <div>No more items</div>;
		const normalizedProps = createMockNormalizedProps({ endMessage });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.endMessage).toBe(endMessage);
	});

	it('should map sentinelRef from setup values', () => {
		const sentinelRef = createRef<HTMLDivElement>();
		const normalizedProps = createMockNormalizedProps();
		const setupValues = createMockSetupValues({ sentinelRef });

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.sentinelRef).toBe(sentinelRef);
	});

	it('should map sentinelClasses from setup values', () => {
		const normalizedProps = createMockNormalizedProps();
		const setupValues = createMockSetupValues({
			sentinelClasses: 'custom-sentinel-class',
		});

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.sentinelClasses).toBe('custom-sentinel-class');
	});

	it('should handle undefined optional values', () => {
		const normalizedProps = createMockNormalizedProps({
			emptyComponent: undefined,
			errorMessage: undefined,
			onRetry: undefined,
			loadingComponent: undefined,
			loadingText: undefined,
			endMessage: undefined,
		});
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.emptyComponent).toBeUndefined();
		expect(result.errorMessage).toBeUndefined();
		expect(result.onRetry).toBeUndefined();
		expect(result.loadingComponent).toBeUndefined();
		expect(result.loadingText).toBeUndefined();
		expect(result.endMessage).toBeUndefined();
	});

	it('should handle all properties with different values', () => {
		const children = <div>Test</div>;
		const emptyComponent = <div>Empty</div>;
		const errorMessage = <div>Error</div>;
		const loadingComponent = <div>Loading</div>;
		const endMessage = <div>End</div>;
		const onRetry = vi.fn();
		const sentinelRef = createRef<HTMLDivElement>();
		const restProps = { 'data-testid': 'test' };

		const normalizedProps = createMockNormalizedProps({
			showEmpty: true,
			children,
			emptyComponent,
			restProps,
			hasError: true,
			errorMessage,
			onRetry,
			isLoading: true,
			loadingComponent,
			loadingText: 'Loading...',
			hasMore: false,
			endMessage,
		});

		const setupValues = createMockSetupValues({
			infiniteScrollId: 'custom-id',
			containerClasses: 'custom-container',
			sentinelRef,
			sentinelClasses: 'custom-sentinel',
		});

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result).toEqual({
			showEmpty: true,
			children,
			emptyComponent,
			infiniteScrollId: 'custom-id',
			containerClasses: 'custom-container',
			restProps,
			hasError: true,
			errorMessage,
			onRetry,
			isLoading: true,
			loadingComponent,
			loadingText: 'Loading...',
			hasMore: false,
			endMessage,
			sentinelRef,
			sentinelClasses: 'custom-sentinel',
		});
	});

	it('should preserve reference equality for refs', () => {
		const sentinelRef = createRef<HTMLDivElement>();
		const normalizedProps = createMockNormalizedProps();
		const setupValues = createMockSetupValues({ sentinelRef });

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.sentinelRef).toBe(sentinelRef);
	});

	it('should preserve reference equality for functions', () => {
		const onRetry = vi.fn();
		const normalizedProps = createMockNormalizedProps({ onRetry });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.onRetry).toBe(onRetry);
	});

	it('should preserve reference equality for ReactNode', () => {
		const children = <div>Test</div>;
		const normalizedProps = createMockNormalizedProps({ children });
		const setupValues = createMockSetupValues();

		const result = prepareRenderParams(normalizedProps, setupValues);

		expect(result.children).toBe(children);
	});
});
