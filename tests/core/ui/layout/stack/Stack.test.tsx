/**
 * Stack Component Tests
 *
 * Tests for the Stack component including:
 * - Rendering
 * - Direction variants
 * - Gap variants
 * - Alignment and justification
 * - Custom className
 * - Accessibility
 */

import Stack from '@core/ui/layout/stack/Stack';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Stack - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<Stack>
				<div>Test Content</div>
			</Stack>
		);

		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('renders with default vertical direction', () => {
		const { container } = renderWithProviders(
			<Stack>
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('flex', 'flex-col');
	});

	it('renders with default gap', () => {
		const { container } = renderWithProviders(
			<Stack>
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('gap-md');
	});

	it('applies custom className', () => {
		const { container } = renderWithProviders(
			<Stack className="custom-stack">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('custom-stack');
	});

	it('merges base classes with custom className', () => {
		const { container } = renderWithProviders(
			<Stack className="custom-class">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass(
			'flex',
			'flex-col',
			'gap-md',
			'items-start',
			'justify-start',
			'custom-class'
		);
	});

	it('forwards additional HTML attributes', () => {
		renderWithProviders(
			<Stack data-testid="stack" aria-label="Stack container">
				<div>Content</div>
			</Stack>
		);

		const stack = screen.getByTestId('stack');
		expect(stack).toHaveAttribute('aria-label', 'Stack container');
	});
});

describe('Stack - Direction', () => {
	it('renders with vertical direction by default', () => {
		const { container } = renderWithProviders(
			<Stack>
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('flex', 'flex-col');
	});

	it('renders with vertical direction when specified', () => {
		const { container } = renderWithProviders(
			<Stack direction="vertical">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('flex', 'flex-col');
	});

	it('renders with horizontal direction', () => {
		const { container } = renderWithProviders(
			<Stack direction="horizontal">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('flex', 'flex-row');
	});
});

describe('Stack - Gap Variants', () => {
	it('renders with none gap', () => {
		const { container } = renderWithProviders(
			<Stack gap="none">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).not.toHaveClass('gap-sm', 'gap-md', 'gap-lg');
	});

	it('renders with sm gap', () => {
		const { container } = renderWithProviders(
			<Stack gap="sm">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('gap-sm');
	});

	it('renders with md gap', () => {
		const { container } = renderWithProviders(
			<Stack gap="md">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('gap-md');
	});

	it('renders with lg gap', () => {
		const { container } = renderWithProviders(
			<Stack gap="lg">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('gap-lg');
	});
});

describe('Stack - Alignment', () => {
	it('renders with start alignment by default', () => {
		const { container } = renderWithProviders(
			<Stack>
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('items-start');
	});

	it('renders with start alignment when specified', () => {
		const { container } = renderWithProviders(
			<Stack align="start">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('items-start');
	});

	it('renders with center alignment', () => {
		const { container } = renderWithProviders(
			<Stack align="center">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('items-center');
	});

	it('renders with end alignment', () => {
		const { container } = renderWithProviders(
			<Stack align="end">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('items-end');
	});

	it('renders with stretch alignment', () => {
		const { container } = renderWithProviders(
			<Stack align="stretch">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('items-stretch');
	});
});

describe('Stack - Justification', () => {
	it('renders with start justification by default', () => {
		const { container } = renderWithProviders(
			<Stack>
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('justify-start');
	});

	it('renders with start justification when specified', () => {
		const { container } = renderWithProviders(
			<Stack justify="start">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('justify-start');
	});

	it('renders with center justification', () => {
		const { container } = renderWithProviders(
			<Stack justify="center">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('justify-center');
	});

	it('renders with end justification', () => {
		const { container } = renderWithProviders(
			<Stack justify="end">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('justify-end');
	});

	it('renders with space-between justification', () => {
		const { container } = renderWithProviders(
			<Stack justify="space-between">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('justify-between');
	});

	it('renders with space-around justification', () => {
		const { container } = renderWithProviders(
			<Stack justify="space-around">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('justify-around');
	});

	it('renders with space-evenly justification', () => {
		const { container } = renderWithProviders(
			<Stack justify="space-evenly">
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass('justify-evenly');
	});
});

describe('Stack - Combined Props', () => {
	it('combines all props correctly', () => {
		const { container } = renderWithProviders(
			<Stack
				direction="horizontal"
				gap="lg"
				align="center"
				justify="space-between"
				className="custom"
			>
				<div>Content</div>
			</Stack>
		);

		const stackElement = container.firstChild as HTMLElement;
		expect(stackElement).toHaveClass(
			'flex',
			'flex-row',
			'gap-lg',
			'items-center',
			'justify-between',
			'custom'
		);
	});
});

describe('Stack - Children', () => {
	it('renders multiple children', () => {
		renderWithProviders(
			<Stack>
				<div>Item 1</div>
				<div>Item 2</div>
				<div>Item 3</div>
			</Stack>
		);

		expect(screen.getByText('Item 1')).toBeInTheDocument();
		expect(screen.getByText('Item 2')).toBeInTheDocument();
		expect(screen.getByText('Item 3')).toBeInTheDocument();
	});

	it('renders complex nested children', () => {
		renderWithProviders(
			<Stack>
				<header>
					<h1>Title</h1>
				</header>
				<main>
					<p>Content</p>
				</main>
				<footer>
					<p>Footer</p>
				</footer>
			</Stack>
		);

		expect(screen.getByText('Title')).toBeInTheDocument();
		expect(screen.getByText('Content')).toBeInTheDocument();
		expect(screen.getByText('Footer')).toBeInTheDocument();
	});
});

describe('Stack - Accessibility', () => {
	it('passes accessibility checks', async () => {
		const { container } = renderWithProviders(
			<Stack aria-label="Stack container">
				<div>Content</div>
			</Stack>
		);

		await expectA11y(container);
	});

	it('preserves semantic HTML', () => {
		renderWithProviders(
			<Stack>
				<nav>
					<a href="#link1">Link 1</a>
					<a href="#link2">Link 2</a>
				</nav>
			</Stack>
		);

		expect(screen.getByRole('navigation')).toBeInTheDocument();
	});
});
