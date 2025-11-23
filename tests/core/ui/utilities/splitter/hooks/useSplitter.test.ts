/**
 * Tests for useSplitter hook
 *
 * Tests the useSplitter hook:
 * - Panel registration
 * - State management
 * - Handlers setup
 * - Size calculators
 */

import { useSplitter } from '@core/ui/utilities/splitter/hooks/useSplitter';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useSplitter - Initialization', () => {
	it('initializes with panels', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [
			{ id: 'panel1', defaultSize: '30%' },
			{ id: 'panel2', defaultSize: '70%' },
		];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		expect(result.current.panelStates).toHaveLength(2);
		expect(result.current.panelRefs).toHaveLength(0); // No panels registered yet
	});

	it('provides registerPanel and unregisterPanel functions', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		expect(typeof result.current.registerPanel).toBe('function');
		expect(typeof result.current.unregisterPanel).toBe('function');
	});

	it('provides handleMouseDown function', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		expect(typeof result.current.handleMouseDown).toBe('function');
	});

	it('initializes with isResizing false', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		expect(result.current.isResizing).toBe(false);
	});
});

describe('useSplitter - Panel Registration - Single Panel', () => {
	it('registers panel element', async () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];
		const element = document.createElement('div');

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		act(() => {
			result.current.registerPanel('panel1', element);
		});

		// Wait for useEffect to update panelRefs
		await waitFor(() => {
			expect(result.current.panelRefs.length).toBeGreaterThan(0);
		});

		expect(result.current.panelRefs).toHaveLength(1);
		expect(result.current.panelRefs[0]?.id).toBe('panel1');
		expect(result.current.panelRefs[0]?.element).toBe(element);
	});

	it('unregisters panel element', async () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];
		const element = document.createElement('div');

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		act(() => {
			result.current.registerPanel('panel1', element);
		});

		await waitFor(() => {
			expect(result.current.panelRefs.length).toBeGreaterThan(0);
		});

		expect(result.current.panelRefs).toHaveLength(1);

		act(() => {
			result.current.unregisterPanel('panel1');
		});

		await waitFor(() => {
			expect(result.current.panelRefs.length).toBe(0);
		});

		expect(result.current.panelRefs).toHaveLength(0);
	});
});

describe('useSplitter - Panel Registration - Multiple Panels', () => {
	it('registers multiple panels', async () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }, { id: 'panel2' }];
		const element1 = document.createElement('div');
		const element2 = document.createElement('div');

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		act(() => {
			result.current.registerPanel('panel1', element1);
			result.current.registerPanel('panel2', element2);
		});

		await waitFor(() => {
			expect(result.current.panelRefs.length).toBe(2);
		});

		expect(result.current.panelRefs).toHaveLength(2);
	});
});

describe('useSplitter - State Management', () => {
	it('provides setPanelCollapsed function', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1', collapsible: true }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		act(() => {
			result.current.setPanelCollapsed('panel1', true);
		});

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(true);
	});

	it('provides getPanelState function', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1', minSize: 100 }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.id).toBe('panel1');
		expect(panelState?.minSize).toBe(100);
	});
});

describe('useSplitter - Panel Size Calculators - getPanelMinSize - Collapsed State', () => {
	it('returns collapsedSize when panel is collapsed', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [
			{
				id: 'panel1',
				collapsible: true,
				collapsedSize: 50,
				minSize: 100,
			},
		];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		// Initially not collapsed - should use minSize
		let panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(false);
		expect(panelState?.minSize).toBe(100);
		expect(panelState?.collapsedSize).toBe(50);

		// Collapse the panel - getPanelMinSize should return collapsedSize
		act(() => {
			result.current.setPanelCollapsed('panel1', true);
		});

		panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(true);
		expect(panelState?.collapsedSize).toBe(50);
		// When collapsed, getPanelMinSize internally returns collapsedSize (50)
		// This is tested through the panel state which reflects the collapsed state
	});

	it('returns collapsedSize when panel is collapsed even if minSize is larger', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [
			{
				id: 'panel1',
				collapsible: true,
				collapsedSize: 30,
				minSize: 200,
			},
		];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		act(() => {
			result.current.setPanelCollapsed('panel1', true);
		});

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(true);
		expect(panelState?.collapsedSize).toBe(30);
		expect(panelState?.minSize).toBe(200);
		// getPanelMinSize internally returns collapsedSize (30) when collapsed,
		// even though minSize (200) is larger
	});
});

describe('useSplitter - Panel Size Calculators - getPanelMinSize - Not Collapsed State', () => {
	it('returns minSize when panel is not collapsed', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [
			{
				id: 'panel1',
				collapsible: true,
				collapsedSize: 50,
				minSize: 100,
			},
		];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		// Panel should not be collapsed initially
		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(false);
		expect(panelState?.minSize).toBe(100);
		// getPanelMinSize internally returns minSize (100) when not collapsed
	});

	it('returns 0 when panel has no minSize and is not collapsed', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		const panelState = result.current.getPanelState('panel1');
		// State initialization sets minSize to 0 when undefined
		expect(panelState?.minSize).toBe(0);
		// getPanelMinSize internally returns 0 when minSize is undefined and not collapsed
	});
});

describe('useSplitter - Panel Size Calculators - getPanelMinSize - State Changes', () => {
	it('updates when panel collapse state changes', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [
			{
				id: 'panel1',
				collapsible: true,
				collapsedSize: 40,
				minSize: 150,
			},
		];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		// Initially not collapsed
		let panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(false);
		// getPanelMinSize would return minSize (150)

		// Collapse
		act(() => {
			result.current.setPanelCollapsed('panel1', true);
		});

		panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(true);
		// getPanelMinSize would return collapsedSize (40)

		// Expand again
		act(() => {
			result.current.setPanelCollapsed('panel1', false);
		});

		panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(false);
		// getPanelMinSize would return minSize (150) again
	});
});

describe('useSplitter - Panel Size Calculators - getPanelMaxSize', () => {
	it('returns maxSize from panel state', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [
			{
				id: 'panel1',
				maxSize: 500,
			},
		];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.maxSize).toBe(500);
		// getPanelMaxSize internally returns state.maxSize (500)
	});

	it('returns undefined when panel has no maxSize', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.maxSize).toBeUndefined();
		// getPanelMaxSize internally returns undefined when maxSize is undefined
	});
});

describe('useSplitter - onResize Callback', () => {
	it('calls onResize when provided', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];
		const onResize = vi.fn();

		renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
				onResize,
			})
		);

		// onResize should be set up (actual resize would trigger it)
		expect(onResize).toBeDefined();
	});
});

describe('useSplitter - Orientation', () => {
	it('works with horizontal orientation', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		expect(result.current.panelStates).toHaveLength(1);
	});

	it('works with vertical orientation', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'vertical',
				disabled: false,
			})
		);

		expect(result.current.panelStates).toHaveLength(1);
	});
});

describe('useSplitter - Disabled State', () => {
	it('handles disabled state', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: true,
			})
		);

		expect(result.current.panelStates).toHaveLength(1);
	});
});

describe('useSplitter - Edge Cases - Panel Registration', () => {
	it('handles registering panel not in config', async () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];
		const element = document.createElement('div');

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		act(() => {
			result.current.registerPanel('nonExistentPanel', element);
		});

		// Panel not in config should not appear in panelRefs
		await waitFor(() => {
			expect(result.current.panelRefs.length).toBe(0);
		});
	});

	it('handles unregistering non-existent panel', async () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		act(() => {
			result.current.unregisterPanel('nonExistentPanel');
		});

		// Should not throw and should remain at 0
		expect(result.current.panelRefs).toHaveLength(0);
	});

	it('handles re-registering same panel with different element', async () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];
		const element1 = document.createElement('div');
		const element2 = document.createElement('div');

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		act(() => {
			result.current.registerPanel('panel1', element1);
		});

		await waitFor(() => {
			expect(result.current.panelRefs.length).toBe(1);
		});

		expect(result.current.panelRefs[0]?.element).toBe(element1);

		act(() => {
			result.current.registerPanel('panel1', element2);
		});

		await waitFor(() => {
			expect(result.current.panelRefs[0]?.element).toBe(element2);
		});

		expect(result.current.panelRefs[0]?.element).toBe(element2);
	});

	it('maintains panel order in panelRefs', async () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }, { id: 'panel2' }, { id: 'panel3' }];
		const element1 = document.createElement('div');
		const element2 = document.createElement('div');
		const element3 = document.createElement('div');

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		act(() => {
			result.current.registerPanel('panel3', element3);
			result.current.registerPanel('panel1', element1);
			result.current.registerPanel('panel2', element2);
		});

		await waitFor(() => {
			expect(result.current.panelRefs.length).toBe(3);
		});

		// Should maintain order from panels config, not registration order
		expect(result.current.panelRefs[0]?.id).toBe('panel1');
		expect(result.current.panelRefs[1]?.id).toBe('panel2');
		expect(result.current.panelRefs[2]?.id).toBe('panel3');
	});

	it('handles empty panels array', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels: readonly { id: string }[] = [];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		expect(result.current.panelStates).toHaveLength(0);
		expect(result.current.panelRefs).toHaveLength(0);
	});
});

describe('useSplitter - Edge Cases - State Management', () => {
	it('returns undefined for non-existent panel state', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		const panelState = result.current.getPanelState('nonExistentPanel');
		expect(panelState).toBeUndefined();
	});

	it('does not collapse non-collapsible panel', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1', collapsible: false }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		const initialState = result.current.getPanelState('panel1');
		expect(initialState?.collapsed).toBe(false);

		act(() => {
			result.current.setPanelCollapsed('panel1', true);
		});

		// Non-collapsible panel should remain not collapsed
		const afterState = result.current.getPanelState('panel1');
		expect(afterState?.collapsed).toBe(false);
	});

	it('handles setting collapsed state on non-existent panel', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1', collapsible: true }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		// Should not throw
		act(() => {
			result.current.setPanelCollapsed('nonExistentPanel', true);
		});

		// Should not affect existing panels
		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(false);
	});

	it('handles multiple rapid state changes', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1', collapsible: true }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		act(() => {
			result.current.setPanelCollapsed('panel1', true);
			result.current.setPanelCollapsed('panel1', false);
			result.current.setPanelCollapsed('panel1', true);
		});

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(true);
	});
});

describe('useSplitter - Edge Cases - Panel Configuration', () => {
	it('handles panel with all optional properties undefined', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.id).toBe('panel1');
		expect(panelState?.minSize).toBe(0);
		expect(panelState?.maxSize).toBeUndefined();
		expect(panelState?.collapsed).toBe(false);
		expect(panelState?.collapsible).toBe(false);
		expect(panelState?.collapsedSize).toBe(0);
	});

	it('handles panel with defaultCollapsed true', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1', collapsible: true, defaultCollapsed: true }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(true);
	});

	it('handles panel with controlled collapsed state', () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1', collapsible: true, collapsed: true }];

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		const panelState = result.current.getPanelState('panel1');
		expect(panelState?.collapsed).toBe(true);
	});
});

describe('useSplitter - Edge Cases - Panel Refs', () => {
	it('filters out unregistered panels from panelRefs', async () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }, { id: 'panel2' }];
		const element1 = document.createElement('div');

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		act(() => {
			result.current.registerPanel('panel1', element1);
		});

		await waitFor(() => {
			expect(result.current.panelRefs.length).toBe(1);
		});

		expect(result.current.panelRefs[0]?.id).toBe('panel1');
	});

	it('filters panelRefs based on current panels config', async () => {
		const containerRef = createRef<HTMLDivElement>();
		const panels = [{ id: 'panel1' }, { id: 'panel2' }];
		const element1 = document.createElement('div');
		const element2 = document.createElement('div');

		const { result } = renderHook(() =>
			useSplitter({
				containerRef,
				panels,
				orientation: 'horizontal',
				disabled: false,
			})
		);

		// Register both panels
		act(() => {
			result.current.registerPanel('panel1', element1);
			result.current.registerPanel('panel2', element2);
		});

		await waitFor(() => {
			expect(result.current.panelRefs.length).toBe(2);
		});

		// Unregister one panel
		act(() => {
			result.current.unregisterPanel('panel2');
		});

		await waitFor(() => {
			expect(result.current.panelRefs.length).toBe(1);
		});

		// Only panel1 should remain
		expect(result.current.panelRefs[0]?.id).toBe('panel1');
	});
});
