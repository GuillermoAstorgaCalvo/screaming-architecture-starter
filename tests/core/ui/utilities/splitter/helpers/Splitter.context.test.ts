/**
 * Tests for Splitter context helper
 *
 * Tests the context helper functions:
 * - createSplitterContextValue
 * - useSplitterContextValue
 */

import {
	createSplitterContextValue,
	useSplitterContextValue,
} from '@core/ui/utilities/splitter/helpers/Splitter.context';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const createMockSplitterState = () => ({
	panelStates: [],
	panelRefs: [] as Array<{ id: string; element: HTMLElement }>,
	registerPanel: vi.fn(),
	unregisterPanel: vi.fn(),
	handleMouseDown: vi.fn(),
	isResizing: false,
	setPanelCollapsed: vi.fn(),
	getPanelState: vi.fn(),
});

describe('Splitter.context - createSplitterContextValue', () => {
	it('creates context value from splitter state', () => {
		const splitterState = createMockSplitterState();

		const contextValue = createSplitterContextValue({
			orientation: 'horizontal',
			disabled: false,
			handleSize: 4,
			handleClassName: undefined,
			splitterState,
		});

		expect(contextValue.orientation).toBe('horizontal');
		expect(contextValue.disabled).toBe(false);
		expect(contextValue.handleSize).toBe(4);
		expect(contextValue.panelStates).toBe(splitterState.panelStates);
		expect(contextValue.registerPanel).toBe(splitterState.registerPanel);
		expect(contextValue.unregisterPanel).toBe(splitterState.unregisterPanel);
		expect(contextValue.handleMouseDown).toBe(splitterState.handleMouseDown);
		expect(contextValue.isResizing).toBe(false);
		expect(contextValue.setPanelCollapsed).toBe(splitterState.setPanelCollapsed);
		expect(contextValue.getPanelState).toBe(splitterState.getPanelState);
	});

	it('includes handleClassName when provided', () => {
		const splitterState = createMockSplitterState();

		const contextValue = createSplitterContextValue({
			orientation: 'horizontal',
			disabled: false,
			handleSize: 4,
			handleClassName: 'custom-handle',
			splitterState,
		});

		expect(contextValue.handleClassName).toBe('custom-handle');
	});

	it('omits handleClassName when undefined', () => {
		const splitterState = createMockSplitterState();

		const contextValue = createSplitterContextValue({
			orientation: 'horizontal',
			disabled: false,
			handleSize: 4,
			handleClassName: undefined,
			splitterState,
		});

		expect(contextValue.handleClassName).toBeUndefined();
	});
});

const defaultHookProps = {
	orientation: 'horizontal' as 'horizontal' | 'vertical',
	disabled: false,
	handleSize: 4,
	handleClassName: undefined as string | undefined,
};

describe('Splitter.context - useSplitterContextValue', () => {
	it('returns memoized context value', () => {
		const splitterState = createMockSplitterState();

		const { result, rerender } = renderHook(
			props =>
				useSplitterContextValue({
					...props,
					splitterState,
				}),
			{ initialProps: defaultHookProps }
		);

		const firstValue = result.current;
		rerender(defaultHookProps);

		expect(result.current).toBe(firstValue);
	});

	it('creates new value when dependencies change', () => {
		const splitterState = createMockSplitterState();

		const { result, rerender } = renderHook(
			props =>
				useSplitterContextValue({
					...props,
					splitterState,
				}),
			{ initialProps: defaultHookProps }
		);

		const firstValue = result.current;
		rerender({
			...defaultHookProps,
			orientation: 'vertical' as const,
		});

		expect(result.current).not.toBe(firstValue);
		expect(result.current.orientation).toBe('vertical');
	});
});
