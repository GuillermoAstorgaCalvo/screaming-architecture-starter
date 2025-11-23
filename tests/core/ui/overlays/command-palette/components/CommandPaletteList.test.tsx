/**
 * Tests for CommandPaletteList component
 *
 * Tests the command palette list component:
 * - Rendering
 * - Empty state
 * - Command items rendering
 * - Highlighted index
 * - Accessibility
 */

import { CommandPaletteList } from '@core/ui/overlays/command-palette/components/CommandPaletteList';
import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import type { CommandPaletteListProps } from '@core/ui/overlays/command-palette/types/CommandPaletteParts.types';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createMockCommand = (overrides?: Partial<CommandPaletteCommand>): CommandPaletteCommand => ({
	id: '1',
	label: 'Test Command',
	...overrides,
});

const createMockProps = (
	overrides?: Partial<CommandPaletteListProps>
): CommandPaletteListProps => ({
	commands: [createMockCommand({ id: '1', label: 'Command 1' })],
	highlightedIndex: 0,
	commandsListRef: createRef<HTMLDivElement>(),
	onSelect: vi.fn(),
	emptyState: 'No commands found',
	...overrides,
});

describe('CommandPaletteList - Rendering', () => {
	it('renders list container', () => {
		const props = createMockProps();
		const { container } = renderWithProviders(<CommandPaletteList {...props} />);

		const list = container.querySelector('[role="listbox"]');
		expect(list).toBeInTheDocument();
	});

	it('renders all commands', () => {
		const commands = [
			createMockCommand({ id: '1', label: 'Command 1' }),
			createMockCommand({ id: '2', label: 'Command 2' }),
			createMockCommand({ id: '3', label: 'Command 3' }),
		];
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(screen.getByText('Command 1')).toBeInTheDocument();
		expect(screen.getByText('Command 2')).toBeInTheDocument();
		expect(screen.getByText('Command 3')).toBeInTheDocument();
	});

	it('renders commands with correct indices', () => {
		const commands = [
			createMockCommand({ id: '1', label: 'Command 1' }),
			createMockCommand({ id: '2', label: 'Command 2' }),
		];
		const props = createMockProps({ commands });
		const { container } = renderWithProviders(<CommandPaletteList {...props} />);

		const items = container.querySelectorAll('[data-command-index]');
		expect(items).toHaveLength(2);
		expect(items[0]).toHaveAttribute('data-command-index', '0');
		expect(items[1]).toHaveAttribute('data-command-index', '1');
	});

	it('applies correct CSS classes', () => {
		const props = createMockProps();
		const { container } = renderWithProviders(<CommandPaletteList {...props} />);

		const list = container.querySelector('[role="listbox"]');
		expect(list).toHaveClass('max-h-96', 'overflow-y-auto');
	});
});

describe('CommandPaletteList - Empty State', () => {
	it('renders empty state when commands array is empty', () => {
		const props = createMockProps({ commands: [], emptyState: 'No commands available' });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(screen.getByText('No commands available')).toBeInTheDocument();
	});

	it('renders custom empty state message', () => {
		const props = createMockProps({
			commands: [],
			emptyState: <div data-testid="custom-empty">Custom empty state</div>,
		});
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
	});

	it('does not render empty state when commands exist', () => {
		const props = createMockProps({ emptyState: 'No commands found' });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(screen.queryByText('No commands found')).not.toBeInTheDocument();
		expect(screen.getByText('Command 1')).toBeInTheDocument();
	});
});

describe('CommandPaletteList - Highlighted Index', () => {
	it('highlights command at highlighted index', () => {
		const commands = [
			createMockCommand({ id: '1', label: 'Command 1' }),
			createMockCommand({ id: '2', label: 'Command 2' }),
		];
		const props = createMockProps({ commands, highlightedIndex: 1 });
		const { container } = renderWithProviders(<CommandPaletteList {...props} />);

		const items = container.querySelectorAll('[role="option"]');
		expect(items[0]).toHaveAttribute('aria-selected', 'false');
		expect(items[1]).toHaveAttribute('aria-selected', 'true');
	});

	it('highlights first command when highlightedIndex is 0', () => {
		const commands = [
			createMockCommand({ id: '1', label: 'Command 1' }),
			createMockCommand({ id: '2', label: 'Command 2' }),
		];
		const props = createMockProps({ commands, highlightedIndex: 0 });
		const { container } = renderWithProviders(<CommandPaletteList {...props} />);

		const items = container.querySelectorAll('[role="option"]');
		expect(items[0]).toHaveAttribute('aria-selected', 'true');
		expect(items[1]).toHaveAttribute('aria-selected', 'false');
	});

	it('handles highlightedIndex beyond array length', () => {
		const commands = [createMockCommand({ id: '1', label: 'Command 1' })];
		const props = createMockProps({ commands, highlightedIndex: 10 });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(screen.getByText('Command 1')).toBeInTheDocument();
	});

	it('handles negative highlightedIndex', () => {
		const commands = [createMockCommand({ id: '1', label: 'Command 1' })];
		const props = createMockProps({ commands, highlightedIndex: -1 });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(screen.getByText('Command 1')).toBeInTheDocument();
	});
});

describe('CommandPaletteList - Command Selection', () => {
	it('calls onSelect when command is clicked', async () => {
		const onSelect = vi.fn().mockResolvedValue(undefined);
		const command = createMockCommand({ id: '1', label: 'Command 1' });
		const commands = [command];
		const props = createMockProps({ commands, onSelect });
		renderWithProviders(<CommandPaletteList {...props} />);

		const button = screen.getByText('Command 1');
		fireEvent.click(button);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith(command);
	});

	it('does not call onSelect when disabled command is clicked', () => {
		const onSelect = vi.fn();
		const command = createMockCommand({ id: '1', label: 'Command 1', disabled: true });
		const commands = [command];
		const props = createMockProps({ commands, onSelect });
		renderWithProviders(<CommandPaletteList {...props} />);

		const button = screen.getByText('Command 1');
		fireEvent.click(button);

		expect(onSelect).not.toHaveBeenCalled();
	});
});

describe('CommandPaletteList - Refs', () => {
	it('assigns ref to list container', () => {
		const commandsListRef = createRef<HTMLDivElement>();
		const props = createMockProps({ commandsListRef });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(commandsListRef.current).toBeInstanceOf(HTMLDivElement);
	});

	it('ref points to listbox element', () => {
		const commandsListRef = createRef<HTMLDivElement>();
		const props = createMockProps({ commandsListRef });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(commandsListRef.current).toHaveAttribute('role', 'listbox');
	});
});

describe('CommandPaletteList - Accessibility', () => {
	it('has correct role attribute', () => {
		const props = createMockProps();
		const { container } = renderWithProviders(<CommandPaletteList {...props} />);

		const list = container.querySelector('[role="listbox"]');
		expect(list).toBeInTheDocument();
	});

	it('has aria-label attribute', () => {
		const props = createMockProps();
		const { container } = renderWithProviders(<CommandPaletteList {...props} />);

		const list = container.querySelector('[role="listbox"]');
		expect(list).toHaveAttribute('aria-label');
	});

	it('passes accessibility checks', async () => {
		const props = createMockProps();
		const { container } = renderWithProviders(<CommandPaletteList {...props} />);

		await expectA11y(container);
	});

	it('renders options with correct roles', () => {
		const commands = [
			createMockCommand({ id: '1', label: 'Command 1' }),
			createMockCommand({ id: '2', label: 'Command 2' }),
		];
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPaletteList {...props} />);

		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(2);
	});
});

describe('CommandPaletteList - Edge Cases', () => {
	it('handles single command', () => {
		const commands = [createMockCommand({ id: '1', label: 'Single Command' })];
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(screen.getByText('Single Command')).toBeInTheDocument();
	});

	it('handles many commands', () => {
		const commands = Array.from({ length: 100 }, (_, i) =>
			createMockCommand({ id: String(i), label: `Command ${i}` })
		);
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(screen.getByText('Command 0')).toBeInTheDocument();
		expect(screen.getByText('Command 99')).toBeInTheDocument();
	});

	it('handles commands with all properties', () => {
		const commands = [
			createMockCommand({
				id: '1',
				label: 'Command 1',
				description: 'Description 1',
				icon: <span>📄</span>,
				shortcut: 'Ctrl+S',
				disabled: false,
			}),
		];
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(screen.getByText('Command 1')).toBeInTheDocument();
		expect(screen.getByText('Description 1')).toBeInTheDocument();
		expect(screen.getByText('Ctrl+S')).toBeInTheDocument();
	});

	it('handles commands with minimal properties', () => {
		const commands = [
			createMockCommand({
				id: '1',
				label: 'Command 1',
			}),
		];
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(screen.getByText('Command 1')).toBeInTheDocument();
	});

	it('handles empty state as ReactNode', () => {
		const emptyState = (
			<div>
				<p>No results</p>
				<button>Clear search</button>
			</div>
		);
		const props = createMockProps({ commands: [], emptyState });
		renderWithProviders(<CommandPaletteList {...props} />);

		expect(screen.getByText('No results')).toBeInTheDocument();
		expect(screen.getByText('Clear search')).toBeInTheDocument();
	});
});
