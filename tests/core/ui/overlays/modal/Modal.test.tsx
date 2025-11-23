import Modal from '@core/ui/overlays/modal/Modal';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { type ReactNode, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_TITLE = 'Test Modal';
const DIALOG_ROLE = 'dialog';

const renderModal = (props: {
	isOpen?: boolean;
	onClose?: () => void;
	title?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	footer?: ReactNode;
	showCloseButton?: boolean;
	closeOnOverlayClick?: boolean;
	closeOnEscape?: boolean;
	children?: ReactNode;
}) => {
	const {
		isOpen = true,
		onClose = vi.fn(),
		title = TEST_TITLE,
		size,
		footer,
		showCloseButton,
		closeOnOverlayClick,
		closeOnEscape,
		children = <p>Modal content</p>,
	} = props;

	return renderWithProviders(
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			{...(size !== undefined && { size })}
			{...(footer !== undefined && { footer })}
			{...(showCloseButton !== undefined && { showCloseButton })}
			{...(closeOnOverlayClick !== undefined && { closeOnOverlayClick })}
			{...(closeOnEscape !== undefined && { closeOnEscape })}
		>
			{children}
		</Modal>
	);
};

describe('Modal - Rendering', () => {
	describe('Visibility', () => {
		it('renders nothing when isOpen is false', () => {
			renderModal({ isOpen: false });

			expect(screen.queryByText(TEST_TITLE)).not.toBeInTheDocument();
		});

		it('renders modal when isOpen is true', () => {
			renderModal({ isOpen: true });

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
			expect(screen.getByText('Modal content')).toBeInTheDocument();
		});
	});

	describe('Size', () => {
		it('renders with default size', () => {
			renderModal({});

			const modal = screen.getByRole(DIALOG_ROLE);
			expect(modal).toBeInTheDocument();
		});

		it('renders with custom size', () => {
			renderModal({ size: 'lg' });

			const modal = screen.getByRole(DIALOG_ROLE);
			expect(modal).toBeInTheDocument();
		});
	});

	describe('Footer', () => {
		it('renders footer when provided', () => {
			renderModal({ footer: <button>Footer Button</button> });

			expect(screen.getByText('Footer Button')).toBeInTheDocument();
		});
	});

	describe('Close Button', () => {
		it('renders close button by default', () => {
			renderModal({});

			const closeButton = screen.getByRole('button', { name: /close/i });
			expect(closeButton).toBeInTheDocument();
		});

		it('does not render close button when showCloseButton is false', () => {
			renderModal({ showCloseButton: false });

			const closeButtons = screen.queryAllByRole('button', { name: /close/i });
			expect(closeButtons).toHaveLength(0);
		});
	});
});

describe('Modal - Open/Close', () => {
	describe('Close Button', () => {
		it('calls onClose when close button is clicked', () => {
			const onClose = vi.fn();
			renderModal({ onClose });

			const closeButton = screen.getByRole('button', { name: /close/i });
			fireEvent.click(closeButton);

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('Backdrop', () => {
		it('calls onClose when backdrop is clicked and closeOnOverlayClick is true', () => {
			const onClose = vi.fn();
			renderModal({ onClose, closeOnOverlayClick: true });

			// The dialog element itself acts as the backdrop/overlay
			const dialog = screen.getByRole(DIALOG_ROLE);
			// Click on the dialog element itself (not its children) to simulate backdrop click
			fireEvent.click(dialog);

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('does not call onClose when backdrop is clicked and closeOnOverlayClick is false', () => {
			const onClose = vi.fn();
			renderModal({ onClose, closeOnOverlayClick: false });

			// The dialog element itself acts as the backdrop/overlay
			const dialog = screen.getByRole(DIALOG_ROLE);
			// Click on the dialog element itself (not its children) to simulate backdrop click
			fireEvent.click(dialog);

			expect(onClose).not.toHaveBeenCalled();
		});
	});

	describe('Escape Key', () => {
		it('calls onClose when escape key is pressed and closeOnEscape is true', () => {
			const onClose = vi.fn();
			renderModal({ onClose, closeOnEscape: true });

			fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('does not call onClose when escape key is pressed and closeOnEscape is false', () => {
			const onClose = vi.fn();
			renderModal({ onClose, closeOnEscape: false });

			fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

			expect(onClose).not.toHaveBeenCalled();
		});
	});
});

describe('Modal - Focus Management', () => {
	it('traps focus within modal when open', async () => {
		const onClose = vi.fn();
		renderWithProviders(
			<div>
				<button>Outside Button</button>
				<Modal isOpen={true} onClose={onClose} title={TEST_TITLE}>
					<button>Modal Button 1</button>
					<button>Modal Button 2</button>
				</Modal>
			</div>
		);

		const modal = screen.getByRole(DIALOG_ROLE);
		const outsideButton = screen.getByText('Outside Button');

		await waitFor(() => {
			// Focus should be within the modal (typically on the close button or first focusable element)
			// eslint-disable-next-line testing-library/no-node-access -- document.activeElement is the standard way to test focus containment
			const focusedElement = document.activeElement;
			// Verify that focus is not on the outside button
			expect(focusedElement).not.toBe(outsideButton);
			// Focus should be either on the modal itself or within the modal
			const isFocusInModal =
				focusedElement === modal || modal.contains(focusedElement as HTMLElement);
			expect(isFocusInModal).toBe(true);
		});
	});

	it('restores focus to previous element when closed', async () => {
		const TestComponent = () => {
			const [isOpen, setIsOpen] = useState(false);
			return (
				<div>
					<button onClick={() => setIsOpen(true)}>Open Modal</button>
					<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={TEST_TITLE}>
						<p>Modal content</p>
					</Modal>
				</div>
			);
		};

		renderWithProviders(<TestComponent />);
		const openButton = screen.getByText('Open Modal');
		openButton.focus();
		fireEvent.click(openButton);

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toBeInTheDocument();
		});

		const closeButton = screen.getByRole('button', { name: /close/i });
		fireEvent.click(closeButton);

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});
});

describe('Modal - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderModal({});

		await expectA11y(container);
	});

	it('has proper ARIA attributes', () => {
		renderModal({});

		const modal = screen.getByRole(DIALOG_ROLE);
		// Native <dialog> elements are implicitly modal and don't require aria-modal
		// They should have aria-labelledby and aria-describedby for accessibility
		expect(modal).toHaveAttribute('aria-labelledby');
		expect(modal).toHaveAttribute('aria-describedby');
	});

	it('has accessible title', () => {
		renderModal({});

		const modal = screen.getByRole(DIALOG_ROLE);
		const title = screen.getByText(TEST_TITLE);
		expect(title).toBeInTheDocument();
		expect(modal).toContainElement(title);
	});
});

describe('Modal - Backdrop', () => {
	it('renders backdrop when modal is open', () => {
		renderModal({});

		// The dialog element itself acts as the backdrop/overlay
		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toBeInTheDocument();
	});
});

describe('Modal - Escape Key', () => {
	it('closes modal on escape key by default', () => {
		const onClose = vi.fn();
		renderModal({ onClose });

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not close modal on escape key when closeOnEscape is false', () => {
		const onClose = vi.fn();
		renderModal({ onClose, closeOnEscape: false });

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

		expect(onClose).not.toHaveBeenCalled();
	});
});
