import ActionSheet from '@core/ui/overlays/action-sheet/ActionSheet';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Mock useTranslation
vi.mock('@core/i18n/useTranslation', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			if (key === 'cancel') {
				return 'Cancel';
			}
			return key;
		},
	}),
}));

// Mock useEscapeKey
vi.mock('@core/ui/overlays/modal/hooks/useModal', () => ({
	useEscapeKey: vi.fn(),
}));

const TEST_ACTIONS = [
	{ id: 'edit', label: 'Edit', onSelect: vi.fn() },
	{ id: 'delete', label: 'Delete', destructive: true, onSelect: vi.fn() },
	{ id: 'share', label: 'Share', icon: <span>Icon</span>, onSelect: vi.fn() },
] as const;

describe('ActionSheet - Rendering', () => {
	it('renders nothing when isOpen is false', () => {
		const onClose = vi.fn();
		renderWithProviders(<ActionSheet isOpen={false} onClose={onClose} actions={TEST_ACTIONS} />);

		expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
	});

	it('renders ActionSheet when isOpen is true', () => {
		const onClose = vi.fn();
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={TEST_ACTIONS} />);

		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it('renders ActionSheet with title', () => {
		const onClose = vi.fn();
		renderWithProviders(
			<ActionSheet
				isOpen={true}
				onClose={onClose}
				actions={TEST_ACTIONS}
				title="Choose an action"
			/>
		);

		expect(screen.getByText('Choose an action')).toBeInTheDocument();
	});

	it('renders ActionSheet without title', () => {
		const onClose = vi.fn();
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={TEST_ACTIONS} />);

		const dialog = screen.getByRole('alertdialog');
		expect(dialog).not.toHaveAttribute('aria-labelledby');
	});

	it('renders all actions', () => {
		const onClose = vi.fn();
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={TEST_ACTIONS} />);

		expect(screen.getByText('Edit')).toBeInTheDocument();
		expect(screen.getByText('Delete')).toBeInTheDocument();
		expect(screen.getByText('Share')).toBeInTheDocument();
	});

	it('renders cancel button by default', () => {
		const onClose = vi.fn();
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={TEST_ACTIONS} />);

		expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
	});

	it('does not render cancel button when showCancel is false', () => {
		const onClose = vi.fn();
		renderWithProviders(
			<ActionSheet isOpen={true} onClose={onClose} actions={TEST_ACTIONS} showCancel={false} />
		);

		expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
	});

	it('renders cancel button with custom label', () => {
		const onClose = vi.fn();
		renderWithProviders(
			<ActionSheet isOpen={true} onClose={onClose} actions={TEST_ACTIONS} cancelLabel="Close" />
		);

		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
	});

	it('renders ActionSheet with custom className', () => {
		const onClose = vi.fn();
		renderWithProviders(
			<ActionSheet
				isOpen={true}
				onClose={onClose}
				actions={TEST_ACTIONS}
				className="custom-action-sheet"
			/>
		);

		// ActionSheet is rendered in a portal (document.body)
		const actionSheet = document.body.querySelector('.custom-action-sheet');
		expect(actionSheet).toBeInTheDocument();
	});
});

describe('ActionSheet - Interactions', () => {
	it('calls onClose when cancel button is clicked', () => {
		const onClose = vi.fn();
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={TEST_ACTIONS} />);

		const cancelButton = screen.getByRole('button', { name: /cancel/i });
		fireEvent.click(cancelButton);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('calls onSelect and onClose when action is clicked', async () => {
		const onClose = vi.fn();
		const onSelect = vi.fn();
		const actions = [{ id: 'test', label: 'Test', onSelect }];
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={actions} />);

		const actionButton = screen.getByText('Test');
		fireEvent.click(actionButton);

		await waitFor(() => {
			expect(onSelect).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	it('calls onClose even when onSelect is not provided', () => {
		const onClose = vi.fn();
		const actions = [{ id: 'test', label: 'Test' }];
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={actions} />);

		const actionButton = screen.getByText('Test');
		fireEvent.click(actionButton);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('handles async onSelect', async () => {
		const onClose = vi.fn();
		const onSelect = vi.fn(async () => {
			await new Promise(resolve => setTimeout(resolve, 10));
		});
		const actions = [{ id: 'test', label: 'Test', onSelect }];
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={actions} />);

		const actionButton = screen.getByText('Test');
		fireEvent.click(actionButton);

		await waitFor(() => {
			expect(onSelect).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	it('does not call onSelect when action is disabled', () => {
		const onClose = vi.fn();
		const onSelect = vi.fn();
		const actions = [{ id: 'test', label: 'Test', disabled: true, onSelect }];
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={actions} />);

		const actionButton = screen.getByText('Test');
		fireEvent.click(actionButton);

		expect(onSelect).not.toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
	});

	it('uses useEscapeKey hook', async () => {
		const onClose = vi.fn();
		const { useEscapeKey } = await import('@core/ui/overlays/modal/hooks/useModal');
		renderWithProviders(
			<ActionSheet isOpen={true} onClose={onClose} actions={TEST_ACTIONS} closeOnEscape={true} />
		);

		expect(useEscapeKey).toHaveBeenCalled();
	});
});

describe('ActionSheet - Action Types', () => {
	it('renders action with icon', () => {
		const onClose = vi.fn();
		const actions = [{ id: 'test', label: 'Test', icon: <span data-testid="icon">Icon</span> }];
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={actions} />);

		expect(screen.getByTestId('icon')).toBeInTheDocument();
	});

	it('renders action without icon', () => {
		const onClose = vi.fn();
		const actions = [{ id: 'test', label: 'Test' }];
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={actions} />);

		expect(screen.getByText('Test')).toBeInTheDocument();
	});

	it('renders destructive action with correct styling', () => {
		const onClose = vi.fn();
		const actions = [{ id: 'delete', label: 'Delete', destructive: true }];
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={actions} />);

		const deleteButton = screen.getByRole('button', { name: 'Delete' });
		expect(deleteButton).toBeInTheDocument();
		expect(deleteButton.className).toContain('text-error');
	});

	it('renders non-destructive action with default styling', () => {
		const onClose = vi.fn();
		const actions = [{ id: 'edit', label: 'Edit', destructive: false }];
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={actions} />);

		const editButton = screen.getByText('Edit');
		expect(editButton).toBeInTheDocument();
	});
});

describe('ActionSheet - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const onClose = vi.fn();
		const { container } = renderWithProviders(
			<ActionSheet
				isOpen={true}
				onClose={onClose}
				actions={TEST_ACTIONS}
				title="Choose an action"
			/>
		);

		await expectA11y(container);
	});

	it('has proper ARIA attributes with title', () => {
		const onClose = vi.fn();
		renderWithProviders(
			<ActionSheet
				isOpen={true}
				onClose={onClose}
				actions={TEST_ACTIONS}
				title="Choose an action"
			/>
		);

		const dialog = screen.getByRole('alertdialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
		expect(dialog).toHaveAttribute('aria-labelledby');
	});

	it('has proper ARIA attributes without title', () => {
		const onClose = vi.fn();
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={TEST_ACTIONS} />);

		const dialog = screen.getByRole('alertdialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
		expect(dialog).not.toHaveAttribute('aria-labelledby');
	});

	it('uses custom actionSheetId when provided', () => {
		const onClose = vi.fn();
		renderWithProviders(
			<ActionSheet
				isOpen={true}
				onClose={onClose}
				actions={TEST_ACTIONS}
				actionSheetId="custom-id"
			/>
		);

		const dialog = screen.getByRole('alertdialog');
		expect(dialog).toHaveAttribute('id', 'custom-id');
	});

	it('generates id when actionSheetId is not provided', () => {
		const onClose = vi.fn();
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={TEST_ACTIONS} />);

		const dialog = screen.getByRole('alertdialog');
		expect(dialog).toHaveAttribute('id');
	});
});

describe('ActionSheet - Edge Cases', () => {
	it('handles empty actions array', () => {
		const onClose = vi.fn();
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={[]} />);

		const dialog = screen.getByRole('alertdialog');
		expect(dialog).toBeInTheDocument();
	});

	it('handles action with ReactNode label', () => {
		const onClose = vi.fn();
		const actions = [
			{
				id: 'test',
				label: (
					<>
						<span>Test</span> <span>Action</span>
					</>
				),
			},
		];
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={actions} />);

		expect(screen.getByText('Test')).toBeInTheDocument();
		expect(screen.getByText('Action')).toBeInTheDocument();
	});

	it('handles multiple actions with same label', () => {
		const onClose = vi.fn();
		const actions = [
			{ id: '1', label: 'Action' },
			{ id: '2', label: 'Action' },
		];
		renderWithProviders(<ActionSheet isOpen={true} onClose={onClose} actions={actions} />);

		const actionButtons = screen.getAllByText('Action');
		expect(actionButtons).toHaveLength(2);
	});
});
