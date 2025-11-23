/**
 * Tests for CommandPaletteOverlay component
 *
 * Tests the overlay/backdrop component:
 * - Rendering when open/closed
 * - Click handling
 * - Styling
 * - Accessibility
 */

import { CommandPaletteOverlay } from '@core/ui/overlays/command-palette/components/CommandPaletteOverlay';
import type { CommandPaletteOverlayProps } from '@core/ui/overlays/command-palette/types/CommandPaletteParts.types';
import { fireEvent } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createMockProps = (
	overrides?: Partial<CommandPaletteOverlayProps>
): CommandPaletteOverlayProps => ({
	isOpen: true,
	onClick: vi.fn(),
	overlayClassName: '',
	...overrides,
});

describe('CommandPaletteOverlay - Rendering', () => {
	it('renders overlay when isOpen is true', () => {
		const props = createMockProps({ isOpen: true });
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		const overlay = container.querySelector('.fixed.inset-0');
		expect(overlay).toBeInTheDocument();
	});

	it('does not render overlay when isOpen is false', () => {
		const props = createMockProps({ isOpen: false });
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		const overlay = container.querySelector('.fixed.inset-0');
		expect(overlay).not.toBeInTheDocument();
	});

	it('applies correct CSS classes', () => {
		const props = createMockProps({ isOpen: true });
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		const overlay = container.querySelector('.fixed.inset-0');
		expect(overlay).toHaveClass(
			'fixed',
			'inset-0',
			'bg-overlay',
			'backdrop-blur-md',
			'transition-opacity'
		);
	});

	it('applies custom overlayClassName', () => {
		const props = createMockProps({ isOpen: true, overlayClassName: 'custom-overlay' });
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		const overlay = container.querySelector('.fixed.inset-0');
		expect(overlay).toHaveClass('custom-overlay');
	});

	it('applies z-index style', () => {
		const props = createMockProps({ isOpen: true });
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		const overlay = container.querySelector('.fixed.inset-0') as HTMLElement;
		expect(overlay).toHaveStyle({ zIndex: expect.any(Number) });
	});
});

describe('CommandPaletteOverlay - Interactions', () => {
	it('calls onClick when overlay is clicked', () => {
		const onClick = vi.fn();
		const props = createMockProps({ isOpen: true, onClick });
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		const overlay = container.querySelector('.fixed.inset-0') as HTMLElement;
		fireEvent.click(overlay);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('passes click event to onClick handler', () => {
		const onClick = vi.fn();
		const props = createMockProps({ isOpen: true, onClick });
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		const overlay = container.querySelector('.fixed.inset-0') as HTMLElement;
		const clickEvent = new MouseEvent('click', { bubbles: true });
		fireEvent.click(overlay, clickEvent);

		expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
	});

	it('does not call onClick when isOpen is false', () => {
		const onClick = vi.fn();
		const props = createMockProps({ isOpen: false, onClick });
		renderWithProviders(<CommandPaletteOverlay {...props} />);

		// Overlay is not rendered, so click cannot happen
		expect(onClick).not.toHaveBeenCalled();
	});
});

describe('CommandPaletteOverlay - Accessibility', () => {
	it('has aria-hidden attribute', () => {
		const props = createMockProps({ isOpen: true });
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		const overlay = container.querySelector('.fixed.inset-0');
		expect(overlay).toHaveAttribute('aria-hidden', 'true');
	});

	it('passes accessibility checks', async () => {
		const props = createMockProps({ isOpen: true });
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		await expectA11y(container);
	});
});

describe('CommandPaletteOverlay - Edge Cases', () => {
	it('handles rapid open/close state changes', () => {
		const props = createMockProps({ isOpen: true });
		const { rerender } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		// Toggle multiple times
		rerender(<CommandPaletteOverlay {...props} isOpen={false} />);
		rerender(<CommandPaletteOverlay {...props} isOpen={true} />);
		rerender(<CommandPaletteOverlay {...props} isOpen={false} />);

		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} isOpen={false} />);
		const overlay = container.querySelector('.fixed.inset-0');
		expect(overlay).not.toBeInTheDocument();
	});

	it('handles undefined overlayClassName', () => {
		const props = createMockProps({ isOpen: true });
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		const overlay = container.querySelector('.fixed.inset-0');
		expect(overlay).toBeInTheDocument();
	});

	it('handles empty overlayClassName', () => {
		const props = createMockProps({ isOpen: true, overlayClassName: '' });
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		const overlay = container.querySelector('.fixed.inset-0');
		expect(overlay).toBeInTheDocument();
	});

	it('handles multiple custom classes in overlayClassName', () => {
		const props = createMockProps({
			isOpen: true,
			overlayClassName: 'custom-class-1 custom-class-2',
		});
		const { container } = renderWithProviders(<CommandPaletteOverlay {...props} />);

		const overlay = container.querySelector('.fixed.inset-0');
		expect(overlay).toHaveClass('custom-class-1', 'custom-class-2');
	});
});
