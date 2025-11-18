/**
 * Tests for handleTabNavigation function
 */

import { handleTabNavigation } from '@core/a11y/focus/focus';
import { describe, expect, it } from 'vitest';

describe('handleTabNavigation - edge cases', () => {
	it('does nothing if container is null', () => {
		const event = new KeyboardEvent('keydown', { key: 'Tab' });
		handleTabNavigation(null, event);
		expect(event.defaultPrevented).toBe(false);
	});

	it('does nothing if key is not Tab', () => {
		const container = document.createElement('div');
		container.innerHTML = '<button>Button</button>';
		document.body.append(container);

		const event = new KeyboardEvent('keydown', { key: 'Enter' });
		handleTabNavigation(container, event);
		expect(event.defaultPrevented).toBe(false);

		container.remove();
	});

	it('does nothing if no focusable elements in container', () => {
		const container = document.createElement('div');
		container.innerHTML = '<div>Some text</div>';
		document.body.append(container);

		const event = new KeyboardEvent('keydown', { key: 'Tab' });
		handleTabNavigation(container, event);
		expect(event.defaultPrevented).toBe(false);

		container.remove();
	});

	it('does nothing if active element is not in container', () => {
		const container = document.createElement('div');
		container.innerHTML = '<button id="inside">Inside</button>';
		document.body.append(container);

		const outsideButton = document.createElement('button');
		outsideButton.id = 'outside';
		document.body.append(outsideButton);
		outsideButton.focus();

		const event = new KeyboardEvent('keydown', { key: 'Tab' });
		handleTabNavigation(container, event);
		expect(event.defaultPrevented).toBe(false);
		expect(document.activeElement?.id).toBe('outside');

		container.remove();
		outsideButton.remove();
	});
});

describe('handleTabNavigation - tab wrapping', () => {
	it('wraps Tab from last element to first element', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button id="first">First</button>
				<button id="second">Second</button>
				<button id="third">Third</button>
			`;
		document.body.append(container);

		const thirdButton = container.querySelector('#third') as HTMLElement;
		thirdButton.focus();

		const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
		handleTabNavigation(container, event);

		expect(event.defaultPrevented).toBe(true);
		expect(document.activeElement?.id).toBe('first');

		container.remove();
	});

	it('wraps Shift+Tab from first element to last element', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button id="first">First</button>
				<button id="second">Second</button>
				<button id="third">Third</button>
			`;
		document.body.append(container);

		const firstButton = container.querySelector('#first') as HTMLElement;
		firstButton.focus();

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: true,
		});
		handleTabNavigation(container, event);

		expect(event.defaultPrevented).toBe(true);
		expect(document.activeElement?.id).toBe('third');

		container.remove();
	});
});

describe('handleTabNavigation - focusable container handling', () => {
	it('includes focusable container in tab order', () => {
		const container = document.createElement('div');
		container.setAttribute('tabindex', '0');
		container.id = 'container';
		container.innerHTML = `
				<button id="first">First</button>
				<button id="second">Second</button>
			`;
		document.body.append(container);

		// Focus the last button
		const secondButton = container.querySelector('#second') as HTMLElement;
		secondButton.focus();

		// Tab should wrap to container (which is first in trap)
		const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
		handleTabNavigation(container, event);

		expect(event.defaultPrevented).toBe(true);
		expect(document.activeElement).toBe(container);

		container.remove();
	});
});

describe('handleTabNavigation - normal navigation', () => {
	it('handles Tab navigation when not at boundaries', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button id="first">First</button>
				<button id="second">Second</button>
				<button id="third">Third</button>
			`;
		document.body.append(container);

		const secondButton = container.querySelector('#second') as HTMLElement;
		secondButton.focus();

		const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
		handleTabNavigation(container, event);

		// Should not prevent default when not at boundary
		expect(event.defaultPrevented).toBe(false);

		container.remove();
	});

	it('handles Shift+Tab navigation when not at boundaries', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button id="first">First</button>
				<button id="second">Second</button>
				<button id="third">Third</button>
			`;
		document.body.append(container);

		const secondButton = container.querySelector('#second') as HTMLElement;
		secondButton.focus();

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: true,
		});
		handleTabNavigation(container, event);

		// Should not prevent default when not at boundary
		expect(event.defaultPrevented).toBe(false);

		container.remove();
	});
});

describe('handleTabNavigation - special cases', () => {
	it('handles single focusable element correctly', () => {
		const container = document.createElement('div');
		container.innerHTML = '<button id="only">Only</button>';
		document.body.append(container);

		const button = container.querySelector('#only') as HTMLElement;
		button.focus();

		// Tab should wrap to same element
		const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
		handleTabNavigation(container, event);

		expect(event.defaultPrevented).toBe(true);
		expect(document.activeElement?.id).toBe('only');

		container.remove();
	});

	it('respects tabindex order for focus trapping', () => {
		const container = document.createElement('div');
		container.innerHTML = `
				<button tabindex="3" id="third">Third</button>
				<button tabindex="1" id="first">First</button>
				<button tabindex="2" id="second">Second</button>
			`;
		document.body.append(container);

		// Focus the last element in tab order (tabindex="3")
		const thirdButton = container.querySelector('#third') as HTMLElement;
		thirdButton.focus();

		const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
		handleTabNavigation(container, event);

		expect(event.defaultPrevented).toBe(true);
		// Should wrap to first in tab order (tabindex="1")
		expect(document.activeElement?.id).toBe('first');

		container.remove();
	});
});
