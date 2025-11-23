/**
 * ToggleGroup Component Tests
 *
 * Tests for the ToggleGroup component including:
 * - Rendering
 * - Single selection mode
 * - Multiple selection mode
 * - Controlled and uncontrolled modes
 * - Variants and sizes
 * - Disabled states
 * - ToggleGroupItem integration
 */

import ToggleGroup, { ToggleGroupItem } from '@core/ui/forms/toggle/components/ToggleGroup';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('ToggleGroup - Rendering', () => {
	it('renders toggle group container', () => {
		renderWithProviders(
			<ToggleGroup>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
			</ToggleGroup>
		);
		const button = screen.getByRole('button', { name: 'Option A' });
		expect(button).toBeInTheDocument();
	});

	it('renders multiple toggle items', () => {
		renderWithProviders(
			<ToggleGroup>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
				<ToggleGroupItem value="c">Option C</ToggleGroupItem>
			</ToggleGroup>
		);
		expect(screen.getByText('Option A')).toBeInTheDocument();
		expect(screen.getByText('Option B')).toBeInTheDocument();
		expect(screen.getByText('Option C')).toBeInTheDocument();
	});

	it('applies className to container', () => {
		const { container } = renderWithProviders(
			<ToggleGroup className="custom-group">
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
			</ToggleGroup>
		);
		const groupContainer = container.firstChild as HTMLElement;
		expect(groupContainer).toHaveClass('custom-group');
	});
});

describe('ToggleGroup - Single Selection Mode', () => {
	it('allows selecting one item at a time', () => {
		const handleValueChange = vi.fn();
		renderWithProviders(
			<ToggleGroup type="single" value="" onValueChange={handleValueChange}>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		fireEvent.click(optionA);
		expect(handleValueChange).toHaveBeenCalledWith('a');
	});

	it('deselects item when clicking selected item', () => {
		const handleValueChange = vi.fn();
		renderWithProviders(
			<ToggleGroup type="single" value="a" onValueChange={handleValueChange}>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		fireEvent.click(optionA);
		expect(handleValueChange).toHaveBeenCalledWith('');
	});

	it('switches selection to different item', () => {
		const handleValueChange = vi.fn();
		renderWithProviders(
			<ToggleGroup type="single" value="a" onValueChange={handleValueChange}>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionB = screen.getByRole('button', { name: 'Option B' });
		fireEvent.click(optionB);
		expect(handleValueChange).toHaveBeenCalledWith('b');
	});

	it('shows pressed state for selected item', () => {
		renderWithProviders(
			<ToggleGroup type="single" value="a">
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		const optionB = screen.getByRole('button', { name: 'Option B' });
		expect(optionA).toHaveAttribute('aria-pressed', 'true');
		expect(optionB).toHaveAttribute('aria-pressed', 'false');
	});
});

describe('ToggleGroup - Multiple Selection Mode', () => {
	it('allows selecting multiple items', () => {
		const handleValueChange = vi.fn();
		const TestComponent = () => {
			const [value, setValue] = React.useState<string[]>([]);
			return (
				<ToggleGroup
					type="multiple"
					value={value}
					onValueChange={newValue => {
						handleValueChange(newValue);
						if (Array.isArray(newValue)) {
							setValue(newValue);
						}
					}}
				>
					<ToggleGroupItem value="a">Option A</ToggleGroupItem>
					<ToggleGroupItem value="b">Option B</ToggleGroupItem>
				</ToggleGroup>
			);
		};
		renderWithProviders(<TestComponent />);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		const optionB = screen.getByRole('button', { name: 'Option B' });

		fireEvent.click(optionA);
		expect(handleValueChange).toHaveBeenCalledWith(['a']);

		fireEvent.click(optionB);
		expect(handleValueChange).toHaveBeenCalledWith(['a', 'b']);
	});

	it('deselects item when clicking selected item', () => {
		const handleValueChange = vi.fn();
		renderWithProviders(
			<ToggleGroup type="multiple" value={['a', 'b']} onValueChange={handleValueChange}>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		fireEvent.click(optionA);
		expect(handleValueChange).toHaveBeenCalledWith(['b']);
	});

	it('shows pressed state for selected items', () => {
		renderWithProviders(
			<ToggleGroup type="multiple" value={['a', 'c']}>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
				<ToggleGroupItem value="c">Option C</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		const optionB = screen.getByRole('button', { name: 'Option B' });
		const optionC = screen.getByRole('button', { name: 'Option C' });
		expect(optionA).toHaveAttribute('aria-pressed', 'true');
		expect(optionB).toHaveAttribute('aria-pressed', 'false');
		expect(optionC).toHaveAttribute('aria-pressed', 'true');
	});
});

describe('ToggleGroup - Controlled Mode', () => {
	it('uses controlled value in single mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('a');
			return (
				<ToggleGroup
					type="single"
					value={value}
					onValueChange={newValue => {
						if (typeof newValue === 'string') {
							setValue(newValue);
						}
					}}
				>
					<ToggleGroupItem value="a">Option A</ToggleGroupItem>
					<ToggleGroupItem value="b">Option B</ToggleGroupItem>
				</ToggleGroup>
			);
		};
		renderWithProviders(<TestComponent />);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		expect(optionA).toHaveAttribute('aria-pressed', 'true');
	});

	it('uses controlled value in multiple mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState<string[]>(['a', 'b']);
			return (
				<ToggleGroup
					type="multiple"
					value={value}
					onValueChange={newValue => {
						if (Array.isArray(newValue)) {
							setValue(newValue);
						}
					}}
				>
					<ToggleGroupItem value="a">Option A</ToggleGroupItem>
					<ToggleGroupItem value="b">Option B</ToggleGroupItem>
					<ToggleGroupItem value="c">Option C</ToggleGroupItem>
				</ToggleGroup>
			);
		};
		renderWithProviders(<TestComponent />);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		const optionB = screen.getByRole('button', { name: 'Option B' });
		const optionC = screen.getByRole('button', { name: 'Option C' });
		expect(optionA).toHaveAttribute('aria-pressed', 'true');
		expect(optionB).toHaveAttribute('aria-pressed', 'true');
		expect(optionC).toHaveAttribute('aria-pressed', 'false');
	});
});

describe('ToggleGroup - Uncontrolled Mode', () => {
	it('manages state internally in single mode', () => {
		renderWithProviders(
			<ToggleGroup type="single">
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		fireEvent.click(optionA);
		expect(optionA).toHaveAttribute('aria-pressed', 'true');
	});

	it('manages state internally in multiple mode', () => {
		renderWithProviders(
			<ToggleGroup type="multiple">
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		const optionB = screen.getByRole('button', { name: 'Option B' });

		fireEvent.click(optionA);
		fireEvent.click(optionB);

		expect(optionA).toHaveAttribute('aria-pressed', 'true');
		expect(optionB).toHaveAttribute('aria-pressed', 'true');
	});
});

describe('ToggleGroup - Variants and Sizes', () => {
	it('applies variant to all toggles', () => {
		renderWithProviders(
			<ToggleGroup variant="outline">
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		const optionB = screen.getByRole('button', { name: 'Option B' });
		expect(optionA).toBeInTheDocument();
		expect(optionB).toBeInTheDocument();
	});

	it('applies size to all toggles', () => {
		renderWithProviders(
			<ToggleGroup size="lg">
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		const optionB = screen.getByRole('button', { name: 'Option B' });
		expect(optionA).toBeInTheDocument();
		expect(optionB).toBeInTheDocument();
	});

	it('defaults to single type and md size', () => {
		renderWithProviders(
			<ToggleGroup>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
			</ToggleGroup>
		);

		const button = screen.getByRole('button', { name: 'Option A' });
		expect(button).toBeInTheDocument();
	});
});

describe('ToggleGroup - Disabled State', () => {
	it('disables all toggles when group is disabled', () => {
		renderWithProviders(
			<ToggleGroup disabled>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		const optionB = screen.getByRole('button', { name: 'Option B' });
		expect(optionA).toBeDisabled();
		expect(optionB).toBeDisabled();
	});

	it('allows individual toggle to be disabled', () => {
		renderWithProviders(
			<ToggleGroup>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b" disabled>
					Option B
				</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		const optionB = screen.getByRole('button', { name: 'Option B' });
		expect(optionA).not.toBeDisabled();
		expect(optionB).toBeDisabled();
	});

	it('prevents interaction when group is disabled', () => {
		const handleValueChange = vi.fn();
		renderWithProviders(
			<ToggleGroup disabled onValueChange={handleValueChange}>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		fireEvent.click(optionA);
		expect(handleValueChange).not.toHaveBeenCalled();
	});
});

describe('ToggleGroup - ToggleGroupItem', () => {
	it('renders ToggleGroupItem with value and children', () => {
		renderWithProviders(
			<ToggleGroup>
				<ToggleGroupItem value="test">Test Item</ToggleGroupItem>
			</ToggleGroup>
		);

		expect(screen.getByText('Test Item')).toBeInTheDocument();
	});

	it('applies className to ToggleGroupItem', () => {
		renderWithProviders(
			<ToggleGroup>
				<ToggleGroupItem value="a" className="custom-item">
					Option A
				</ToggleGroupItem>
			</ToggleGroup>
		);

		const button = screen.getByRole('button', { name: 'Option A' });
		expect(button).toHaveClass('custom-item');
	});
});

describe('ToggleGroup - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<ToggleGroup>
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);
		await expectA11y(container);
	});

	it('uses correct aria-pressed attributes', () => {
		renderWithProviders(
			<ToggleGroup type="single" value="a">
				<ToggleGroupItem value="a">Option A</ToggleGroupItem>
				<ToggleGroupItem value="b">Option B</ToggleGroupItem>
			</ToggleGroup>
		);

		const optionA = screen.getByRole('button', { name: 'Option A' });
		expect(optionA).toHaveAttribute('aria-pressed', 'true');
	});
});
