/**
 * Tests for useTreeViewKeyboard helper functions
 *
 * Tests utility functions:
 * - getVisibleNodeIds
 * - getNextVisibleNodeId
 * - getFirstVisibleNodeId
 * - getLastVisibleNodeId
 * - nodeHasChildren
 */

import {
	getFirstVisibleNodeId,
	getLastVisibleNodeId,
	getNextVisibleNodeId,
	getVisibleNodeIds,
	nodeHasChildren,
} from '@core/ui/data-display/tree-view/helpers/useTreeViewKeyboard.helpers';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import { describe, expect, it } from 'vitest';

describe('useTreeViewKeyboard.helpers - getVisibleNodeIds', () => {
	it('should return empty array for empty nodes', () => {
		const result = getVisibleNodeIds([], new Set());
		expect(result).toEqual([]);
	});

	it('should return single node ID when no nodes are expanded', () => {
		const nodes: TreeNode[] = [{ id: 'node-1', label: 'Node 1' }];
		const result = getVisibleNodeIds(nodes, new Set());
		expect(result).toEqual(['node-1']);
	});

	it('should return only root nodes when none are expanded', () => {
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
		const result = getVisibleNodeIds(nodes, new Set());
		expect(result).toEqual(['node-1', 'node-2']);
	});

	it('should include children when parent is expanded', () => {
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
		const result = getVisibleNodeIds(nodes, new Set(['node-1']));
		expect(result).toEqual(['node-1', 'node-1-1', 'node-1-2', 'node-2']);
	});

	it('should handle multiple expanded nodes', () => {
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
		const result = getVisibleNodeIds(nodes, new Set(['node-1', 'node-1-2']));
		expect(result).toEqual(['node-1', 'node-1-1', 'node-1-2', 'node-1-2-1', 'node-2']);
	});

	it('should not include children of collapsed nodes', () => {
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
		const result = getVisibleNodeIds(nodes, new Set(['node-1-2']));
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
		const result = getVisibleNodeIds(nodes, new Set(['level-1', 'level-2', 'level-3']));
		expect(result).toEqual(['level-1', 'level-2', 'level-3', 'level-4']);
	});

	it('should handle nodes with empty children arrays', () => {
		const nodes: TreeNode[] = [
			{ id: 'node-1', label: 'Node 1', children: [] },
			{ id: 'node-2', label: 'Node 2' },
		];
		const result = getVisibleNodeIds(nodes, new Set(['node-1']));
		expect(result).toEqual(['node-1', 'node-2']);
	});

	it('should preserve order of nodes', () => {
		const nodes: TreeNode[] = [
			{ id: 'first', label: 'First' },
			{
				id: 'second',
				label: 'Second',
				children: [
					{ id: 'second-1', label: 'Second 1' },
					{ id: 'second-2', label: 'Second 2' },
				],
			},
			{ id: 'third', label: 'Third' },
		];
		const result = getVisibleNodeIds(nodes, new Set(['second']));
		expect(result).toEqual(['first', 'second', 'second-1', 'second-2', 'third']);
	});
});

describe('useTreeViewKeyboard.helpers - getNextVisibleNodeId', () => {
	it('should return next node ID when direction is "next"', () => {
		const visibleNodeIds = ['node-1', 'node-2', 'node-3'];
		const result = getNextVisibleNodeId('node-1', visibleNodeIds, 'next');
		expect(result).toBe('node-2');
	});

	it('should return previous node ID when direction is "previous"', () => {
		const visibleNodeIds = ['node-1', 'node-2', 'node-3'];
		const result = getNextVisibleNodeId('node-2', visibleNodeIds, 'previous');
		expect(result).toBe('node-1');
	});

	it('should return null when at last node and direction is "next"', () => {
		const visibleNodeIds = ['node-1', 'node-2', 'node-3'];
		const result = getNextVisibleNodeId('node-3', visibleNodeIds, 'next');
		expect(result).toBeNull();
	});

	it('should return null when at first node and direction is "previous"', () => {
		const visibleNodeIds = ['node-1', 'node-2', 'node-3'];
		const result = getNextVisibleNodeId('node-1', visibleNodeIds, 'previous');
		expect(result).toBeNull();
	});

	it('should return first node when current node is not found', () => {
		const visibleNodeIds = ['node-1', 'node-2', 'node-3'];
		const result = getNextVisibleNodeId('node-unknown', visibleNodeIds, 'next');
		expect(result).toBe('node-1');
	});

	it('should return null when current node is not found and array is empty', () => {
		const visibleNodeIds: string[] = [];
		const result = getNextVisibleNodeId('node-unknown', visibleNodeIds, 'next');
		expect(result).toBeNull();
	});

	it('should return null when array is empty', () => {
		const visibleNodeIds: string[] = [];
		const result = getNextVisibleNodeId('node-1', visibleNodeIds, 'next');
		expect(result).toBeNull();
	});

	it('should handle single node array with "next" direction', () => {
		const visibleNodeIds = ['node-1'];
		const result = getNextVisibleNodeId('node-1', visibleNodeIds, 'next');
		expect(result).toBeNull();
	});

	it('should handle single node array with "previous" direction', () => {
		const visibleNodeIds = ['node-1'];
		const result = getNextVisibleNodeId('node-1', visibleNodeIds, 'previous');
		expect(result).toBeNull();
	});

	it('should handle boundary cases correctly', () => {
		const visibleNodeIds = ['node-1', 'node-2', 'node-3'];
		expect(getNextVisibleNodeId('node-1', visibleNodeIds, 'next')).toBe('node-2');
		expect(getNextVisibleNodeId('node-3', visibleNodeIds, 'previous')).toBe('node-2');
	});
});

describe('useTreeViewKeyboard.helpers - getFirstVisibleNodeId', () => {
	it('should return first node ID from non-empty array', () => {
		const visibleNodeIds = ['node-1', 'node-2', 'node-3'];
		const result = getFirstVisibleNodeId(visibleNodeIds);
		expect(result).toBe('node-1');
	});

	it('should return null for empty array', () => {
		const visibleNodeIds: string[] = [];
		const result = getFirstVisibleNodeId(visibleNodeIds);
		expect(result).toBeNull();
	});

	it('should return the only node ID from single-element array', () => {
		const visibleNodeIds = ['node-1'];
		const result = getFirstVisibleNodeId(visibleNodeIds);
		expect(result).toBe('node-1');
	});
});

describe('useTreeViewKeyboard.helpers - getLastVisibleNodeId', () => {
	it('should return last node ID from non-empty array', () => {
		const visibleNodeIds = ['node-1', 'node-2', 'node-3'];
		const result = getLastVisibleNodeId(visibleNodeIds);
		expect(result).toBe('node-3');
	});

	it('should return null for empty array', () => {
		const visibleNodeIds: string[] = [];
		const result = getLastVisibleNodeId(visibleNodeIds);
		expect(result).toBeNull();
	});

	it('should return the only node ID from single-element array', () => {
		const visibleNodeIds = ['node-1'];
		const result = getLastVisibleNodeId(visibleNodeIds);
		expect(result).toBe('node-1');
	});
});

describe('useTreeViewKeyboard.helpers - nodeHasChildren', () => {
	it('should return true when node has children', () => {
		const nodes: TreeNode[] = [
			{
				id: 'node-1',
				label: 'Node 1',
				children: [
					{ id: 'node-1-1', label: 'Node 1.1' },
					{ id: 'node-1-2', label: 'Node 1.2' },
				],
			},
		];
		const result = nodeHasChildren(nodes, 'node-1');
		expect(result).toBe(true);
	});

	it('should return false when node has no children', () => {
		const nodes: TreeNode[] = [{ id: 'node-1', label: 'Node 1' }];
		const result = nodeHasChildren(nodes, 'node-1');
		expect(result).toBe(false);
	});

	it('should return false when node has empty children array', () => {
		const nodes: TreeNode[] = [{ id: 'node-1', label: 'Node 1', children: [] }];
		const result = nodeHasChildren(nodes, 'node-1');
		expect(result).toBe(false);
	});

	it('should return false when node is not found', () => {
		const nodes: TreeNode[] = [{ id: 'node-1', label: 'Node 1' }];
		const result = nodeHasChildren(nodes, 'node-unknown');
		expect(result).toBe(false);
	});

	it('should find node in nested structure and return true', () => {
		const nodes: TreeNode[] = [
			{
				id: 'node-1',
				label: 'Node 1',
				children: [
					{
						id: 'node-1-1',
						label: 'Node 1.1',
						children: [{ id: 'node-1-1-1', label: 'Node 1.1.1' }],
					},
				],
			},
		];
		const result = nodeHasChildren(nodes, 'node-1-1');
		expect(result).toBe(true);
	});

	it('should find node in nested structure and return false when no children', () => {
		const nodes: TreeNode[] = [
			{
				id: 'node-1',
				label: 'Node 1',
				children: [{ id: 'node-1-1', label: 'Node 1.1' }],
			},
		];
		const result = nodeHasChildren(nodes, 'node-1-1');
		expect(result).toBe(false);
	});

	it('should handle deeply nested nodes', () => {
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
		expect(nodeHasChildren(nodes, 'level-1')).toBe(true);
		expect(nodeHasChildren(nodes, 'level-2')).toBe(true);
		expect(nodeHasChildren(nodes, 'level-3')).toBe(true);
		expect(nodeHasChildren(nodes, 'level-4')).toBe(false);
	});

	it('should return false for empty nodes array', () => {
		const nodes: TreeNode[] = [];
		const result = nodeHasChildren(nodes, 'node-1');
		expect(result).toBe(false);
	});

	it('should handle multiple root nodes', () => {
		const nodes: TreeNode[] = [
			{
				id: 'node-1',
				label: 'Node 1',
				children: [{ id: 'node-1-1', label: 'Node 1.1' }],
			},
			{ id: 'node-2', label: 'Node 2' },
			{
				id: 'node-3',
				label: 'Node 3',
				children: [{ id: 'node-3-1', label: 'Node 3.1' }],
			},
		];
		expect(nodeHasChildren(nodes, 'node-1')).toBe(true);
		expect(nodeHasChildren(nodes, 'node-2')).toBe(false);
		expect(nodeHasChildren(nodes, 'node-3')).toBe(true);
		expect(nodeHasChildren(nodes, 'node-1-1')).toBe(false);
		expect(nodeHasChildren(nodes, 'node-3-1')).toBe(false);
	});
});
