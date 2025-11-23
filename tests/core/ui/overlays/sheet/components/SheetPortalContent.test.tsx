import { SheetPortalContent } from '@core/ui/overlays/sheet/components/SheetPortalContent';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { MouseEvent, RefObject } from 'react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_TITLE = 'Test Sheet Portal';
const DIALOG_ROLE = 'dialog';

const createMockHandleOverlayClick = () => {
	return vi.fn((e: MouseEvent<HTMLDivElement>, closeOnOverlayClick: boolean) => {
		if (closeOnOverlayClick && e.target === e.currentTarget) {
			// Mock implementation
		}
	});
};

const renderSheetPortalContent = (props?: {
	id?: string;
	sheetRef?: RefObject<HTMLDivElement | null>;
	position?: 'left' | 'right' | 'top' | 'bottom';
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	isOpen?: boolean;
	title?: string;
	showCloseButton?: boolean;
	onClose?: () => void;
	footer?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
	overlayClassName?: string;
	handleOverlayClick?: (e: MouseEvent<HTMLDivElement>, closeOnOverlayClick: boolean) => void;
	closeOnOverlayClick?: boolean;
}) => {
	const {
		id = 'test-sheet',
		sheetRef = createRef<HTMLDivElement>(),
		position = 'right',
		size = 'md',
		isOpen = true,
		showCloseButton = true,
		onClose = vi.fn(),
		children = <p>Sheet portal content</p>,
		handleOverlayClick = createMockHandleOverlayClick(),
		closeOnOverlayClick = true,
		...rest
	} = props ?? {};

	return renderWithProviders(
		<SheetPortalContent
			id={id}
			sheetRef={sheetRef}
			position={position}
			size={size}
			isOpen={isOpen}
			showCloseButton={showCloseButton}
			onClose={onClose}
			handleOverlayClick={handleOverlayClick}
			closeOnOverlayClick={closeOnOverlayClick}
			{...rest}
		>
			{children}
		</SheetPortalContent>
	);
};

describe('SheetPortalContent - Rendering', () => {
	it('renders both overlay and dialog', () => {
		renderSheetPortalContent({});

		const overlay = document.querySelector('[aria-hidden="true"]');
		const dialog = screen.getByRole(DIALOG_ROLE);

		expect(overlay).toBeInTheDocument();
		expect(dialog).toBeInTheDocument();
	});

	it('renders dialog with correct props', () => {
		renderSheetPortalContent({ title: TEST_TITLE });

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toBeInTheDocument();
		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
	});

	it('renders overlay with correct props', () => {
		renderSheetPortalContent({ isOpen: true });

		const overlay = document.querySelector('[aria-hidden="true"]');
		expect(overlay).toBeInTheDocument();
		expect(overlay).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders children content', () => {
		renderSheetPortalContent({ children: <div>Custom Content</div> });

		expect(screen.getByText('Custom Content')).toBeInTheDocument();
	});

	it('renders footer when provided', () => {
		renderSheetPortalContent({ footer: <button>Footer Button</button> });

		expect(screen.getByText('Footer Button')).toBeInTheDocument();
	});
});

describe('SheetPortalContent - Overlay Click Handling', () => {
	it('calls handleOverlayClick when overlay is clicked', () => {
		const handleOverlayClick = createMockHandleOverlayClick();
		renderSheetPortalContent({ handleOverlayClick, closeOnOverlayClick: true });

		const overlay = document.querySelector('[aria-hidden="true"]');
		if (overlay) {
			fireEvent.click(overlay);
			expect(handleOverlayClick).toHaveBeenCalled();
		}
	});

	it('passes closeOnOverlayClick to handleOverlayClick', () => {
		const handleOverlayClick = createMockHandleOverlayClick();
		renderSheetPortalContent({ handleOverlayClick, closeOnOverlayClick: true });

		const overlay = document.querySelector('[aria-hidden="true"]');
		if (overlay) {
			fireEvent.click(overlay);
			expect(handleOverlayClick).toHaveBeenCalledWith(expect.any(Object), true);
		}
	});

	it('passes false closeOnOverlayClick when set to false', () => {
		const handleOverlayClick = createMockHandleOverlayClick();
		renderSheetPortalContent({ handleOverlayClick, closeOnOverlayClick: false });

		const overlay = document.querySelector('[aria-hidden="true"]');
		if (overlay) {
			fireEvent.click(overlay);
			expect(handleOverlayClick).toHaveBeenCalledWith(expect.any(Object), false);
		}
	});
});

describe('SheetPortalContent - Overlay Classes', () => {
	it('applies overlay classes based on isOpen', () => {
		const { rerender } = renderSheetPortalContent({ isOpen: true });

		let overlay = document.querySelector('[aria-hidden="true"]');
		expect(overlay?.className).toContain('opacity-100');

		rerender(
			<SheetPortalContent
				id="test-sheet"
				sheetRef={createRef<HTMLDivElement>()}
				position="right"
				size="md"
				isOpen={false}
				showCloseButton={true}
				onClose={vi.fn()}
				handleOverlayClick={createMockHandleOverlayClick()}
				closeOnOverlayClick={true}
			>
				<p>Content</p>
			</SheetPortalContent>
		);

		overlay = document.querySelector('[aria-hidden="true"]');
		expect(overlay?.className).toContain('opacity-0');
		expect(overlay?.className).toContain('pointer-events-none');
	});

	it('applies custom overlayClassName when provided', () => {
		renderSheetPortalContent({ overlayClassName: 'custom-overlay' });

		const overlay = document.querySelector('[aria-hidden="true"]');
		expect(overlay?.className).toContain('custom-overlay');
	});

	it('omits overlayClassName when undefined', () => {
		renderSheetPortalContent({});

		const overlay = document.querySelector('[aria-hidden="true"]');
		expect(overlay).toBeInTheDocument();
	});
});

describe('SheetPortalContent - Dialog Props', () => {
	it('passes all dialog props correctly', () => {
		const onClose = vi.fn();
		renderSheetPortalContent({
			id: 'custom-id',
			title: TEST_TITLE,
			showCloseButton: true,
			onClose,
			footer: <div>Footer</div>,
			className: 'custom-class',
		});

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toHaveAttribute('id', 'custom-id');
		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
		expect(screen.getByText('Footer')).toBeInTheDocument();
	});

	it('omits optional props when undefined', () => {
		renderSheetPortalContent({});

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toBeInTheDocument();
		expect(screen.queryByText(TEST_TITLE)).not.toBeInTheDocument();
	});
});

describe('SheetPortalContent - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderSheetPortalContent({ title: TEST_TITLE });

		await expectA11y(container);
	});

	it('overlay has aria-hidden attribute', () => {
		renderSheetPortalContent({});

		const overlay = document.querySelector('[aria-hidden="true"]');
		expect(overlay).toHaveAttribute('aria-hidden', 'true');
	});

	it('dialog has proper ARIA attributes', () => {
		renderSheetPortalContent({ title: TEST_TITLE });

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toHaveAttribute('role', 'dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
	});
});

describe('SheetPortalContent - Position and Size', () => {
	it('handles all position variants', () => {
		const positions: Array<'left' | 'right' | 'top' | 'bottom'> = [
			'left',
			'right',
			'top',
			'bottom',
		];

		for (const position of positions) {
			const { unmount } = renderSheetPortalContent({ position });
			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toBeInTheDocument();
			unmount();
		}
	});

	it('handles all size variants', () => {
		const sizes: Array<'sm' | 'md' | 'lg' | 'xl' | 'full'> = ['sm', 'md', 'lg', 'xl', 'full'];

		for (const size of sizes) {
			const { unmount } = renderSheetPortalContent({ size });
			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toBeInTheDocument();
			unmount();
		}
	});
});
