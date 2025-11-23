/**
 * Tests for Splitter render helper
 *
 * Tests the renderSplitterChildren function:
 * - Panel rendering
 * - Handle insertion
 * - Non-panel children preservation
 */

import { SplitterPanel } from '@core/ui/utilities/splitter/components/SplitterPanel';
import { renderSplitterChildren } from '@core/ui/utilities/splitter/helpers/Splitter.render';
import { createElement, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

describe('Splitter.render - renderSplitterChildren', () => {
	it('renders panels from children', () => {
		const children = [
			createElement(SplitterPanel, { id: 'panel1', key: 'panel1' }, 'Panel 1'),
			createElement(SplitterPanel, { id: 'panel2', key: 'panel2' }, 'Panel 2'),
		];

		const panelConfigs = [{ id: 'panel1' }, { id: 'panel2' }];

		const view = renderSplitterChildren(children, panelConfigs);

		expect(view).toHaveLength(3); // 2 panels + 1 handle
		expect((view[0] as ReactElement<any>).props.id).toBe('panel1');
		expect((view[1] as ReactElement<any>).props.panelIndex).toBe(0); // Handle
		expect((view[2] as ReactElement<any>).props.id).toBe('panel2');
	});

	it('does not render handle after last panel', () => {
		const children = [createElement(SplitterPanel, { id: 'panel1', key: 'panel1' }, 'Panel 1')];

		const panelConfigs = [{ id: 'panel1' }];

		const view = renderSplitterChildren(children, panelConfigs);

		expect(view).toHaveLength(1); // Only panel, no handle
	});

	it('renders handles between multiple panels', () => {
		const children = [
			createElement(SplitterPanel, { id: 'panel1', key: 'panel1' }, 'Panel 1'),
			createElement(SplitterPanel, { id: 'panel2', key: 'panel2' }, 'Panel 2'),
			createElement(SplitterPanel, { id: 'panel3', key: 'panel3' }, 'Panel 3'),
		];

		const panelConfigs = [{ id: 'panel1' }, { id: 'panel2' }, { id: 'panel3' }];

		const view = renderSplitterChildren(children, panelConfigs);

		expect(view).toHaveLength(5); // 3 panels + 2 handles
		expect((view[1] as ReactElement<any>).props.panelIndex).toBe(0); // First handle
		expect((view[3] as ReactElement<any>).props.panelIndex).toBe(1); // Second handle
	});

	it('preserves non-panel children', () => {
		const children = [
			createElement('div', { key: 'div' }, 'Non-panel'),
			createElement(SplitterPanel, { id: 'panel1', key: 'panel1' }, 'Panel 1'),
		];

		const panelConfigs = [{ id: 'panel1' }];

		const view = renderSplitterChildren(children, panelConfigs);

		expect(view).toHaveLength(2);
		expect(view[0]).toBe(children[0]); // Preserved as-is
		expect((view[1] as ReactElement<any>).props.id).toBe('panel1');
	});

	it('preserves panel keys', () => {
		const children = [createElement(SplitterPanel, { id: 'panel1', key: 'custom-key' }, 'Panel 1')];

		const panelConfigs = [{ id: 'panel1' }];

		const view = renderSplitterChildren(children, panelConfigs);

		expect((view[0] as ReactElement<any>).key).toBe('custom-key');
	});

	it('generates key for panels without key', () => {
		const children = [createElement(SplitterPanel, { id: 'panel1' }, 'Panel 1')];

		const panelConfigs = [{ id: 'panel1' }];

		const view = renderSplitterChildren(children, panelConfigs);

		expect((view[0] as ReactElement<any>).key).toBe('panel-0');
	});
});
