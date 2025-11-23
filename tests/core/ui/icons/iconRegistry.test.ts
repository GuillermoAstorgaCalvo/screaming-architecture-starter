/**
 * iconRegistry Tests
 *
 * Tests for icon registry functions:
 * - getIcon
 * - registerIcon
 * - hasIcon
 * - iconRegistry export
 */

import { getIcon, hasIcon, iconRegistry, registerIcon } from '@core/ui/icons/iconRegistry';
import type { IconRegistry } from '@src-types/ui/icons';
import React from 'react';
import { describe, expect, it } from 'vitest';

// Mock icon component for testing
const MockIcon = () => React.createElement('svg', { 'data-testid': 'mock-icon' });

describe('iconRegistry', () => {
	it('exports iconRegistry object', () => {
		expect(iconRegistry).toBeDefined();
		expect(typeof iconRegistry).toBe('object');
	});

	it('contains expected registered icons', () => {
		expect(iconRegistry['arrow-down']).toBeDefined();
		expect(iconRegistry['arrow-left']).toBeDefined();
		expect(iconRegistry['arrow-right']).toBeDefined();
		expect(iconRegistry['arrow-up']).toBeDefined();
		expect(iconRegistry.bell).toBeDefined();
		expect(iconRegistry.check).toBeDefined();
		expect(iconRegistry.clear).toBeDefined();
		expect(iconRegistry.close).toBeDefined();
		expect(iconRegistry.copy).toBeDefined();
		expect(iconRegistry.heart).toBeDefined();
		expect(iconRegistry.search).toBeDefined();
		expect(iconRegistry.settings).toBeDefined();
		expect(iconRegistry.star).toBeDefined();
	});

	it('has all icon components as functions', () => {
		for (const icon of Object.values(iconRegistry)) {
			expect(typeof icon).toBe('function');
		}
	});
});

describe('getIcon', () => {
	it('returns icon component for registered icon', () => {
		const icon = getIcon('search');
		expect(icon).toBeDefined();
		expect(typeof icon).toBe('function');
	});

	it('returns correct icon component for different icons', () => {
		const searchIcon = getIcon('search');
		const settingsIcon = getIcon('settings');
		const checkIcon = getIcon('check');

		expect(searchIcon).toBeDefined();
		expect(settingsIcon).toBeDefined();
		expect(checkIcon).toBeDefined();
		expect(searchIcon).not.toBe(settingsIcon);
	});

	it('returns undefined for non-existent icon', () => {
		const icon = getIcon('non-existent-icon');
		expect(icon).toBeUndefined();
	});

	it('returns undefined for empty string', () => {
		const icon = getIcon('');
		expect(icon).toBeUndefined();
	});

	it('handles all registered icon names', () => {
		const iconNames = [
			'arrow-down',
			'arrow-left',
			'arrow-right',
			'arrow-up',
			'bell',
			'check',
			'clear',
			'close',
			'copy',
			'heart',
			'search',
			'settings',
			'star',
		];

		for (const name of iconNames) {
			const icon = getIcon(name);
			expect(icon).toBeDefined();
			expect(typeof icon).toBe('function');
		}
	});

	it('is case-sensitive', () => {
		const lowerCase = getIcon('search');
		const upperCase = getIcon('Search');
		const mixedCase = getIcon('SeArCh');

		expect(lowerCase).toBeDefined();
		expect(upperCase).toBeUndefined();
		expect(mixedCase).toBeUndefined();
	});
});

describe('registerIcon', () => {
	it('registers a new icon in the registry', () => {
		const originalIcon = iconRegistry['custom-icon'];
		registerIcon('custom-icon', MockIcon as IconRegistry[string]);

		expect(iconRegistry['custom-icon']).toBeDefined();
		expect(iconRegistry['custom-icon']).toBe(MockIcon);

		// Cleanup
		if (originalIcon) {
			iconRegistry['custom-icon'] = originalIcon;
		} else {
			delete iconRegistry['custom-icon'];
		}
	});

	it('overwrites existing icon when registering with same name', () => {
		const originalSearchIcon = iconRegistry.search;
		registerIcon('search', MockIcon as IconRegistry[string]);

		expect(iconRegistry.search).toBe(MockIcon);
		expect(iconRegistry.search).not.toBe(originalSearchIcon);

		// Restore original
		if (originalSearchIcon) {
			iconRegistry.search = originalSearchIcon;
		}
	});

	it('allows registering multiple icons', () => {
		const icon1 = () => React.createElement('svg', { 'data-testid': 'icon1' });
		const icon2 = () => React.createElement('svg', { 'data-testid': 'icon2' });

		registerIcon('test-icon-1', icon1 as IconRegistry[string]);
		registerIcon('test-icon-2', icon2 as IconRegistry[string]);

		expect(iconRegistry['test-icon-1']).toBe(icon1);
		expect(iconRegistry['test-icon-2']).toBe(icon2);

		// Cleanup
		delete iconRegistry['test-icon-1'];
		delete iconRegistry['test-icon-2'];
	});

	it('handles special characters in icon name', () => {
		const icon = () => React.createElement('svg', { 'data-testid': 'special-icon' });
		registerIcon('icon-with-dashes', icon as IconRegistry[string]);
		registerIcon('icon_with_underscores', icon as IconRegistry[string]);

		expect(iconRegistry['icon-with-dashes']).toBeDefined();
		expect(iconRegistry['icon_with_underscores']).toBeDefined();

		// Cleanup
		delete iconRegistry['icon-with-dashes'];
		delete iconRegistry['icon_with_underscores'];
	});
});

describe('hasIcon', () => {
	it('returns true for registered icon', () => {
		expect(hasIcon('search')).toBe(true);
		expect(hasIcon('settings')).toBe(true);
		expect(hasIcon('check')).toBe(true);
	});

	it('returns false for non-existent icon', () => {
		expect(hasIcon('non-existent-icon')).toBe(false);
		expect(hasIcon('unknown')).toBe(false);
	});

	it('returns false for empty string', () => {
		expect(hasIcon('')).toBe(false);
	});

	it('returns true for all registered icons', () => {
		const iconNames = [
			'arrow-down',
			'arrow-left',
			'arrow-right',
			'arrow-up',
			'bell',
			'check',
			'clear',
			'close',
			'copy',
			'heart',
			'search',
			'settings',
			'star',
		];

		for (const name of iconNames) {
			expect(hasIcon(name)).toBe(true);
		}
	});

	it('is case-sensitive', () => {
		expect(hasIcon('search')).toBe(true);
		expect(hasIcon('Search')).toBe(false);
		expect(hasIcon('SEARCH')).toBe(false);
		expect(hasIcon('SeArCh')).toBe(false);
	});

	it('returns true for newly registered icon', () => {
		registerIcon('new-test-icon', MockIcon as IconRegistry[string]);

		expect(hasIcon('new-test-icon')).toBe(true);

		// Cleanup
		delete iconRegistry['new-test-icon'];
	});

	it('returns false after icon is deleted', () => {
		registerIcon('temporary-icon', MockIcon as IconRegistry[string]);
		expect(hasIcon('temporary-icon')).toBe(true);

		delete iconRegistry['temporary-icon'];
		expect(hasIcon('temporary-icon')).toBe(false);
	});
});

describe('iconRegistry - Integration', () => {
	it('getIcon and hasIcon work together', () => {
		const iconName = 'test-integration-icon';
		registerIcon(iconName, MockIcon as IconRegistry[string]);

		expect(hasIcon(iconName)).toBe(true);
		expect(getIcon(iconName)).toBeDefined();
		expect(getIcon(iconName)).toBe(MockIcon);

		// Cleanup
		delete iconRegistry[iconName];
	});

	it('registerIcon updates both getIcon and hasIcon', () => {
		const iconName = 'dynamic-icon';
		const icon = () => React.createElement('svg', { 'data-testid': 'dynamic' });

		expect(hasIcon(iconName)).toBe(false);
		expect(getIcon(iconName)).toBeUndefined();

		registerIcon(iconName, icon as IconRegistry[string]);

		expect(hasIcon(iconName)).toBe(true);
		expect(getIcon(iconName)).toBe(icon);

		// Cleanup
		delete iconRegistry[iconName];
	});

	it('handles edge cases with whitespace', () => {
		expect(hasIcon(' search')).toBe(false);
		expect(hasIcon('search ')).toBe(false);
		expect(hasIcon(' search ')).toBe(false);
		expect(getIcon(' search')).toBeUndefined();
		expect(getIcon('search ')).toBeUndefined();
	});

	it('handles numeric strings', () => {
		expect(hasIcon('123')).toBe(false);
		expect(getIcon('123')).toBeUndefined();
	});
});
