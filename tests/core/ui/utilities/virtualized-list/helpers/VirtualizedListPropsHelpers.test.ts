/**
 * Tests for VirtualizedListPropsHelpers
 *
 * Tests prop extraction, normalization, and wrapper props preparation
 */

import {
	extractVirtualizedListProps,
	normalizeEmptyMessage,
	prepareWrapperProps,
} from '@core/ui/utilities/virtualized-list/helpers/VirtualizedListPropsHelpers';
import type { VirtualizedListProps } from '@src-types/ui/layout/scroll';
import { createElement, type ReactNode, type RefObject } from 'react';
import { describe, expect, it } from 'vitest';

const CONTAINER_SIZE_400 = 400;
const CUSTOM_CLASS = 'custom-class';

// Shared test data
const mockItems = [{ id: 1 }, { id: 2 }];
const mockRenderItem = () => createElement('div', null, 'Item') as ReactNode;
const mockVirtualizer = {
	getVirtualItems: () => [],
	getTotalSize: () => 100,
	measureElement: () => {},
} as any;

describe('VirtualizedListPropsHelpers - normalizeEmptyMessage', () => {
	it('should return string when emptyMessage is a string', () => {
		expect(normalizeEmptyMessage('No items')).toBe('No items');
		expect(normalizeEmptyMessage('')).toBe('');
	});

	it('should return undefined when emptyMessage is not a string', () => {
		expect(normalizeEmptyMessage()).toBeUndefined();
		expect(normalizeEmptyMessage(null as unknown as string)).toBeUndefined();
		expect(normalizeEmptyMessage(123 as unknown as string)).toBeUndefined();
		// ReactNode values are not strings
		expect(normalizeEmptyMessage({ type: 'div', props: {} } as unknown as string)).toBeUndefined();
	});
});

describe('VirtualizedListPropsHelpers - extractVirtualizedListProps - default values', () => {
	it('should extract all props with defaults', () => {
		const props: VirtualizedListProps<{ id: number }> = {
			items: mockItems,
			renderItem: mockRenderItem,
			itemSize: 50,
		};

		const extracted = extractVirtualizedListProps(props);

		expect(extracted.items).toBe(mockItems);
		expect(extracted.renderItem).toBe(mockRenderItem);
		expect(extracted.itemSize).toBe(50);
		expect(extracted.orientation).toBe('vertical');
		expect(extracted.containerSize).toBe(CONTAINER_SIZE_400);
		expect(extracted.overscan).toBe(1);
		expect(extracted.initialScrollOffset).toBe(0);
		expect(extracted.smoothScroll).toBe(false);
		expect(extracted.emptyMessage).toBeUndefined();
		expect(extracted.className).toBeUndefined();
	});
});

describe('VirtualizedListPropsHelpers - extractVirtualizedListProps - provided values', () => {
	it('should use provided values over defaults', () => {
		const props: VirtualizedListProps<{ id: number }> = {
			items: mockItems,
			renderItem: mockRenderItem,
			itemSize: 100,
			orientation: 'horizontal',
			containerSize: 500,
			overscan: 3,
			initialScrollOffset: 200,
			smoothScroll: true,
			emptyMessage: 'Custom empty',
			className: CUSTOM_CLASS,
		};

		const extracted = extractVirtualizedListProps(props);

		expect(extracted.itemSize).toBe(100);
		expect(extracted.orientation).toBe('horizontal');
		expect(extracted.containerSize).toBe(500);
		expect(extracted.overscan).toBe(3);
		expect(extracted.initialScrollOffset).toBe(200);
		expect(extracted.smoothScroll).toBe(true);
		expect(extracted.emptyMessage).toBe('Custom empty');
		expect(extracted.className).toBe(CUSTOM_CLASS);
	});
});

describe('VirtualizedListPropsHelpers - extractVirtualizedListProps - emptyMessage normalization', () => {
	it('should normalize emptyMessage to string or undefined', () => {
		const props1: VirtualizedListProps<{ id: number }> = {
			items: mockItems,
			renderItem: mockRenderItem,
			itemSize: 50,
			emptyMessage: 'String message',
		};

		const props2: VirtualizedListProps<{ id: number }> = {
			items: mockItems,
			renderItem: mockRenderItem,
			itemSize: 50,
			emptyMessage: { type: 'div', props: { children: 'React node' } } as unknown as string,
		};

		expect(extractVirtualizedListProps(props1).emptyMessage).toBe('String message');
		expect(extractVirtualizedListProps(props2).emptyMessage).toBeUndefined();
	});
});

describe('VirtualizedListPropsHelpers - extractVirtualizedListProps - optional callbacks', () => {
	it('should extract getItemKey and onScrollChange when provided', () => {
		const getItemKey = (_item: { id: number }, index: number) => `key-${index}`;
		const onScrollChange = (_offset: number) => {};

		const props: VirtualizedListProps<{ id: number }> = {
			items: mockItems,
			renderItem: mockRenderItem,
			itemSize: 50,
			getItemKey,
			onScrollChange,
		};

		const extracted = extractVirtualizedListProps(props);

		expect(extracted.getItemKey).toBe(getItemKey);
		expect(extracted.onScrollChange).toBe(onScrollChange);
	});
});

describe('VirtualizedListPropsHelpers - extractVirtualizedListProps - restProps extraction', () => {
	it('should extract restProps', () => {
		const props = {
			items: mockItems,
			renderItem: mockRenderItem,
			itemSize: 50,
			'data-testid': 'test-list',
			'aria-label': 'Test list',
		} as VirtualizedListProps<{ id: number }>;

		const extracted = extractVirtualizedListProps(props);

		expect(extracted.restProps).toHaveProperty('data-testid', 'test-list');
		expect(extracted.restProps).toHaveProperty('aria-label', 'Test list');
	});
});

describe('VirtualizedListPropsHelpers - extractVirtualizedListProps - function itemSize', () => {
	it('should handle function itemSize', () => {
		const itemSizeFn = (index: number) => index * 10 + 50;

		const props: VirtualizedListProps<{ id: number }> = {
			items: mockItems,
			renderItem: mockRenderItem,
			itemSize: itemSizeFn,
		};

		const extracted = extractVirtualizedListProps(props);

		expect(extracted.itemSize).toBe(itemSizeFn);
	});
});

describe('VirtualizedListPropsHelpers - prepareWrapperProps - required fields', () => {
	it('should prepare wrapper props with all required fields', () => {
		const parentRef = { current: null } as RefObject<HTMLDivElement | null>;

		const props = prepareWrapperProps({
			items: mockItems,
			renderItem: mockRenderItem,
			virtualizer: mockVirtualizer,
			orientation: 'vertical',
			containerSize: CONTAINER_SIZE_400,
			smoothScroll: false,
			parentRef,
		});

		expect(props.items).toBe(mockItems);
		expect(props.renderItem).toBe(mockRenderItem);
		expect(props.virtualizer).toBe(mockVirtualizer);
		expect(props.orientation).toBe('vertical');
		expect(props.containerSize).toBe(CONTAINER_SIZE_400);
		expect(props.smoothScroll).toBe(false);
		expect(props.parentRef).toBe(parentRef);
	});
});

describe('VirtualizedListPropsHelpers - prepareWrapperProps - optional props', () => {
	it('should include optional props when provided', () => {
		const parentRef = { current: null } as RefObject<HTMLDivElement | null>;
		const getItemKey = (_item: { id: number }, index: number) => `key-${index}`;

		const props = prepareWrapperProps({
			items: mockItems,
			renderItem: mockRenderItem,
			virtualizer: mockVirtualizer,
			getItemKey,
			orientation: 'horizontal',
			containerSize: '100%',
			smoothScroll: true,
			emptyMessage: 'No items',
			className: CUSTOM_CLASS,
			parentRef,
		});

		expect(props.getItemKey).toBe(getItemKey);
		expect(props.emptyMessage).toBe('No items');
		expect(props.className).toBe(CUSTOM_CLASS);
		expect(props.orientation).toBe('horizontal');
		expect(props.containerSize).toBe('100%');
		expect(props.smoothScroll).toBe(true);
	});

	it('should exclude undefined optional props', () => {
		const parentRef = { current: null } as RefObject<HTMLDivElement | null>;

		const props = prepareWrapperProps({
			items: mockItems,
			renderItem: mockRenderItem,
			virtualizer: mockVirtualizer,
			orientation: 'vertical',
			containerSize: CONTAINER_SIZE_400,
			smoothScroll: false,
			parentRef,
		});

		// getItemKey is always included in baseProps, even if undefined
		expect(props.getItemKey).toBeUndefined();
		// emptyMessage and className are conditionally included
		expect(props).not.toHaveProperty('emptyMessage');
		expect(props).not.toHaveProperty('className');
	});
});

describe('VirtualizedListPropsHelpers - prepareWrapperProps - restProps merging', () => {
	it('should merge restProps', () => {
		const parentRef = { current: null } as RefObject<HTMLDivElement | null>;

		const props = prepareWrapperProps({
			items: mockItems,
			renderItem: mockRenderItem,
			virtualizer: mockVirtualizer,
			orientation: 'vertical',
			containerSize: CONTAINER_SIZE_400,
			smoothScroll: false,
			parentRef,
			'data-testid': 'test-list',
			'aria-label': 'Test list',
		});

		expect(props).toHaveProperty('data-testid', 'test-list');
		expect(props).toHaveProperty('aria-label', 'Test list');
	});
});

describe('VirtualizedListPropsHelpers - prepareWrapperProps - parentRef casting', () => {
	it('should cast parentRef to RefObject<HTMLDivElement>', () => {
		const parentRef = { current: null } as RefObject<HTMLDivElement | null>;

		const props = prepareWrapperProps({
			items: mockItems,
			renderItem: mockRenderItem,
			virtualizer: mockVirtualizer,
			orientation: 'vertical',
			containerSize: CONTAINER_SIZE_400,
			smoothScroll: false,
			parentRef,
		});

		expect(props.parentRef).toBe(parentRef);
		expect(props.parentRef).toBeInstanceOf(Object);
	});
});
