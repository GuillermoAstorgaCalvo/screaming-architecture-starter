/**
 * LoadingWrapperHelpers.state.optional Tests
 *
 * Tests for the optional state props helper including:
 * - buildOptionalStateProps
 */

import { buildOptionalStateProps } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.optional';
import { describe, expect, it } from 'vitest';

const LOADING_TEXT = 'Loading...';

const createFullProps = () => {
	const onRetry = () => {};
	const onEmptyAction = () => {};
	return {
		onRetry,
		emptyMessage: 'No items',
		loadingComponent: <div>Loading</div>,
		skeletonComponent: <div>Skeleton</div>,
		errorComponent: <div>Error</div>,
		loadingText: LOADING_TEXT,
		emptyDescription: 'Description',
		emptyActionLabel: 'Add Item',
		onEmptyAction,
		children: <div>Content</div>,
		className: 'test-class',
	};
};

const assertAllPropsIncluded = (
	result: ReturnType<typeof buildOptionalStateProps>,
	props: ReturnType<typeof createFullProps>
) => {
	expect(result.onRetry).toBe(props.onRetry);
	expect(result.emptyMessage).toBe('No items');
	expect(result.loadingComponent).toBeDefined();
	expect(result.skeletonComponent).toBeDefined();
	expect(result.errorComponent).toBeDefined();
	expect(result.loadingText).toBe(LOADING_TEXT);
	expect(result.emptyDescription).toBe('Description');
	expect(result.emptyActionLabel).toBe('Add Item');
	expect(result.onEmptyAction).toBe(props.onEmptyAction);
	expect(result.children).toBeDefined();
	expect(result.className).toBe('test-class');
};

describe('buildOptionalStateProps', () => {
	describe('when all optional props are defined', () => {
		it('includes all defined optional props', () => {
			const props = createFullProps();
			const result = buildOptionalStateProps(props);
			assertAllPropsIncluded(result, props);
		});
	});

	describe('when optional props are undefined', () => {
		it('filters out undefined optional props', () => {
			const props = {
				onRetry: undefined,
				emptyMessage: undefined,
				loadingComponent: undefined,
				loadingText: LOADING_TEXT,
			};

			const result = buildOptionalStateProps(props);

			expect(result.onRetry).toBeUndefined();
			expect(result.emptyMessage).toBeUndefined();
			expect(result.loadingComponent).toBeUndefined();
			expect(result.loadingText).toBe(LOADING_TEXT);
		});
	});

	describe('edge cases', () => {
		it('handles empty object', () => {
			const props = {};
			const result = buildOptionalStateProps(props);
			expect(result).toEqual({});
		});

		it('handles null values as defined', () => {
			const props = {
				error: null,
				emptyMessage: null,
			};

			const result = buildOptionalStateProps(props);
			expect(result.emptyMessage).toBeNull();
		});

		it('handles zero and false as defined values', () => {
			const props = {
				onRetry: () => {},
				emptyMessage: '',
				loadingText: '',
			};

			const result = buildOptionalStateProps(props);
			expect(result.emptyMessage).toBe('');
			expect(result.loadingText).toBe('');
		});
	});
});
