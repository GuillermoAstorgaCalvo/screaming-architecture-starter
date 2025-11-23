/**
 * RatingStarButton Component Tests
 *
 * Tests for the RatingStarButton component including:
 * - Rendering
 * - Click handling
 * - Hover handling
 * - Button props
 * - Accessibility
 * - Disabled and read-only states
 */

import { RatingStarButton } from '@core/ui/forms/rating/components/RatingStarButton';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('RatingStarButton - Rendering', () => {
	it('renders button element', () => {
		renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={1}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByRole('radio');
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute('type', 'button');
	});

	it('renders with correct aria-label', () => {
		renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={1}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByLabelText('1 star');
		expect(button).toBeInTheDocument();
	});

	it('renders with correct aria-label for multiple stars', () => {
		renderWithProviders(
			<RatingStarButton
				starIndex={2}
				fill={1}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByLabelText('3 stars');
		expect(button).toBeInTheDocument();
	});
});

describe('RatingStarButton - Interactions', () => {
	it('calls onClick when clicked', () => {
		const onClick = vi.fn();

		renderWithProviders(
			<RatingStarButton
				starIndex={2}
				fill={1}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={onClick}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByRole('radio');
		fireEvent.click(button);

		expect(onClick).toHaveBeenCalledWith(2);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('calls onMouseEnter when hovered', () => {
		const onMouseEnter = vi.fn();

		renderWithProviders(
			<RatingStarButton
				starIndex={3}
				fill={1}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={onMouseEnter}
			/>
		);

		const button = screen.getByRole('radio');
		fireEvent.mouseEnter(button);

		expect(onMouseEnter).toHaveBeenCalledWith(3);
		expect(onMouseEnter).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when readOnly', () => {
		const onClick = vi.fn();

		renderWithProviders(
			<RatingStarButton
				starIndex={2}
				fill={1}
				size="md"
				readOnly={true}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={onClick}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('does not call onClick when disabled', () => {
		const onClick = vi.fn();

		renderWithProviders(
			<RatingStarButton
				starIndex={2}
				fill={1}
				size="md"
				readOnly={false}
				disabled={true}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={onClick}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByRole('radio');
		fireEvent.click(button);

		expect(onClick).not.toHaveBeenCalled();
	});
});

describe('RatingStarButton - Accessibility', () => {
	it('has role="radio" when interactive', () => {
		renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={1}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByRole('radio');
		expect(button).toBeInTheDocument();
	});

	it('does not have role="radio" when readOnly', () => {
		renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={1}
				size="md"
				readOnly={true}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).not.toHaveAttribute('role', 'radio');
	});

	it('has aria-checked="true" for filled star', () => {
		renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={1}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByRole('radio');
		expect(button).toHaveAttribute('aria-checked', 'true');
	});

	it('has aria-checked="false" for empty star', () => {
		renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={0}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByRole('radio');
		expect(button).toHaveAttribute('aria-checked', 'false');
	});

	it('does not have aria-checked when readOnly', () => {
		renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={1}
				size="md"
				readOnly={true}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).not.toHaveAttribute('aria-checked');
	});

	it('is disabled when readOnly', () => {
		renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={1}
				size="md"
				readOnly={true}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});

	it('is disabled when disabled prop is true', () => {
		renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={1}
				size="md"
				readOnly={false}
				disabled={true}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const button = screen.getByRole('radio');
		expect(button).toBeDisabled();
	});
});

describe('RatingStarButton - Fill States', () => {
	it('renders filled star when fill is 1', () => {
		const { container } = renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={1}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toHaveClass('star-class');
	});

	it('renders empty star when fill is 0', () => {
		const { container } = renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={0}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toHaveClass('empty-class');
	});

	it('renders half star when fill is 0.5', () => {
		const { container } = renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={0.5}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toHaveClass('star-class');
		expect(icon).toHaveClass('opacity-disabled');
	});
});

describe('RatingStarButton - Custom Icons', () => {
	it('renders custom filled icon', () => {
		const customFilledIcon = <span data-testid="custom-filled">★</span>;

		renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={1}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				filledIcon={customFilledIcon}
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		expect(screen.getByTestId('custom-filled')).toBeInTheDocument();
	});

	it('renders custom empty icon', () => {
		const customEmptyIcon = <span data-testid="custom-empty">☆</span>;

		renderWithProviders(
			<RatingStarButton
				starIndex={0}
				fill={0}
				size="md"
				readOnly={false}
				disabled={false}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				emptyIcon={customEmptyIcon}
				onClick={vi.fn()}
				onMouseEnter={vi.fn()}
			/>
		);

		expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
	});
});
