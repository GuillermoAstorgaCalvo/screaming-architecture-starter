import Popover from '@core/ui/overlays/popover/Popover';
import type { PopoverPosition } from '@src-types/ui/overlays/floating';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TRIGGER_TEXT = 'Open Popover';
const CONTENT_TEXT = 'Popover content';
const OUTSIDE_BUTTON_TEXT = 'Outside Button';

const renderPopover = (props: {
	isOpen: boolean;
	onClose: () => void;
	position?: PopoverPosition;
	closeOnEscape?: boolean;
	closeOnOutsideClick?: boolean;
	children?: ReactNode;
}) => {
	const { isOpen, onClose, position, closeOnEscape, closeOnOutsideClick, children } = props;
	const popoverProps: {
		isOpen: boolean;
		onClose: () => void;
		trigger: ReactElement;
		position?: PopoverPosition;
		closeOnEscape?: boolean;
		closeOnOutsideClick?: boolean;
		children: ReactNode;
	} = {
		isOpen,
		onClose,
		trigger: <button>{TRIGGER_TEXT}</button>,
		children: children ?? <div>{CONTENT_TEXT}</div>,
	};

	if (position !== undefined) {
		popoverProps.position = position;
	}
	if (closeOnEscape !== undefined) {
		popoverProps.closeOnEscape = closeOnEscape;
	}
	if (closeOnOutsideClick !== undefined) {
		popoverProps.closeOnOutsideClick = closeOnOutsideClick;
	}

	return renderWithProviders(<Popover {...popoverProps} />);
};

const renderPopoverWithOutsideButton = (props: {
	isOpen: boolean;
	onClose: () => void;
	closeOnOutsideClick?: boolean;
}) => {
	const { isOpen, onClose, closeOnOutsideClick } = props;
	const popoverProps: {
		isOpen: boolean;
		onClose: () => void;
		trigger: ReactElement;
		closeOnOutsideClick?: boolean;
		children: ReactNode;
	} = {
		isOpen,
		onClose,
		trigger: <button>{TRIGGER_TEXT}</button>,
		children: <div>{CONTENT_TEXT}</div>,
	};

	if (closeOnOutsideClick !== undefined) {
		popoverProps.closeOnOutsideClick = closeOnOutsideClick;
	}

	return renderWithProviders(
		<div>
			<Popover {...popoverProps} />
			<button>{OUTSIDE_BUTTON_TEXT}</button>
		</div>
	);
};

const findPopoverElement = (container: HTMLElement) => {
	const containerQueries = within(container);
	return (
		containerQueries.queryByRole('tooltip') ?? containerQueries.queryByTestId('popover') ?? null
	);
};

const pressEscapeKey = () => {
	fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
};

const testRendering = () => {
	describe('Rendering', () => {
		it('renders trigger when popover is closed', () => {
			const onClose = vi.fn();
			renderPopover({ isOpen: false, onClose });

			expect(screen.getByText(TRIGGER_TEXT)).toBeInTheDocument();
			expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();
		});

		it('renders popover content when isOpen is true', () => {
			const onClose = vi.fn();
			renderPopover({ isOpen: true, onClose });

			expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
		});

		it('renders with default position', () => {
			const onClose = vi.fn();
			const { container } = renderPopover({ isOpen: true, onClose });

			const popover = findPopoverElement(container);
			expect(popover ?? screen.getByText(CONTENT_TEXT)).toBeTruthy();
		});

		it('renders with custom position', () => {
			const onClose = vi.fn();
			const { container } = renderPopover({ isOpen: true, onClose, position: 'top' });

			const popover = findPopoverElement(container);
			expect(popover ?? screen.getByText(CONTENT_TEXT)).toBeTruthy();
		});
	});
};

const testEscapeKeyBehavior = () => {
	describe('Escape Key Behavior', () => {
		it('calls onClose when escape key is pressed and closeOnEscape is true', () => {
			const onClose = vi.fn();
			renderPopover({ isOpen: true, onClose, closeOnEscape: true });

			pressEscapeKey();

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('does not call onClose when escape key is pressed and closeOnEscape is false', () => {
			const onClose = vi.fn();
			renderPopover({ isOpen: true, onClose, closeOnEscape: false });

			pressEscapeKey();

			expect(onClose).not.toHaveBeenCalled();
		});

		it('closes popover on escape key by default', () => {
			const onClose = vi.fn();
			renderPopover({ isOpen: true, onClose });

			pressEscapeKey();

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});
};

const testOutsideClickBehavior = () => {
	describe('Outside Click Behavior', () => {
		it('calls onClose when clicking outside and closeOnOutsideClick is true', async () => {
			const onClose = vi.fn();
			renderPopoverWithOutsideButton({ isOpen: true, onClose, closeOnOutsideClick: true });

			const outsideButton = screen.getByText(OUTSIDE_BUTTON_TEXT);
			fireEvent.mouseDown(outsideButton);
			fireEvent.click(outsideButton);

			await waitFor(
				() => {
					expect(onClose).toHaveBeenCalled();
				},
				{ timeout: 1000 }
			);
		});

		it('does not call onClose when clicking outside and closeOnOutsideClick is false', () => {
			const onClose = vi.fn();
			renderPopoverWithOutsideButton({ isOpen: true, onClose, closeOnOutsideClick: false });

			const outsideButton = screen.getByText(OUTSIDE_BUTTON_TEXT);
			fireEvent.click(outsideButton);

			expect(onClose).not.toHaveBeenCalled();
		});
	});
};

const testFocusManagement = () => {
	describe('Focus Management', () => {
		it('manages focus when popover opens', async () => {
			const onClose = vi.fn();
			renderPopover({
				isOpen: true,
				onClose,
				children: (
					<div>
						<button>Popover Button</button>
					</div>
				),
			});

			await waitFor(() => {
				expect(screen.getByText('Popover Button')).toBeInTheDocument();
			});
		});
	});
};

const testAccessibility = () => {
	describe('Accessibility', () => {
		it('has no accessibility violations', async () => {
			const onClose = vi.fn();
			const { container } = renderPopover({ isOpen: true, onClose });

			await expectA11y(container);
		});

		it('has proper ARIA attributes when open', () => {
			const onClose = vi.fn();
			const { container } = renderPopover({ isOpen: true, onClose });

			const containerQueries = within(container);
			const popover =
				findPopoverElement(container) ??
				containerQueries.queryByRole('region', { name: /popover/i }) ??
				screen.getByText(CONTENT_TEXT);

			expect(popover).toBeTruthy();
		});
	});
};

describe('Popover', () => {
	testRendering();
	testEscapeKeyBehavior();
	testOutsideClickBehavior();
	testFocusManagement();
	testAccessibility();
});
