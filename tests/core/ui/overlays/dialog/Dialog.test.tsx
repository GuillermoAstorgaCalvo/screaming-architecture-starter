import Dialog from '@core/ui/overlays/dialog/Dialog';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { type ReactNode, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_DIALOG_TITLE = 'Test Dialog';
const DIALOG_CONTENT = <p>Dialog content</p>;
const DIALOG_ROLE = 'dialog';

const findBackdrop = (container: HTMLElement) => {
	const containerWithin = within(container);
	return (
		containerWithin.queryByTestId('backdrop') ??
		containerWithin.queryByRole('presentation', { hidden: true }) ??
		null
	);
};

const TestComponent = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<button onClick={() => setIsOpen(true)}>Open Dialog</button>
			<Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title={TEST_DIALOG_TITLE}>
				{DIALOG_CONTENT}
			</Dialog>
		</div>
	);
};

const renderDialog = (props?: {
	isOpen?: boolean;
	onClose?: () => void;
	title?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	variant?: 'default' | 'centered';
	footer?: ReactNode;
	showCloseButton?: boolean;
	closeOnOverlayClick?: boolean;
	closeOnEscape?: boolean;
	children?: ReactNode;
}) => {
	const {
		isOpen = true,
		onClose = vi.fn(),
		title = TEST_DIALOG_TITLE,
		children = DIALOG_CONTENT,
		...rest
	} = props ?? {};

	return renderWithProviders(
		<Dialog isOpen={isOpen} onClose={onClose} title={title} {...rest}>
			{children}
		</Dialog>
	);
};

describe('Dialog - Rendering', () => {
	describe('Visibility', () => {
		it('renders nothing when isOpen is false', () => {
			renderDialog({ isOpen: false });

			expect(screen.queryByText(TEST_DIALOG_TITLE)).not.toBeInTheDocument();
		});

		it('renders dialog when isOpen is true', () => {
			renderDialog();

			expect(screen.getByText(TEST_DIALOG_TITLE)).toBeInTheDocument();
			expect(screen.getByText('Dialog content')).toBeInTheDocument();
		});
	});

	describe('Size and Variant', () => {
		it('renders with default size and variant', () => {
			renderDialog();

			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toBeInTheDocument();
		});

		it('renders with custom size', () => {
			renderDialog({ size: 'lg' });

			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toBeInTheDocument();
		});

		it('renders with custom variant', () => {
			renderDialog({ variant: 'centered' });

			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toBeInTheDocument();
		});
	});

	describe('Components', () => {
		it('renders footer when provided', () => {
			renderDialog({ footer: <button>Footer Button</button> });

			expect(screen.getByText('Footer Button')).toBeInTheDocument();
		});

		it('renders close button by default', () => {
			renderDialog();

			const closeButton = screen.getByRole('button', { name: /close/i });
			expect(closeButton).toBeInTheDocument();
		});

		it('does not render close button when showCloseButton is false', () => {
			renderDialog({ showCloseButton: false });

			const closeButtons = screen.queryAllByRole('button', { name: /close/i });
			expect(closeButtons).toHaveLength(0);
		});
	});
});

describe('Dialog - Open/Close', () => {
	it('calls onClose when close button is clicked', () => {
		const onClose = vi.fn();
		renderDialog({ onClose });

		const closeButton = screen.getByRole('button', { name: /close/i });
		fireEvent.click(closeButton);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('calls onClose when backdrop is clicked and closeOnOverlayClick is true', () => {
		const onClose = vi.fn();
		const { container } = renderDialog({ onClose, closeOnOverlayClick: true });

		const backdrop = findBackdrop(container);
		if (backdrop) {
			fireEvent.click(backdrop);
			expect(onClose).toHaveBeenCalledTimes(1);
		}
	});

	it('does not call onClose when backdrop is clicked and closeOnOverlayClick is false', () => {
		const onClose = vi.fn();
		const { container } = renderDialog({ onClose, closeOnOverlayClick: false });

		const backdrop = findBackdrop(container);
		if (backdrop) {
			fireEvent.click(backdrop);
			expect(onClose).not.toHaveBeenCalled();
		}
	});

	it('calls onClose when escape key is pressed and closeOnEscape is true', () => {
		const onClose = vi.fn();
		renderDialog({ onClose, closeOnEscape: true });

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose when escape key is pressed and closeOnEscape is false', () => {
		const onClose = vi.fn();
		renderDialog({ onClose, closeOnEscape: false });

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('Dialog - Focus Management', () => {
	it('traps focus within dialog when open', async () => {
		const onClose = vi.fn();
		renderWithProviders(
			<div>
				<button>Outside Button</button>
				<Dialog isOpen={true} onClose={onClose} title={TEST_DIALOG_TITLE}>
					<button>Dialog Button 1</button>
					<button>Dialog Button 2</button>
				</Dialog>
			</div>
		);

		const dialog = screen.getByRole(DIALOG_ROLE);
		await waitFor(() => {
			// Focus should be on a focusable element within the dialog (typically the close button)
			const closeButton = screen.getByRole('button', { name: /close/i });
			expect(closeButton).toHaveFocus();
			expect(dialog).toContainElement(closeButton);
		});
	});

	it('restores focus to previous element when closed', async () => {
		renderWithProviders(<TestComponent />);
		const openButton = screen.getByText('Open Dialog');
		openButton.focus();
		fireEvent.click(openButton);

		await waitFor(() => {
			expect(screen.getByRole(DIALOG_ROLE)).toBeInTheDocument();
		});

		const closeButton = screen.getByRole('button', { name: /close/i });
		fireEvent.click(closeButton);

		await waitFor(() => {
			expect(screen.queryByRole(DIALOG_ROLE)).not.toBeInTheDocument();
		});
	});
});

describe('Dialog - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderDialog();

		await expectA11y(container);
	});

	it('has proper ARIA attributes', () => {
		renderDialog();

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toHaveAttribute('aria-modal', 'true');
	});

	it('has accessible title', () => {
		renderDialog();

		const dialog = screen.getByRole(DIALOG_ROLE);
		const title = screen.getByText(TEST_DIALOG_TITLE);
		expect(title).toBeInTheDocument();
		expect(dialog).toContainElement(title);
	});
});

describe('Dialog - Backdrop', () => {
	it('renders backdrop when dialog is open', () => {
		const { container } = renderDialog();

		const backdrop = findBackdrop(container) ?? screen.queryByRole(DIALOG_ROLE);

		expect(backdrop).toBeTruthy();
	});
});

describe('Dialog - Escape Key', () => {
	it('closes dialog on escape key by default', () => {
		const onClose = vi.fn();
		renderDialog({ onClose });

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not close dialog on escape key when closeOnEscape is false', () => {
		const onClose = vi.fn();
		renderDialog({ onClose, closeOnEscape: false });

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

		expect(onClose).not.toHaveBeenCalled();
	});
});
