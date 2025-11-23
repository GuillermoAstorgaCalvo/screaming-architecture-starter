/**
 * SplitButton Component Tests
 *
 * Tests for the SplitButton component including:
 * - Rendering
 * - User interactions
 * - Variants and sizes
 * - Loading and disabled states
 * - Menu item selection
 * - Accessibility
 */

import SplitButton from '@core/ui/split-button/SplitButton';
import type { StandardSize } from '@src-types/ui/base';
import type { ButtonVariant, SplitButtonProps } from '@src-types/ui/buttons';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createMenuItems = (): SplitButtonProps['menuItems'] => [
	{ id: '1', label: 'Save As...' },
	{ id: '2', type: 'separator' },
	{ id: '3', label: 'Export' },
];

describe('SplitButton - Rendering', () => {
	it('renders split button with main button and dropdown trigger', () => {
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={vi.fn()}>
				Save
			</SplitButton>
		);

		const mainButton = screen.getByRole('button', { name: 'Save' });
		const dropdownButton = screen.getByRole('button', { name: /more options/i });

		expect(mainButton).toBeInTheDocument();
		expect(dropdownButton).toBeInTheDocument();
	});

	it('renders children in main button', () => {
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={vi.fn()}>
				Save Document
			</SplitButton>
		);

		expect(screen.getByText('Save Document')).toBeInTheDocument();
	});

	it('renders with default variant', () => {
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={vi.fn()}>
				Save
			</SplitButton>
		);

		const mainButton = screen.getByRole('button', { name: 'Save' });
		expect(mainButton).toBeInTheDocument();
	});

	it('renders with different variants', () => {
		const variants: SplitButtonProps['variant'][] = ['primary', 'secondary', 'ghost'];

		for (const variant of variants) {
			const { unmount } = renderWithProviders(
				<SplitButton
					variant={variant as ButtonVariant}
					menuItems={createMenuItems()}
					onClick={vi.fn()}
				>
					Save
				</SplitButton>
			);

			const mainButton = screen.getByRole('button', { name: 'Save' });
			expect(mainButton).toBeInTheDocument();

			unmount();
		}
	});

	it('renders with different sizes', () => {
		const sizes: SplitButtonProps['size'][] = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const { unmount } = renderWithProviders(
				<SplitButton size={size as StandardSize} menuItems={createMenuItems()} onClick={vi.fn()}>
					Save
				</SplitButton>
			);

			const mainButton = screen.getByRole('button', { name: 'Save' });
			expect(mainButton).toBeInTheDocument();

			unmount();
		}
	});

	it('renders dropdown trigger with correct aria-label', () => {
		renderWithProviders(
			<SplitButton
				menuItems={createMenuItems()}
				onClick={vi.fn()}
				dropdownAriaLabel="Custom dropdown"
			>
				Save
			</SplitButton>
		);

		const dropdownButton = screen.getByRole('button', { name: 'Custom dropdown' });
		expect(dropdownButton).toBeInTheDocument();
	});
});

describe('SplitButton - User Interactions', () => {
	it('calls onClick when main button is clicked', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={onClick}>
				Save
			</SplitButton>
		);

		const mainButton = screen.getByRole('button', { name: 'Save' });
		fireEvent.click(mainButton);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when disabled', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={onClick} disabled>
				Save
			</SplitButton>
		);

		const mainButton = screen.getByRole('button', { name: 'Save' });
		fireEvent.click(mainButton);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('does not call onClick when isLoading', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={onClick} isLoading>
				Save
			</SplitButton>
		);

		const mainButton = screen.getByRole('button', { name: /loading save/i });
		fireEvent.click(mainButton);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('calls onMenuItemSelect when menu item is selected', async () => {
		const onMenuItemSelect = vi.fn();
		const menuItems: SplitButtonProps['menuItems'] = [
			{ id: '1', label: 'Save As...', onSelect: vi.fn() },
		];

		renderWithProviders(
			<SplitButton menuItems={menuItems} onClick={vi.fn()} onMenuItemSelect={onMenuItemSelect}>
				Save
			</SplitButton>
		);

		const dropdownButton = screen.getByRole('button', { name: /more options/i });
		fireEvent.click(dropdownButton);

		await waitFor(() => {
			const menuItem = screen.getByText('Save As...');
			expect(menuItem).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText('Save As...'));

		await waitFor(() => {
			expect(onMenuItemSelect).toHaveBeenCalledTimes(1);
		});
		expect(onMenuItemSelect).toHaveBeenCalledWith(menuItems[0]);
	});

	it('calls item.onSelect when menu item is selected', async () => {
		const itemOnSelect = vi.fn();
		const menuItems: SplitButtonProps['menuItems'] = [
			{ id: '1', label: 'Save As...', onSelect: itemOnSelect },
		];

		renderWithProviders(
			<SplitButton menuItems={menuItems} onClick={vi.fn()}>
				Save
			</SplitButton>
		);

		const dropdownButton = screen.getByRole('button', { name: /more options/i });
		fireEvent.click(dropdownButton);

		await waitFor(() => {
			const menuItem = screen.getByText('Save As...');
			expect(menuItem).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText('Save As...'));

		await waitFor(() => {
			expect(itemOnSelect).toHaveBeenCalledTimes(1);
		});
	});

	it('handles async item.onSelect', async () => {
		const itemOnSelect = vi.fn().mockResolvedValue(undefined);
		const menuItems: SplitButtonProps['menuItems'] = [
			{ id: '1', label: 'Save As...', onSelect: itemOnSelect },
		];

		renderWithProviders(
			<SplitButton menuItems={menuItems} onClick={vi.fn()}>
				Save
			</SplitButton>
		);

		const dropdownButton = screen.getByRole('button', { name: /more options/i });
		fireEvent.click(dropdownButton);

		await waitFor(() => {
			const menuItem = screen.getByText('Save As...');
			expect(menuItem).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText('Save As...'));

		await waitFor(() => {
			expect(itemOnSelect).toHaveBeenCalledTimes(1);
		});
	});
});

describe('SplitButton - States', () => {
	it('disables main button when disabled prop is true', () => {
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={vi.fn()} disabled>
				Save
			</SplitButton>
		);

		const mainButton = screen.getByRole('button', { name: 'Save' });
		expect(mainButton).toBeDisabled();
	});

	it('disables dropdown trigger when disabled prop is true', () => {
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={vi.fn()} disabled>
				Save
			</SplitButton>
		);

		const dropdownButton = screen.getByRole('button', { name: /more options/i });
		expect(dropdownButton).toBeDisabled();
	});

	it('disables main button when isLoading is true', () => {
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={vi.fn()} isLoading>
				Save
			</SplitButton>
		);

		const mainButton = screen.getByRole('button', { name: /loading save/i });
		expect(mainButton).toBeDisabled();
	});

	it('disables dropdown trigger when isLoading is true', () => {
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={vi.fn()} isLoading>
				Save
			</SplitButton>
		);

		const dropdownButton = screen.getByRole('button', { name: /more options/i });
		expect(dropdownButton).toBeDisabled();
	});
});

describe('SplitButton - Accessibility', () => {
	it('should have no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={vi.fn()}>
				Save
			</SplitButton>
		);

		await expectA11y(container);
	});

	it('should have accessible main button', () => {
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={vi.fn()}>
				Save
			</SplitButton>
		);

		const mainButton = screen.getByRole('button', { name: 'Save' });
		expect(mainButton).toBeInTheDocument();
	});

	it('should have accessible dropdown trigger', () => {
		renderWithProviders(
			<SplitButton menuItems={createMenuItems()} onClick={vi.fn()}>
				Save
			</SplitButton>
		);

		const dropdownButton = screen.getByRole('button', { name: /more options/i });
		expect(dropdownButton).toHaveAttribute('aria-label');
	});
});
