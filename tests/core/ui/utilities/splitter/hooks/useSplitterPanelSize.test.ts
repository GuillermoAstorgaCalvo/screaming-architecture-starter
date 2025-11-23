/**
 * Tests for useSplitterPanelSize hook
 *
 * Tests the useSplitterPanelSize hook:
 * - Size application from panelState
 * - Default size handling
 * - Collapsed state handling
 * - Orientation handling
 */

import type { PanelState } from '@core/ui/utilities/splitter/hooks/useSplitter.state';
import { useSplitterPanelSize } from '@core/ui/utilities/splitter/hooks/useSplitterPanelSize';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockParseDefaultSize = vi.fn<(...args: any[]) => any>(size => {
	if (typeof size === 'number') return size;
	if (typeof size === 'string' && size.endsWith('px')) {
		return Number.parseFloat(size);
	}
	return null;
});
const mockSetDimension = vi.fn<(...args: any[]) => any>();

// Mock the helpers
vi.mock('@core/ui/utilities/splitter/helpers/useSplitter.helpers', () => ({
	parseDefaultSize: (...args: unknown[]) => mockParseDefaultSize(...args),
	setDimension: (...args: unknown[]) => mockSetDimension(...args),
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe('useSplitterPanelSize - Collapsed State', () => {
	it('sets collapsed size when panel is collapsed', () => {
		const panelRef = createRef<HTMLDivElement>();
		const element = document.createElement('div');
		panelRef.current = element;

		const panelState: PanelState = {
			id: 'panel1',
			size: 200,
			collapsed: true,
			minSize: 100,
			maxSize: undefined,
			collapsible: true,
			collapsedSize: 50,
		};

		renderHook(() =>
			useSplitterPanelSize({
				panelRef,
				orientation: 'horizontal',
				panelState,
				isCollapsed: true,
				collapsible: true,
				collapsedSize: 50,
			})
		);

		expect(mockSetDimension).toHaveBeenCalledWith('horizontal', element, 50);
	});

	it('does not set collapsed size when not collapsible', () => {
		const panelRef = createRef<HTMLDivElement>();
		const element = document.createElement('div');
		panelRef.current = element;

		renderHook(() =>
			useSplitterPanelSize({
				panelRef,
				orientation: 'horizontal',
				panelState: undefined,
				isCollapsed: true,
				collapsible: false,
				collapsedSize: 50,
			})
		);

		// Should not call setDimension with collapsed size
		expect(mockSetDimension).not.toHaveBeenCalledWith('horizontal', element, 50);
	});
});

describe('useSplitterPanelSize - Panel State Size', () => {
	it('sets size from panelState when available', () => {
		const panelRef = createRef<HTMLDivElement>();
		const element = document.createElement('div');
		panelRef.current = element;

		const panelState: PanelState = {
			id: 'panel1',
			size: 200,
			collapsed: false,
			minSize: 100,
			maxSize: undefined,
			collapsible: false,
			collapsedSize: 0,
		};

		renderHook(() =>
			useSplitterPanelSize({
				panelRef,
				orientation: 'horizontal',
				panelState,
				isCollapsed: false,
				collapsible: false,
				collapsedSize: 0,
			})
		);

		expect(mockSetDimension).toHaveBeenCalledWith('horizontal', element, 200);
	});
});

describe('useSplitterPanelSize - Default Size', () => {
	it('sets default size when panelState size is undefined', () => {
		const panelRef = createRef<HTMLDivElement>();
		const element = document.createElement('div');
		panelRef.current = element;

		mockParseDefaultSize.mockReturnValue(300);

		renderHook(() =>
			useSplitterPanelSize({
				panelRef,
				orientation: 'horizontal',
				panelState: undefined,
				isCollapsed: false,
				collapsible: false,
				collapsedSize: 0,
				defaultSize: '300px',
			})
		);

		expect(mockParseDefaultSize).toHaveBeenCalledWith('300px', 'horizontal', element);
		expect(mockSetDimension).toHaveBeenCalledWith('horizontal', element, 300);
	});

	it('does not set size when element is null', () => {
		const panelRef = createRef<HTMLDivElement>();

		renderHook(() =>
			useSplitterPanelSize({
				panelRef,
				orientation: 'horizontal',
				panelState: undefined,
				isCollapsed: false,
				collapsible: false,
				collapsedSize: 0,
				defaultSize: '300px',
			})
		);

		expect(mockSetDimension).not.toHaveBeenCalled();
	});
});

describe('useSplitterPanelSize - Orientation', () => {
	it('works with horizontal orientation', () => {
		const panelRef = createRef<HTMLDivElement>();
		const element = document.createElement('div');
		panelRef.current = element;

		const panelState: PanelState = {
			id: 'panel1',
			size: 200,
			collapsed: false,
			minSize: 100,
			maxSize: undefined,
			collapsible: false,
			collapsedSize: 0,
		};

		renderHook(() =>
			useSplitterPanelSize({
				panelRef,
				orientation: 'horizontal',
				panelState,
				isCollapsed: false,
				collapsible: false,
				collapsedSize: 0,
			})
		);

		expect(mockSetDimension).toHaveBeenCalledWith('horizontal', element, 200);
	});

	it('works with vertical orientation', () => {
		const panelRef = createRef<HTMLDivElement>();
		const element = document.createElement('div');
		panelRef.current = element;

		const panelState: PanelState = {
			id: 'panel1',
			size: 200,
			collapsed: false,
			minSize: 100,
			maxSize: undefined,
			collapsible: false,
			collapsedSize: 0,
		};

		renderHook(() =>
			useSplitterPanelSize({
				panelRef,
				orientation: 'vertical',
				panelState,
				isCollapsed: false,
				collapsible: false,
				collapsedSize: 0,
			})
		);

		expect(mockSetDimension).toHaveBeenCalledWith('vertical', element, 200);
	});
});
