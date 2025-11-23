/**
 * RatingStarIcon Component Tests
 *
 * Tests for the RatingStarIcon component including:
 * - Rendering
 * - Icon display (filled vs empty)
 * - Half-star display
 * - Custom icons
 * - Size variants
 * - Class names
 */

import { RatingStarIcon } from '@core/ui/forms/rating/components/RatingStarIcon';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('RatingStarIcon - Rendering', () => {
	it('renders filled star icon', () => {
		const { container } = renderWithProviders(
			<RatingStarIcon
				size="md"
				starClasses="star-class"
				emptyStarClasses="empty-class"
				isFilled={true}
				isHalf={false}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveClass('star-class');
	});

	it('renders empty star icon', () => {
		const { container } = renderWithProviders(
			<RatingStarIcon
				size="md"
				starClasses="star-class"
				emptyStarClasses="empty-class"
				isFilled={false}
				isHalf={false}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveClass('empty-class');
	});

	it('applies opacity for half star', () => {
		const { container } = renderWithProviders(
			<RatingStarIcon
				size="md"
				starClasses="star-class"
				emptyStarClasses="empty-class"
				isFilled={true}
				isHalf={true}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toHaveClass('opacity-disabled');
	});
});

describe('RatingStarIcon - Size Variants', () => {
	it('renders with sm size', () => {
		const { container } = renderWithProviders(
			<RatingStarIcon
				size="sm"
				starClasses="star-class"
				emptyStarClasses="empty-class"
				isFilled={true}
				isHalf={false}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toBeInTheDocument();
	});

	it('renders with md size', () => {
		const { container } = renderWithProviders(
			<RatingStarIcon
				size="md"
				starClasses="star-class"
				emptyStarClasses="empty-class"
				isFilled={true}
				isHalf={false}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		const { container } = renderWithProviders(
			<RatingStarIcon
				size="lg"
				starClasses="star-class"
				emptyStarClasses="empty-class"
				isFilled={true}
				isHalf={false}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toBeInTheDocument();
	});

	it('defaults to md size when size is undefined', () => {
		const { container } = renderWithProviders(
			<RatingStarIcon
				size={undefined}
				starClasses="star-class"
				emptyStarClasses="empty-class"
				isFilled={true}
				isHalf={false}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toBeInTheDocument();
	});
});

describe('RatingStarIcon - Custom Icons', () => {
	it('renders custom filled icon', () => {
		const customFilledIcon = <span data-testid="custom-filled">★</span>;

		renderWithProviders(
			<RatingStarIcon
				size="md"
				starClasses="star-class"
				emptyStarClasses="empty-class"
				isFilled={true}
				isHalf={false}
				filledIcon={customFilledIcon}
			/>
		);

		expect(screen.getByTestId('custom-filled')).toBeInTheDocument();
		expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
	});

	it('renders custom empty icon', () => {
		const customEmptyIcon = <span data-testid="custom-empty">☆</span>;

		renderWithProviders(
			<RatingStarIcon
				size="md"
				starClasses="star-class"
				emptyStarClasses="empty-class"
				isFilled={false}
				isHalf={false}
				emptyIcon={customEmptyIcon}
			/>
		);

		expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
		expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
	});

	it('uses default icon when custom icon not provided', () => {
		const { container } = renderWithProviders(
			<RatingStarIcon
				size="md"
				starClasses="star-class"
				emptyStarClasses="empty-class"
				isFilled={true}
				isHalf={false}
				filledIcon={undefined}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toBeInTheDocument();
	});
});

describe('RatingStarIcon - Class Names', () => {
	it('applies starClasses to filled icon', () => {
		const { container } = renderWithProviders(
			<RatingStarIcon
				size="md"
				starClasses="custom-filled-class"
				emptyStarClasses="empty-class"
				isFilled={true}
				isHalf={false}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toHaveClass('custom-filled-class');
	});

	it('applies emptyStarClasses to empty icon', () => {
		const { container } = renderWithProviders(
			<RatingStarIcon
				size="md"
				starClasses="star-class"
				emptyStarClasses="custom-empty-class"
				isFilled={false}
				isHalf={false}
			/>
		);

		const icon = container.querySelector('svg');
		expect(icon).toHaveClass('custom-empty-class');
	});
});
