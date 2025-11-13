import type { KeyboardEvent } from 'react';

import { nodeHasChildren } from './useTreeViewKeyboard.helpers';
import type { KeyHandlerContext } from './useTreeViewKeyboard.types';

/**
 * Handles ArrowRight key: expand node or move to first child
 */
export function handleArrowRight(currentNodeId: string, context: KeyHandlerContext): void {
	const { nodes, expandedNodeIds, getNextNodeId, onNodeSelect, onNodeExpand } = context;
	const hasChildren = nodeHasChildren(nodes, currentNodeId);
	if (!hasChildren) {
		return;
	}
	if (expandedNodeIds.has(currentNodeId)) {
		const nextId = getNextNodeId(currentNodeId, 'next');
		if (nextId) {
			onNodeSelect(nextId);
		}
	} else {
		onNodeExpand(currentNodeId);
	}
}

/**
 * Handles ArrowLeft key: collapse node or move to previous node
 */
export function handleArrowLeft(currentNodeId: string, context: KeyHandlerContext): void {
	const { nodes, expandedNodeIds, getNextNodeId, onNodeSelect, onNodeCollapse } = context;
	const hasChildren = nodeHasChildren(nodes, currentNodeId);
	if (hasChildren && expandedNodeIds.has(currentNodeId)) {
		onNodeCollapse(currentNodeId);
	} else {
		const prevId = getNextNodeId(currentNodeId, 'previous');
		if (prevId) {
			onNodeSelect(prevId);
		}
	}
}

/**
 * Handles ArrowDown key: move to next visible node
 */
export function handleArrowDown(currentNodeId: string, context: KeyHandlerContext): void {
	const { getNextNodeId, onNodeSelect } = context;
	const nextId = getNextNodeId(currentNodeId, 'next');
	if (nextId) {
		onNodeSelect(nextId);
	}
}

/**
 * Handles ArrowUp key: move to previous visible node
 */
export function handleArrowUp(currentNodeId: string, context: KeyHandlerContext): void {
	const { getNextNodeId, onNodeSelect } = context;
	const prevId = getNextNodeId(currentNodeId, 'previous');
	if (prevId) {
		onNodeSelect(prevId);
	}
}

/**
 * Handles Home key: move to first node
 */
export function handleHome(context: KeyHandlerContext): void {
	const { getFirstNodeId, onNodeSelect } = context;
	const firstId = getFirstNodeId();
	if (firstId) {
		onNodeSelect(firstId);
	}
}

/**
 * Handles End key: move to last node
 */
export function handleEnd(context: KeyHandlerContext): void {
	const { getLastNodeId, onNodeSelect } = context;
	const lastId = getLastNodeId();
	if (lastId) {
		onNodeSelect(lastId);
	}
}

/**
 * Handles Enter/Space key: toggle node
 */
export function handleToggle(currentNodeId: string, context: KeyHandlerContext): void {
	context.onNodeToggle(currentNodeId);
}

/**
 * Creates the keyboard event handler
 */
export function createKeyboardHandler(context: KeyHandlerContext) {
	return (event: KeyboardEvent<HTMLDivElement>, currentNodeId: string): void => {
		event.preventDefault();
		switch (event.key) {
			case 'ArrowRight': {
				handleArrowRight(currentNodeId, context);
				break;
			}
			case 'ArrowLeft': {
				handleArrowLeft(currentNodeId, context);
				break;
			}
			case 'ArrowDown': {
				handleArrowDown(currentNodeId, context);
				break;
			}
			case 'ArrowUp': {
				handleArrowUp(currentNodeId, context);
				break;
			}
			case 'Home': {
				handleHome(context);
				break;
			}
			case 'End': {
				handleEnd(context);
				break;
			}
			case 'Enter':
			case ' ': {
				handleToggle(currentNodeId, context);
				break;
			}
			default: {
				// No action for other keys
				break;
			}
		}
	};
}
