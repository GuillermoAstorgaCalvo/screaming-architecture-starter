import { updateContainerSize } from '@core/ui/utilities/resizable/helpers/useResizable.helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('useResizable.helpers - updateContainerSize', () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.append(container);
	});

	afterEach(() => {
		container.remove();
	});

	it('sets width for horizontal direction', () => {
		updateContainerSize(container, 'horizontal', 250);
		expect(container.style.width).toBe('250px');
		expect(container.style.height).toBe('');
	});

	it('sets height for vertical direction', () => {
		updateContainerSize(container, 'vertical', 300);
		expect(container.style.height).toBe('300px');
		expect(container.style.width).toBe('');
	});

	it('sets both width and height for both direction', () => {
		updateContainerSize(container, 'both', 400);
		expect(container.style.width).toBe('400px');
		expect(container.style.height).toBe('400px');
	});

	it('overwrites existing styles', () => {
		container.style.width = '100px';
		container.style.height = '200px';

		updateContainerSize(container, 'horizontal', 350);
		expect(container.style.width).toBe('350px');
		expect(container.style.height).toBe('200px'); // Unchanged

		updateContainerSize(container, 'vertical', 450);
		expect(container.style.width).toBe('350px'); // Unchanged
		expect(container.style.height).toBe('450px');
	});

	it('handles zero size', () => {
		updateContainerSize(container, 'horizontal', 0);
		expect(container.style.width).toBe('0px');

		updateContainerSize(container, 'vertical', 0);
		expect(container.style.height).toBe('0px');
	});

	it('handles decimal sizes', () => {
		updateContainerSize(container, 'horizontal', 123.456);
		expect(container.style.width).toBe('123.456px');
	});
});
