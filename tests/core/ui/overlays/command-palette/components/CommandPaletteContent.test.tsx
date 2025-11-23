/**
 * Tests for CommandPaletteContent component
 *
 * Tests the main content container component:
 * - Rendering
 * - Component composition
 * - Props passing
 * - Keyboard event handling
 * - Accessibility
 */

import { CommandPaletteContent } from '@core/ui/overlays/command-palette/components/CommandPaletteContent';
import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import type { CommandPaletteContentProps } from '@core/ui/overlays/command-palette/types/CommandPaletteParts.types';
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
	overrides?: Partial<CommandPaletteContentProps>
): CommandPaletteContentProps => ({
	id: 'test-palette',
	className: '',
	searchQuery: '',
	onSearchChange: vi.fn(),
	searchInputRef: createRef<HTMLInputElement>(),
	placeholder: 'Search commands...',
	commands: [createMockCommand({ id: '1', label: 'Command 1' })],
	highlightedIndex: 0,
	commandsListRef: createRef<HTMLDivElement>(),
	onKeyDown: vi.fn(),
	onSelect: vi.fn().mockResolvedValue(undefined),
	emptyState: 'No commands found',
	searchIcon: <span data-testid="search-icon">🔍</span>,
	...overrides,
});

describe('CommandPaletteContent - Rendering', () => {
	it('renders dialog element', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteContent {...props} />);

		const dialog = screen.getByRole('dialog');
		expect(dialog).toBeInTheDocument();
	});

	it('renders search input', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteContent {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();
	});

	it('renders commands list', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteContent {...props} />);

		expect(screen.getByText('Command 1')).toBeInTheDocument();
	});

	it('applies id to dialog', () => {
		const props = createMockProps({ id: 'custom-palette-id' });
		renderWithProviders(<CommandPaletteContent {...props} />);

		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('id', 'custom-palette-id');
	});

	it('applies custom className to dialog', () => {
		const props = createMockProps({ className: 'custom-dialog-class' });
		renderWithProviders(<CommandPaletteContent {...props} />);

		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveClass('custom-dialog-class');
	});

	it('renders with padding container', () => {
		const props = createMockProps();
		const { container } = renderWithProviders(<CommandPaletteContent {...props} />);

		const paddingContainer = container.querySelector('.p-4');
		expect(paddingContainer).toBeInTheDocument();
	});
});

describe('CommandPaletteContent - Component Composition', () => {
	it('renders CommandPaletteSearchInput with correct props', () => {
		const onSearchChange = vi.fn();
		const searchInputRef = createRef<HTMLInputElement>();
		const props = createMockProps({
			searchQuery: 'test query',
			onSearchChange,
			searchInputRef,
			placeholder: 'Custom placeholder',
		});
		renderWithProviders(<CommandPaletteContent {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('test query');
		expect(input).toHaveAttribute('placeholder', 'Custom placeholder');
	});

	it('renders CommandPaletteList with correct props', () => {
		const commands = [
			createMockCommand({ id: '1', label: 'Command 1' }),
			createMockCommand({ id: '2', label: 'Command 2' }),
		];
		const onSelect = vi.fn().mockResolvedValue(undefined);
		const props = createMockProps({
			commands,
			highlightedIndex: 1,
			onSelect,
			emptyState: 'No results',
		});
		renderWithProviders(<CommandPaletteContent {...props} />);

		expect(screen.getByText('Command 1')).toBeInTheDocument();
		expect(screen.getByText('Command 2')).toBeInTheDocument();
	});

	it('passes searchIcon to search input', () => {
		const searchIcon = <span data-testid="custom-search-icon">🔎</span>;
		const props = createMockProps({ searchIcon });
		renderWithProviders(<CommandPaletteContent {...props} />);

		expect(screen.getByTestId('custom-search-icon')).toBeInTheDocument();
	});
});

describe('CommandPaletteContent - Keyboard Events', () => {
	it('calls onKeyDown when key is pressed on dialog', () => {
		const onKeyDown = vi.fn();
		const props = createMockProps({ onKeyDown });
		renderWithProviders(<CommandPaletteContent {...props} />);

		const dialog = screen.getByRole('dialog');
		fireEvent.keyDown(dialog, { key: 'ArrowDown' });

		expect(onKeyDown).toHaveBeenCalledTimes(1);
	});

	it('passes keyboard event to onKeyDown handler', () => {
		const onKeyDown = vi.fn();
		const props = createMockProps({ onKeyDown });
		renderWithProviders(<CommandPaletteContent {...props} />);

		const dialog = screen.getByRole('dialog');
		fireEvent.keyDown(dialog, { key: 'Escape' });

		expect(onKeyDown).toHaveBeenCalledWith(
			expect.objectContaining({
				key: 'Escape',
			})
		);
	});

	it('handles different keyboard keys', () => {
		const onKeyDown = vi.fn();
		const props = createMockProps({ onKeyDown });
		renderWithProviders(<CommandPaletteContent {...props} />);

		const dialog = screen.getByRole('dialog');
		const keys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Home', 'End'];

		for (const key of keys) {
			fireEvent.keyDown(dialog, { key });
		}

		expect(onKeyDown).toHaveBeenCalledTimes(keys.length);
	});
});

describe('CommandPaletteContent - Props Passing', () => {
	it('passes searchQuery to search input', () => {
		const props = createMockProps({ searchQuery: 'search term' });
		renderWithProviders(<CommandPaletteContent {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('search term');
	});

	it('passes onSearchChange to search input', () => {
		const onSearchChange = vi.fn();
		const props = createMockProps({ onSearchChange });
		renderWithProviders(<CommandPaletteContent {...props} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'new query' } });

		expect(onSearchChange).toHaveBeenCalledWith('new query');
	});

	it('passes searchInputRef to search input', () => {
		const searchInputRef = createRef<HTMLInputElement>();
		const props = createMockProps({ searchInputRef });
		renderWithProviders(<CommandPaletteContent {...props} />);

		expect(searchInputRef.current).toBeInstanceOf(HTMLInputElement);
	});

	it('passes commands to list', () => {
		const commands = [
			createMockCommand({ id: '1', label: 'Command 1' }),
			createMockCommand({ id: '2', label: 'Command 2' }),
		];
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPaletteContent {...props} />);

		expect(screen.getByText('Command 1')).toBeInTheDocument();
		expect(screen.getByText('Command 2')).toBeInTheDocument();
	});

	it('passes highlightedIndex to list', () => {
		const commands = [
			createMockCommand({ id: '1', label: 'Command 1' }),
			createMockCommand({ id: '2', label: 'Command 2' }),
		];
		const props = createMockProps({ commands, highlightedIndex: 1 });
		const { container } = renderWithProviders(<CommandPaletteContent {...props} />);

		const options = container.querySelectorAll('[role="option"]');
		expect(options[0]).toHaveAttribute('aria-selected', 'false');
		expect(options[1]).toHaveAttribute('aria-selected', 'true');
	});

	it('passes commandsListRef to list', () => {
		const commandsListRef = createRef<HTMLDivElement>();
		const props = createMockProps({ commandsListRef });
		renderWithProviders(<CommandPaletteContent {...props} />);

		expect(commandsListRef.current).toBeInstanceOf(HTMLDivElement);
	});

	it('passes onSelect to list', async () => {
		const onSelect = vi.fn().mockResolvedValue(undefined);
		const command = createMockCommand({ id: '1', label: 'Command 1' });
		const props = createMockProps({ commands: [command], onSelect });
		renderWithProviders(<CommandPaletteContent {...props} />);

		const button = screen.getByText('Command 1');
		fireEvent.click(button);

		expect(onSelect).toHaveBeenCalledWith(command);
	});

	it('passes emptyState to list', () => {
		const props = createMockProps({ commands: [], emptyState: 'Custom empty message' });
		renderWithProviders(<CommandPaletteContent {...props} />);

		expect(screen.getByText('Custom empty message')).toBeInTheDocument();
	});
});

describe('CommandPaletteContent - Accessibility', () => {
	it('has dialog role', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteContent {...props} />);

		const dialog = screen.getByRole('dialog');
		expect(dialog).toBeInTheDocument();
	});

	it('has aria-labelledby attribute', () => {
		const props = createMockProps({ id: 'test-palette' });
		renderWithProviders(<CommandPaletteContent {...props} />);

		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('aria-labelledby', 'test-palette-title');
	});

	it('passes accessibility checks', async () => {
		const props = createMockProps();
		const { container } = renderWithProviders(<CommandPaletteContent {...props} />);

		await expectA11y(container);
	});

	it('has open attribute on dialog', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteContent {...props} />);

		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('open');
	});
});

describe('CommandPaletteContent - Edge Cases', () => {
	it('handles empty commands array', () => {
		const props = createMockProps({ commands: [] });
		renderWithProviders(<CommandPaletteContent {...props} />);

		expect(screen.getByText('No commands found')).toBeInTheDocument();
	});

	it('handles undefined className', () => {
		const props = createMockProps({});
		renderWithProviders(<CommandPaletteContent {...props} />);

		const dialog = screen.getByRole('dialog');
		expect(dialog).toBeInTheDocument();
	});

	it('handles many commands', () => {
		const commands = Array.from({ length: 50 }, (_, i) =>
			createMockCommand({ id: String(i), label: `Command ${i}` })
		);
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPaletteContent {...props} />);

		expect(screen.getByText('Command 0')).toBeInTheDocument();
		expect(screen.getByText('Command 49')).toBeInTheDocument();
	});

	it('handles rapid prop changes', () => {
		const props = createMockProps({ searchQuery: 'initial' });
		const { rerender } = renderWithProviders(<CommandPaletteContent {...props} />);

		let input = screen.getByRole('textbox');
		expect(input).toHaveValue('initial');

		rerender(<CommandPaletteContent {...props} searchQuery="updated" />);
		input = screen.getByRole('textbox');
		expect(input).toHaveValue('updated');

		rerender(<CommandPaletteContent {...props} searchQuery="updated" highlightedIndex={1} />);
		input = screen.getByRole('textbox');
		expect(input).toHaveValue('updated');
	});
});
