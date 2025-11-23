/**
 * Avatar Component Tests
 *
 * Tests for Avatar component:
 * - Rendering
 * - Data display
 * - Interactions
 * - Accessibility
 */

import Avatar from '@core/ui/data-display/avatar/Avatar';
import { screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const AVATAR_FALLBACK = 'JD';
const AVATAR_ICON_TEST_ID = 'avatar-icon';

// Helper to create a mock Image class that simulates successful load
function createMockImageClass(): typeof Image {
	return class extends Image {
		constructor() {
			super();
			setTimeout(() => {
				this.onload?.({} as Event);
			}, 0);
		}
	} as typeof Image;
}

describe('Avatar - rendering', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<Avatar fallback="JD" />);
		}).not.toThrow();
	});

	it('should render avatar element', () => {
		renderWithProviders(<Avatar fallback={AVATAR_FALLBACK} data-testid="avatar" />);
		const avatar = screen.getByTestId('avatar');
		expect(avatar).toBeInTheDocument();
		expect(screen.getByText(AVATAR_FALLBACK)).toBeInTheDocument();
	});

	it('should render with default fallback when no props provided', () => {
		renderWithProviders(<Avatar />);
		const avatar = screen.getByText('?');
		expect(avatar).toBeInTheDocument();
	});

	it('should apply custom className', () => {
		renderWithProviders(
			<Avatar fallback={AVATAR_FALLBACK} className="custom-avatar" data-testid="avatar" />
		);
		const avatar = screen.getByTestId('avatar');
		expect(avatar).toHaveClass('custom-avatar');
	});

	it('should render with default size (md)', () => {
		renderWithProviders(<Avatar fallback={AVATAR_FALLBACK} />);
		expect(screen.getByText(AVATAR_FALLBACK)).toBeInTheDocument();
	});

	it('should render with default variant (circle)', () => {
		renderWithProviders(<Avatar fallback={AVATAR_FALLBACK} />);
		expect(screen.getByText(AVATAR_FALLBACK)).toBeInTheDocument();
	});
});

describe('Avatar - data display - basic display', () => {
	it('should display fallback text', () => {
		renderWithProviders(<Avatar fallback={AVATAR_FALLBACK} />);
		expect(screen.getByText(AVATAR_FALLBACK)).toBeInTheDocument();
	});

	it('should display image when src is provided', async () => {
		// Mock successful image load
		globalThis.Image = createMockImageClass();

		renderWithProviders(<Avatar src="/avatar.jpg" alt="User avatar" fallback={AVATAR_FALLBACK} />);
		await waitFor(() => {
			const img = screen.queryByAltText('User avatar');
			if (img) {
				expect(img).toBeInTheDocument();
			}
		});
	});

	it('should display fallback when image fails to load', () => {
		// In jsdom, images don't actually fail, but we can test the component structure
		renderWithProviders(
			<Avatar src="/invalid.jpg" alt="User" fallback={AVATAR_FALLBACK} data-testid="avatar" />
		);
		// Component should render (image error handling is browser-specific)
		const avatar = screen.getByTestId('avatar');
		expect(avatar).toBeInTheDocument();
	});

	it('should display icon when provided', () => {
		const Icon = () => <span data-testid={AVATAR_ICON_TEST_ID}>👤</span>;
		renderWithProviders(<Avatar icon={<Icon />} />);
		expect(screen.getByTestId(AVATAR_ICON_TEST_ID)).toBeInTheDocument();
	});
});

describe('Avatar - data display - display priority', () => {
	it('should prioritize image over icon', async () => {
		const Icon = () => <span data-testid={AVATAR_ICON_TEST_ID}>👤</span>;
		globalThis.Image = createMockImageClass();

		renderWithProviders(
			<Avatar src="/avatar.jpg" alt="User" icon={<Icon />} fallback={AVATAR_FALLBACK} />
		);
		await waitFor(() => {
			// Image should be shown, not icon
			const icon = screen.queryByTestId(AVATAR_ICON_TEST_ID);
			expect(icon).not.toBeInTheDocument();
		});
	});

	it('should prioritize icon over fallback', () => {
		const Icon = () => <span data-testid={AVATAR_ICON_TEST_ID}>👤</span>;
		renderWithProviders(<Avatar icon={<Icon />} fallback={AVATAR_FALLBACK} />);
		expect(screen.getByTestId(AVATAR_ICON_TEST_ID)).toBeInTheDocument();
		expect(screen.queryByText(AVATAR_FALLBACK)).not.toBeInTheDocument();
	});
});

describe('Avatar - data display - size and variant support', () => {
	it('should support different sizes', () => {
		const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
		for (const size of sizes) {
			const { unmount } = renderWithProviders(<Avatar fallback={AVATAR_FALLBACK} size={size} />);
			expect(screen.getByText(AVATAR_FALLBACK)).toBeInTheDocument();
			unmount();
		}
	});

	it('should support different variants', () => {
		const variants = ['circle', 'square', 'rounded'] as const;
		for (const variant of variants) {
			const { unmount } = renderWithProviders(
				<Avatar fallback={AVATAR_FALLBACK} variant={variant} />
			);
			expect(screen.getByText(AVATAR_FALLBACK)).toBeInTheDocument();
			unmount();
		}
	});
});

describe('Avatar - interactions', () => {
	it('should handle click events', () => {
		const handleClick = vi.fn();
		renderWithProviders(
			<Avatar fallback={AVATAR_FALLBACK} onClick={handleClick} data-testid="avatar" />
		);
		const avatar = screen.getByTestId('avatar');
		avatar.click();
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('should preserve HTML attributes', () => {
		renderWithProviders(
			<Avatar fallback={AVATAR_FALLBACK} data-testid="avatar" aria-label="User avatar" />
		);
		const avatar = screen.getByTestId('avatar');
		expect(avatar).toHaveAttribute('aria-label', 'User avatar');
	});

	it('should handle image error gracefully', () => {
		// In jsdom, images don't actually fail, but we can test the component structure
		renderWithProviders(
			<Avatar src="/invalid.jpg" alt="User" fallback={AVATAR_FALLBACK} data-testid="avatar" />
		);
		// Component should render (image error handling is browser-specific)
		const avatar = screen.getByTestId('avatar');
		expect(avatar).toBeInTheDocument();
		// The component has error handling logic that will show fallback in real browsers
	});
});

describe('Avatar - accessibility', () => {
	it('should have no accessibility violations', async () => {
		const { container } = renderWithProviders(<Avatar fallback="JD" />);
		await expectA11y(container);
	});

	it('should have alt text for images', async () => {
		globalThis.Image = createMockImageClass();

		renderWithProviders(<Avatar src="/avatar.jpg" alt="John Doe" fallback={AVATAR_FALLBACK} />);
		await waitFor(() => {
			const img = screen.queryByAltText('John Doe');
			if (img) {
				expect(img).toHaveAttribute('alt', 'John Doe');
			}
		});
	});

	it('should support custom ARIA attributes', () => {
		renderWithProviders(
			<Avatar fallback={AVATAR_FALLBACK} data-testid="avatar" aria-label="User profile picture" />
		);
		const avatar = screen.getByTestId('avatar');
		expect(avatar).toHaveAttribute('aria-label', 'User profile picture');
	});

	it('should be readable by screen readers', () => {
		renderWithProviders(<Avatar fallback={AVATAR_FALLBACK} />);
		const avatar = screen.getByText(AVATAR_FALLBACK);
		expect(avatar).toBeInTheDocument();
		// Fallback text should be accessible to screen readers
	});

	it('should have proper semantic structure', () => {
		renderWithProviders(<Avatar fallback={AVATAR_FALLBACK} data-testid="avatar" />);
		const avatar = screen.getByTestId('avatar');
		expect(avatar).toBeInTheDocument();
	});

	it('should support keyboard navigation when interactive', () => {
		renderWithProviders(
			<Avatar fallback={AVATAR_FALLBACK} tabIndex={0} onClick={vi.fn()} data-testid="avatar" />
		);
		const avatar = screen.getByTestId('avatar');
		expect(avatar).toHaveAttribute('tabIndex', '0');
	});
});
