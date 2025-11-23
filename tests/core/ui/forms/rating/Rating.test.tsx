/**
 * Rating Component Tests
 *
 * Tests for the Rating component including:
 * - Rendering
 * - User interactions
 * - Controlled and uncontrolled modes
 * - Read-only and disabled states
 * - Size variants
 * - Half-star support
 * - Accessibility
 * - Custom icons
 */

import Rating from '@core/ui/forms/rating/Rating';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('Rating - Rendering', () => {
	it('renders rating component', () => {
		renderWithProviders(<Rating />);

		const container = screen.getByRole('radiogroup');
		expect(container).toBeInTheDocument();
	});

	it('renders correct number of stars', () => {
		renderWithProviders(<Rating max={5} />);

		const buttons = screen.getAllByRole('radio');
		expect(buttons).toHaveLength(5);
	});

	it('renders with default max of 5', () => {
		renderWithProviders(<Rating />);

		const buttons = screen.getAllByRole('radio');
		expect(buttons).toHaveLength(5);
	});

	it('renders with custom max', () => {
		renderWithProviders(<Rating max={10} />);

		const buttons = screen.getAllByRole('radio');
		expect(buttons).toHaveLength(10);
	});
});

describe('Rating - Interactions', () => {
	it('calls onChange when star is clicked', () => {
		const onChange = vi.fn();

		renderWithProviders(<Rating onChange={onChange} />);

		const buttons = screen.getAllByRole('radio');
		expect(buttons[2]).toBeDefined();
		if (buttons[2]) {
			fireEvent.click(buttons[2]);
		}

		expect(onChange).toHaveBeenCalledWith(3);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('updates display when star is hovered', () => {
		renderWithProviders(<Rating defaultValue={2} />);

		const buttons = screen.getAllByRole('radio');
		expect(buttons[4]).toBeDefined();
		if (buttons[4]) {
			fireEvent.mouseEnter(buttons[4]);
		}

		// After hover, the 5th star should be checked
		expect(buttons[4]).toHaveAttribute('aria-checked', 'true');
	});

	it('reverts display when mouse leaves', () => {
		renderWithProviders(<Rating defaultValue={2} />);

		const buttons = screen.getAllByRole('radio');
		const container = screen.getByRole('radiogroup');

		// Hover
		expect(buttons[4]).toBeDefined();
		if (buttons[4]) {
			fireEvent.mouseEnter(buttons[4]);
			expect(buttons[4]).toHaveAttribute('aria-checked', 'true');
		}

		// Leave
		fireEvent.mouseLeave(container);
		expect(buttons[4]).toHaveAttribute('aria-checked', 'false');
		expect(buttons[1]).toHaveAttribute('aria-checked', 'true');
	});
});

describe('Rating - Controlled Mode', () => {
	it('displays controlled value', () => {
		renderWithProviders(<Rating value={3} />);

		const buttons = screen.getAllByRole('radio');
		expect(buttons[0]).toHaveAttribute('aria-checked', 'true');
		expect(buttons[1]).toHaveAttribute('aria-checked', 'true');
		expect(buttons[2]).toHaveAttribute('aria-checked', 'true');
		expect(buttons[3]).toHaveAttribute('aria-checked', 'false');
	});

	it('calls onChange in controlled mode', () => {
		const onChange = vi.fn();

		renderWithProviders(<Rating value={2} onChange={onChange} />);

		const buttons = screen.getAllByRole('radio');
		expect(buttons[3]).toBeDefined();
		if (buttons[3]) {
			fireEvent.click(buttons[3]);
		}

		expect(onChange).toHaveBeenCalledWith(4);
	});

	it('updates when controlled value changes', () => {
		const { rerender } = renderWithProviders(<Rating value={2} />);

		let buttons = screen.getAllByRole('radio');
		expect(buttons[1]).toHaveAttribute('aria-checked', 'true');

		rerender(<Rating value={4} />);

		buttons = screen.getAllByRole('radio');
		expect(buttons[3]).toHaveAttribute('aria-checked', 'true');
	});
});

describe('Rating - Uncontrolled Mode', () => {
	it('displays defaultValue', () => {
		renderWithProviders(<Rating defaultValue={3} />);

		const buttons = screen.getAllByRole('radio');
		expect(buttons[2]).toHaveAttribute('aria-checked', 'true');
	});

	it('updates internal value on click', () => {
		renderWithProviders(<Rating defaultValue={0} />);

		const buttons = screen.getAllByRole('radio');
		expect(buttons[2]).toBeDefined();
		if (buttons[2]) {
			fireEvent.click(buttons[2]);
		}

		expect(buttons[2]).toHaveAttribute('aria-checked', 'true');
	});
});

describe('Rating - Read-Only Mode', () => {
	it('renders without role="radiogroup" when readOnly', () => {
		renderWithProviders(<Rating value={3} readOnly />);

		expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
	});

	it('does not call onChange when readOnly', () => {
		const onChange = vi.fn();

		renderWithProviders(<Rating value={3} readOnly onChange={onChange} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDefined();
		if (buttons[0]) {
			fireEvent.click(buttons[0]);
		}

		expect(onChange).not.toHaveBeenCalled();
	});

	it('has aria-valuenow when readOnly', () => {
		renderWithProviders(<Rating value={3} readOnly />);

		const container = screen.getByLabelText(/rating/i);
		expect(container).toHaveAttribute('aria-valuenow', '3');
	});
});

describe('Rating - Disabled State', () => {
	it('disables all buttons when disabled', () => {
		renderWithProviders(<Rating value={3} disabled />);

		const buttons = screen.getAllByRole('radio');
		for (const button of buttons) {
			expect(button).toBeDisabled();
		}
	});

	it('does not call onChange when disabled', () => {
		const onChange = vi.fn();

		renderWithProviders(<Rating value={3} disabled onChange={onChange} />);

		const buttons = screen.getAllByRole('radio');
		expect(buttons[0]).toBeDefined();
		if (buttons[0]) {
			fireEvent.click(buttons[0]);
		}

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('Rating - Size Variants', () => {
	it('renders with sm size', () => {
		renderWithProviders(<Rating size="sm" />);

		const container = screen.getByRole('radiogroup');
		expect(container).toBeInTheDocument();
	});

	it('renders with md size', () => {
		renderWithProviders(<Rating size="md" />);

		const container = screen.getByRole('radiogroup');
		expect(container).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		renderWithProviders(<Rating size="lg" />);

		const container = screen.getByRole('radiogroup');
		expect(container).toBeInTheDocument();
	});
});

describe('Rating - Half-Star Support', () => {
	it('renders half star when allowHalf is true', () => {
		renderWithProviders(<Rating value={2.5} allowHalf />);

		const buttons = screen.getAllByRole('radio');
		expect(buttons[2]).toBeDefined();
		// Third star should have opacity for half star
		const thirdStarIcon = buttons[2]?.querySelector('svg');
		expect(thirdStarIcon).toHaveClass('opacity-disabled');
	});

	it('does not render half star when allowHalf is false', () => {
		renderWithProviders(<Rating value={2.5} allowHalf={false} />);

		const buttons = screen.getAllByRole('radio');
		// Third star should be empty
		expect(buttons[2]).toHaveAttribute('aria-checked', 'false');
	});
});

describe('Rating - Accessibility', () => {
	it('has correct ARIA attributes', () => {
		renderWithProviders(<Rating value={3} max={5} aria-label="Product Rating" />);

		const container = screen.getByLabelText('Product Rating');
		expect(container).toHaveAttribute('role', 'radiogroup');
		// aria-valuemin and aria-valuemax are not allowed on radiogroup per accessibility rules
		// They should only be present when readOnly
		expect(container).not.toHaveAttribute('aria-valuemin');
		expect(container).not.toHaveAttribute('aria-valuemax');
	});

	it('has correct ARIA attributes for read-only', () => {
		renderWithProviders(<Rating value={3} readOnly max={5} />);

		const container = screen.getByLabelText(/rating/i);
		expect(container).toHaveAttribute('aria-valuenow', '3');
		expect(container).toHaveAttribute('aria-valuemin', '0');
		expect(container).toHaveAttribute('aria-valuemax', '5');
	});

	it('passes accessibility checks', async () => {
		const { container } = renderWithProviders(<Rating value={3} aria-label="Rating" />);

		await expectA11y(container);
	});
});

describe('Rating - Custom Icons', () => {
	it('renders custom filled icon', () => {
		const customFilledIcon = <span data-testid="custom-filled">★</span>;

		renderWithProviders(<Rating value={3} filledIcon={customFilledIcon} />);

		const filledIcons = screen.getAllByTestId('custom-filled');
		expect(filledIcons).toHaveLength(3);
	});

	it('renders custom empty icon', () => {
		const customEmptyIcon = <span data-testid="custom-empty">☆</span>;

		renderWithProviders(<Rating value={2} max={5} emptyIcon={customEmptyIcon} />);

		const emptyIcons = screen.getAllByTestId('custom-empty');
		expect(emptyIcons).toHaveLength(3);
	});
});

describe('Rating - Custom ClassName', () => {
	it('applies custom className', () => {
		renderWithProviders(<Rating className="custom-rating-class" />);

		const container = screen.getByRole('radiogroup');
		expect(container).toHaveClass('custom-rating-class');
	});
});

describe('Rating - Rest Props', () => {
	it('forwards rest props to container', () => {
		renderWithProviders(<Rating data-testid="rating-component" />);

		const container = screen.getByTestId('rating-component');
		expect(container).toBeInTheDocument();
	});
});
