import Sheet from '@core/ui/overlays/sheet/Sheet';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_TITLE = 'Test Sheet';
const SHEET_CONTENT = <p>Sheet content</p>;
const DIALOG_ROLE = 'dialog';

const renderSheet = (props?: {
	isOpen?: boolean;
	onClose?: () => void;
	title?: string;
	position?: 'left' | 'right' | 'top' | 'bottom';
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	footer?: ReactNode;
	showCloseButton?: boolean;
	closeOnOverlayClick?: boolean;
	closeOnEscape?: boolean;
	children?: ReactNode;
	sheetId?: string;
	className?: string;
	overlayClassName?: string;
}) => {
	const {
		isOpen = true,
		onClose = vi.fn(),
		title,
		children = SHEET_CONTENT,
		...rest
	} = props ?? {};

	return renderWithProviders(
		<Sheet isOpen={isOpen} onClose={onClose} {...(title !== undefined && { title })} {...rest}>
			{children}
		</Sheet>
	);
};

describe('Sheet - Rendering', () => {
	describe('Visibility', () => {
		it('renders nothing when isOpen is false', () => {
			renderSheet({ isOpen: false });

			expect(screen.queryByRole(DIALOG_ROLE)).not.toBeInTheDocument();
		});

		it('renders sheet when isOpen is true', () => {
			renderSheet({ isOpen: true });

			expect(screen.getByRole(DIALOG_ROLE)).toBeInTheDocument();
			expect(screen.getByText('Sheet content')).toBeInTheDocument();
		});
	});

	describe('Position and Size', () => {
		it('renders with default position and size', () => {
			renderSheet({});

			const sheet = screen.getByRole(DIALOG_ROLE);
			expect(sheet).toBeInTheDocument();
		});

		it('renders with custom position', () => {
			renderSheet({ position: 'left' });

			const sheet = screen.getByRole(DIALOG_ROLE);
			expect(sheet).toBeInTheDocument();
		});

		it('renders with custom size', () => {
			renderSheet({ size: 'lg' });

			const sheet = screen.getByRole(DIALOG_ROLE);
			expect(sheet).toBeInTheDocument();
		});
	});

	describe('Components', () => {
		it('renders footer when provided', () => {
			renderSheet({ footer: <button>Footer Button</button> });

			expect(screen.getByText('Footer Button')).toBeInTheDocument();
		});

		it('renders close button by default', () => {
			renderSheet({});

			const closeButton = screen.getByRole('button', { name: /close/i });
			expect(closeButton).toBeInTheDocument();
		});

		it('does not render close button when showCloseButton is false', () => {
			renderSheet({ showCloseButton: false });

			const closeButtons = screen.queryAllByRole('button', { name: /close/i });
			expect(closeButtons).toHaveLength(0);
		});

		it('renders title when provided', () => {
			renderSheet({ title: TEST_TITLE });

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
		});
	});
});

describe('Sheet - Open/Close', () => {
	describe('Close Button', () => {
		it('calls onClose when close button is clicked', () => {
			const onClose = vi.fn();
			renderSheet({ onClose });

			const closeButton = screen.getByRole('button', { name: /close/i });
			fireEvent.click(closeButton);

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('Backdrop', () => {
		it('calls onClose when backdrop is clicked and closeOnOverlayClick is true', () => {
			const onClose = vi.fn();
			renderSheet({ onClose, closeOnOverlayClick: true });

			// Find overlay by aria-hidden attribute
			const overlay = document.querySelector('[aria-hidden="true"]');
			if (overlay) {
				fireEvent.click(overlay);
				expect(onClose).toHaveBeenCalledTimes(1);
			}
		});

		it('does not call onClose when backdrop is clicked and closeOnOverlayClick is false', () => {
			const onClose = vi.fn();
			renderSheet({ onClose, closeOnOverlayClick: false });

			const overlay = document.querySelector('[aria-hidden="true"]');
			if (overlay) {
				fireEvent.click(overlay);
				expect(onClose).not.toHaveBeenCalled();
			}
		});
	});

	describe('Escape Key', () => {
		it('calls onClose when escape key is pressed and closeOnEscape is true', () => {
			const onClose = vi.fn();
			renderSheet({ onClose, closeOnEscape: true });

			fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('does not call onClose when escape key is pressed and closeOnEscape is false', () => {
			const onClose = vi.fn();
			renderSheet({ onClose, closeOnEscape: false });

			fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

			expect(onClose).not.toHaveBeenCalled();
		});

		it('closes sheet on escape key by default', () => {
			const onClose = vi.fn();
			renderSheet({ onClose });

			fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});
});

describe('Sheet - Body Overflow', () => {
	it('sets body overflow to hidden when sheet is open', () => {
		renderSheet({ isOpen: true });

		expect(document.body.style.overflow).toBe('hidden');
	});

	it('restores body overflow when sheet is closed', async () => {
		const TestComponent = () => {
			const [isOpen, setIsOpen] = useState(true);
			return (
				<div>
					<button onClick={() => setIsOpen(false)}>Close Sheet</button>
					<Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
						<p>Content</p>
					</Sheet>
				</div>
			);
		};

		renderWithProviders(<TestComponent />);

		expect(document.body.style.overflow).toBe('hidden');

		const closeButton = screen.getByText('Close Sheet');
		fireEvent.click(closeButton);

		await waitFor(() => {
			expect(document.body.style.overflow).toBe('');
		});
	});
});

describe('Sheet - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderSheet({ title: TEST_TITLE });

		await expectA11y(container);
	});

	it('has proper ARIA attributes', () => {
		renderSheet({ title: TEST_TITLE });

		const sheet = screen.getByRole(DIALOG_ROLE);
		expect(sheet).toHaveAttribute('aria-modal', 'true');
		expect(sheet).toHaveAttribute('role', 'dialog');
	});

	it('has accessible title when provided', () => {
		renderSheet({ title: TEST_TITLE });

		const sheet = screen.getByRole(DIALOG_ROLE);
		const title = screen.getByText(TEST_TITLE);
		expect(title).toBeInTheDocument();
		expect(sheet).toContainElement(title);
	});

	it('has aria-labelledby when title is provided', () => {
		renderSheet({ title: TEST_TITLE });

		const sheet = screen.getByRole(DIALOG_ROLE);
		expect(sheet).toHaveAttribute('aria-labelledby');
	});

	it('does not have aria-labelledby when title is not provided', () => {
		renderSheet({});

		const sheet = screen.getByRole(DIALOG_ROLE);
		expect(sheet).not.toHaveAttribute('aria-labelledby');
	});
});

describe('Sheet - ID Generation', () => {
	it('uses provided sheetId when given', () => {
		renderSheet({ sheetId: 'custom-sheet-id' });

		const sheet = screen.getByRole(DIALOG_ROLE);
		expect(sheet).toHaveAttribute('id', 'custom-sheet-id');
	});

	it('generates unique ID when sheetId is not provided', () => {
		renderSheet({});

		const sheet = screen.getByRole(DIALOG_ROLE);
		const id = sheet.getAttribute('id');
		expect(id).toBeTruthy();
		expect(id).toContain('sheet-');
	});
});
