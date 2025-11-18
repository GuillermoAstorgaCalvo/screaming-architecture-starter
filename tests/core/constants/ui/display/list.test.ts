import {
	LIST_BASE_CLASSES,
	LIST_ITEM_SIZE_CLASSES,
	LIST_VARIANT_CLASSES,
} from '@core/constants/ui/display/list';
import { describe, expect, it } from 'vitest';

describe('list constants', () => {
	it('locks base, variant, and size classes', () => {
		expect(LIST_BASE_CLASSES).toBe('list-none p-0 m-0');
		expect(LIST_VARIANT_CLASSES).toEqual({
			default: '',
			bordered: 'border border-border rounded-lg dark:border-border-dark',
			divided: 'divide-y divide-border dark:divide-border-dark',
		});
		expect(LIST_ITEM_SIZE_CLASSES).toEqual({
			sm: 'px-sm py-sm',
			md: 'px-md py-md',
			lg: 'px-lg py-lg',
		});
	});
});
