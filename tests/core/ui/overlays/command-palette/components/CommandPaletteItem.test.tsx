/**
 * Tests for CommandPaletteItem component
 *
 * Tests the command palette item component:
 * - Rendering
 * - User interactions
 * - Highlighted state
 * - Disabled state
 * - Icons and shortcuts
 * - Accessibility
 */

import { CommandPaletteItem } from '@core/ui/overlays/command-palette/components/CommandPaletteItem';
import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import type { CommandPaletteItemProps } from '@core/ui/overlays/command-palette/types/CommandPaletteParts.types';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createMockCommand = (overrides?: Partial<CommandPaletteCommand>): CommandPaletteCommand => ({
	id: '1',
	label: 'Test Command',
	...overrides,
});

const createMockProps = (
	overrides?: Partial<CommandPaletteItemProps>
): CommandPaletteItemProps => ({
	command: createMockCommand(),
	index: 0,
	isHighlighted: false,
	onSelect: vi.fn(),
	...overrides,
});

describe('CommandPaletteItem - Rendering', () => {
	it('renders command item', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteItem {...props} />);

		expect(screen.getByText('Test Command')).toBeInTheDocument();
	});

	it('renders command label', () => {
		const command = createMockCommand({ label: 'Save File' });
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		expect(screen.getByText('Save File')).toBeInTheDocument();
	});

	it('renders command description when provided', () => {
		const command = createMockCommand({ description: 'Save the current file' });
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		expect(screen.getByText('Save the current file')).toBeInTheDocument();
	});

	it('does not render description when not provided', () => {
		const command = createMockCommand({});
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
	});

	it('renders icon when provided', () => {
		const icon = <span data-testid="command-icon">📄</span>;
		const command = createMockCommand({ icon });
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		expect(screen.getByTestId('command-icon')).toBeInTheDocument();
	});

	it('does not render icon when not provided', () => {
		const command = createMockCommand({});
		const props = createMockProps({ command });
		const { container } = renderWithProviders(<CommandPaletteItem {...props} />);

		const iconContainer = container.querySelector('.shrink-0.text-text-muted');
		expect(iconContainer).not.toBeInTheDocument();
	});

	it('renders shortcut when provided', () => {
		const command = createMockCommand({ shortcut: 'Ctrl+S' });
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		expect(screen.getByText('Ctrl+S')).toBeInTheDocument();
	});

	it('does not render shortcut when not provided', () => {
		const command = createMockCommand({});
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		expect(screen.queryByText(/ctrl/i)).not.toBeInTheDocument();
	});

	it('renders shortcut in kbd element', () => {
		const command = createMockCommand({ shortcut: 'Ctrl+S' });
		const props = createMockProps({ command });
		const { container } = renderWithProviders(<CommandPaletteItem {...props} />);

		const kbd = container.querySelector('kbd');
		expect(kbd).toBeInTheDocument();
		expect(kbd?.textContent).toBe('Ctrl+S');
	});
});

describe('CommandPaletteItem - Highlighted State', () => {
	it('applies highlighted styles when isHighlighted is true', () => {
		const props = createMockProps({ isHighlighted: true });
		const { container } = renderWithProviders(<CommandPaletteItem {...props} />);

		const button = container.querySelector('button');
		expect(button).toHaveClass('bg-primary/10', 'text-primary');
	});

	it('applies default styles when isHighlighted is false', () => {
		const props = createMockProps({ isHighlighted: false });
		const { container } = renderWithProviders(<CommandPaletteItem {...props} />);

		const button = container.querySelector('button');
		expect(button).toHaveClass('text-text-primary', 'hover:bg-muted');
		expect(button).not.toHaveClass('bg-primary/10', 'text-primary');
	});

	it('sets aria-selected to true when highlighted', () => {
		const props = createMockProps({ isHighlighted: true });
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		expect(button).toHaveAttribute('aria-selected', 'true');
	});

	it('sets aria-selected to false when not highlighted', () => {
		const props = createMockProps({ isHighlighted: false });
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		expect(button).toHaveAttribute('aria-selected', 'false');
	});
});

describe('CommandPaletteItem - Disabled State', () => {
	it('disables button when command is disabled', () => {
		const command = createMockCommand({ disabled: true });
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		expect(button).toBeDisabled();
	});

	it('enables button when command is not disabled', () => {
		const command = createMockCommand({ disabled: false });
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		expect(button).not.toBeDisabled();
	});

	it('applies disabled styles when disabled', () => {
		const command = createMockCommand({ disabled: true });
		const props = createMockProps({ command });
		const { container } = renderWithProviders(<CommandPaletteItem {...props} />);

		const button = container.querySelector('button');
		expect(button).toHaveClass('cursor-not-allowed', 'opacity-disabled');
	});

	it('does not call onSelect when disabled item is clicked', () => {
		const onSelect = vi.fn();
		const command = createMockCommand({ disabled: true });
		const props = createMockProps({ command, onSelect });
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		fireEvent.click(button);

		expect(onSelect).not.toHaveBeenCalled();
	});
});

describe('CommandPaletteItem - Interactions', () => {
	it('calls onSelect when item is clicked', async () => {
		const onSelect = vi.fn().mockResolvedValue(undefined);
		const command = createMockCommand();
		const props = createMockProps({ command, onSelect });
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		fireEvent.click(button);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith(command);
	});

	it('handles async onSelect', async () => {
		const onSelect = vi.fn().mockImplementation(async () => {
			await new Promise(resolve => setTimeout(resolve, 10));
		});
		const command = createMockCommand();
		const props = createMockProps({ command, onSelect });
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		fireEvent.click(button);

		expect(onSelect).toHaveBeenCalledTimes(1);
	});

	it('handles onSelect that throws error gracefully', async () => {
		const onSelect = vi.fn().mockRejectedValue(new Error('Test error'));
		const command = createMockCommand();
		const props = createMockProps({ command, onSelect });
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		fireEvent.click(button);

		// Error should be caught and ignored
		expect(onSelect).toHaveBeenCalledTimes(1);
	});

	it('sets data-command-index attribute', () => {
		const props = createMockProps({ index: 5 });
		const { container } = renderWithProviders(<CommandPaletteItem {...props} />);

		const button = container.querySelector('button');
		expect(button).toHaveAttribute('data-command-index', '5');
	});
});

describe('CommandPaletteItem - Accessibility', () => {
	it('has correct role attribute', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		expect(button).toBeInTheDocument();
	});

	it('has aria-selected attribute', () => {
		const props = createMockProps({ isHighlighted: true });
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		expect(button).toHaveAttribute('aria-selected', 'true');
	});

	it('passes accessibility checks', async () => {
		const props = createMockProps();
		const { container } = renderWithProviders(
			<div role="listbox" aria-label="Commands">
				<CommandPaletteItem {...props} />
			</div>
		);

		await expectA11y(container);
	});

	it('has accessible button element', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		expect(button).toHaveAttribute('type', 'button');
	});
});

describe('CommandPaletteItem - Edge Cases', () => {
	it('handles command with all optional properties', () => {
		const command = createMockCommand({
			description: 'Test description',
			icon: <span>📄</span>,
			shortcut: 'Ctrl+S',
			keywords: ['test'],
			group: 'File',
		});
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		expect(screen.getByText('Test Command')).toBeInTheDocument();
		expect(screen.getByText('Test description')).toBeInTheDocument();
		expect(screen.getByText('Ctrl+S')).toBeInTheDocument();
	});

	it('handles command with minimal properties', () => {
		const command = createMockCommand({});
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		expect(screen.getByText('Test Command')).toBeInTheDocument();
	});

	it('handles empty label', () => {
		const command = createMockCommand({ label: '' });
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		const button = screen.getByRole('option');
		expect(button).toBeInTheDocument();
	});

	it('handles long label', () => {
		const longLabel = 'A'.repeat(200);
		const command = createMockCommand({ label: longLabel });
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		expect(screen.getByText(longLabel)).toBeInTheDocument();
	});

	it('handles long description', () => {
		const longDescription = 'B'.repeat(500);
		const command = createMockCommand({ description: longDescription });
		const props = createMockProps({ command });
		renderWithProviders(<CommandPaletteItem {...props} />);

		expect(screen.getByText(longDescription)).toBeInTheDocument();
	});
});
