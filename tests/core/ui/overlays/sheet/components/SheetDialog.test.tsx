import { SheetDialog } from '@core/ui/overlays/sheet/components/SheetDialog';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode, RefObject } from 'react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_TITLE = 'Test Sheet Dialog';
const DIALOG_ROLE = 'dialog';

const renderSheetDialog = (props?: {
	id?: string;
	sheetRef?: RefObject<HTMLDivElement | null>;
	position?: 'left' | 'right' | 'top' | 'bottom';
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	isOpen?: boolean;
	title?: string;
	showCloseButton?: boolean;
	onClose?: () => void;
	footer?: ReactNode;
	children?: ReactNode;
	className?: string;
}) => {
	const {
		id = 'test-sheet',
		sheetRef = createRef<HTMLDivElement>(),
		position = 'right',
		size = 'md',
		isOpen = true,
		showCloseButton = true,
		onClose = vi.fn(),
		children = <p>Sheet dialog content</p>,
		...rest
	} = props ?? {};

	return renderWithProviders(
		<SheetDialog
			id={id}
			sheetRef={sheetRef}
			position={position}
			size={size}
			isOpen={isOpen}
			showCloseButton={showCloseButton}
			onClose={onClose}
			{...rest}
		>
			{children}
		</SheetDialog>
	);
};

describe('SheetDialog - Rendering', () => {
	it('renders dialog with correct role and attributes', () => {
		renderSheetDialog({ title: TEST_TITLE });

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toBeInTheDocument();
		expect(dialog).toHaveAttribute('role', 'dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
	});

	it('renders with provided id', () => {
		renderSheetDialog({ id: 'custom-id' });

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toHaveAttribute('id', 'custom-id');
	});

	it('renders title when provided', () => {
		renderSheetDialog({ title: TEST_TITLE });

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
	});

	it('does not render title when not provided', () => {
		renderSheetDialog({});

		expect(screen.queryByText(TEST_TITLE)).not.toBeInTheDocument();
	});

	it('renders close button when showCloseButton is true', () => {
		renderSheetDialog({ showCloseButton: true });

		const closeButton = screen.getByRole('button', { name: /close/i });
		expect(closeButton).toBeInTheDocument();
	});

	it('does not render close button when showCloseButton is false', () => {
		renderSheetDialog({ showCloseButton: false });

		const closeButtons = screen.queryAllByRole('button', { name: /close/i });
		expect(closeButtons).toHaveLength(0);
	});

	it('renders footer when provided', () => {
		renderSheetDialog({ footer: <button>Footer Button</button> });

		expect(screen.getByText('Footer Button')).toBeInTheDocument();
	});

	it('does not render footer when not provided', () => {
		renderSheetDialog({});

		expect(screen.queryByText('Footer Button')).not.toBeInTheDocument();
	});

	it('renders children content', () => {
		renderSheetDialog({ children: <div>Custom Content</div> });

		expect(screen.getByText('Custom Content')).toBeInTheDocument();
	});

	it('applies className when provided', () => {
		renderSheetDialog({ className: 'custom-class' });

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog.className).toContain('custom-class');
	});
});

describe('SheetDialog - ARIA Attributes', () => {
	it('has aria-labelledby when title is provided', () => {
		renderSheetDialog({ id: 'test-sheet', title: TEST_TITLE });

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toHaveAttribute('aria-labelledby', 'test-sheet-title');
	});

	it('does not have aria-labelledby when title is not provided', () => {
		renderSheetDialog({ id: 'test-sheet' });

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).not.toHaveAttribute('aria-labelledby');
	});

	it('has correct title id format', () => {
		renderSheetDialog({ id: 'my-sheet', title: TEST_TITLE });

		const title = screen.getByText(TEST_TITLE);
		expect(title).toHaveAttribute('id', 'my-sheet-title');
	});
});

describe('SheetDialog - Interactions', () => {
	it('calls onClose when close button is clicked', () => {
		const onClose = vi.fn();
		renderSheetDialog({ onClose, showCloseButton: true });

		const closeButton = screen.getByRole('button', { name: /close/i });
		fireEvent.click(closeButton);

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('SheetDialog - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderSheetDialog({ title: TEST_TITLE });

		await expectA11y(container);
	});

	it('has proper dialog structure', () => {
		renderSheetDialog({ title: TEST_TITLE, footer: <div>Footer</div> });

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
		expect(screen.getByText('Footer')).toBeInTheDocument();
	});
});

describe('SheetDialog - Position and Size Classes', () => {
	it('applies classes for different positions', () => {
		const positions: Array<'left' | 'right' | 'top' | 'bottom'> = [
			'left',
			'right',
			'top',
			'bottom',
		];

		for (const position of positions) {
			const { unmount } = renderSheetDialog({ position });
			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog.className).toBeTruthy();
			unmount();
		}
	});

	it('applies classes for different sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg' | 'xl' | 'full'> = ['sm', 'md', 'lg', 'xl', 'full'];

		for (const size of sizes) {
			const { unmount } = renderSheetDialog({ size });
			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog.className).toBeTruthy();
			unmount();
		}
	});

	it('applies transform classes based on isOpen state', () => {
		const { rerender } = renderSheetDialog({ isOpen: true });
		const dialog1 = screen.getByRole(DIALOG_ROLE);
		const classes1 = dialog1.className;

		rerender(
			<SheetDialog
				id="test-sheet"
				sheetRef={createRef<HTMLDivElement>()}
				position="right"
				size="md"
				isOpen={false}
				showCloseButton={true}
				onClose={vi.fn()}
			>
				<p>Content</p>
			</SheetDialog>
		);

		const dialog2 = screen.getByRole(DIALOG_ROLE);
		const classes2 = dialog2.className;

		// Classes should differ based on open state
		expect(classes1).not.toBe(classes2);
	});
});
