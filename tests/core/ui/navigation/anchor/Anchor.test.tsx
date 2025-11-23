import Anchor from '@core/ui/navigation/anchor/Anchor';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock window.scrollTo
const mockScrollTo = vi.fn();
const mockPushState = vi.fn();

describe('Anchor Component - Basic Rendering', () => {
	beforeEach(() => {
		globalThis.window.scrollTo = mockScrollTo;
		globalThis.window.history.pushState = mockPushState;
		mockScrollTo.mockClear();
		mockPushState.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
		document.body.innerHTML = '';
	});

	it('renders anchor with text content', () => {
		renderWithProviders(<Anchor href="#section-1">Go to Section 1</Anchor>);

		const anchor = screen.getByRole('link', { name: 'Go to Section 1' });
		expect(anchor).toBeInTheDocument();
		expect(anchor).toHaveAttribute('href', '#section-1');
	});

	it('renders anchor with default variant and size', () => {
		renderWithProviders(<Anchor href="#about">About</Anchor>);

		const anchor = screen.getByRole('link', { name: 'About' });
		expect(anchor).toBeInTheDocument();
	});

	it('renders anchor with custom className', () => {
		renderWithProviders(
			<Anchor href="#custom" className="custom-class">
				Custom Anchor
			</Anchor>
		);

		const anchor = screen.getByRole('link', { name: 'Custom Anchor' });
		expect(anchor).toHaveClass('custom-class');
	});
});

describe('Anchor Component - Variants and Sizes', () => {
	beforeEach(() => {
		globalThis.window.scrollTo = mockScrollTo;
		globalThis.window.history.pushState = mockPushState;
		mockScrollTo.mockClear();
		mockPushState.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
		document.body.innerHTML = '';
	});

	it('renders anchor with custom variant', () => {
		renderWithProviders(
			<Anchor href="#contact" variant="subtle">
				Contact
			</Anchor>
		);

		const anchor = screen.getByRole('link', { name: 'Contact' });
		expect(anchor).toBeInTheDocument();
	});

	it('renders anchor with custom size', () => {
		renderWithProviders(
			<Anchor href="#products" size="lg">
				Products
			</Anchor>
		);

		const anchor = screen.getByRole('link', { name: 'Products' });
		expect(anchor).toBeInTheDocument();
	});

	it('renders anchor with all variants', () => {
		const variants: Array<'default' | 'subtle' | 'muted'> = ['default', 'subtle', 'muted'];

		for (const variant of variants) {
			const { unmount } = renderWithProviders(
				<Anchor href={`#${variant}`} variant={variant}>
					{variant} Anchor
				</Anchor>
			);

			const anchor = screen.getByRole('link', { name: `${variant} Anchor` });
			expect(anchor).toBeInTheDocument();
			unmount();
		}
	});

	it('renders anchor with all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const { unmount } = renderWithProviders(
				<Anchor href={`#${size}`} size={size}>
					{size} Anchor
				</Anchor>
			);

			const anchor = screen.getByRole('link', { name: `${size} Anchor` });
			expect(anchor).toBeInTheDocument();
			unmount();
		}
	});
});

describe('Anchor Component - Hash Normalization', () => {
	beforeEach(() => {
		globalThis.window.scrollTo = mockScrollTo;
		globalThis.window.history.pushState = mockPushState;
		mockScrollTo.mockClear();
		mockPushState.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
		document.body.innerHTML = '';
	});

	it('normalizes href without hash prefix', () => {
		const targetElement = document.createElement('div');
		targetElement.id = 'section-1';
		document.body.append(targetElement);

		renderWithProviders(<Anchor href="section-1">Section 1</Anchor>);

		const anchor = screen.getByRole('link', { name: 'Section 1' });
		fireEvent.click(anchor);

		expect(mockPushState).toHaveBeenCalledWith(null, '', '#section-1');
	});

	it('handles href with hash prefix', () => {
		const targetElement = document.createElement('div');
		targetElement.id = 'section-2';
		document.body.append(targetElement);

		renderWithProviders(<Anchor href="#section-2">Section 2</Anchor>);

		const anchor = screen.getByRole('link', { name: 'Section 2' });
		fireEvent.click(anchor);

		expect(mockPushState).toHaveBeenCalledWith(null, '', '#section-2');
	});
});

describe('Anchor Component - Scroll Behavior', () => {
	beforeEach(() => {
		globalThis.window.scrollTo = mockScrollTo;
		globalThis.window.history.pushState = mockPushState;
		globalThis.window.scrollY = 0;
		mockScrollTo.mockClear();
		mockPushState.mockClear();

		// Create a target element
		const targetElement = document.createElement('div');
		targetElement.id = 'target-section';
		targetElement.style.height = '100px';
		document.body.append(targetElement);
	});

	afterEach(() => {
		vi.clearAllMocks();
		document.body.innerHTML = '';
	});

	it('scrolls to target element on click', () => {
		renderWithProviders(<Anchor href="#target-section">Scroll to Target</Anchor>);

		const anchor = screen.getByRole('link', { name: 'Scroll to Target' });
		fireEvent.click(anchor);

		expect(mockScrollTo).toHaveBeenCalled();
	});

	it('uses smooth scroll behavior by default', () => {
		const targetElement = document.querySelector('#target-section');
		if (!targetElement) return;

		// Mock getBoundingClientRect
		vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
			top: 100,
			left: 0,
			bottom: 200,
			right: 0,
			width: 0,
			height: 0,
			x: 0,
			y: 0,
			toJSON: vi.fn(),
		});

		renderWithProviders(<Anchor href="#target-section">Scroll to Target</Anchor>);

		const anchor = screen.getByRole('link', { name: 'Scroll to Target' });
		fireEvent.click(anchor);

		expect(mockScrollTo).toHaveBeenCalledWith(
			expect.objectContaining({
				behavior: 'smooth',
			})
		);
	});

	it('uses custom scroll behavior', () => {
		const targetElement = document.querySelector('#target-section');
		if (!targetElement) return;

		vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
			top: 100,
			left: 0,
			bottom: 200,
			right: 0,
			width: 0,
			height: 0,
			x: 0,
			y: 0,
			toJSON: vi.fn(),
		});

		renderWithProviders(
			<Anchor href="#target-section" scrollBehavior="auto">
				Scroll to Target
			</Anchor>
		);

		const anchor = screen.getByRole('link', { name: 'Scroll to Target' });
		fireEvent.click(anchor);

		expect(mockScrollTo).toHaveBeenCalledWith(
			expect.objectContaining({
				behavior: 'auto',
			})
		);
	});

	it('applies scroll offset for fixed headers', () => {
		const targetElement = document.querySelector('#target-section');
		if (!targetElement) return;

		vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
			top: 100,
			left: 0,
			bottom: 200,
			right: 0,
			width: 0,
			height: 0,
			x: 0,
			y: 0,
			toJSON: vi.fn(),
		});

		renderWithProviders(
			<Anchor href="#target-section" scrollOffset={80}>
				Scroll to Target
			</Anchor>
		);

		const anchor = screen.getByRole('link', { name: 'Scroll to Target' });
		fireEvent.click(anchor);

		expect(mockScrollTo).toHaveBeenCalledWith(
			expect.objectContaining({
				top: expect.any(Number),
			})
		);
	});

	it('updates URL hash after scrolling', () => {
		const targetElement = document.querySelector('#target-section');
		if (!targetElement) return;

		vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
			top: 100,
			left: 0,
			bottom: 200,
			right: 0,
			width: 0,
			height: 0,
			x: 0,
			y: 0,
			toJSON: vi.fn(),
		});

		renderWithProviders(<Anchor href="#target-section">Scroll to Target</Anchor>);

		const anchor = screen.getByRole('link', { name: 'Scroll to Target' });
		fireEvent.click(anchor);

		expect(mockPushState).toHaveBeenCalledWith(null, '', '#target-section');
	});

	it('does not scroll if target element is not found', () => {
		renderWithProviders(<Anchor href="#non-existent">Non Existent</Anchor>);

		const anchor = screen.getByRole('link', { name: 'Non Existent' });
		fireEvent.click(anchor);

		expect(mockScrollTo).not.toHaveBeenCalled();
		expect(mockPushState).not.toHaveBeenCalled();
	});
});

describe('Anchor Component - Click Handling', () => {
	beforeEach(() => {
		globalThis.window.scrollTo = mockScrollTo;
		globalThis.window.history.pushState = mockPushState;
		mockScrollTo.mockClear();
		mockPushState.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
		document.body.innerHTML = '';
	});

	it('calls custom onClick handler', () => {
		const handleClick = vi.fn();
		const targetElement = document.createElement('div');
		targetElement.id = 'click-section';
		document.body.append(targetElement);

		renderWithProviders(
			<Anchor href="#click-section" onClick={handleClick}>
				Click Me
			</Anchor>
		);

		const anchor = screen.getByRole('link', { name: 'Click Me' });
		fireEvent.click(anchor);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('prevents default behavior when target exists', () => {
		const targetElement = document.createElement('div');
		targetElement.id = 'prevent-section';
		document.body.append(targetElement);

		renderWithProviders(<Anchor href="#prevent-section">Prevent Default</Anchor>);

		const anchor = screen.getByRole('link', { name: 'Prevent Default' });
		const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
		const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

		fireEvent(anchor, clickEvent);

		expect(preventDefaultSpy).toHaveBeenCalled();
	});

	it('does not prevent default if onClick prevents it', () => {
		const targetElement = document.createElement('div');
		targetElement.id = 'no-prevent-section';
		document.body.append(targetElement);

		const handleClick = vi.fn((e: React.MouseEvent<HTMLAnchorElement>) => {
			e.preventDefault();
		});

		renderWithProviders(
			<Anchor href="#no-prevent-section" onClick={handleClick}>
				No Prevent
			</Anchor>
		);

		const anchor = screen.getByRole('link', { name: 'No Prevent' });
		fireEvent.click(anchor);

		expect(handleClick).toHaveBeenCalled();
	});
});

describe('Anchor Component - Accessibility', () => {
	beforeEach(() => {
		globalThis.window.scrollTo = mockScrollTo;
		globalThis.window.history.pushState = mockPushState;
		mockScrollTo.mockClear();
		mockPushState.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
		document.body.innerHTML = '';
	});

	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Anchor href="#accessible">Accessible Anchor</Anchor>
		);

		await expectA11y(container);
	});

	it('is keyboard accessible', () => {
		renderWithProviders(<Anchor href="#keyboard">Keyboard Anchor</Anchor>);

		const anchor = screen.getByRole('link', { name: 'Keyboard Anchor' });
		anchor.focus();
		expect(anchor).toHaveFocus();
	});

	it('supports keyboard navigation with Enter key', () => {
		const targetElement = document.createElement('div');
		targetElement.id = 'enter-section';
		document.body.append(targetElement);

		renderWithProviders(<Anchor href="#enter-section">Enter Anchor</Anchor>);

		const anchor = screen.getByRole('link', { name: 'Enter Anchor' });
		anchor.focus();
		fireEvent.keyDown(anchor, { key: 'Enter', code: 'Enter' });
		expect(anchor).toHaveFocus();
	});

	it('has proper semantic HTML', () => {
		renderWithProviders(<Anchor href="#semantic">Semantic Anchor</Anchor>);

		const anchor = screen.getByRole('link', { name: 'Semantic Anchor' });
		expect(anchor).toBeInTheDocument();
		expect(anchor.tagName).toBe('A');
	});

	it('passes through additional props', () => {
		renderWithProviders(
			<Anchor href="#test" data-testid="custom-anchor" aria-label="Custom anchor">
				Test Anchor
			</Anchor>
		);

		const anchor = screen.getByTestId('custom-anchor');
		expect(anchor).toBeInTheDocument();
		expect(anchor).toHaveAttribute('aria-label', 'Custom anchor');
	});
});
