/**
 * StatIcon Component Tests
 *
 * Tests for the StatIcon component including:
 * - Rendering with different sizes
 * - Icon rendering
 * - CSS classes application
 * - Accessibility attributes
 */

import { StatIcon } from '@core/ui/data-display/stat/components/StatIcon';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const TestIcon = () => <svg data-testid="test-icon" />;
const TestIconWithText = () => <span>Icon Text</span>;

describe('StatIcon - Rendering', () => {
	it('renders the icon container', () => {
		renderWithProviders(<StatIcon icon={<TestIcon />} size="md" />);
		const container = screen.getByTestId('test-icon').parentElement;
		expect(container).toBeInTheDocument();
		expect(container?.tagName).toBe('DIV');
	});

	it('renders the provided icon', () => {
		renderWithProviders(<StatIcon icon={<TestIcon />} size="md" />);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
	});

	it('renders icon with text content', () => {
		renderWithProviders(<StatIcon icon={<TestIconWithText />} size="md" />);
		expect(screen.getByText('Icon Text')).toBeInTheDocument();
	});

	it('renders icon with ReactNode children', () => {
		renderWithProviders(
			<StatIcon
				icon={
					<div>
						<span>Icon 1</span>
						<span>Icon 2</span>
					</div>
				}
				size="md"
			/>
		);
		expect(screen.getByText('Icon 1')).toBeInTheDocument();
		expect(screen.getByText('Icon 2')).toBeInTheDocument();
	});
});

describe('StatIcon - Sizes', () => {
	it('applies correct classes for sm size', () => {
		const { container } = renderWithProviders(<StatIcon icon={<TestIcon />} size="sm" />);
		const iconContainer = container.firstChild as HTMLElement;
		expect(iconContainer).toHaveClass('w-8', 'h-8');
	});

	it('applies correct classes for md size', () => {
		const { container } = renderWithProviders(<StatIcon icon={<TestIcon />} size="md" />);
		const iconContainer = container.firstChild as HTMLElement;
		expect(iconContainer).toHaveClass('w-10', 'h-10');
	});

	it('applies correct classes for lg size', () => {
		const { container } = renderWithProviders(<StatIcon icon={<TestIcon />} size="lg" />);
		const iconContainer = container.firstChild as HTMLElement;
		expect(iconContainer).toHaveClass('w-12', 'h-12');
	});
});

describe('StatIcon - CSS Classes', () => {
	it('applies base styling classes', () => {
		const { container } = renderWithProviders(<StatIcon icon={<TestIcon />} size="md" />);
		const iconContainer = container.firstChild as HTMLElement;
		expect(iconContainer).toHaveClass(
			'flex',
			'shrink-0',
			'items-center',
			'justify-center',
			'rounded-lg',
			'bg-primary/10',
			'text-primary',
			'dark:bg-primary/20'
		);
	});

	it('merges size classes with base classes', () => {
		const { container } = renderWithProviders(<StatIcon icon={<TestIcon />} size="sm" />);
		const iconContainer = container.firstChild as HTMLElement;
		expect(iconContainer).toHaveClass('w-8', 'h-8', 'flex', 'rounded-lg');
	});
});

describe('StatIcon - Accessibility', () => {
	it('sets aria-hidden attribute to true', () => {
		const { container } = renderWithProviders(<StatIcon icon={<TestIcon />} size="md" />);
		const iconContainer = container.firstChild as HTMLElement;
		expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
	});
});

describe('StatIcon - Integration', () => {
	it('renders correctly with all size variants', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
		for (const size of sizes) {
			const { container, unmount } = renderWithProviders(
				<StatIcon icon={<TestIcon />} size={size} />
			);
			const iconContainer = container.firstChild as HTMLElement;
			expect(iconContainer).toBeInTheDocument();
			expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
			unmount();
		}
	});

	it('renders correctly with different icon types', () => {
		const icons = [
			<TestIcon key="svg" />,
			<TestIconWithText key="text" />,
			<span key="span">Custom Icon</span>,
		];

		for (const icon of icons) {
			const { container, unmount } = renderWithProviders(<StatIcon icon={icon} size="md" />);
			const iconContainer = container.firstChild as HTMLElement;
			expect(iconContainer).toBeInTheDocument();
			expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
			unmount();
		}
	});
});
