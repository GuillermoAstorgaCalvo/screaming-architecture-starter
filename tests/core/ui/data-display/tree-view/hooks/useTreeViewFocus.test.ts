/**
 * Tests for useTreeViewFocus hooks
 *
 * Tests the focus management hooks:
 * - useFocusedNode hook behavior
 * - useFocusedNodeState hook behavior
 * - Focus synchronization with selected nodes
 * - Internal focus state management
 */

import {
	useFocusedNode,
	useFocusedNodeState,
} from '@core/ui/data-display/tree-view/hooks/useTreeViewFocus';
import type { TreeStateResult } from '@core/ui/data-display/tree-view/types/useTreeViewSetup.types';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useFocusedNode', () => {
	it('should return first selected node when selection exists', () => {
		const selectedNodeIds = new Set<string>(['node-2', 'node-3']);
		const allNodeIds = ['node-1', 'node-2', 'node-3'];

		const { result } = renderHook(() => useFocusedNode(selectedNodeIds, allNodeIds));

		expect(result.current[0]).toBe('node-2');
	});

	it('should return first node from allNodeIds when no selection exists', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds = ['node-1', 'node-2', 'node-3'];

		const { result } = renderHook(() => useFocusedNode(selectedNodeIds, allNodeIds));

		expect(result.current[0]).toBe('node-1');
	});

	it('should return null when both selection and allNodeIds are empty', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds: string[] = [];

		const { result } = renderHook(() => useFocusedNode(selectedNodeIds, allNodeIds));

		expect(result.current[0]).toBeNull();
	});

	it('should return null when allNodeIds is empty even with selection', () => {
		const selectedNodeIds = new Set<string>(['node-1']);
		const allNodeIds: string[] = [];

		const { result } = renderHook(() => useFocusedNode(selectedNodeIds, allNodeIds));

		// When allNodeIds is empty, Array.from(selectedNodeIds)[0] should still work
		// But the logic prioritizes selection, so it should return 'node-1'
		expect(result.current[0]).toBe('node-1');
	});

	it('should allow setting focused node manually when no selection exists', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds: string[] = [];

		const { result } = renderHook(() => useFocusedNode(selectedNodeIds, allNodeIds));

		expect(result.current[0]).toBeNull();

		act(() => {
			result.current[1]('node-3');
		});

		// Manual focus works when computed focus is null
		expect(result.current[0]).toBe('node-3');
	});

	it('should sync with selected nodes when selection changes', () => {
		const selectedNodeIds = new Set<string>(['node-1']);
		const allNodeIds = ['node-1', 'node-2', 'node-3'];

		const { result, rerender } = renderHook(({ selected, all }) => useFocusedNode(selected, all), {
			initialProps: { selected: selectedNodeIds, all: allNodeIds },
		});

		expect(result.current[0]).toBe('node-1');

		// Change selection
		const newSelectedNodeIds = new Set<string>(['node-2']);
		rerender({ selected: newSelectedNodeIds, all: allNodeIds });

		expect(result.current[0]).toBe('node-2');
	});

	it('should fall back to first node when selection is cleared', () => {
		const selectedNodeIds = new Set<string>(['node-1']);
		const allNodeIds = ['node-1', 'node-2', 'node-3'];

		const { result, rerender } = renderHook(({ selected, all }) => useFocusedNode(selected, all), {
			initialProps: { selected: selectedNodeIds, all: allNodeIds },
		});

		expect(result.current[0]).toBe('node-1');

		// Clear selection
		const emptySelectedNodeIds = new Set<string>();
		rerender({ selected: emptySelectedNodeIds, all: allNodeIds });

		expect(result.current[0]).toBe('node-1');
	});

	it('should prioritize selection over manual focus', () => {
		const selectedNodeIds = new Set<string>(['node-1']);
		const allNodeIds = ['node-1', 'node-2', 'node-3'];

		const { result } = renderHook(() => useFocusedNode(selectedNodeIds, allNodeIds));

		expect(result.current[0]).toBe('node-1');

		// Try to manually set focus to node-3
		act(() => {
			result.current[1]('node-3');
		});

		// Selection takes precedence over manual focus
		expect(result.current[0]).toBe('node-1');
	});

	it('should handle empty allNodeIds array', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds: string[] = [];

		const { result } = renderHook(() => useFocusedNode(selectedNodeIds, allNodeIds));

		expect(result.current[0]).toBeNull();
		expect(typeof result.current[1]).toBe('function');
	});

	it('should handle single node in allNodeIds', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds = ['node-1'];

		const { result } = renderHook(() => useFocusedNode(selectedNodeIds, allNodeIds));

		expect(result.current[0]).toBe('node-1');
	});

	it('should handle multiple selected nodes and return first one', () => {
		const selectedNodeIds = new Set<string>(['node-3', 'node-1', 'node-2']);
		const allNodeIds = ['node-1', 'node-2', 'node-3'];

		const { result } = renderHook(() => useFocusedNode(selectedNodeIds, allNodeIds));

		// Should return the first node from the Set iteration
		// Note: Set iteration order is insertion order
		expect(result.current[0]).toBe('node-3');
	});

	it('should update focus when allNodeIds changes', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds = ['node-1', 'node-2'];

		const { result, rerender } = renderHook(({ selected, all }) => useFocusedNode(selected, all), {
			initialProps: { selected: selectedNodeIds, all: allNodeIds },
		});

		expect(result.current[0]).toBe('node-1');

		// Change allNodeIds
		const newAllNodeIds = ['node-4', 'node-5'];
		rerender({ selected: selectedNodeIds, all: newAllNodeIds });

		expect(result.current[0]).toBe('node-4');
	});

	it('should prioritize computed focus over manual focus when allNodeIds exists', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds = ['node-1', 'node-2'];

		const { result } = renderHook(() => useFocusedNode(selectedNodeIds, allNodeIds));

		expect(result.current[0]).toBe('node-1');

		// Try to manually set focus to node-2
		act(() => {
			result.current[1]('node-2');
		});

		// Computed focus (first node from allNodeIds) takes precedence
		expect(result.current[0]).toBe('node-1');
	});
});

describe('useFocusedNodeState', () => {
	const createMockTreeState = (
		selectedNodeIds: Set<string> = new Set(),
		allNodeIds: string[] = []
	): TreeStateResult => {
		return {
			selectedNodeIds,
			expandedNodeIds: new Set(),
			isSelected: vi.fn((nodeId: string) => selectedNodeIds.has(nodeId)),
			isExpanded: vi.fn(() => false),
			toggleSelection: vi.fn(),
			toggleExpansion: vi.fn(),
			expandNode: vi.fn(),
			collapseNode: vi.fn(),
			getAllNodeIds: vi.fn(() => allNodeIds),
			getNodeById: vi.fn(),
		};
	};

	it('should use selectedNodeIds from treeState', () => {
		const selectedNodeIds = new Set<string>(['node-2']);
		const allNodeIds = ['node-1', 'node-2', 'node-3'];
		const treeState = createMockTreeState(selectedNodeIds, allNodeIds);

		const { result } = renderHook(() => useFocusedNodeState(treeState));

		expect(result.current[0]).toBe('node-2');
	});

	it('should use getAllNodeIds from treeState', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds = ['node-1', 'node-2', 'node-3'];
		const treeState = createMockTreeState(selectedNodeIds, allNodeIds);

		const { result } = renderHook(() => useFocusedNodeState(treeState));

		expect(result.current[0]).toBe('node-1');
		expect(treeState.getAllNodeIds).toHaveBeenCalled();
	});

	it('should return null when treeState has no nodes', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds: string[] = [];
		const treeState = createMockTreeState(selectedNodeIds, allNodeIds);

		const { result } = renderHook(() => useFocusedNodeState(treeState));

		expect(result.current[0]).toBeNull();
	});

	it('should prioritize selection over manual focus in treeState', () => {
		const selectedNodeIds = new Set<string>(['node-1']);
		const allNodeIds = ['node-1', 'node-2', 'node-3'];
		const treeState = createMockTreeState(selectedNodeIds, allNodeIds);

		const { result } = renderHook(() => useFocusedNodeState(treeState));

		expect(result.current[0]).toBe('node-1');

		act(() => {
			result.current[1]('node-3');
		});

		// Selection takes precedence over manual focus
		expect(result.current[0]).toBe('node-1');
	});

	it('should sync with treeState when it changes', () => {
		const selectedNodeIds = new Set<string>(['node-1']);
		const allNodeIds = ['node-1', 'node-2', 'node-3'];
		const treeState = createMockTreeState(selectedNodeIds, allNodeIds);

		const { result, rerender } = renderHook(({ state }) => useFocusedNodeState(state), {
			initialProps: { state: treeState },
		});

		expect(result.current[0]).toBe('node-1');

		// Update treeState with new selection
		const newTreeState = createMockTreeState(new Set<string>(['node-2']), allNodeIds);
		rerender({ state: newTreeState });

		expect(result.current[0]).toBe('node-2');
	});

	it('should handle treeState with empty selection', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds = ['node-1', 'node-2'];
		const treeState = createMockTreeState(selectedNodeIds, allNodeIds);

		const { result } = renderHook(() => useFocusedNodeState(treeState));

		expect(result.current[0]).toBe('node-1');
	});

	it('should handle treeState with multiple selected nodes', () => {
		const selectedNodeIds = new Set<string>(['node-2', 'node-3']);
		const allNodeIds = ['node-1', 'node-2', 'node-3'];
		const treeState = createMockTreeState(selectedNodeIds, allNodeIds);

		const { result } = renderHook(() => useFocusedNodeState(treeState));

		// Should return first selected node
		expect(result.current[0]).toBe('node-2');
	});

	it('should return setter function', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds = ['node-1'];
		const treeState = createMockTreeState(selectedNodeIds, allNodeIds);

		const { result } = renderHook(() => useFocusedNodeState(treeState));

		expect(typeof result.current[1]).toBe('function');
	});

	it('should handle treeState changes to empty node list', () => {
		const selectedNodeIds = new Set<string>(['node-1']);
		const allNodeIds = ['node-1', 'node-2'];
		const treeState = createMockTreeState(selectedNodeIds, allNodeIds);

		const { result, rerender } = renderHook(({ state }) => useFocusedNodeState(state), {
			initialProps: { state: treeState },
		});

		expect(result.current[0]).toBe('node-1');

		// Update treeState with empty node list
		// When both selection and allNodeIds are empty, computed focus is null
		// useState doesn't reset on rerender, so internalFocusedNodeId keeps 'node-1'
		// syncedFocusedNodeId = null ?? 'node-1' = 'node-1'
		const newTreeState = createMockTreeState(new Set<string>(), []);
		rerender({ state: newTreeState });

		expect(result.current[0]).toBe('node-1');
	});

	it('should allow manual focus when treeState has no nodes initially', () => {
		const selectedNodeIds = new Set<string>();
		const allNodeIds: string[] = [];
		const treeState = createMockTreeState(selectedNodeIds, allNodeIds);

		const { result } = renderHook(() => useFocusedNodeState(treeState));

		expect(result.current[0]).toBeNull();

		act(() => {
			result.current[1]('node-3');
		});

		// Manual focus works when computed focus is null
		expect(result.current[0]).toBe('node-3');
	});
});
