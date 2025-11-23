/**
 * SwipeableActions Component Tests
 *
 * Tests for the SwipeableActions component:
 * - Rendering
 * - Action buttons
 * - Click handling
 * - Empty actions handling
 * - Background styling
 */

import { SwipeableActions } from '@core/ui/utilities/swipeable/SwipeableActions';
import type { SwipeableAction } from '@src-types/ui/overlays/interactions';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_IDS = {
	CONTAINER: 'swipeable-actions-container',
	ACTION_EDIT: 'swipeable-action-edit',
	ACTION_DELETE: 'swipeable-action-delete',
} as const;

const DEFAULT_CONTAINER_STYLE = { left: 0, width: '100px' } as const;

const ACTION_IDS = {
	EDIT: 'edit',
	DELETE: 'delete',
} as const;

const ACTION_CONTENT = {
	EDIT: 'Edit',
	DELETE: 'Delete',
} as const;

const BACKGROUND_CLASSES = {
	PRIMARY: 'bg-primary',
	SECONDARY: 'bg-secondary',
	DESTRUCTIVE: 'bg-destructive',
} as const;

function renderSwipeableActions(
	actions: readonly SwipeableAction[],
	actionsContainerStyle: React.CSSProperties = DEFAULT_CONTAINER_STYLE,
	onActionClick = vi.fn()
) {
	return renderWithProviders(
		<SwipeableActions
			actions={actions}
			actionsContainerStyle={actionsContainerStyle}
			onActionClick={onActionClick}
		/>
	);
}

function createEditAction(background?: string): SwipeableAction {
	return {
		id: ACTION_IDS.EDIT,
		content: ACTION_CONTENT.EDIT,
		...(background && { background }),
	};
}

function createDeleteAction(background?: string): SwipeableAction {
	return {
		id: ACTION_IDS.DELETE,
		content: ACTION_CONTENT.DELETE,
		...(background && { background }),
	};
}

function expectButtonToHaveClass(testId: string, className: string) {
	const button = screen.getByTestId(testId);
	expect(button).toHaveClass(className);
}

describe('SwipeableActions - Rendering', () => {
	it('renders nothing when actions array is empty', () => {
		renderWithProviders(
			<SwipeableActions actions={[]} actionsContainerStyle={{}} onActionClick={vi.fn()} />
		);

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('renders action buttons', () => {
		const actions: readonly SwipeableAction[] = [createEditAction(), createDeleteAction()];

		renderSwipeableActions(actions);

		expect(screen.getByText(ACTION_CONTENT.EDIT)).toBeInTheDocument();
		expect(screen.getByText(ACTION_CONTENT.DELETE)).toBeInTheDocument();
	});

	it('renders action with React node content', () => {
		const actions: readonly SwipeableAction[] = [
			{ id: ACTION_IDS.EDIT, content: <span data-testid="edit-icon">Edit Icon</span> },
		];

		renderSwipeableActions(actions);

		expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
	});

	it('applies actionsContainerStyle to container', () => {
		const actions: readonly SwipeableAction[] = [createEditAction()];
		const style = { left: 0, width: '100px' };

		renderSwipeableActions(actions, style);

		const containerElement = screen.getByTestId(TEST_IDS.CONTAINER);
		expect(containerElement).toHaveStyle({ left: '0px', width: '100px' });
	});
});

describe('SwipeableActions - Click Handling', () => {
	it('calls onActionClick when action button is clicked', () => {
		const onActionClick = vi.fn();
		const actions: readonly SwipeableAction[] = [createEditAction()];

		renderSwipeableActions(actions, DEFAULT_CONTAINER_STYLE, onActionClick);

		const button = screen.getByText(ACTION_CONTENT.EDIT);
		fireEvent.click(button);

		expect(onActionClick).toHaveBeenCalledTimes(1);
		expect(onActionClick).toHaveBeenCalledWith(actions[0]);
	});

	it('calls onActionClick with correct action for each button', () => {
		const onActionClick = vi.fn();
		const actions: readonly SwipeableAction[] = [createEditAction(), createDeleteAction()];

		renderSwipeableActions(actions, DEFAULT_CONTAINER_STYLE, onActionClick);

		fireEvent.click(screen.getByText(ACTION_CONTENT.EDIT));
		expect(onActionClick).toHaveBeenCalledWith(actions[0]);

		fireEvent.click(screen.getByText(ACTION_CONTENT.DELETE));
		expect(onActionClick).toHaveBeenCalledWith(actions[1]);
	});

	it('handles multiple clicks on same button', () => {
		const onActionClick = vi.fn();
		const actions: readonly SwipeableAction[] = [createEditAction()];

		renderSwipeableActions(actions, DEFAULT_CONTAINER_STYLE, onActionClick);

		const button = screen.getByText(ACTION_CONTENT.EDIT);
		fireEvent.click(button);
		fireEvent.click(button);
		fireEvent.click(button);

		expect(onActionClick).toHaveBeenCalledTimes(3);
	});
});

describe('SwipeableActions - Styling', () => {
	it('applies default background class when background is not provided', () => {
		const actions: readonly SwipeableAction[] = [createEditAction()];

		renderSwipeableActions(actions);

		expectButtonToHaveClass(TEST_IDS.ACTION_EDIT, BACKGROUND_CLASSES.SECONDARY);
	});

	it('applies custom background class when provided', () => {
		const actions: readonly SwipeableAction[] = [createEditAction(BACKGROUND_CLASSES.PRIMARY)];

		renderSwipeableActions(actions);

		const button = screen.getByTestId(TEST_IDS.ACTION_EDIT);
		expect(button).toHaveClass(BACKGROUND_CLASSES.PRIMARY);
		expect(button).not.toHaveClass(BACKGROUND_CLASSES.SECONDARY);
	});

	it('applies different backgrounds to different actions', () => {
		const actions: readonly SwipeableAction[] = [
			createEditAction(BACKGROUND_CLASSES.PRIMARY),
			createDeleteAction(BACKGROUND_CLASSES.DESTRUCTIVE),
		];

		renderSwipeableActions(actions);

		expectButtonToHaveClass(TEST_IDS.ACTION_EDIT, BACKGROUND_CLASSES.PRIMARY);
		expectButtonToHaveClass(TEST_IDS.ACTION_DELETE, BACKGROUND_CLASSES.DESTRUCTIVE);
	});

	it('renders buttons with correct type attribute', () => {
		const actions: readonly SwipeableAction[] = [createEditAction()];

		renderSwipeableActions(actions);

		const button = screen.getByTestId(TEST_IDS.ACTION_EDIT);
		expect(button).toHaveAttribute('type', 'button');
	});
});
