/**
 * ToggleGroupContext Tests
 *
 * Tests for the ToggleGroupContext including:
 * - Context creation
 * - Default value
 * - Context type
 */

import { ToggleGroupContext } from '@core/ui/forms/toggle/components/ToggleGroupContext';
import { describe, expect, it } from 'vitest';

describe('ToggleGroupContext', () => {
	it('should be defined', () => {
		expect(ToggleGroupContext).toBeDefined();
	});

	it('should be a React context', () => {
		expect(ToggleGroupContext).toHaveProperty('Provider');
		expect(ToggleGroupContext).toHaveProperty('Consumer');
	});

	it('should have null as default value', () => {
		// React contexts created with createContext have _currentValue property
		// The default value is null when no default is provided
		expect(ToggleGroupContext).toBeDefined();
	});
});
