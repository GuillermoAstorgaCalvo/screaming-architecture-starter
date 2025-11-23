import {
	ActionSheetActionButton,
	ActionSheetActions,
	ActionSheetCancelButton,
	ActionSheetContent,
	ActionSheetTitle,
} from '@core/ui/overlays/action-sheet/components/ActionSheet.components';
import type { ActionSheetAction } from '@src-types/ui/overlays/interactions';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const TEST_ACTIONS: readonly ActionSheetAction[] = [
	{ id: 'edit', label: 'Edit', onSelect: vi.fn() },
	{ id: 'delete', label: 'Delete', destructive: true, onSelect: vi.fn() },
	{ id: 'share', label: 'Share', icon: <span>Icon</span>, onSelect: vi.fn() },
];

describe('ActionSheetTitle', () => {
	it('renders title with id', () => {
		renderWithProviders(<ActionSheetTitle id="test-id" title="Test Title" />);

		const title = screen.getByText('Test Title');
		expect(title).toBeInTheDocument();
		expect(title).toHaveAttribute('id', 'test-id-title');
	});

	it('renders title with different id', () => {
		renderWithProviders(<ActionSheetTitle id="custom-id" title="Custom Title" />);

		const title = screen.getByText('Custom Title');
		expect(title).toBeInTheDocument();
		expect(title).toHaveAttribute('id', 'custom-id-title');
	});
});

describe('ActionSheetActionButton', () => {
	it('renders action button with label', () => {
		const action: ActionSheetAction = { id: 'test', label: 'Test Action' };
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetActionButton action={action} index={0} onActionClick={onActionClick} />
		);

		expect(screen.getByText('Test Action')).toBeInTheDocument();
	});

	it('renders action button with icon', () => {
		const action: ActionSheetAction = {
			id: 'test',
			label: 'Test Action',
			icon: <span data-testid="icon">Icon</span>,
		};
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetActionButton action={action} index={0} onActionClick={onActionClick} />
		);

		expect(screen.getByTestId('icon')).toBeInTheDocument();
	});

	it('calls onActionClick when clicked', async () => {
		const action: ActionSheetAction = { id: 'test', label: 'Test Action', onSelect: vi.fn() };
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetActionButton action={action} index={0} onActionClick={onActionClick} />
		);

		const button = screen.getByText('Test Action');
		fireEvent.click(button);

		await waitFor(() => {
			expect(onActionClick).toHaveBeenCalledTimes(1);
		});
		expect(onActionClick).toHaveBeenCalledWith(action);
	});

	it('renders disabled button when action is disabled', () => {
		const action: ActionSheetAction = { id: 'test', label: 'Test Action', disabled: true };
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetActionButton action={action} index={0} onActionClick={onActionClick} />
		);

		const button = screen.getByRole('button', { name: 'Test Action' });
		expect(button).toBeDisabled();
	});

	it('applies destructive styling when action is destructive', () => {
		const action: ActionSheetAction = { id: 'test', label: 'Delete', destructive: true };
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetActionButton action={action} index={0} onActionClick={onActionClick} />
		);

		const button = screen.getByRole('button', { name: 'Delete' });
		expect(button.className).toContain('text-error');
	});

	it('applies separator class for index > 0', () => {
		const action: ActionSheetAction = { id: 'test', label: 'Test Action' };
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetActionButton action={action} index={1} onActionClick={onActionClick} />
		);

		const button = screen.getByRole('button', { name: 'Test Action' });
		expect(button.className).toContain('border-t');
	});

	it('does not apply separator class for index 0', () => {
		const action: ActionSheetAction = { id: 'test', label: 'Test Action' };
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetActionButton action={action} index={0} onActionClick={onActionClick} />
		);

		const button = screen.getByRole('button', { name: 'Test Action' });
		// First action should not have border-t separator
		expect(button.className).not.toContain('border-t');
	});
});

describe('ActionSheetActions', () => {
	it('renders all actions', () => {
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetActions actions={TEST_ACTIONS} onActionClick={onActionClick} />
		);

		expect(screen.getByText('Edit')).toBeInTheDocument();
		expect(screen.getByText('Delete')).toBeInTheDocument();
		expect(screen.getByText('Share')).toBeInTheDocument();
	});

	it('calls onActionClick for each action', async () => {
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetActions actions={TEST_ACTIONS} onActionClick={onActionClick} />
		);

		const editButton = screen.getByText('Edit');
		fireEvent.click(editButton);

		await waitFor(() => {
			expect(onActionClick).toHaveBeenCalledWith(TEST_ACTIONS[0]);
		});
	});

	it('renders empty actions array', () => {
		const onActionClick = vi.fn();

		renderWithProviders(<ActionSheetActions actions={[]} onActionClick={onActionClick} />);

		expect(screen.queryByText('Edit')).not.toBeInTheDocument();
	});
});

describe('ActionSheetCancelButton', () => {
	it('renders cancel button with label', () => {
		const onClose = vi.fn();

		renderWithProviders(<ActionSheetCancelButton cancelLabel="Close" onClose={onClose} />);

		expect(screen.getByText('Close')).toBeInTheDocument();
	});

	it('calls onClose when clicked', () => {
		const onClose = vi.fn();

		renderWithProviders(<ActionSheetCancelButton cancelLabel="Cancel" onClose={onClose} />);

		const button = screen.getByText('Cancel');
		fireEvent.click(button);

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('ActionSheetContent', () => {
	it('renders ActionSheetContent with all props', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetContent
				id="test-id"
				title="Test Title"
				actions={TEST_ACTIONS}
				cancelLabel="Cancel"
				showCancel={true}
				onClose={onClose}
				onActionClick={onActionClick}
			/>
		);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.getByText('Edit')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	it('renders ActionSheetContent without title', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetContent
				id="test-id"
				actions={TEST_ACTIONS}
				cancelLabel="Cancel"
				showCancel={true}
				onClose={onClose}
				onActionClick={onActionClick}
			/>
		);

		expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
		expect(screen.getByText('Edit')).toBeInTheDocument();
	});

	it('renders ActionSheetContent without cancel button', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetContent
				id="test-id"
				title="Test Title"
				actions={TEST_ACTIONS}
				cancelLabel="Cancel"
				showCancel={false}
				onClose={onClose}
				onActionClick={onActionClick}
			/>
		);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
	});

	it('has proper ARIA attributes with title', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetContent
				id="test-id"
				title="Test Title"
				actions={TEST_ACTIONS}
				cancelLabel="Cancel"
				showCancel={true}
				onClose={onClose}
				onActionClick={onActionClick}
			/>
		);

		const dialog = screen.getByRole('alertdialog');
		expect(dialog).toHaveAttribute('id', 'test-id');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
		expect(dialog).toHaveAttribute('aria-labelledby', 'test-id-title');
	});

	it('has proper ARIA attributes without title', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetContent
				id="test-id"
				actions={TEST_ACTIONS}
				cancelLabel="Cancel"
				showCancel={true}
				onClose={onClose}
				onActionClick={onActionClick}
			/>
		);

		const dialog = screen.getByRole('alertdialog');
		expect(dialog).toHaveAttribute('id', 'test-id');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
		expect(dialog).not.toHaveAttribute('aria-labelledby');
	});

	it('applies custom className', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetContent
				id="test-id"
				actions={TEST_ACTIONS}
				cancelLabel="Cancel"
				showCancel={true}
				onClose={onClose}
				onActionClick={onActionClick}
				className="custom-class"
			/>
		);

		const dialog = screen.getByRole('alertdialog');
		expect(dialog).toHaveClass('custom-class');
	});

	it('applies z-index style', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();

		renderWithProviders(
			<ActionSheetContent
				id="test-id"
				actions={TEST_ACTIONS}
				cancelLabel="Cancel"
				showCancel={true}
				onClose={onClose}
				onActionClick={onActionClick}
			/>
		);

		const dialog = screen.getByRole('alertdialog');
		expect(dialog).toHaveStyle({ zIndex: expect.any(Number) });
	});
});
