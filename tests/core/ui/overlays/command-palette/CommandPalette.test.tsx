/**
 * Tests for CommandPalette component
 *
 * Tests the main CommandPalette component:
 * - Rendering
 * - Open/closed state
 * - Props handling
 * - Integration with hooks
 * - Translations
 * - Accessibility
 */

import CommandPalette from '@core/ui/overlays/command-palette/CommandPalette';
import type {
	CommandPaletteCommand,
	CommandPaletteProps,
} from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock useTranslation
vi.mock('@core/i18n/useTranslation', () => ({
	useTranslation: vi.fn((namespace?: string) => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'commandPalette.placeholder': 'Search commands...',
				'commandPalette.emptyState': 'No commands found',
				'common.a11y.commands': 'Commands',
				'common.a11y.searchCommands': 'Search commands',
			};
			return translations[namespace ? `${namespace}.${key}` : key] ?? key;
		},
	})),
}));

// Mock scrollIntoView for jsdom
beforeEach(() => {
	Element.prototype.scrollIntoView = vi.fn();
});

const createMockCommand = (overrides?: Partial<CommandPaletteCommand>): CommandPaletteCommand => ({
	id: '1',
	label: 'Test Command',
	onSelect: vi.fn(),
	...overrides,
});

const createMockProps = (overrides?: Partial<CommandPaletteProps>): CommandPaletteProps => ({
	isOpen: true,
	onClose: vi.fn(),
	commands: [createMockCommand({ id: '1', label: 'Command 1' })],
	...overrides,
});

describe('CommandPalette - Rendering', () => {
	it('renders nothing when isOpen is false', () => {
		const props = createMockProps({ isOpen: false });
		const { container } = renderWithProviders(<CommandPalette {...props} />);

		expect(container.firstChild).toBeNull();
	});

	it('renders dialog when isOpen is true', () => {
		const props = createMockProps({ isOpen: true });
		renderWithProviders(<CommandPalette {...props} />);

		const dialog = screen.getByRole('dialog');
		expect(dialog).toBeInTheDocument();
	});

	it('renders search input when open', () => {
		const props = createMockProps({ isOpen: true });
		renderWithProviders(<CommandPalette {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();
	});

	it('renders commands when open', () => {
		const props = createMockProps({ isOpen: true });
		renderWithProviders(<CommandPalette {...props} />);

		expect(screen.getByText('Command 1')).toBeInTheDocument();
	});

	it('renders overlay when open', () => {
		const props = createMockProps({ isOpen: true });
		renderWithProviders(<CommandPalette {...props} />);

		// Overlay is rendered in a portal to document.body
		const overlay = document.body.querySelector('.fixed.inset-0.bg-overlay');
		expect(overlay).toBeInTheDocument();
	});
});

describe('CommandPalette - Commands', () => {
	it('renders all commands', () => {
		const commands = [
			createMockCommand({ id: '1', label: 'Command 1' }),
			createMockCommand({ id: '2', label: 'Command 2' }),
			createMockCommand({ id: '3', label: 'Command 3' }),
		];
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPalette {...props} />);

		expect(screen.getByText('Command 1')).toBeInTheDocument();
		expect(screen.getByText('Command 2')).toBeInTheDocument();
		expect(screen.getByText('Command 3')).toBeInTheDocument();
	});

	it('renders empty state when no commands', () => {
		const props = createMockProps({ commands: [] });
		renderWithProviders(<CommandPalette {...props} />);

		// Default empty state from translation
		expect(screen.getByText('No commands found')).toBeInTheDocument();
	});

	it('renders custom empty state', () => {
		const emptyState = <div data-testid="custom-empty">No results found</div>;
		const props = createMockProps({ commands: [], emptyState });
		renderWithProviders(<CommandPalette {...props} />);

		expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
	});

	it('filters commands based on search query', async () => {
		const commands = [
			createMockCommand({ id: '1', label: 'New File' }),
			createMockCommand({ id: '2', label: 'Save File' }),
			createMockCommand({ id: '3', label: 'Close Tab' }),
		];
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPalette {...props} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'save' } });

		await waitFor(() => {
			expect(screen.getByText('Save File')).toBeInTheDocument();
			expect(screen.queryByText('New File')).not.toBeInTheDocument();
			expect(screen.queryByText('Close Tab')).not.toBeInTheDocument();
		});
	});
});

describe('CommandPalette - Placeholder', () => {
	it('uses default placeholder from translation', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPalette {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('placeholder');
	});

	it('uses custom placeholder when provided', () => {
		const props = createMockProps({ placeholder: 'Type to search commands...' });
		renderWithProviders(<CommandPalette {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('placeholder', 'Type to search commands...');
	});
});

describe('CommandPalette - Close Behavior', () => {
	it('calls onClose when Escape key is pressed', () => {
		const onClose = vi.fn();
		const props = createMockProps({ onClose, closeOnEscape: true });
		renderWithProviders(<CommandPalette {...props} />);

		const dialog = screen.getByRole('dialog');
		fireEvent.keyDown(dialog, { key: 'Escape' });

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose when Escape is pressed and closeOnEscape is false', () => {
		const onClose = vi.fn();
		const props = createMockProps({ onClose, closeOnEscape: false });
		renderWithProviders(<CommandPalette {...props} />);

		const dialog = screen.getByRole('dialog');
		fireEvent.keyDown(dialog, { key: 'Escape' });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('calls onClose when overlay is clicked', () => {
		const onClose = vi.fn();
		const props = createMockProps({ onClose, closeOnOverlayClick: true });
		renderWithProviders(<CommandPalette {...props} />);

		// Overlay is rendered in a portal to document.body
		const overlay = document.body.querySelector('.fixed.inset-0.bg-overlay') as HTMLElement;
		expect(overlay).toBeInTheDocument();
		fireEvent.click(overlay);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose when overlay is clicked and closeOnOverlayClick is false', () => {
		const onClose = vi.fn();
		const props = createMockProps({ onClose, closeOnOverlayClick: false });
		renderWithProviders(<CommandPalette {...props} />);

		// Overlay is rendered in a portal to document.body
		const overlay = document.body.querySelector('.fixed.inset-0.bg-overlay') as HTMLElement;
		expect(overlay).toBeInTheDocument();
		fireEvent.click(overlay);

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('CommandPalette - Command Selection', () => {
	it('calls command onSelect when command is clicked', async () => {
		const commandOnSelect = vi.fn().mockResolvedValue(undefined);
		const command = createMockCommand({ id: '1', label: 'Command 1', onSelect: commandOnSelect });
		const props = createMockProps({ commands: [command] });
		renderWithProviders(<CommandPalette {...props} />);

		const button = screen.getByText('Command 1');
		fireEvent.click(button);

		await waitFor(() => {
			expect(commandOnSelect).toHaveBeenCalledTimes(1);
		});
	});

	it('calls props onSelect when provided', async () => {
		const propsOnSelect = vi.fn();
		const command = createMockCommand({ id: '1', label: 'Command 1' });
		const props = createMockProps({ commands: [command], onSelect: propsOnSelect });
		renderWithProviders(<CommandPalette {...props} />);

		const button = screen.getByText('Command 1');
		fireEvent.click(button);

		await waitFor(() => {
			expect(propsOnSelect).toHaveBeenCalledWith(command);
		});
	});

	it('calls both command onSelect and props onSelect', async () => {
		const commandOnSelect = vi.fn().mockResolvedValue(undefined);
		const propsOnSelect = vi.fn();
		const command = createMockCommand({ id: '1', label: 'Command 1', onSelect: commandOnSelect });
		const props = createMockProps({ commands: [command], onSelect: propsOnSelect });
		renderWithProviders(<CommandPalette {...props} />);

		const button = screen.getByText('Command 1');
		fireEvent.click(button);

		await waitFor(() => {
			expect(commandOnSelect).toHaveBeenCalledTimes(1);
			expect(propsOnSelect).toHaveBeenCalledWith(command);
		});
	});

	it('does not call onSelect when command is disabled', () => {
		const propsOnSelect = vi.fn();
		const command = createMockCommand({ id: '1', label: 'Command 1', disabled: true });
		const props = createMockProps({ commands: [command], onSelect: propsOnSelect });
		renderWithProviders(<CommandPalette {...props} />);

		const button = screen.getByText('Command 1');
		fireEvent.click(button);

		expect(propsOnSelect).not.toHaveBeenCalled();
	});
});

describe('CommandPalette - Styling', () => {
	it('applies custom className to dialog', () => {
		const props = createMockProps({ className: 'custom-palette-class' });
		renderWithProviders(<CommandPalette {...props} />);

		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveClass('custom-palette-class');
	});

	it('applies custom overlayClassName to overlay', () => {
		const props = createMockProps({ overlayClassName: 'custom-overlay-class' });
		renderWithProviders(<CommandPalette {...props} />);

		// Overlay is rendered in a portal to document.body
		const overlay = document.body.querySelector('.fixed.inset-0.bg-overlay');
		expect(overlay).toBeInTheDocument();
		expect(overlay).toHaveClass('custom-overlay-class');
	});
});

describe('CommandPalette - Keyboard Navigation', () => {
	it('navigates with ArrowDown key', () => {
		const commands = [
			createMockCommand({ id: '1', label: 'Command 1' }),
			createMockCommand({ id: '2', label: 'Command 2' }),
		];
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPalette {...props} />);

		const dialog = screen.getByRole('dialog');
		fireEvent.keyDown(dialog, { key: 'ArrowDown' });

		// Commands are rendered in a portal
		const options = document.body.querySelectorAll('[role="option"]');
		expect(options).toHaveLength(2);
	});

	it('navigates with ArrowUp key', () => {
		const commands = [
			createMockCommand({ id: '1', label: 'Command 1' }),
			createMockCommand({ id: '2', label: 'Command 2' }),
		];
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPalette {...props} />);

		const dialog = screen.getByRole('dialog');
		fireEvent.keyDown(dialog, { key: 'ArrowUp' });

		// Should wrap to last command
		expect(screen.getByText('Command 2')).toBeInTheDocument();
	});

	it('selects command with Enter key', async () => {
		const commandOnSelect = vi.fn().mockResolvedValue(undefined);
		const command = createMockCommand({ id: '1', label: 'Command 1', onSelect: commandOnSelect });
		const props = createMockProps({ commands: [command] });
		renderWithProviders(<CommandPalette {...props} />);

		const dialog = screen.getByRole('dialog');
		fireEvent.keyDown(dialog, { key: 'Enter' });

		await waitFor(() => {
			expect(commandOnSelect).toHaveBeenCalledTimes(1);
		});
	});
});

describe('CommandPalette - Accessibility', () => {
	it('has dialog role', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPalette {...props} />);

		const dialog = screen.getByRole('dialog');
		expect(dialog).toBeInTheDocument();
	});

	it('has accessible search input', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPalette {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('aria-label');
	});

	it('has accessible listbox', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPalette {...props} />);

		// Listbox is rendered in a portal to document.body
		const listbox = document.body.querySelector('[role="listbox"]');
		expect(listbox).toBeInTheDocument();
		expect(listbox).toHaveAttribute('aria-label');
	});

	it('passes accessibility checks', async () => {
		const props = createMockProps();
		const { container } = renderWithProviders(<CommandPalette {...props} />);

		await expectA11y(container);
	});
});

describe('CommandPalette - Integration', () => {
	it('works with controlled open state', () => {
		const TestComponent = () => {
			const [isOpen, setIsOpen] = useState(false);
			const commands = [createMockCommand({ id: '1', label: 'Command 1' })];

			return (
				<div>
					<button onClick={() => setIsOpen(true)}>Open</button>
					<CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} commands={commands} />
				</div>
			);
		};

		renderWithProviders(<TestComponent />);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

		const openButton = screen.getByText('Open');
		fireEvent.click(openButton);

		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('handles state changes correctly', () => {
		const props = createMockProps({ isOpen: true });
		const { rerender } = renderWithProviders(<CommandPalette {...props} />);

		expect(screen.getByRole('dialog')).toBeInTheDocument();

		rerender(<CommandPalette {...props} isOpen={false} />);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});
});

describe('CommandPalette - Edge Cases', () => {
	it('handles empty commands array', () => {
		const props = createMockProps({ commands: [] });
		renderWithProviders(<CommandPalette {...props} />);

		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('handles commands with all optional properties', () => {
		const commands = [
			createMockCommand({
				id: '1',
				label: 'Command 1',
				description: 'Description',
				icon: <span>📄</span>,
				shortcut: 'Ctrl+S',
				keywords: ['test'],
				group: 'File',
			}),
		];
		const props = createMockProps({ commands });
		renderWithProviders(<CommandPalette {...props} />);

		expect(screen.getByText('Command 1')).toBeInTheDocument();
		expect(screen.getByText('Description')).toBeInTheDocument();
		expect(screen.getByText('Ctrl+S')).toBeInTheDocument();
	});

	it('handles undefined placeholder', () => {
		const props = createMockProps({});
		renderWithProviders(<CommandPalette {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();
	});

	it('handles undefined emptyState', () => {
		const props = createMockProps({ commands: [], emptyState: undefined });
		renderWithProviders(<CommandPalette {...props} />);

		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});
