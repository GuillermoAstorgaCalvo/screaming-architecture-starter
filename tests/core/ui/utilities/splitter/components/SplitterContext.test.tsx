/**
 * Tests for SplitterContext
 *
 * Tests the SplitterContext:
 * - Context creation
 * - useSplitterContext hook
 * - Error when used outside provider
 */

import {
	SplitterContext,
	useSplitterContext,
} from '@core/ui/utilities/splitter/components/SplitterContext';
import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

describe('SplitterContext', () => {
	it('throws error when useSplitterContext is used outside provider', () => {
		expect(() => {
			renderHook(() => useSplitterContext());
		}).toThrow('SplitterPanel must be used within a Splitter component');
	});

	it('provides context value when used within provider', () => {
		const mockContextValue = {
			orientation: 'horizontal' as const,
			disabled: false,
			handleSize: 4,
			panelStates: [],
			registerPanel: vi.fn(),
			unregisterPanel: vi.fn(),
			handleMouseDown: vi.fn(),
			isResizing: false,
			setPanelCollapsed: vi.fn(),
			getPanelState: vi.fn(),
		};

		const wrapper = ({ children }: { children: ReactNode }) =>
			createElement(SplitterContext.Provider, { value: mockContextValue }, children);

		const { result } = renderHook(() => useSplitterContext(), { wrapper });

		expect(result.current.orientation).toBe('horizontal');
		expect(result.current.disabled).toBe(false);
		expect(result.current.handleSize).toBe(4);
		expect(result.current.panelStates).toEqual([]);
		expect(result.current.isResizing).toBe(false);
	});
});
