/**
 * Tests for useInfiniteScrollSetup hook
 *
 * Tests the useInfiniteScrollSetup hook:
 * - ID generation
 * - Parameter passing to useInfiniteScroll
 * - Class generation for container and sentinel
 * - Return values structure
 * - Error state handling (enabled flag)
 */

import { useInfiniteScrollSetup } from '@core/ui/utilities/infinite-scroll/hooks/useInfiniteScrollSetup';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the dependencies
const mockUseInfiniteScroll = vi.fn();
const mockGetInfiniteScrollClasses = vi.fn();
const mockGetSentinelClasses = vi.fn();
const mockUseId = vi.fn();

vi.mock('@core/ui/utilities/infinite-scroll/hooks/useInfiniteScroll', () => ({
	useInfiniteScroll: (args: unknown) => mockUseInfiniteScroll(args),
}));

vi.mock('@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollHelpers', () => ({
	getInfiniteScrollClasses: (args: unknown) => mockGetInfiniteScrollClasses(args),
	getSentinelClasses: () => mockGetSentinelClasses(),
}));

vi.mock('react', async () => {
	const actual = await vi.importActual('react');
	return {
		...actual,
		useId: () => mockUseId(),
	};
});

beforeEach(() => {
	vi.clearAllMocks();
});

describe('useInfiniteScrollSetup', () => {
	const defaultParams = {
		isLoading: false,
		hasMore: true,
		onLoadMore: vi.fn(),
		threshold: 100,
		rootMargin: '100px',
		hasError: false,
		className: undefined,
	};

	it('should generate an ID using useId', () => {
		const mockId = 'infinite-scroll-123';
		mockUseId.mockReturnValue(mockId);
		const mockSentinelRef = createRef<HTMLDivElement>();
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue('w-full');
		mockGetSentinelClasses.mockReturnValue('h-1 w-full');

		const { result } = renderHook(() => useInfiniteScrollSetup(defaultParams));

		expect(mockUseId).toHaveBeenCalled();
		expect(result.current.infiniteScrollId).toBe(mockId);
	});

	it('should call useInfiniteScroll with correct parameters', () => {
		const mockSentinelRef = createRef<HTMLDivElement>();
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue('w-full');
		mockGetSentinelClasses.mockReturnValue('h-1 w-full');
		mockUseId.mockReturnValue('test-id');

		renderHook(() => useInfiniteScrollSetup(defaultParams));

		expect(mockUseInfiniteScroll).toHaveBeenCalledWith({
			isLoading: defaultParams.isLoading,
			hasMore: defaultParams.hasMore,
			onLoadMore: defaultParams.onLoadMore,
			threshold: defaultParams.threshold,
			rootMargin: defaultParams.rootMargin,
			enabled: true, // !hasError
		});
	});

	it('should disable infinite scroll when hasError is true', () => {
		const mockSentinelRef = createRef<HTMLDivElement>();
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue('w-full');
		mockGetSentinelClasses.mockReturnValue('h-1 w-full');
		mockUseId.mockReturnValue('test-id');

		const paramsWithError = { ...defaultParams, hasError: true };

		renderHook(() => useInfiniteScrollSetup(paramsWithError));

		expect(mockUseInfiniteScroll).toHaveBeenCalledWith(
			expect.objectContaining({
				enabled: false,
			})
		);
	});

	it('should call getInfiniteScrollClasses with className', () => {
		const mockSentinelRef = createRef<HTMLDivElement>();
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue('w-full custom-class');
		mockGetSentinelClasses.mockReturnValue('h-1 w-full');
		mockUseId.mockReturnValue('test-id');

		const customClassName = 'custom-class';
		const paramsWithClassName = { ...defaultParams, className: customClassName };

		renderHook(() => useInfiniteScrollSetup(paramsWithClassName));

		expect(mockGetInfiniteScrollClasses).toHaveBeenCalledWith(customClassName);
	});

	it('should call getInfiniteScrollClasses with undefined when className is not provided', () => {
		const mockSentinelRef = createRef<HTMLDivElement>();
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue('w-full');
		mockGetSentinelClasses.mockReturnValue('h-1 w-full');
		mockUseId.mockReturnValue('test-id');

		renderHook(() => useInfiniteScrollSetup(defaultParams));

		expect(mockGetInfiniteScrollClasses).toHaveBeenCalledWith(undefined);
	});

	it('should call getSentinelClasses', () => {
		const mockSentinelRef = createRef<HTMLDivElement>();
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue('w-full');
		mockGetSentinelClasses.mockReturnValue('h-1 w-full');
		mockUseId.mockReturnValue('test-id');

		renderHook(() => useInfiniteScrollSetup(defaultParams));

		expect(mockGetSentinelClasses).toHaveBeenCalled();
	});

	it('should return all expected values', () => {
		const mockId = 'infinite-scroll-456';
		const mockSentinelRef = createRef<HTMLDivElement>();
		const mockContainerClasses = 'w-full custom-container';
		const mockSentinelClasses = 'h-1 w-full custom-sentinel';

		mockUseId.mockReturnValue(mockId);
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue(mockContainerClasses);
		mockGetSentinelClasses.mockReturnValue(mockSentinelClasses);

		const { result } = renderHook(() => useInfiniteScrollSetup(defaultParams));

		expect(result.current).toEqual({
			infiniteScrollId: mockId,
			sentinelRef: mockSentinelRef,
			containerClasses: mockContainerClasses,
			sentinelClasses: mockSentinelClasses,
		});
	});

	it('should pass all parameters correctly to useInfiniteScroll', () => {
		const mockSentinelRef = createRef<HTMLDivElement>();
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue('w-full');
		mockGetSentinelClasses.mockReturnValue('h-1 w-full');
		mockUseId.mockReturnValue('test-id');

		const customParams = {
			isLoading: true,
			hasMore: false,
			onLoadMore: vi.fn(() => Promise.resolve()),
			threshold: 200,
			rootMargin: '200px',
			hasError: false,
			className: 'my-custom-class',
		};

		renderHook(() => useInfiniteScrollSetup(customParams));

		expect(mockUseInfiniteScroll).toHaveBeenCalledWith({
			isLoading: customParams.isLoading,
			hasMore: customParams.hasMore,
			onLoadMore: customParams.onLoadMore,
			threshold: customParams.threshold,
			rootMargin: customParams.rootMargin,
			enabled: true,
		});
	});

	it('should handle async onLoadMore callback', () => {
		const mockSentinelRef = createRef<HTMLDivElement>();
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue('w-full');
		mockGetSentinelClasses.mockReturnValue('h-1 w-full');
		mockUseId.mockReturnValue('test-id');

		const asyncOnLoadMore = vi.fn(async () => {
			await Promise.resolve();
		});

		const paramsWithAsync = { ...defaultParams, onLoadMore: asyncOnLoadMore };

		renderHook(() => useInfiniteScrollSetup(paramsWithAsync));

		expect(mockUseInfiniteScroll).toHaveBeenCalledWith(
			expect.objectContaining({
				onLoadMore: asyncOnLoadMore,
			})
		);
	});

	it('should handle different threshold values', () => {
		const mockSentinelRef = createRef<HTMLDivElement>();
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue('w-full');
		mockGetSentinelClasses.mockReturnValue('h-1 w-full');
		mockUseId.mockReturnValue('test-id');

		const paramsWithThreshold = { ...defaultParams, threshold: 500 };

		renderHook(() => useInfiniteScrollSetup(paramsWithThreshold));

		expect(mockUseInfiniteScroll).toHaveBeenCalledWith(
			expect.objectContaining({
				threshold: 500,
			})
		);
	});

	it('should handle different rootMargin values', () => {
		const mockSentinelRef = createRef<HTMLDivElement>();
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue('w-full');
		mockGetSentinelClasses.mockReturnValue('h-1 w-full');
		mockUseId.mockReturnValue('test-id');

		const paramsWithRootMargin = { ...defaultParams, rootMargin: '50px' };

		renderHook(() => useInfiniteScrollSetup(paramsWithRootMargin));

		expect(mockUseInfiniteScroll).toHaveBeenCalledWith(
			expect.objectContaining({
				rootMargin: '50px',
			})
		);
	});

	it('should maintain stable return values across re-renders', () => {
		const mockId = 'stable-id';
		const mockSentinelRef = createRef<HTMLDivElement>();
		mockUseId.mockReturnValue(mockId);
		mockUseInfiniteScroll.mockReturnValue({ sentinelRef: mockSentinelRef });
		mockGetInfiniteScrollClasses.mockReturnValue('w-full');
		mockGetSentinelClasses.mockReturnValue('h-1 w-full');

		const { result, rerender } = renderHook(() => useInfiniteScrollSetup(defaultParams));

		const firstResult = result.current;

		rerender();

		// The ref should remain the same
		expect(result.current.sentinelRef).toBe(firstResult.sentinelRef);
		// ID should remain the same
		expect(result.current.infiniteScrollId).toBe(firstResult.infiniteScrollId);
	});
});
