/**
 * Tests for useSplitterState hook
 *
 * Tests the useSplitterState hook:
 * - State initialization
 * - setPanelSize
 * - setPanelCollapsed
 * - getPanelState
 * - Size constraints
 */

import { useSplitterState } from '@core/ui/utilities/splitter/hooks/useSplitter.state';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useSplitterState - Initialization', () => {
	it('initializes panel states from config', () => {
		const panels = [
			{ id: 'panel1', defaultSize: '30%', minSize: 100, collapsible: true },
			{ id: 'panel2', defaultSize: '70%', minSize: 150 },
		];

		const { result } = renderHook(() => useSplitterState({ panels }));

		expect(result.current.panelStates).toHaveLength(2);
		expect(result.current.panelStates[0]).toMatchObject({
			id: 'panel1',
			minSize: 100,
			collapsible: true,
		});
		expect(result.current.panelStates[1]).toMatchObject({
			id: 'panel2',
			minSize: 150,
			collapsible: false,
		});
	});

	it('initializes with default collapsed state', () => {
		const panels = [{ id: 'panel1', collapsible: true, defaultCollapsed: true }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		expect(result.current.panelStates[0]?.collapsed).toBe(true);
	});

	it('initializes with controlled collapsed state', () => {
		const panels = [{ id: 'panel1', collapsible: true, collapsed: true }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		expect(result.current.panelStates[0]?.collapsed).toBe(true);
	});

	it('parses minSize from string', () => {
		const panels = [{ id: 'panel1', minSize: '100px' }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		expect(result.current.panelStates[0]?.minSize).toBe(100);
	});

	it('handles undefined maxSize', () => {
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		expect(result.current.panelStates[0]?.maxSize).toBeUndefined();
	});
});

describe('useSplitterState - setPanelSize', () => {
	it('updates panel size', () => {
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		act(() => {
			result.current.setPanelSize('panel1', 200);
		});

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.size).toBe(200);
	});

	it('applies minSize constraint', () => {
		const panels = [{ id: 'panel1', minSize: 100 }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		act(() => {
			result.current.setPanelSize('panel1', 50);
		});

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.size).toBe(100);
	});

	it('applies maxSize constraint', () => {
		const panels = [{ id: 'panel1', maxSize: 300 }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		act(() => {
			result.current.setPanelSize('panel1', 400);
		});

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.size).toBe(300);
	});

	it('does not update other panels', () => {
		const panels = [{ id: 'panel1' }, { id: 'panel2' }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		act(() => {
			result.current.setPanelSize('panel1', 200);
		});

		const panel1State = result.current.getPanelState('panel1');
		const panel2State = result.current.getPanelState('panel2');

		expect(panel1State?.size).toBe(200);
		expect(panel2State?.size).toBeUndefined();
	});
});

describe('useSplitterState - setPanelCollapsed', () => {
	it('updates collapsed state for collapsible panel', () => {
		const panels = [{ id: 'panel1', collapsible: true }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		act(() => {
			result.current.setPanelCollapsed('panel1', true);
		});

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(true);
	});

	it('does not update collapsed state for non-collapsible panel', () => {
		const panels = [{ id: 'panel1', collapsible: false }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		act(() => {
			result.current.setPanelCollapsed('panel1', true);
		});

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(false);
	});

	it('toggles collapsed state', () => {
		const panels = [{ id: 'panel1', collapsible: true }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		act(() => {
			result.current.setPanelCollapsed('panel1', true);
		});

		expect(result.current.getPanelState('panel1')?.collapsed).toBe(true);

		act(() => {
			result.current.setPanelCollapsed('panel1', false);
		});

		expect(result.current.getPanelState('panel1')?.collapsed).toBe(false);
	});
});

describe('useSplitterState - getPanelState', () => {
	it('returns panel state by id', () => {
		const panels = [
			{ id: 'panel1', minSize: 100 },
			{ id: 'panel2', minSize: 200 },
		];

		const { result } = renderHook(() => useSplitterState({ panels }));

		const panel1State = result.current.getPanelState('panel1');
		const panel2State = result.current.getPanelState('panel2');

		expect(panel1State?.id).toBe('panel1');
		expect(panel1State?.minSize).toBe(100);
		expect(panel2State?.id).toBe('panel2');
		expect(panel2State?.minSize).toBe(200);
	});

	it('returns undefined for non-existent panel', () => {
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() => useSplitterState({ panels }));

		const state = result.current.getPanelState('non-existent');
		expect(state).toBeUndefined();
	});
});
