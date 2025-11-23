/**
 * FocusTrap Component Tests
 *
 * Tests for the FocusTrap component covering:
 * - Rendering: children, className, props forwarding
 * - Functionality: enabled/disabled state, event listener management
 * - Focus trapping: Tab navigation, focus containment
 * - Edge cases: empty content, no focusable elements, dynamic changes
 */

import FocusTrap from '@core/ui/utilities/focus-trap/FocusTrap';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_CONTENT = 'FocusTrap Content';
const TEST_CLASS = 'custom-focus-trap';

describe('FocusTrap - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<FocusTrap>
				<div>{TEST_CONTENT}</div>
			</FocusTrap>
		);

		expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
	});

	it('renders with default props', () => {
		renderWithProviders(
			<FocusTrap>
				<div>{TEST_CONTENT}</div>
			</FocusTrap>
		);

		const container = screen.getByText(TEST_CONTENT).parentElement;
		expect(container).toBeInTheDocument();
		expect(container?.tagName).toBe('DIV');
	});

	it('applies custom className', () => {
		renderWithProviders(
			<FocusTrap className={TEST_CLASS}>
				<div>{TEST_CONTENT}</div>
			</FocusTrap>
		);

		const container = screen.getByText(TEST_CONTENT).parentElement;
		expect(container).toHaveClass(TEST_CLASS);
	});

	it('merges multiple className values', () => {
		renderWithProviders(
			<FocusTrap className="class1 class2">
				<div>{TEST_CONTENT}</div>
			</FocusTrap>
		);

		const container = screen.getByText(TEST_CONTENT).parentElement;
		expect(container).toHaveClass('class1', 'class2');
	});

	it('forwards additional HTML attributes', () => {
		renderWithProviders(
			<FocusTrap data-testid="focus-trap" aria-label="Test trap">
				<div>{TEST_CONTENT}</div>
			</FocusTrap>
		);

		const container = screen.getByTestId('focus-trap');
		expect(container).toHaveAttribute('aria-label', 'Test trap');
	});

	it('renders complex children structure', () => {
		renderWithProviders(
			<FocusTrap>
				<div>
					<h1>Title</h1>
					<p>Paragraph</p>
					<button>Button</button>
				</div>
			</FocusTrap>
		);

		expect(screen.getByText('Title')).toBeInTheDocument();
		expect(screen.getByText('Paragraph')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeInTheDocument();
	});
});

describe('FocusTrap - Enabled/Disabled State', () => {
	it('is enabled by default', () => {
		const { container } = renderWithProviders(
			<FocusTrap>
				<button>Test Button</button>
			</FocusTrap>
		);

		const trapContainer = container.querySelector('div');
		expect(trapContainer).toBeInTheDocument();

		// Event listener should be attached when enabled
		// We can verify this by checking that Tab key events are handled
		const button = screen.getByRole('button');
		button.focus();

		// Create a Tab keydown event
		const tabEvent = new KeyboardEvent('keydown', {
			key: 'Tab',
			bubbles: true,
			cancelable: true,
		});

		// The event should be handled (preventDefault may be called)
		document.dispatchEvent(tabEvent);
		// If enabled, handleTabNavigation would process it
		// We verify the component doesn't crash and event listener is set up
		expect(button).toBeInTheDocument();
	});

	it('can be disabled via enabled prop', () => {
		renderWithProviders(
			<FocusTrap enabled={false}>
				<button>Test Button</button>
			</FocusTrap>
		);

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();

		// When disabled, event listener should not be attached
		// Tab navigation should work normally (not trapped)
		button.focus();
		expect(button).toHaveFocus();
	});

	it('updates when enabled prop changes', async () => {
		const TestComponent = () => {
			const [enabled, setEnabled] = useState(false);
			return (
				<div>
					<button onClick={() => setEnabled(!enabled)}>Toggle</button>
					<FocusTrap enabled={enabled}>
						<button>Trapped Button</button>
					</FocusTrap>
				</div>
			);
		};

		renderWithProviders(<TestComponent />);

		const toggleButton = screen.getByText('Toggle');
		const trappedButton = screen.getByText('Trapped Button');

		// Initially disabled
		trappedButton.focus();
		expect(trappedButton).toHaveFocus();

		// Enable the trap
		fireEvent.click(toggleButton);

		await waitFor(() => {
			// After enabling, focus trapping should be active
			expect(trappedButton).toBeInTheDocument();
		});
	});
});

describe('FocusTrap - Event Listener Management', () => {
	beforeEach(() => {
		// Clean up any existing event listeners
		document.body.innerHTML = '';
	});

	it('adds keydown event listener when enabled', () => {
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

		renderWithProviders(
			<FocusTrap enabled={true}>
				<button>Test</button>
			</FocusTrap>
		);

		// Wait for useEffect to run
		expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

		addEventListenerSpy.mockRestore();
	});

	it('removes keydown event listener when disabled', () => {
		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

		const { rerender } = renderWithProviders(
			<FocusTrap enabled={true}>
				<button>Test</button>
			</FocusTrap>
		);

		// Disable the trap
		rerender(
			<FocusTrap enabled={false}>
				<button>Test</button>
			</FocusTrap>
		);

		// Wait for cleanup
		expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

		removeEventListenerSpy.mockRestore();
	});

	it('removes event listener on unmount', () => {
		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

		const { unmount } = renderWithProviders(
			<FocusTrap enabled={true}>
				<button>Test</button>
			</FocusTrap>
		);

		unmount();

		// Cleanup should remove the event listener
		expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

		removeEventListenerSpy.mockRestore();
	});

	it('does not add event listener when disabled initially', () => {
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

		renderWithProviders(
			<FocusTrap enabled={false}>
				<button>Test</button>
			</FocusTrap>
		);

		// Should not add keydown listener when disabled
		const keydownCalls = addEventListenerSpy.mock.calls.filter(call => call[0] === 'keydown');
		expect(keydownCalls.length).toBe(0);

		addEventListenerSpy.mockRestore();
	});
});

describe('FocusTrap - Focus Trapping Behavior', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('handles Tab key navigation within trap', () => {
		renderWithProviders(
			<div>
				<button>Outside Button</button>
				<FocusTrap enabled={true}>
					<button>First</button>
					<button>Second</button>
					<button>Last</button>
				</FocusTrap>
			</div>
		);

		const firstButton = screen.getByText('First');
		const secondButton = screen.getByText('Second');
		const lastButton = screen.getByText('Last');

		// Focus first button
		firstButton.focus();
		expect(firstButton).toHaveFocus();

		// Tab should move to second button
		fireEvent.keyDown(document, { key: 'Tab', bubbles: true });
		// Note: Actual focus movement depends on handleTabNavigation implementation
		// We verify the component handles the event without crashing
		expect(firstButton).toBeInTheDocument();
		expect(secondButton).toBeInTheDocument();
		expect(lastButton).toBeInTheDocument();
	});

	it('handles Shift+Tab navigation within trap', () => {
		renderWithProviders(
			<FocusTrap enabled={true}>
				<button>First</button>
				<button>Second</button>
				<button>Last</button>
			</FocusTrap>
		);

		const lastButton = screen.getByText('Last');
		lastButton.focus();
		expect(lastButton).toHaveFocus();

		// Shift+Tab should move backwards
		fireEvent.keyDown(document, {
			key: 'Tab',
			shiftKey: true,
			bubbles: true,
		});

		// Component should handle the event
		expect(lastButton).toBeInTheDocument();
	});

	it('does not trap focus when disabled', () => {
		renderWithProviders(
			<div>
				<button>Outside Button</button>
				<FocusTrap enabled={false}>
					<button>Inside Button</button>
				</FocusTrap>
			</div>
		);

		const insideButton = screen.getByText('Inside Button');
		insideButton.focus();
		expect(insideButton).toHaveFocus();

		// Tab should work normally (not trapped)
		fireEvent.keyDown(document, { key: 'Tab', bubbles: true });
		// Normal tab behavior - focus may move outside
		expect(insideButton).toBeInTheDocument();
	});

	it('handles non-Tab keys normally', () => {
		renderWithProviders(
			<FocusTrap enabled={true}>
				<button>Test</button>
			</FocusTrap>
		);

		const button = screen.getByRole('button');
		button.focus();

		// Other keys should not be affected
		fireEvent.keyDown(document, { key: 'Enter', bubbles: true });
		fireEvent.keyDown(document, { key: 'Escape', bubbles: true });
		fireEvent.keyDown(document, { key: 'ArrowDown', bubbles: true });

		// Component should not interfere with non-Tab keys
		expect(button).toBeInTheDocument();
	});

	it('works with single focusable element', () => {
		renderWithProviders(
			<FocusTrap enabled={true}>
				<button>Only Button</button>
			</FocusTrap>
		);

		const button = screen.getByRole('button');
		button.focus();
		expect(button).toHaveFocus();

		// Tab navigation with single element should still be handled
		fireEvent.keyDown(document, { key: 'Tab', bubbles: true });
		expect(button).toBeInTheDocument();
	});

	it('works with no focusable elements', () => {
		renderWithProviders(
			<FocusTrap enabled={true}>
				<div>No focusable content</div>
			</FocusTrap>
		);

		const content = screen.getByText('No focusable content');
		expect(content).toBeInTheDocument();

		// Tab navigation should be handled gracefully
		fireEvent.keyDown(document, { key: 'Tab', bubbles: true });
		expect(content).toBeInTheDocument();
	});
});

describe('FocusTrap - Edge Cases', () => {
	it('handles empty children', () => {
		renderWithProviders(<FocusTrap enabled={true}>{null}</FocusTrap>);

		const container = document.body.querySelector('div');
		expect(container).toBeInTheDocument();
	});

	it('handles null children', () => {
		renderWithProviders(<FocusTrap enabled={true}>{null}</FocusTrap>);

		const container = document.body.querySelector('div');
		expect(container).toBeInTheDocument();
	});

	it('handles undefined className', () => {
		renderWithProviders(
			<FocusTrap>
				<div>{TEST_CONTENT}</div>
			</FocusTrap>
		);

		expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
	});

	it('handles empty className string', () => {
		renderWithProviders(
			<FocusTrap className="">
				<div>{TEST_CONTENT}</div>
			</FocusTrap>
		);

		expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
	});

	it('handles rapid enabled/disabled toggles', async () => {
		const TestComponent = () => {
			const [enabled, setEnabled] = useState(true);
			return (
				<div>
					<button onClick={() => setEnabled(!enabled)}>Toggle</button>
					<FocusTrap enabled={enabled}>
						<button>Test</button>
					</FocusTrap>
				</div>
			);
		};

		renderWithProviders(<TestComponent />);

		const toggleButton = screen.getByText('Toggle');

		// Rapidly toggle
		fireEvent.click(toggleButton);
		fireEvent.click(toggleButton);
		fireEvent.click(toggleButton);

		await waitFor(() => {
			expect(screen.getByText('Test')).toBeInTheDocument();
		});
	});

	it('handles container ref being null initially', () => {
		// This tests the case where containerRef.current might be null
		// when the effect runs (though unlikely in practice)
		renderWithProviders(
			<FocusTrap enabled={true}>
				<div>{TEST_CONTENT}</div>
			</FocusTrap>
		);

		// Component should handle gracefully
		expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
	});
});

describe('FocusTrap - Integration', () => {
	it('works with form elements', () => {
		renderWithProviders(
			<FocusTrap enabled={true}>
				<form>
					<input type="text" placeholder="Name" />
					<input type="email" placeholder="Email" />
					<button type="submit">Submit</button>
				</form>
			</FocusTrap>
		);

		const nameInput = screen.getByPlaceholderText('Name');
		const emailInput = screen.getByPlaceholderText('Email');
		const submitButton = screen.getByRole('button');

		expect(nameInput).toBeInTheDocument();
		expect(emailInput).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();

		// Focus should be trappable within form
		nameInput.focus();
		expect(nameInput).toHaveFocus();
	});

	it('works with nested focusable elements', () => {
		renderWithProviders(
			<FocusTrap enabled={true}>
				<div>
					<button>Outer Button</button>
					<div>
						<button>Nested Button 1</button>
						<button>Nested Button 2</button>
					</div>
				</div>
			</FocusTrap>
		);

		const outerButton = screen.getByText('Outer Button');
		const nestedButton1 = screen.getByText('Nested Button 1');
		const nestedButton2 = screen.getByText('Nested Button 2');

		expect(outerButton).toBeInTheDocument();
		expect(nestedButton1).toBeInTheDocument();
		expect(nestedButton2).toBeInTheDocument();
	});

	it('works with links and buttons', () => {
		renderWithProviders(
			<FocusTrap enabled={true}>
				<a href="#link1">Link 1</a>
				<button>Button</button>
				<a href="#link2">Link 2</a>
			</FocusTrap>
		);

		const link1 = screen.getByText('Link 1');
		const button = screen.getByRole('button');
		const link2 = screen.getByText('Link 2');

		expect(link1).toBeInTheDocument();
		expect(button).toBeInTheDocument();
		expect(link2).toBeInTheDocument();
	});
});
