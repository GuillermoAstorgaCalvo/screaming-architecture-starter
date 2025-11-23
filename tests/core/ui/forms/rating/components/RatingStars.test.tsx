/**
 * RatingStars Component Tests
 *
 * Tests for the RatingStars component including:
 * - Rendering correct number of stars
 * - Fill calculation
 * - Half-star support
 * - Click and hover handling
 * - Size variants
 * - Read-only and disabled states
 */

import { RatingStars } from '@core/ui/forms/rating/components/RatingStars';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('RatingStars - Rendering', () => {
	it('renders correct number of stars', () => {
		renderWithProviders(
			<RatingStars
				max={5}
				displayValue={3}
				allowHalf={false}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		expect(buttons).toHaveLength(5);
	});

	it('renders correct number of stars for custom max', () => {
		renderWithProviders(
			<RatingStars
				max={10}
				displayValue={5}
				allowHalf={false}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		expect(buttons).toHaveLength(10);
	});
});

describe('RatingStars - Fill States', () => {
	it('renders filled stars correctly', () => {
		renderWithProviders(
			<RatingStars
				max={5}
				displayValue={3}
				allowHalf={false}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		// First 3 stars should be filled
		expect(buttons[0]).toHaveAttribute('aria-checked', 'true');
		expect(buttons[1]).toHaveAttribute('aria-checked', 'true');
		expect(buttons[2]).toHaveAttribute('aria-checked', 'true');
		// Last 2 stars should be empty
		expect(buttons[3]).toHaveAttribute('aria-checked', 'false');
		expect(buttons[4]).toHaveAttribute('aria-checked', 'false');
	});

	it('renders empty stars when displayValue is 0', () => {
		renderWithProviders(
			<RatingStars
				max={5}
				displayValue={0}
				allowHalf={false}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		for (const button of buttons) {
			expect(button).toHaveAttribute('aria-checked', 'false');
		}
	});

	it('renders all filled stars when displayValue equals max', () => {
		renderWithProviders(
			<RatingStars
				max={5}
				displayValue={5}
				allowHalf={false}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		for (const button of buttons) {
			expect(button).toHaveAttribute('aria-checked', 'true');
		}
	});
});

describe('RatingStars - Half-Star Support', () => {
	it('renders half star when allowHalf is true', () => {
		renderWithProviders(
			<RatingStars
				max={5}
				displayValue={2.5}
				allowHalf={true}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		// First 2 stars should be filled
		expect(buttons[0]).toHaveAttribute('aria-checked', 'true');
		expect(buttons[1]).toHaveAttribute('aria-checked', 'true');
		// Third star should be half (check for opacity class)
		expect(buttons[2]).toBeDefined();
		const thirdStarIcon = buttons[2]?.querySelector('svg');
		expect(thirdStarIcon).toHaveClass('opacity-disabled');
		// Last 2 stars should be empty
		expect(buttons[3]).toHaveAttribute('aria-checked', 'false');
		expect(buttons[4]).toHaveAttribute('aria-checked', 'false');
	});

	it('does not render half star when allowHalf is false', () => {
		renderWithProviders(
			<RatingStars
				max={5}
				displayValue={2.5}
				allowHalf={false}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		// First 2 stars should be filled
		expect(buttons[0]).toHaveAttribute('aria-checked', 'true');
		expect(buttons[1]).toHaveAttribute('aria-checked', 'true');
		// Third star should be empty (no half star)
		expect(buttons[2]).toHaveAttribute('aria-checked', 'false');
	});
});

describe('RatingStars - Interactions', () => {
	it('calls onClick with correct index', () => {
		const onClick = vi.fn();

		renderWithProviders(
			<RatingStars
				max={5}
				displayValue={2}
				allowHalf={false}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={onClick}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		expect(buttons[3]).toBeDefined();
		if (buttons[3]) {
			fireEvent.click(buttons[3]);
		}

		expect(onClick).toHaveBeenCalledWith(3);
	});

	it('calls onMouseEnter with correct index', () => {
		const onMouseEnter = vi.fn();

		renderWithProviders(
			<RatingStars
				max={5}
				displayValue={2}
				allowHalf={false}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={onMouseEnter}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		expect(buttons[4]).toBeDefined();
		if (buttons[4]) {
			fireEvent.mouseEnter(buttons[4]);
		}

		expect(onMouseEnter).toHaveBeenCalledWith(4);
	});

	it('does not call onClick when readOnly', () => {
		const onClick = vi.fn();

		renderWithProviders(
			<RatingStars
				max={5}
				displayValue={2}
				allowHalf={false}
				size="md"
				readOnly={true}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={onClick}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDefined();
		if (buttons[0]) {
			fireEvent.click(buttons[0]);
		}

		expect(onClick).not.toHaveBeenCalled();
	});

	it('does not call onClick when disabled', () => {
		const onClick = vi.fn();

		renderWithProviders(
			<RatingStars
				max={5}
				displayValue={2}
				allowHalf={false}
				size="md"
				readOnly={false}
				disabled={true}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={onClick}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		expect(buttons[0]).toBeDefined();
		if (buttons[0]) {
			fireEvent.click(buttons[0]);
		}

		expect(onClick).not.toHaveBeenCalled();
	});
});

describe('RatingStars - Size Variants', () => {
	it('renders with sm size', () => {
		renderWithProviders(
			<RatingStars
				max={3}
				displayValue={2}
				allowHalf={false}
				size="sm"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		expect(buttons).toHaveLength(3);
	});

	it('renders with lg size', () => {
		renderWithProviders(
			<RatingStars
				max={3}
				displayValue={2}
				allowHalf={false}
				size="lg"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const buttons = screen.getAllByRole('radio');
		expect(buttons).toHaveLength(3);
	});
});

describe('RatingStars - Custom Icons', () => {
	it('renders custom icons', () => {
		const customFilledIcon = <span data-testid="custom-filled">★</span>;
		const customEmptyIcon = <span data-testid="custom-empty">☆</span>;

		renderWithProviders(
			<RatingStars
				max={3}
				displayValue={2}
				allowHalf={false}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				filledIcon={customFilledIcon}
				emptyIcon={customEmptyIcon}
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		// Should have 2 filled icons and 1 empty icon
		const filledIcons = screen.getAllByTestId('custom-filled');
		const emptyIcons = screen.getAllByTestId('custom-empty');
		expect(filledIcons).toHaveLength(2);
		expect(emptyIcons).toHaveLength(1);
	});
});
