/**
 * Tests for useTreeView utility functions
 *
 * Tests utility functions:
 * - flattenNodeIds
 * - findNodeById
 * - getInitialExpandedIds
 * - getInitialSelectedIds
 */

import {
	findNodeById,
	flattenNodeIds,
	getInitialExpandedIds,
	getInitialSelectedIds,
} from '@core/ui/data-display/tree-view/helpers/useTreeView.utils';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import { describe, expect, it } from 'vitest';

describe('useTreeView.utils - flattenNodeIds', () => {
	it('should return empty array for empty nodes', () => {
		const result = flattenNodeIds([]);
		expect(result).toEqual([]);
	});

	it('should flatten IDs from single node', () => {
		const nodes: TreeNode[] = [{ id: 'node-1', label: 'Node 1' }];
		const result = flattenNodeIds(nodes);
		expect(result).toEqual(['node-1']);
	});

	it('should flatten IDs from multiple root nodes', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1' },
			{ id: 'node-2', label: 'Node 2' },
			{ id: 'node-3', label: 'Node 3' },
		];
		const result = flattenNodeIds(nodes);
		expect(result).toEqual(['node-1', 'node-2', 'node-3']);
	});

	it('should flatten IDs from nested tree structure', () => {
		const nodes: TreeNode[] = [
			{
				id: 'node-1',
				label: 'Node 1',
				children: [
					{ id: 'node-1-1', label: 'Node 1.1' },
					{
						id: 'node-1-2',
						label: 'Node 1.2',
						children: [{ id: 'node-1-2-1', label: 'Node 1.2.1' }],
					},
				],
			},
			{ id: 'node-2', label: 'Node 2' },
		];
		const result = flattenNodeIds(nodes);
		expect(result).toEqual(['node-1', 'node-1-1', 'node-1-2', 'node-1-2-1', 'node-2']);
	});

	it('should handle nodes with empty children arrays', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1', children: [] },
			{ id: 'node-2', label: 'Node 2' },
		];
		const result = flattenNodeIds(nodes);
		expect(result).toEqual(['node-1', 'node-2']);
	});

	it('should handle deeply nested structures', () => {
		const nodes: TreeNode[] = [
			{
				id: 'level-1',
				label: 'Level 1',
				children: [
					{
						id: 'level-2',
						label: 'Level 2',
						children: [
							{
								id: 'level-3',
								label: 'Level 3',
								children: [{ id: 'level-4', label: 'Level 4' }],
							},
						],
					},
				],
			},
		];
		const result = flattenNodeIds(nodes);
		expect(result).toEqual(['level-1', 'level-2', 'level-3', 'level-4']);
	});

	it('should preserve order of nodes', () => {
		const nodes: TreeNode[] = [
			{ id: 'first', label: 'First' },
			{
				id: 'second',
				label: 'Second',
				children: [
					{ id: 'second-first', label: 'Second First' },
					{ id: 'second-second', label: 'Second Second' },
				],
			},
			{ id: 'third', label: 'Third' },
		];
		const result = flattenNodeIds(nodes);
		expect(result).toEqual(['first', 'second', 'second-first', 'second-second', 'third']);
	});
});

describe('useTreeView.utils - findNodeById', () => {
	it('should return undefined for empty nodes', () => {
		const result = findNodeById([], 'node-1');
		expect(result).toBeUndefined();
	});

	it('should return undefined when node not found', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1' },
			{ id: 'node-2', label: 'Node 2' },
		];
		const result = findNodeById(nodes, 'node-3');
		expect(result).toBeUndefined();
	});

	it('should find node at root level', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1' },
			{ id: 'node-2', label: 'Node 2' },
		];
		const result = findNodeById(nodes, 'node-1');
		expect(result).toBeDefined();
		expect(result?.id).toBe('node-1');
		expect(result?.label).toBe('Node 1');
	});

	it('should find node in nested children', () => {
		const nodes: TreeNode[] = [
			{
				id: 'node-1',
				label: 'Node 1',
				children: [
					{ id: 'node-1-1', label: 'Node 1.1' },
					{ id: 'node-1-2', label: 'Node 1.2' },
				],
			},
			{ id: 'node-2', label: 'Node 2' },
		];
		const result = findNodeById(nodes, 'node-1-2');
		expect(result).toBeDefined();
		expect(result?.id).toBe('node-1-2');
		expect(result?.label).toBe('Node 1.2');
	});

	it('should find deeply nested node', () => {
		const nodes: TreeNode[] = [
			{
				id: 'node-1',
				label: 'Node 1',
				children: [
					{
						id: 'node-1-1',
						label: 'Node 1.1',
						children: [
							{
								id: 'node-1-1-1',
								label: 'Node 1.1.1',
								children: [{ id: 'node-1-1-1-1', label: 'Node 1.1.1.1' }],
							},
						],
					},
				],
			},
		];
		const result = findNodeById(nodes, 'node-1-1-1-1');
		expect(result).toBeDefined();
		expect(result?.id).toBe('node-1-1-1-1');
		expect(result?.label).toBe('Node 1.1.1.1');
	});

	it('should return the exact node object with all properties', () => {
		const targetNode: TreeNode = {
			id: 'node-1',
			label: 'Node 1',
			icon: 'icon',
			defaultExpanded: true,
			defaultSelected: true,
			disabled: false,
			data: { custom: 'data' },
		};
		const nodes: TreeNode[] = [targetNode, { id: 'node-2', label: 'Node 2' }];
		const result = findNodeById(nodes, 'node-1');
		expect(result).toBe(targetNode);
		expect(result).toEqual(targetNode);
	});

	it('should find first matching node when duplicates exist (should not happen in practice)', () => {
		const nodes: TreeNode[] = [
			{
				id: 'node-1',
				label: 'Node 1',
				children: [{ id: 'duplicate', label: 'First' }],
			},
			{ id: 'duplicate', label: 'Second' },
		];
		const result = findNodeById(nodes, 'duplicate');
		expect(result).toBeDefined();
		// Should find the first one encountered in traversal order
		expect(result?.label).toBe('First');
	});
});

describe('useTreeView.utils - getInitialExpandedIds', () => {
	it('should return empty set for empty nodes without defaultExpandedIds', () => {
		const result = getInitialExpandedIds([]);
		expect(result).toBeInstanceOf(Set);
		expect(result.size).toBe(0);
	});

	it('should return set with defaultExpandedIds when provided', () => {
		const result = getInitialExpandedIds([], ['node-1', 'node-2']);
		expect(result).toBeInstanceOf(Set);
		expect(result.size).toBe(2);
		expect(result.has('node-1')).toBe(true);
		expect(result.has('node-2')).toBe(true);
	});

	it('should include nodes with defaultExpanded flag', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1', defaultExpanded: true },
			{ id: 'node-2', label: 'Node 2', defaultExpanded: false },
			{ id: 'node-3', label: 'Node 3' },
		];
		const result = getInitialExpandedIds(nodes);
		expect(result.size).toBe(1);
		expect(result.has('node-1')).toBe(true);
		expect(result.has('node-2')).toBe(false);
		expect(result.has('node-3')).toBe(false);
	});

	it('should merge defaultExpandedIds with nodes having defaultExpanded flag', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1', defaultExpanded: true },
			{ id: 'node-2', label: 'Node 2' },
		];
		const result = getInitialExpandedIds(nodes, ['node-2', 'node-3']);
		expect(result.size).toBe(3);
		expect(result.has('node-1')).toBe(true);
		expect(result.has('node-2')).toBe(true);
		expect(result.has('node-3')).toBe(true);
	});

	it('should handle nested nodes with defaultExpanded flag', () => {
		const nodes: TreeNode[] = [
			{
				id: 'node-1',
				label: 'Node 1',
				defaultExpanded: true,
				children: [
					{ id: 'node-1-1', label: 'Node 1.1', defaultExpanded: true },
					{ id: 'node-1-2', label: 'Node 1.2' },
				],
			},
			{ id: 'node-2', label: 'Node 2' },
		];
		const result = getInitialExpandedIds(nodes);
		expect(result.size).toBe(2);
		expect(result.has('node-1')).toBe(true);
		expect(result.has('node-1-1')).toBe(true);
	});

	it('should handle deeply nested nodes with defaultExpanded flag', () => {
		const nodes: TreeNode[] = [
			{
				id: 'level-1',
				label: 'Level 1',
				children: [
					{
						id: 'level-2',
						label: 'Level 2',
						defaultExpanded: true,
						children: [
							{
								id: 'level-3',
								label: 'Level 3',
								defaultExpanded: true,
								children: [{ id: 'level-4', label: 'Level 4' }],
							},
						],
					},
				],
			},
		];
		const result = getInitialExpandedIds(nodes);
		expect(result.size).toBe(2);
		expect(result.has('level-2')).toBe(true);
		expect(result.has('level-3')).toBe(true);
	});

	it('should deduplicate when defaultExpandedIds and defaultExpanded flag overlap', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1', defaultExpanded: true },
			{ id: 'node-2', label: 'Node 2', defaultExpanded: true },
		];
		const result = getInitialExpandedIds(nodes, ['node-1', 'node-3']);
		expect(result.size).toBe(3);
		expect(result.has('node-1')).toBe(true);
		expect(result.has('node-2')).toBe(true);
		expect(result.has('node-3')).toBe(true);
	});

	it('should handle undefined defaultExpandedIds', () => {
		const nodes: TreeNode[] = [{ id: 'node-1', label: 'Node 1', defaultExpanded: true }];
		const result = getInitialExpandedIds(nodes, undefined);
		expect(result.size).toBe(1);
		expect(result.has('node-1')).toBe(true);
	});

	it('should return empty set when no nodes have defaultExpanded and no defaultExpandedIds provided', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1' },
			{ id: 'node-2', label: 'Node 2', defaultExpanded: false },
		];
		const result = getInitialExpandedIds(nodes);
		expect(result.size).toBe(0);
	});
});

describe('useTreeView.utils - getInitialSelectedIds', () => {
	it('should return empty set for empty nodes without defaultSelectedIds', () => {
		const result = getInitialSelectedIds([]);
		expect(result).toBeInstanceOf(Set);
		expect(result.size).toBe(0);
	});

	it('should return set with defaultSelectedIds when provided', () => {
		const result = getInitialSelectedIds([], ['node-1', 'node-2']);
		expect(result).toBeInstanceOf(Set);
		expect(result.size).toBe(2);
		expect(result.has('node-1')).toBe(true);
		expect(result.has('node-2')).toBe(true);
	});

	it('should include nodes with defaultSelected flag', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1', defaultSelected: true },
			{ id: 'node-2', label: 'Node 2', defaultSelected: false },
			{ id: 'node-3', label: 'Node 3' },
		];
		const result = getInitialSelectedIds(nodes);
		expect(result.size).toBe(1);
		expect(result.has('node-1')).toBe(true);
		expect(result.has('node-2')).toBe(false);
		expect(result.has('node-3')).toBe(false);
	});

	it('should merge defaultSelectedIds with nodes having defaultSelected flag', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1', defaultSelected: true },
			{ id: 'node-2', label: 'Node 2' },
		];
		const result = getInitialSelectedIds(nodes, ['node-2', 'node-3']);
		expect(result.size).toBe(3);
		expect(result.has('node-1')).toBe(true);
		expect(result.has('node-2')).toBe(true);
		expect(result.has('node-3')).toBe(true);
	});

	it('should handle nested nodes with defaultSelected flag', () => {
		const nodes: TreeNode[] = [
			{
				id: 'node-1',
				label: 'Node 1',
				defaultSelected: true,
				children: [
					{ id: 'node-1-1', label: 'Node 1.1', defaultSelected: true },
					{ id: 'node-1-2', label: 'Node 1.2' },
				],
			},
			{ id: 'node-2', label: 'Node 2' },
		];
		const result = getInitialSelectedIds(nodes);
		expect(result.size).toBe(2);
		expect(result.has('node-1')).toBe(true);
		expect(result.has('node-1-1')).toBe(true);
	});

	it('should handle deeply nested nodes with defaultSelected flag', () => {
		const nodes: TreeNode[] = [
			{
				id: 'level-1',
				label: 'Level 1',
				children: [
					{
						id: 'level-2',
						label: 'Level 2',
						defaultSelected: true,
						children: [
							{
								id: 'level-3',
								label: 'Level 3',
								defaultSelected: true,
								children: [{ id: 'level-4', label: 'Level 4' }],
							},
						],
					},
				],
			},
		];
		const result = getInitialSelectedIds(nodes);
		expect(result.size).toBe(2);
		expect(result.has('level-2')).toBe(true);
		expect(result.has('level-3')).toBe(true);
	});

	it('should deduplicate when defaultSelectedIds and defaultSelected flag overlap', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1', defaultSelected: true },
			{ id: 'node-2', label: 'Node 2', defaultSelected: true },
		];
		const result = getInitialSelectedIds(nodes, ['node-1', 'node-3']);
		expect(result.size).toBe(3);
		expect(result.has('node-1')).toBe(true);
		expect(result.has('node-2')).toBe(true);
		expect(result.has('node-3')).toBe(true);
	});

	it('should handle undefined defaultSelectedIds', () => {
		const nodes: TreeNode[] = [{ id: 'node-1', label: 'Node 1', defaultSelected: true }];
		const result = getInitialSelectedIds(nodes, undefined);
		expect(result.size).toBe(1);
		expect(result.has('node-1')).toBe(true);
	});

	it('should return empty set when no nodes have defaultSelected and no defaultSelectedIds provided', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1' },
			{ id: 'node-2', label: 'Node 2', defaultSelected: false },
		];
		const result = getInitialSelectedIds(nodes);
		expect(result.size).toBe(0);
	});

	it('should handle nodes with both defaultExpanded and defaultSelected flags independently', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1', defaultExpanded: true, defaultSelected: true },
			{ id: 'node-2', label: 'Node 2', defaultExpanded: true },
			{ id: 'node-3', label: 'Node 3', defaultSelected: true },
		];
		const expandedResult = getInitialExpandedIds(nodes);
		const selectedResult = getInitialSelectedIds(nodes);
		expect(expandedResult.size).toBe(2);
		expect(expandedResult.has('node-1')).toBe(true);
		expect(expandedResult.has('node-2')).toBe(true);
		expect(selectedResult.size).toBe(2);
		expect(selectedResult.has('node-1')).toBe(true);
		expect(selectedResult.has('node-3')).toBe(true);
	});
});
