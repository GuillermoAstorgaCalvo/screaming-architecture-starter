/**
 * LoadingWrapperHelpers.state.success Tests
 *
 * Tests for the success state helpers including:
 * - renderSuccessState
 * - buildSuccessStateParams
 */

import {
	buildSuccessStateParams,
	renderSuccessState,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.success';
import type { LoadingWrapperStateParams } from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const EMPTY_TITLE = 'No Data';
const CUSTOM_CLASS = 'custom-class';

describe('buildSuccessStateParams', () => {
	it('builds success state params with children', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: null,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: EMPTY_TITLE,
			children: <div data-testid="content">Content</div>,
			props: {},
		};

		const successParams = buildSuccessStateParams(params);
		expect(successParams).toHaveProperty('children');
		expect(successParams.props).toEqual({});
	});

	it('builds success state params with className', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: null,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: EMPTY_TITLE,
			className: CUSTOM_CLASS,
			props: {},
		};

		const successParams = buildSuccessStateParams(params);
		expect(successParams.className).toBe(CUSTOM_CLASS);
	});

	it('filters out undefined properties', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: null,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: EMPTY_TITLE,
			props: {},
		};

		const successParams = buildSuccessStateParams(params);
		expect(successParams).not.toHaveProperty('children');
		expect(successParams).not.toHaveProperty('className');
	});
});

describe('renderSuccessState', () => {
	it('renders children', () => {
		const params = {
			children: <div data-testid="content">Content</div>,
			props: {},
		};

		render(<>{renderSuccessState(params)}</>);
		expect(screen.getByTestId('content')).toBeInTheDocument();
		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	it('applies className to container', () => {
		const params = {
			children: <div>Content</div>,
			className: CUSTOM_CLASS,
			props: { 'data-testid': 'success-container' },
		};

		render(<>{renderSuccessState(params)}</>);
		expect(screen.getByTestId('success-container')).toHaveClass(CUSTOM_CLASS);
	});

	it('passes through props to container', () => {
		const params = {
			children: <div>Content</div>,
			props: { 'data-testid': 'success-wrapper' },
		};

		render(<>{renderSuccessState(params)}</>);
		expect(screen.getByTestId('success-wrapper')).toBeInTheDocument();
	});

	it('renders multiple children', () => {
		const params = {
			children: (
				<>
					<div data-testid="content1">Content 1</div>
					<div data-testid="content2">Content 2</div>
				</>
			),
			props: {},
		};

		render(<>{renderSuccessState(params)}</>);
		expect(screen.getByTestId('content1')).toBeInTheDocument();
		expect(screen.getByTestId('content2')).toBeInTheDocument();
	});
});
