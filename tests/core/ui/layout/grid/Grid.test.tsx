/**
 * Grid Component Tests
 *
 * Tests for the Grid component including:
 * - Rendering
 * - Column configurations
 * - Gap variants
 * - Alignment and justification
 * - Auto-fit columns
 * - Custom className
 * - Accessibility
 */

import Grid from '@core/ui/layout/grid/Grid';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Grid - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<Grid>
				<div>Test Content</div>
			</Grid>
		);

		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('renders with default gap', () => {
		const { container } = renderWithProviders(
			<Grid>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('gap-md');
	});

	it('applies custom className', () => {
		const { container } = renderWithProviders(
			<Grid className="custom-grid">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('custom-grid');
	});

	it('merges base classes with custom className', () => {
		const { container } = renderWithProviders(
			<Grid className="custom-class" cols={3}>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('grid', 'grid-cols-3', 'gap-md', 'custom-class');
	});

	it('forwards additional HTML attributes', () => {
		renderWithProviders(
			<Grid data-testid="grid" aria-label="Grid container">
				<div>Content</div>
			</Grid>
		);

		const grid = screen.getByTestId('grid');
		expect(grid).toHaveAttribute('aria-label', 'Grid container');
	});

	it('forwards custom style prop', () => {
		const { container } = renderWithProviders(
			<Grid style={{ backgroundColor: 'red' }}>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement.style.backgroundColor).toBe('red');
	});
});

describe('Grid - Column Configurations', () => {
	it('renders with 1 column', () => {
		const { container } = renderWithProviders(
			<Grid cols={1}>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('grid-cols-1');
	});

	it('renders with 2 columns', () => {
		const { container } = renderWithProviders(
			<Grid cols={2}>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('grid-cols-2');
	});

	it('renders with 3 columns', () => {
		const { container } = renderWithProviders(
			<Grid cols={3}>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('grid-cols-3');
	});

	it('renders with 4 columns', () => {
		const { container } = renderWithProviders(
			<Grid cols={4}>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('grid-cols-4');
	});

	it('renders with 6 columns', () => {
		const { container } = renderWithProviders(
			<Grid cols={6}>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('grid-cols-6');
	});

	it('renders with 12 columns', () => {
		const { container } = renderWithProviders(
			<Grid cols={12}>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('grid-cols-12');
	});

	it('renders with auto-fit columns', () => {
		const { container } = renderWithProviders(
			<Grid cols="auto" autoMinWidth={250}>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		// Auto-fit uses Tailwind arbitrary value class
		expect(gridElement.className).toContain('grid-cols-[');
		expect(gridElement.className).toContain('repeat(auto-fit');
		expect(gridElement.className).toContain('250px');
	});

	it('uses default autoMinWidth when not specified', () => {
		const { container } = renderWithProviders(
			<Grid cols="auto">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		// Auto-fit uses Tailwind arbitrary value class with default 200px
		expect(gridElement.className).toContain('grid-cols-[');
		expect(gridElement.className).toContain('repeat(auto-fit');
		expect(gridElement.className).toContain('200px');
	});

	it('renders without cols prop', () => {
		const { container } = renderWithProviders(
			<Grid>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('grid');
		expect(gridElement).not.toHaveClass('grid-cols-1', 'grid-cols-2', 'grid-cols-3');
	});
});

describe('Grid - Gap Variants', () => {
	it('renders with none gap', () => {
		const { container } = renderWithProviders(
			<Grid gap="none">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).not.toHaveClass('gap-sm', 'gap-md', 'gap-lg');
	});

	it('renders with sm gap', () => {
		const { container } = renderWithProviders(
			<Grid gap="sm">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('gap-sm');
	});

	it('renders with md gap', () => {
		const { container } = renderWithProviders(
			<Grid gap="md">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('gap-md');
	});

	it('renders with lg gap', () => {
		const { container } = renderWithProviders(
			<Grid gap="lg">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('gap-lg');
	});
});

describe('Grid - Alignment', () => {
	it('renders with start alignment', () => {
		const { container } = renderWithProviders(
			<Grid align="start">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('items-start');
	});

	it('renders with center alignment', () => {
		const { container } = renderWithProviders(
			<Grid align="center">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('items-center');
	});

	it('renders with end alignment', () => {
		const { container } = renderWithProviders(
			<Grid align="end">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('items-end');
	});

	it('renders with stretch alignment', () => {
		const { container } = renderWithProviders(
			<Grid align="stretch">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('items-stretch');
	});

	it('renders with default start alignment', () => {
		const { container } = renderWithProviders(
			<Grid>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('items-start');
	});
});

describe('Grid - Justification', () => {
	it('renders with start justification', () => {
		const { container } = renderWithProviders(
			<Grid justify="start">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('justify-start');
	});

	it('renders with center justification', () => {
		const { container } = renderWithProviders(
			<Grid justify="center">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('justify-center');
	});

	it('renders with end justification', () => {
		const { container } = renderWithProviders(
			<Grid justify="end">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('justify-end');
	});

	it('renders with between justification', () => {
		const { container } = renderWithProviders(
			<Grid justify="between">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('justify-between');
	});

	it('renders with around justification', () => {
		const { container } = renderWithProviders(
			<Grid justify="around">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('justify-around');
	});

	it('renders with evenly justification', () => {
		const { container } = renderWithProviders(
			<Grid justify="evenly">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('justify-evenly');
	});

	it('renders with default start justification', () => {
		const { container } = renderWithProviders(
			<Grid>
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass('justify-start');
	});
});

describe('Grid - Combined Props', () => {
	it('combines all props correctly', () => {
		const { container } = renderWithProviders(
			<Grid cols={3} gap="lg" align="center" justify="between" className="custom">
				<div>Content</div>
			</Grid>
		);

		const gridElement = container.firstChild as HTMLElement;
		expect(gridElement).toHaveClass(
			'grid',
			'grid-cols-3',
			'gap-lg',
			'items-center',
			'justify-between',
			'custom'
		);
	});
});

describe('Grid - Children', () => {
	it('renders multiple children', () => {
		renderWithProviders(
			<Grid cols={3}>
				<div>Item 1</div>
				<div>Item 2</div>
				<div>Item 3</div>
			</Grid>
		);

		expect(screen.getByText('Item 1')).toBeInTheDocument();
		expect(screen.getByText('Item 2')).toBeInTheDocument();
		expect(screen.getByText('Item 3')).toBeInTheDocument();
	});

	it('renders complex nested children', () => {
		renderWithProviders(
			<Grid cols={2}>
				<div>
					<h2>Title 1</h2>
					<p>Content 1</p>
				</div>
				<div>
					<h2>Title 2</h2>
					<p>Content 2</p>
				</div>
			</Grid>
		);

		expect(screen.getByText('Title 1')).toBeInTheDocument();
		expect(screen.getByText('Content 1')).toBeInTheDocument();
		expect(screen.getByText('Title 2')).toBeInTheDocument();
		expect(screen.getByText('Content 2')).toBeInTheDocument();
	});
});

describe('Grid - Accessibility', () => {
	it('passes accessibility checks', async () => {
		const { container } = renderWithProviders(
			<Grid aria-label="Grid container">
				<div>Content</div>
			</Grid>
		);

		await expectA11y(container);
	});

	it('preserves semantic HTML', () => {
		renderWithProviders(
			<Grid>
				<article>
					<h2>Article Title</h2>
					<p>Article content</p>
				</article>
			</Grid>
		);

		expect(screen.getByRole('article')).toBeInTheDocument();
	});
});
