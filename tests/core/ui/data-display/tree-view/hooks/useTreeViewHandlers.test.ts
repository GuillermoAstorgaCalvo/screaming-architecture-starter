/**
 * Tests for useTreeViewHandlers hook
 *
 * Tests handler composition:
 * - useTreeViewHandlers combines event handlers and keyboard handlers
 * - useTreeViewHandlersFromState correctly maps setup props and tree state
 */

import { useTreeViewEventHandlers } from '@core/ui/data-display/tree-view/helpers/useTreeViewEventHandlers';
import {
	useTreeViewHandlers,
	useTreeViewHandlersFromState,
} from '@core/ui/data-display/tree-view/hooks/useTreeViewHandlers';
import { useTreeViewKeyboardHandlers } from '@core/ui/data-display/tree-view/hooks/useTreeViewKeyboardHandlers';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/data-display/tree-view/helpers/useTreeViewEventHandlers');
vi.mock('@core/ui/data-display/tree-view/hooks/useTreeViewKeyboardHandlers');

const mockUseTreeViewEventHandlers = vi.mocked(useTreeViewEventHandlers);
const mockUseTreeViewKeyboardHandlers = vi.mocked(useTreeViewKeyboardHandlers);

// Test data
const createMockNode = (id: string, label: string = `Node ${id}`): TreeNode => ({
	id,
	label,
});

describe('useTreeViewHandlers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Handler Composition', () => {
		it('should combine event handlers and keyboard handlers', () => {
			const mockEventHandlers = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockHandleKeyDown = vi.fn();

			mockUseTreeViewEventHandlers.mockReturnValue(mockEventHandlers);
			mockUseTreeViewKeyboardHandlers.mockReturnValue(mockHandleKeyDown);

			const params = {
				nodes: [createMockNode('node-1')],
				expandedNodeIds: new Set<string>(),
				selectionMode: 'none' as const,
				toggleSelection: vi.fn(),
				expandNode: vi.fn(),
				collapseNode: vi.fn(),
				toggleExpansion: vi.fn(),
				getNodeById: vi.fn(),
				setFocusedNodeId: vi.fn(),
			};

			const { result } = renderHook(() => useTreeViewHandlers(params));

			expect(result.current).toEqual({
				...mockEventHandlers,
				handleKeyDown: mockHandleKeyDown,
			});
		});

		it('should pass correct params to useTreeViewEventHandlers', () => {
			const mockEventHandlers = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockHandleKeyDown = vi.fn();

			mockUseTreeViewEventHandlers.mockReturnValue(mockEventHandlers);
			mockUseTreeViewKeyboardHandlers.mockReturnValue(mockHandleKeyDown);

			const onNodeClick = vi.fn();
			const onNodeDoubleClick = vi.fn();
			const toggleSelection = vi.fn();
			const expandNode = vi.fn();
			const collapseNode = vi.fn();

			const params = {
				nodes: [createMockNode('node-1')],
				expandedNodeIds: new Set<string>(),
				selectionMode: 'single' as const,
				toggleSelection,
				expandNode,
				collapseNode,
				toggleExpansion: vi.fn(),
				getNodeById: vi.fn(),
				setFocusedNodeId: vi.fn(),
				onNodeClick,
				onNodeDoubleClick,
			};

			renderHook(() => useTreeViewHandlers(params));

			expect(mockUseTreeViewEventHandlers).toHaveBeenCalledWith({
				onNodeClick,
				onNodeDoubleClick,
				selectionMode: 'single',
				toggleSelection,
				expandNode,
				collapseNode,
			});
		});

		it('should pass correct params to useTreeViewKeyboardHandlers', () => {
			const mockEventHandlers = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockHandleKeyDown = vi.fn();

			mockUseTreeViewEventHandlers.mockReturnValue(mockEventHandlers);
			mockUseTreeViewKeyboardHandlers.mockReturnValue(mockHandleKeyDown);

			const nodes = [createMockNode('node-1'), createMockNode('node-2')];
			const expandedNodeIds = new Set<string>(['node-1']);
			const toggleSelection = vi.fn();
			const expandNode = vi.fn();
			const collapseNode = vi.fn();
			const toggleExpansion = vi.fn();
			const getNodeById = vi.fn();
			const setFocusedNodeId = vi.fn();

			const params = {
				nodes,
				expandedNodeIds,
				selectionMode: 'multiple' as const,
				toggleSelection,
				expandNode,
				collapseNode,
				toggleExpansion,
				getNodeById,
				setFocusedNodeId,
			};

			renderHook(() => useTreeViewHandlers(params));

			expect(mockUseTreeViewKeyboardHandlers).toHaveBeenCalledWith({
				nodes,
				expandedNodeIds,
				selectionMode: 'multiple',
				toggleSelection,
				expandNode,
				collapseNode,
				toggleExpansion,
				getNodeById,
				setFocusedNodeId,
			});
		});

		it('should work without optional callbacks', () => {
			const mockEventHandlers = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockHandleKeyDown = vi.fn();

			mockUseTreeViewEventHandlers.mockReturnValue(mockEventHandlers);
			mockUseTreeViewKeyboardHandlers.mockReturnValue(mockHandleKeyDown);

			const params = {
				nodes: [createMockNode('node-1')],
				expandedNodeIds: new Set<string>(),
				selectionMode: 'none' as const,
				toggleSelection: vi.fn(),
				expandNode: vi.fn(),
				collapseNode: vi.fn(),
				toggleExpansion: vi.fn(),
				getNodeById: vi.fn(),
				setFocusedNodeId: vi.fn(),
			};

			const { result } = renderHook(() => useTreeViewHandlers(params));

			expect(result.current).toHaveProperty('handleNodeClick');
			expect(result.current).toHaveProperty('handleNodeDoubleClick');
			expect(result.current).toHaveProperty('handleNodeToggle');
			expect(result.current).toHaveProperty('handleNodeExpand');
			expect(result.current).toHaveProperty('handleNodeCollapse');
			expect(result.current).toHaveProperty('handleKeyDown');

			expect(mockUseTreeViewEventHandlers).toHaveBeenCalledWith({
				onNodeClick: undefined,
				onNodeDoubleClick: undefined,
				selectionMode: 'none',
				toggleSelection: params.toggleSelection,
				expandNode: params.expandNode,
				collapseNode: params.collapseNode,
			});
		});
	});

	describe('Handler Updates', () => {
		it('should update handlers when params change', () => {
			const mockEventHandlers1 = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockEventHandlers2 = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockHandleKeyDown1 = vi.fn();
			const mockHandleKeyDown2 = vi.fn();

			mockUseTreeViewEventHandlers
				.mockReturnValueOnce(mockEventHandlers1)
				.mockReturnValueOnce(mockEventHandlers2);
			mockUseTreeViewKeyboardHandlers
				.mockReturnValueOnce(mockHandleKeyDown1)
				.mockReturnValueOnce(mockHandleKeyDown2);

			const toggleSelection1 = vi.fn();
			const toggleSelection2 = vi.fn();

			const { result, rerender } = renderHook(
				({ toggleSelection }) =>
					useTreeViewHandlers({
						nodes: [createMockNode('node-1')],
						expandedNodeIds: new Set<string>(),
						selectionMode: 'single',
						toggleSelection,
						expandNode: vi.fn(),
						collapseNode: vi.fn(),
						toggleExpansion: vi.fn(),
						getNodeById: vi.fn(),
						setFocusedNodeId: vi.fn(),
					}),
				{
					initialProps: { toggleSelection: toggleSelection1 },
				}
			);

			const firstRenderHandlers = result.current;

			rerender({ toggleSelection: toggleSelection2 });

			// Handlers should be new references when params change
			expect(result.current).not.toBe(firstRenderHandlers);
			expect(result.current.handleNodeToggle).not.toBe(firstRenderHandlers.handleNodeToggle);
		});
	});
});

describe('useTreeViewHandlersFromState', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('State Mapping', () => {
		it('should correctly map setup props and tree state to handlers params', () => {
			const mockEventHandlers = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockHandleKeyDown = vi.fn();

			mockUseTreeViewEventHandlers.mockReturnValue(mockEventHandlers);
			mockUseTreeViewKeyboardHandlers.mockReturnValue(mockHandleKeyDown);

			const nodes = [createMockNode('node-1'), createMockNode('node-2')];
			const onNodeClick = vi.fn();
			const onNodeDoubleClick = vi.fn();
			const toggleSelection = vi.fn();
			const expandNode = vi.fn();
			const collapseNode = vi.fn();
			const toggleExpansion = vi.fn();
			const getNodeById = vi.fn();
			const setFocusedNodeId = vi.fn();
			const expandedNodeIds = new Set<string>(['node-1']);

			const setupProps = {
				nodes,
				selectionMode: 'multiple' as const,
				onNodeClick,
				onNodeDoubleClick,
			};

			const treeState = {
				selectedNodeIds: new Set<string>(),
				expandedNodeIds,
				isSelected: vi.fn(),
				isExpanded: vi.fn(),
				toggleSelection,
				toggleExpansion,
				expandNode,
				collapseNode,
				getAllNodeIds: vi.fn(),
				getNodeById,
			};

			renderHook(() => useTreeViewHandlersFromState(setupProps, treeState, setFocusedNodeId));

			expect(mockUseTreeViewEventHandlers).toHaveBeenCalledWith({
				onNodeClick,
				onNodeDoubleClick,
				selectionMode: 'multiple',
				toggleSelection,
				expandNode,
				collapseNode,
			});

			expect(mockUseTreeViewKeyboardHandlers).toHaveBeenCalledWith({
				nodes,
				expandedNodeIds,
				selectionMode: 'multiple',
				toggleSelection,
				expandNode,
				collapseNode,
				toggleExpansion,
				getNodeById,
				setFocusedNodeId,
			});
		});

		it('should work with different selection modes', () => {
			const mockEventHandlers = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockHandleKeyDown = vi.fn();

			mockUseTreeViewEventHandlers.mockReturnValue(mockEventHandlers);
			mockUseTreeViewKeyboardHandlers.mockReturnValue(mockHandleKeyDown);

			const selectionModes: Array<'none' | 'single' | 'multiple'> = ['none', 'single', 'multiple'];

			for (const selectionMode of selectionModes) {
				vi.clearAllMocks();

				const setupProps = {
					nodes: [createMockNode('node-1')],
					selectionMode,
				};

				const treeState = {
					selectedNodeIds: new Set<string>(),
					expandedNodeIds: new Set<string>(),
					isSelected: vi.fn(),
					isExpanded: vi.fn(),
					toggleSelection: vi.fn(),
					toggleExpansion: vi.fn(),
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
					getAllNodeIds: vi.fn(),
					getNodeById: vi.fn(),
				};

				renderHook(() => useTreeViewHandlersFromState(setupProps, treeState, vi.fn()));

				expect(mockUseTreeViewEventHandlers).toHaveBeenCalledWith(
					expect.objectContaining({
						selectionMode,
					})
				);

				expect(mockUseTreeViewKeyboardHandlers).toHaveBeenCalledWith(
					expect.objectContaining({
						selectionMode,
					})
				);
			}
		});

		it('should handle missing optional callbacks in setup props', () => {
			const mockEventHandlers = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockHandleKeyDown = vi.fn();

			mockUseTreeViewEventHandlers.mockReturnValue(mockEventHandlers);
			mockUseTreeViewKeyboardHandlers.mockReturnValue(mockHandleKeyDown);

			const setupProps = {
				nodes: [createMockNode('node-1')],
				selectionMode: 'none' as const,
			};

			const treeState = {
				selectedNodeIds: new Set<string>(),
				expandedNodeIds: new Set<string>(),
				isSelected: vi.fn(),
				isExpanded: vi.fn(),
				toggleSelection: vi.fn(),
				toggleExpansion: vi.fn(),
				expandNode: vi.fn(),
				collapseNode: vi.fn(),
				getAllNodeIds: vi.fn(),
				getNodeById: vi.fn(),
			};

			renderHook(() => useTreeViewHandlersFromState(setupProps, treeState, vi.fn()));

			expect(mockUseTreeViewEventHandlers).toHaveBeenCalledWith({
				onNodeClick: undefined,
				onNodeDoubleClick: undefined,
				selectionMode: 'none',
				toggleSelection: treeState.toggleSelection,
				expandNode: treeState.expandNode,
				collapseNode: treeState.collapseNode,
			});
		});

		it('should return combined handlers', () => {
			const mockEventHandlers = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockHandleKeyDown = vi.fn();

			mockUseTreeViewEventHandlers.mockReturnValue(mockEventHandlers);
			mockUseTreeViewKeyboardHandlers.mockReturnValue(mockHandleKeyDown);

			const setupProps = {
				nodes: [createMockNode('node-1')],
				selectionMode: 'single' as const,
			};

			const treeState = {
				selectedNodeIds: new Set<string>(),
				expandedNodeIds: new Set<string>(),
				isSelected: vi.fn(),
				isExpanded: vi.fn(),
				toggleSelection: vi.fn(),
				toggleExpansion: vi.fn(),
				expandNode: vi.fn(),
				collapseNode: vi.fn(),
				getAllNodeIds: vi.fn(),
				getNodeById: vi.fn(),
			};

			const { result } = renderHook(() =>
				useTreeViewHandlersFromState(setupProps, treeState, vi.fn())
			);

			expect(result.current).toEqual({
				...mockEventHandlers,
				handleKeyDown: mockHandleKeyDown,
			});
		});
	});

	describe('Integration', () => {
		it('should correctly integrate with tree state changes', () => {
			const mockEventHandlers1 = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockEventHandlers2 = {
				handleNodeClick: vi.fn(),
				handleNodeDoubleClick: vi.fn(),
				handleNodeToggle: vi.fn(),
				handleNodeExpand: vi.fn(),
				handleNodeCollapse: vi.fn(),
			};
			const mockHandleKeyDown1 = vi.fn();
			const mockHandleKeyDown2 = vi.fn();

			mockUseTreeViewEventHandlers
				.mockReturnValueOnce(mockEventHandlers1)
				.mockReturnValueOnce(mockEventHandlers2);
			mockUseTreeViewKeyboardHandlers
				.mockReturnValueOnce(mockHandleKeyDown1)
				.mockReturnValueOnce(mockHandleKeyDown2);

			const setupProps = {
				nodes: [createMockNode('node-1')],
				selectionMode: 'single' as const,
			};

			const treeState1 = {
				selectedNodeIds: new Set<string>(),
				expandedNodeIds: new Set<string>(),
				isSelected: vi.fn(),
				isExpanded: vi.fn(),
				toggleSelection: vi.fn(),
				toggleExpansion: vi.fn(),
				expandNode: vi.fn(),
				collapseNode: vi.fn(),
				getAllNodeIds: vi.fn(),
				getNodeById: vi.fn(),
			};

			const treeState2 = {
				selectedNodeIds: new Set<string>(['node-1']),
				expandedNodeIds: new Set<string>(['node-1']),
				isSelected: vi.fn(),
				isExpanded: vi.fn(),
				toggleSelection: vi.fn(),
				toggleExpansion: vi.fn(),
				expandNode: vi.fn(),
				collapseNode: vi.fn(),
				getAllNodeIds: vi.fn(),
				getNodeById: vi.fn(),
			};

			const { result, rerender } = renderHook(
				({ treeState }) => useTreeViewHandlersFromState(setupProps, treeState, vi.fn()),
				{
					initialProps: { treeState: treeState1 },
				}
			);

			const firstRenderHandlers = result.current;

			rerender({ treeState: treeState2 });

			// Handlers should update when tree state changes
			expect(result.current).not.toBe(firstRenderHandlers);
			expect(mockUseTreeViewKeyboardHandlers).toHaveBeenCalledTimes(2);
			expect(mockUseTreeViewKeyboardHandlers).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					expandedNodeIds: treeState2.expandedNodeIds,
				})
			);
		});
	});
});
