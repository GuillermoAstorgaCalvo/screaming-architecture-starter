/**
 * Tests for splitter handler calculation functions
 *
 * Tests calculation functions:
 * - getPanelConstraints
 * - calculatePanelSizes
 */

import {
	calculatePanelSizes,
	getPanelConstraints,
} from '@core/ui/utilities/splitter/helpers/useSplitter.handlers.calculations';
import type {
	PanelConstraints,
	PanelRef,
	SizeGetters,
} from '@core/ui/utilities/splitter/types/useSplitter.handlers.types';
import { describe, expect, it } from 'vitest';

// Helper functions for test setup
function createPanelElement(dimension: 'width' | 'height', size: number): HTMLDivElement {
	const element = document.createElement('div');
	const property = dimension === 'width' ? 'offsetWidth' : 'offsetHeight';
	Object.defineProperty(element, property, { value: size, writable: false });
	return element;
}

function createPanel(id: string, dimension: 'width' | 'height', size: number): PanelRef {
	return {
		id,
		element: createPanelElement(dimension, size),
	};
}

function createConstraints(params: {
	panelMinSize: number;
	panelMaxSize: number;
	nextPanelMinSize: number;
	nextPanelMaxSize: number;
}): PanelConstraints {
	return {
		panelMinSize: params.panelMinSize,
		panelMaxSize: params.panelMaxSize,
		nextPanelMinSize: params.nextPanelMinSize,
		nextPanelMaxSize: params.nextPanelMaxSize,
	};
}

describe('useSplitter.handlers.calculations - getPanelConstraints', () => {
	it('returns constraints for both panels', () => {
		const panel: PanelRef = { id: 'panel1', element: document.createElement('div') };
		const nextPanel: PanelRef = { id: 'panel2', element: document.createElement('div') };

		const sizeGetters: SizeGetters = {
			getPanelMinSize: (id: string) => (id === 'panel1' ? 100 : 150),
			getPanelMaxSize: (id: string) => (id === 'panel1' ? 500 : 600),
		};

		const constraints = getPanelConstraints(panel, nextPanel, sizeGetters);

		expect(constraints.panelMinSize).toBe(100);
		expect(constraints.panelMaxSize).toBe(500);
		expect(constraints.nextPanelMinSize).toBe(150);
		expect(constraints.nextPanelMaxSize).toBe(600);
	});

	it('handles undefined maxSize', () => {
		const panel: PanelRef = { id: 'panel1', element: document.createElement('div') };
		const nextPanel: PanelRef = { id: 'panel2', element: document.createElement('div') };

		const sizeGetters: SizeGetters = {
			getPanelMinSize: () => 100,
			getPanelMaxSize: () => undefined,
		};

		const constraints = getPanelConstraints(panel, nextPanel, sizeGetters);

		expect(constraints.panelMaxSize).toBeUndefined();
		expect(constraints.nextPanelMaxSize).toBeUndefined();
	});
});

describe('useSplitter.handlers.calculations - calculatePanelSizes - basic calculations', () => {
	it('calculates new sizes based on delta', () => {
		const panel = createPanel('panel1', 'width', 200);
		const nextPanel = createPanel('panel2', 'width', 300);
		const constraints = createConstraints({
			panelMinSize: 100,
			panelMaxSize: 500,
			nextPanelMinSize: 150,
			nextPanelMaxSize: 600,
		});

		const result = calculatePanelSizes(
			50,
			{ panel, nextPanel, orientation: 'horizontal' },
			constraints
		);

		expect(result.newPanelSize).toBe(250); // 200 + 50
		expect(result.newNextPanelSize).toBe(250); // 300 - 50
	});
});

describe('useSplitter.handlers.calculations - calculatePanelSizes - constraints', () => {
	it('respects minSize constraints', () => {
		const panel = createPanel('panel1', 'width', 200);
		const nextPanel = createPanel('panel2', 'width', 300);
		const constraints = createConstraints({
			panelMinSize: 200,
			panelMaxSize: 500,
			nextPanelMinSize: 150,
			nextPanelMaxSize: 600,
		});

		const result = calculatePanelSizes(
			-150,
			{ panel, nextPanel, orientation: 'horizontal' },
			constraints
		);

		expect(result.newPanelSize).toBe(200); // Clamped to minSize
		expect(result.newNextPanelSize).toBe(300); // 300 - (-150) = 450, but adjusted
	});

	it('respects maxSize constraints', () => {
		const panel = createPanel('panel1', 'width', 200);
		const nextPanel = createPanel('panel2', 'width', 300);
		const constraints = createConstraints({
			panelMinSize: 100,
			panelMaxSize: 250,
			nextPanelMinSize: 150,
			nextPanelMaxSize: 600,
		});

		const result = calculatePanelSizes(
			100,
			{ panel, nextPanel, orientation: 'horizontal' },
			constraints
		);

		expect(result.newPanelSize).toBe(250); // Clamped to maxSize
	});

	it('maintains total size when constraints are hit', () => {
		const panel = createPanel('panel1', 'width', 200);
		const nextPanel = createPanel('panel2', 'width', 300);
		const constraints = createConstraints({
			panelMinSize: 200,
			panelMaxSize: 250,
			nextPanelMinSize: 150,
			nextPanelMaxSize: 600,
		});

		const result = calculatePanelSizes(
			100,
			{ panel, nextPanel, orientation: 'horizontal' },
			constraints
		);

		const totalSize = result.newPanelSize + result.newNextPanelSize;
		expect(totalSize).toBe(500); // 200 + 300
	});
});

describe('useSplitter.handlers.calculations - calculatePanelSizes - orientation', () => {
	it('works with vertical orientation', () => {
		const panel = createPanel('panel1', 'height', 200);
		const nextPanel = createPanel('panel2', 'height', 300);
		const constraints = createConstraints({
			panelMinSize: 100,
			panelMaxSize: 500,
			nextPanelMinSize: 150,
			nextPanelMaxSize: 600,
		});

		const result = calculatePanelSizes(
			50,
			{ panel, nextPanel, orientation: 'vertical' },
			constraints
		);

		expect(result.newPanelSize).toBe(250);
		expect(result.newNextPanelSize).toBe(250);
	});
});
