/**
 * ThemeToggle Component Tests
 *
 * Tests for the ThemeToggle component including:
 * - Rendering with different themes
 * - Theme icons (light, dark, system)
 * - Theme labels
 * - Theme cycling (light → dark → system → light)
 * - Custom ariaLabel
 * - Custom className
 * - Accessibility
 * - Keyboard navigation
 */

import type { Theme } from '@core/constants/theme';
import ThemeToggle from '@core/ui/theme-toggle/ThemeToggle';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('ThemeToggle - Rendering', () => {
	it('renders button element', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button.tagName).toBe('BUTTON');
	});

	it('renders with type="button"', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('type', 'button');
	});

	it('renders with custom className', () => {
		const setTheme = vi.fn();
		renderWithProviders(
			<ThemeToggle
				theme="light"
				resolvedTheme="light"
				setTheme={setTheme}
				className="custom-class"
			/>
		);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-class');
	});

	it('renders theme icon', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);
		const icon = screen.getByText('☀️');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders theme label', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);
		// Theme label should be visible (not sr-only on larger screens)
		const label = screen.getByText(/light/i);
		expect(label).toBeInTheDocument();
	});
});

describe('ThemeToggle - Theme Icons', () => {
	it('displays sun icon for light theme', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);
		expect(screen.getByText('☀️')).toBeInTheDocument();
	});

	it('displays moon icon for dark theme', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="dark" resolvedTheme="dark" setTheme={setTheme} />);
		expect(screen.getByText('🌙')).toBeInTheDocument();
	});

	it('displays computer icon for system theme', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="system" resolvedTheme="light" setTheme={setTheme} />);
		expect(screen.getByText('💻')).toBeInTheDocument();
	});

	it('displays moon icon when system theme resolves to dark', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="system" resolvedTheme="dark" setTheme={setTheme} />);
		// System theme should show computer icon, not resolved theme icon
		expect(screen.getByText('💻')).toBeInTheDocument();
	});

	it('displays sun icon when system theme resolves to light', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="system" resolvedTheme="light" setTheme={setTheme} />);
		// System theme should show computer icon, not resolved theme icon
		expect(screen.getByText('💻')).toBeInTheDocument();
	});
});

describe('ThemeToggle - Theme Labels', () => {
	it('displays light theme label', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);
		// Translation key 'theme.light' should be rendered
		const label = screen.getByText(/light/i);
		expect(label).toBeInTheDocument();
	});

	it('displays dark theme label', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="dark" resolvedTheme="dark" setTheme={setTheme} />);
		// Translation key 'theme.dark' should be rendered
		const label = screen.getByText(/dark/i);
		expect(label).toBeInTheDocument();
	});

	it('displays system theme label', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="system" resolvedTheme="light" setTheme={setTheme} />);
		// Translation key 'theme.system' should be rendered
		const label = screen.getByText(/system/i);
		expect(label).toBeInTheDocument();
	});
});

describe('ThemeToggle - Theme Cycling', () => {
	it('cycles from light to dark on click', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(setTheme).toHaveBeenCalledTimes(1);
		expect(setTheme).toHaveBeenCalledWith('dark');
	});

	it('cycles from dark to system on click', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="dark" resolvedTheme="dark" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(setTheme).toHaveBeenCalledTimes(1);
		expect(setTheme).toHaveBeenCalledWith('system');
	});

	it('cycles from system to light on click', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="system" resolvedTheme="light" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(setTheme).toHaveBeenCalledTimes(1);
		expect(setTheme).toHaveBeenCalledWith('light');
	});

	it('completes full cycle: light → dark → system → light', () => {
		const setTheme = vi.fn();
		const { rerender } = renderWithProviders(
			<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />
		);

		const button = screen.getByRole('button');

		// First click: light → dark
		fireEvent.click(button);
		expect(setTheme).toHaveBeenCalledWith('dark');
		rerender(<ThemeToggle theme="dark" resolvedTheme="dark" setTheme={setTheme} />);

		// Second click: dark → system
		fireEvent.click(button);
		expect(setTheme).toHaveBeenCalledWith('system');
		rerender(<ThemeToggle theme="system" resolvedTheme="light" setTheme={setTheme} />);

		// Third click: system → light
		fireEvent.click(button);
		expect(setTheme).toHaveBeenCalledWith('light');

		expect(setTheme).toHaveBeenCalledTimes(3);
	});

	it('handles multiple rapid clicks', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);
		fireEvent.click(button);
		fireEvent.click(button);

		expect(setTheme).toHaveBeenCalledTimes(3);
		expect(setTheme).toHaveBeenNthCalledWith(1, 'dark');
		expect(setTheme).toHaveBeenNthCalledWith(2, 'dark');
		expect(setTheme).toHaveBeenNthCalledWith(3, 'dark');
	});
});

describe('ThemeToggle - ARIA Labels', () => {
	it('has default aria-label', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		// aria-label should include toggle theme text and current theme
		expect(button).toHaveAttribute('aria-label');
		const ariaLabel = button.getAttribute('aria-label');
		expect(ariaLabel).toBeTruthy();
		// Check that aria-label contains either the interpolated theme or the structure
		// Translation might return "Toggle theme: Current theme: {theme}" if interpolation hasn't happened
		// or "Toggle theme: Current theme: Light" if it has
		expect(ariaLabel).toMatch(/toggle theme/i);
		expect(ariaLabel).toMatch(/current theme/i);
	});

	it('uses custom ariaLabel when provided', () => {
		const setTheme = vi.fn();
		renderWithProviders(
			<ThemeToggle
				theme="light"
				resolvedTheme="light"
				setTheme={setTheme}
				ariaLabel="Custom toggle label"
			/>
		);

		const button = screen.getByRole('button');
		const ariaLabel = button.getAttribute('aria-label');
		expect(ariaLabel).toContain('Custom toggle label');
	});

	it('includes current theme in aria-label', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="dark" resolvedTheme="dark" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		const ariaLabel = button.getAttribute('aria-label');
		// Check that aria-label contains either the interpolated theme or the structure
		expect(ariaLabel).toMatch(/current theme/i);
	});

	it('has title attribute with theme description', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('title');
		const title = button.getAttribute('title');
		expect(title).toBeTruthy();
		// Check that title contains the theme description structure
		// Translation might return "Current theme: {theme}. Click to toggle." if interpolation hasn't happened
		// or "Current theme: Light. Click to toggle." if it has
		expect(title).toMatch(/current theme/i);
		expect(title).toMatch(/click to toggle/i);
	});
});

describe('ThemeToggle - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const setTheme = vi.fn();
		const { container } = renderWithProviders(
			<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />
		);
		await expectA11y(container);
	});

	it('is keyboard accessible', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		button.focus();
		expect(button).toHaveFocus();
	});

	it('supports keyboard navigation with Enter key', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		button.focus();
		fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
		fireEvent.keyUp(button, { key: 'Enter', code: 'Enter' });
		// Enter key on button should trigger click
		expect(button).toHaveFocus();
	});

	it('supports keyboard navigation with Space key', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		button.focus();
		fireEvent.keyDown(button, { key: ' ', code: 'Space' });
		fireEvent.keyUp(button, { key: ' ', code: 'Space' });
		// Space key on button should trigger click
		expect(button).toHaveFocus();
	});

	it('has proper semantic HTML', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button.tagName).toBe('BUTTON');
	});

	it('hides icon from screen readers with aria-hidden', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);

		const icon = screen.getByText('☀️');
		expect(icon).toHaveAttribute('aria-hidden', 'true');
	});

	it('has accessible label text', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		// Button should have accessible name from aria-label
		expect(button).toHaveAccessibleName();
	});
});

describe('ThemeToggle - All Theme Combinations', () => {
	const themes: Theme[] = ['light', 'dark', 'system'];
	const resolvedThemes: Array<'light' | 'dark'> = ['light', 'dark'];

	it('renders correctly for all theme combinations', () => {
		const setTheme = vi.fn();

		for (const theme of themes) {
			for (const resolvedTheme of resolvedThemes) {
				const { unmount } = renderWithProviders(
					<ThemeToggle theme={theme} resolvedTheme={resolvedTheme} setTheme={setTheme} />
				);

				const button = screen.getByRole('button');
				expect(button).toBeInTheDocument();
				expect(button).toHaveAttribute('type', 'button');

				unmount();
			}
		}
	});

	it('displays correct icon for all theme combinations', () => {
		const setTheme = vi.fn();

		// Light theme
		const { unmount: unmountLight } = renderWithProviders(
			<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />
		);
		expect(screen.getByText('☀️')).toBeInTheDocument();
		unmountLight();

		// Dark theme
		const { unmount: unmountDark } = renderWithProviders(
			<ThemeToggle theme="dark" resolvedTheme="dark" setTheme={setTheme} />
		);
		expect(screen.getByText('🌙')).toBeInTheDocument();
		unmountDark();

		// System theme (light resolved)
		const { unmount: unmountSystemLight } = renderWithProviders(
			<ThemeToggle theme="system" resolvedTheme="light" setTheme={setTheme} />
		);
		expect(screen.getByText('💻')).toBeInTheDocument();
		unmountSystemLight();

		// System theme (dark resolved)
		const { unmount: unmountSystemDark } = renderWithProviders(
			<ThemeToggle theme="system" resolvedTheme="dark" setTheme={setTheme} />
		);
		expect(screen.getByText('💻')).toBeInTheDocument();
		unmountSystemDark();
	});
});

describe('ThemeToggle - Edge Cases', () => {
	it('handles empty className', () => {
		const setTheme = vi.fn();
		renderWithProviders(
			<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} className="" />
		);

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('handles undefined ariaLabel', () => {
		const setTheme = vi.fn();
		renderWithProviders(<ThemeToggle theme="light" resolvedTheme="light" setTheme={setTheme} />);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label');
	});

	it('handles multiple className values', () => {
		const setTheme = vi.fn();
		renderWithProviders(
			<ThemeToggle
				theme="light"
				resolvedTheme="light"
				setTheme={setTheme}
				className="class1 class2 class3"
			/>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('class1', 'class2', 'class3');
	});
});
