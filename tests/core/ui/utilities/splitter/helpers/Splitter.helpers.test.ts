/**
 * Tests for Splitter helper functions
 *
 * Tests helper functions:
 * - extractPanelConfigs
 * - createPanelConfig
 * - getContainerClasses
 * - ifDefined
 */

import { SplitterPanel } from '@core/ui/utilities/splitter/components/SplitterPanel';
import {
	createPanelConfig,
	extractPanelConfigs,
	getContainerClasses,
	ifDefined,
} from '@core/ui/utilities/splitter/helpers/Splitter.helpers';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

describe('Splitter.helpers - ifDefined', () => {
	it('returns empty object when value is undefined', () => {
		const result = ifDefined(undefined, 'defaultSize');
		expect(result).toEqual({});
	});

	it('returns object with key-value when value is defined', () => {
		const result = ifDefined('30%', 'defaultSize');
		expect(result).toEqual({ defaultSize: '30%' });
	});

	it('handles number values', () => {
		const result = ifDefined(200, 'defaultSize');
		expect(result).toEqual({ defaultSize: 200 });
	});
});

describe('Splitter.helpers - createPanelConfig', () => {
	it('creates config from panel props', () => {
		const props = {
			id: 'panel1',
			defaultSize: '30%',
			minSize: 100,
			collapsible: true,
		};

		const config = createPanelConfig(props as any);
		expect(config).toEqual({
			id: 'panel1',
			defaultSize: '30%',
			minSize: 100,
			collapsible: true,
		});
	});

	it('omits undefined values', () => {
		const props = {
			id: 'panel1',
			defaultSize: '30%',
			minSize: undefined,
			collapsible: undefined,
		};

		const config = createPanelConfig(props as any);
		expect(config).toEqual({
			id: 'panel1',
			defaultSize: '30%',
		});
	});
});

describe('Splitter.helpers - extractPanelConfigs', () => {
	it('extracts configs from children', () => {
		const children = [
			createElement(SplitterPanel, { id: 'panel1', defaultSize: '30%' } as any, 'Panel 1'),
			createElement(SplitterPanel, { id: 'panel2', defaultSize: '70%' } as any, 'Panel 2'),
		];

		const configs = extractPanelConfigs(children);
		expect(configs).toHaveLength(2);
		expect(configs[0]).toMatchObject({ id: 'panel1', defaultSize: '30%' });
		expect(configs[1]).toMatchObject({ id: 'panel2', defaultSize: '70%' });
	});

	it('uses panels prop when provided', () => {
		const panels = [
			{ id: 'panel1', defaultSize: '30%' },
			{ id: 'panel2', defaultSize: '70%' },
		];

		const configs = extractPanelConfigs(null, panels);
		expect(configs).toEqual(panels);
	});

	it('prefers panels prop over children', () => {
		const panels = [{ id: 'panel1', defaultSize: '50%' }];
		const children = [
			createElement(SplitterPanel, { id: 'panel2', defaultSize: '30%' } as any, 'Panel 2'),
		];

		const configs = extractPanelConfigs(children, panels);
		expect(configs).toEqual(panels);
	});

	it('returns empty array when no panels provided', () => {
		const configs = extractPanelConfigs(null);
		expect(configs).toEqual([]);
	});

	it('ignores non-panel children', () => {
		const children = [
			createElement('div', { key: 'div' }, 'Non-panel'),
			createElement(SplitterPanel, { id: 'panel1' } as any, 'Panel 1'),
		];

		const configs = extractPanelConfigs(children);
		expect(configs).toHaveLength(1);
		expect(configs[0]).toMatchObject({ id: 'panel1' });
	});
});

describe('Splitter.helpers - getContainerClasses', () => {
	it('returns base classes for horizontal orientation', () => {
		const classes = getContainerClasses('horizontal');
		expect(classes).toContain('flex');
		expect(classes).toContain('w-full');
		expect(classes).toContain('h-full');
		expect(classes).toContain('flex-row');
	});

	it('returns base classes for vertical orientation', () => {
		const classes = getContainerClasses('vertical');
		expect(classes).toContain('flex');
		expect(classes).toContain('w-full');
		expect(classes).toContain('h-full');
		expect(classes).toContain('flex-col');
	});

	it('merges custom className', () => {
		const classes = getContainerClasses('horizontal', 'custom-class');
		expect(classes).toContain('custom-class');
		expect(classes).toContain('flex-row');
	});
});
