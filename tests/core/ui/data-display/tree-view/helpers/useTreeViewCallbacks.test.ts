/**
 * Tests for useTreeViewCallbacks helper functions
 *
 * Tests callback functions:
 * - createSelectionCallbacks (toggleSelection, selectNode, deselectNode)
 * - createExpansionCallbacks (toggleExpansion, expandNode, collapseNode)
 */

import {
	createExpansionCallbacks,
	createSelectionCallbacks,
} from '@core/ui/data-display/tree-view/helpers/useTreeViewCallbacks';
import { describe, expect, it, vi } from 'vitest';

describe('useTreeViewCallbacks - createSelectionCallbacks', () => {
	describe('toggleSelection', () => {
		it('should not update selection when selectionMode is "none"', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { toggleSelection } = createSelectionCallbacks({
				selectionMode: 'none',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			toggleSelection('node-2');

			expect(setInternalSelectedIds).not.toHaveBeenCalled();
			expect(onSelectionChange).not.toHaveBeenCalled();
		});

		it('should add node to selection in "single" mode when not selected', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { toggleSelection } = createSelectionCallbacks({
				selectionMode: 'single',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			toggleSelection('node-2');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set(['node-2']));
			expect(onSelectionChange).toHaveBeenCalledWith(['node-2']);
		});

		it('should clear previous selection and add new node in "single" mode', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { toggleSelection } = createSelectionCallbacks({
				selectionMode: 'single',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			toggleSelection('node-2');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set(['node-2']));
			expect(onSelectionChange).toHaveBeenCalledWith(['node-2']);
		});

		it('should remove node from selection in "single" mode when already selected', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { toggleSelection } = createSelectionCallbacks({
				selectionMode: 'single',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			toggleSelection('node-1');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set());
			expect(onSelectionChange).toHaveBeenCalledWith([]);
		});

		it('should add node to selection in "multiple" mode when not selected', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { toggleSelection } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			toggleSelection('node-2');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set(['node-1', 'node-2']));
			expect(onSelectionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});

		it('should remove node from selection in "multiple" mode when already selected', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1', 'node-2']);

			const { toggleSelection } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			toggleSelection('node-1');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set(['node-2']));
			expect(onSelectionChange).toHaveBeenCalledWith(['node-2']);
		});

		it('should not call setInternalSelectedIds when isSelectedControlled is true', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { toggleSelection } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: true,
				setInternalSelectedIds,
				onSelectionChange,
			});

			toggleSelection('node-2');

			expect(setInternalSelectedIds).not.toHaveBeenCalled();
			expect(onSelectionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});

		it('should call onSelectionChange even when isSelectedControlled is true', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { toggleSelection } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: true,
				setInternalSelectedIds,
				onSelectionChange,
			});

			toggleSelection('node-2');

			expect(onSelectionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});

		it('should work when onSelectionChange is undefined', () => {
			const setInternalSelectedIds = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { toggleSelection } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange: undefined,
			});

			toggleSelection('node-2');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set(['node-1', 'node-2']));
		});
	});

	describe('selectNode', () => {
		it('should not update selection when selectionMode is "none"', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { selectNode } = createSelectionCallbacks({
				selectionMode: 'none',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			selectNode('node-2');

			expect(setInternalSelectedIds).not.toHaveBeenCalled();
			expect(onSelectionChange).not.toHaveBeenCalled();
		});

		it('should clear previous selection and select new node in "single" mode', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { selectNode } = createSelectionCallbacks({
				selectionMode: 'single',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			selectNode('node-2');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set(['node-2']));
			expect(onSelectionChange).toHaveBeenCalledWith(['node-2']);
		});

		it('should add node to selection in "multiple" mode without clearing', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { selectNode } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			selectNode('node-2');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set(['node-1', 'node-2']));
			expect(onSelectionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});

		it('should not duplicate node in "multiple" mode when already selected', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { selectNode } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			selectNode('node-1');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set(['node-1']));
			expect(onSelectionChange).toHaveBeenCalledWith(['node-1']);
		});

		it('should not call setInternalSelectedIds when isSelectedControlled is true', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { selectNode } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: true,
				setInternalSelectedIds,
				onSelectionChange,
			});

			selectNode('node-2');

			expect(setInternalSelectedIds).not.toHaveBeenCalled();
			expect(onSelectionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});
	});

	describe('deselectNode', () => {
		it('should not update selection when selectionMode is "none"', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { deselectNode } = createSelectionCallbacks({
				selectionMode: 'none',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			deselectNode('node-1');

			expect(setInternalSelectedIds).not.toHaveBeenCalled();
			expect(onSelectionChange).not.toHaveBeenCalled();
		});

		it('should remove node from selection when selected', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1', 'node-2']);

			const { deselectNode } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			deselectNode('node-1');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set(['node-2']));
			expect(onSelectionChange).toHaveBeenCalledWith(['node-2']);
		});

		it('should not change selection when node is not selected', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { deselectNode } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			deselectNode('node-2');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set(['node-1']));
			expect(onSelectionChange).toHaveBeenCalledWith(['node-1']);
		});

		it('should clear all selection when last node is deselected', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { deselectNode } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: false,
				setInternalSelectedIds,
				onSelectionChange,
			});

			deselectNode('node-1');

			expect(setInternalSelectedIds).toHaveBeenCalledWith(new Set());
			expect(onSelectionChange).toHaveBeenCalledWith([]);
		});

		it('should not call setInternalSelectedIds when isSelectedControlled is true', () => {
			const setInternalSelectedIds = vi.fn();
			const onSelectionChange = vi.fn();
			const selectedNodeIds = new Set<string>(['node-1']);

			const { deselectNode } = createSelectionCallbacks({
				selectionMode: 'multiple',
				selectedNodeIds,
				isSelectedControlled: true,
				setInternalSelectedIds,
				onSelectionChange,
			});

			deselectNode('node-1');

			expect(setInternalSelectedIds).not.toHaveBeenCalled();
			expect(onSelectionChange).toHaveBeenCalledWith([]);
		});
	});
});

describe('useTreeViewCallbacks - createExpansionCallbacks', () => {
	describe('toggleExpansion', () => {
		it('should expand node when collapsed', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1']);

			const { toggleExpansion } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: false,
				setInternalExpandedIds,
				onExpansionChange,
			});

			toggleExpansion('node-2');

			expect(setInternalExpandedIds).toHaveBeenCalledWith(new Set(['node-1', 'node-2']));
			expect(onExpansionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});

		it('should collapse node when expanded', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1', 'node-2']);

			const { toggleExpansion } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: false,
				setInternalExpandedIds,
				onExpansionChange,
			});

			toggleExpansion('node-1');

			expect(setInternalExpandedIds).toHaveBeenCalledWith(new Set(['node-2']));
			expect(onExpansionChange).toHaveBeenCalledWith(['node-2']);
		});

		it('should handle empty expanded set', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>();

			const { toggleExpansion } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: false,
				setInternalExpandedIds,
				onExpansionChange,
			});

			toggleExpansion('node-1');

			expect(setInternalExpandedIds).toHaveBeenCalledWith(new Set(['node-1']));
			expect(onExpansionChange).toHaveBeenCalledWith(['node-1']);
		});

		it('should not call setInternalExpandedIds when isExpandedControlled is true', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1']);

			const { toggleExpansion } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: true,
				setInternalExpandedIds,
				onExpansionChange,
			});

			toggleExpansion('node-2');

			expect(setInternalExpandedIds).not.toHaveBeenCalled();
			expect(onExpansionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});

		it('should call onExpansionChange even when isExpandedControlled is true', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1']);

			const { toggleExpansion } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: true,
				setInternalExpandedIds,
				onExpansionChange,
			});

			toggleExpansion('node-2');

			expect(onExpansionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});

		it('should work when onExpansionChange is undefined', () => {
			const setInternalExpandedIds = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1']);

			const { toggleExpansion } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: false,
				setInternalExpandedIds,
				onExpansionChange: undefined,
			});

			toggleExpansion('node-2');

			expect(setInternalExpandedIds).toHaveBeenCalledWith(new Set(['node-1', 'node-2']));
		});
	});

	describe('expandNode', () => {
		it('should add node to expanded set when not expanded', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1']);

			const { expandNode } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: false,
				setInternalExpandedIds,
				onExpansionChange,
			});

			expandNode('node-2');

			expect(setInternalExpandedIds).toHaveBeenCalledWith(new Set(['node-1', 'node-2']));
			expect(onExpansionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});

		it('should not duplicate node when already expanded', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1']);

			const { expandNode } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: false,
				setInternalExpandedIds,
				onExpansionChange,
			});

			expandNode('node-1');

			expect(setInternalExpandedIds).toHaveBeenCalledWith(new Set(['node-1']));
			expect(onExpansionChange).toHaveBeenCalledWith(['node-1']);
		});

		it('should handle empty expanded set', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>();

			const { expandNode } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: false,
				setInternalExpandedIds,
				onExpansionChange,
			});

			expandNode('node-1');

			expect(setInternalExpandedIds).toHaveBeenCalledWith(new Set(['node-1']));
			expect(onExpansionChange).toHaveBeenCalledWith(['node-1']);
		});

		it('should not call setInternalExpandedIds when isExpandedControlled is true', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1']);

			const { expandNode } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: true,
				setInternalExpandedIds,
				onExpansionChange,
			});

			expandNode('node-2');

			expect(setInternalExpandedIds).not.toHaveBeenCalled();
			expect(onExpansionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});
	});

	describe('collapseNode', () => {
		it('should remove node from expanded set when expanded', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1', 'node-2']);

			const { collapseNode } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: false,
				setInternalExpandedIds,
				onExpansionChange,
			});

			collapseNode('node-1');

			expect(setInternalExpandedIds).toHaveBeenCalledWith(new Set(['node-2']));
			expect(onExpansionChange).toHaveBeenCalledWith(['node-2']);
		});

		it('should not change expanded set when node is not expanded', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1']);

			const { collapseNode } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: false,
				setInternalExpandedIds,
				onExpansionChange,
			});

			collapseNode('node-2');

			expect(setInternalExpandedIds).toHaveBeenCalledWith(new Set(['node-1']));
			expect(onExpansionChange).toHaveBeenCalledWith(['node-1']);
		});

		it('should clear all expanded nodes when last node is collapsed', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1']);

			const { collapseNode } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: false,
				setInternalExpandedIds,
				onExpansionChange,
			});

			collapseNode('node-1');

			expect(setInternalExpandedIds).toHaveBeenCalledWith(new Set());
			expect(onExpansionChange).toHaveBeenCalledWith([]);
		});

		it('should handle empty expanded set', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>();

			const { collapseNode } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: false,
				setInternalExpandedIds,
				onExpansionChange,
			});

			collapseNode('node-1');

			expect(setInternalExpandedIds).toHaveBeenCalledWith(new Set());
			expect(onExpansionChange).toHaveBeenCalledWith([]);
		});

		it('should not call setInternalExpandedIds when isExpandedControlled is true', () => {
			const setInternalExpandedIds = vi.fn();
			const onExpansionChange = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1']);

			const { collapseNode } = createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled: true,
				setInternalExpandedIds,
				onExpansionChange,
			});

			collapseNode('node-1');

			expect(setInternalExpandedIds).not.toHaveBeenCalled();
			expect(onExpansionChange).toHaveBeenCalledWith([]);
		});
	});
});
