/**
 * LoadingWrapperHelpers.state.loading Tests
 *
 * Tests for the loading state helpers including:
 * - buildLoadingStateParams
 * - renderLoadingState
 * - renderLoadingStateIfPresent
 */

import {
	buildLoadingStateParams,
	renderLoadingState,
	renderLoadingStateIfPresent,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.loading';
import type { LoadingWrapperStateParams } from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const LOADING_TEXT = 'Loading...';
const NO_DATA_TITLE = 'No Data';
const SKELETON_WRAPPER_TEST_ID = 'skeleton-wrapper';

describe('buildLoadingStateParams', () => {
	it('builds loading state params with all properties', () => {
		const params = buildLoadingStateParams({
			loadingComponent: <div>Loading</div>,
			useSkeleton: true,
			skeletonComponent: <div>Skeleton</div>,
			loadingText: LOADING_TEXT,
			className: 'test-class',
			props: {},
		});

		expect(params.useSkeleton).toBe(true);
		expect(params.loadingComponent).toBeDefined();
		expect(params.skeletonComponent).toBeDefined();
		expect(params.loadingText).toBe(LOADING_TEXT);
		expect(params.className).toBe('test-class');
	});

	it('filters out undefined properties', () => {
		const params = buildLoadingStateParams({
			useSkeleton: false,
			props: {},
		});

		expect(params.useSkeleton).toBe(false);
		expect(params.loadingComponent).toBeUndefined();
		expect(params.skeletonComponent).toBeUndefined();
		expect(params.loadingText).toBeUndefined();
	});
});

describe('renderLoadingState - custom component', () => {
	it('renders custom loading component when provided', () => {
		const props = {
			loadingComponent: <div data-testid="custom-loading">Custom Loading</div>,
			useSkeleton: false,
			props: {},
		};

		render(<>{renderLoadingState(props)}</>);
		expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
	});
});

describe('renderLoadingState - skeleton', () => {
	it('renders skeleton when useSkeleton is true', () => {
		const props = {
			useSkeleton: true,
			props: { 'data-testid': 'skeleton-loading' },
		};

		render(<>{renderLoadingState(props)}</>);
		expect(screen.getByTestId('skeleton-loading')).toBeInTheDocument();
	});

	it('renders custom skeleton when useSkeleton is true and skeletonComponent provided', () => {
		const props = {
			useSkeleton: true,
			skeletonComponent: <div data-testid="custom-skeleton">Custom Skeleton</div>,
			props: {},
		};

		render(<>{renderLoadingState(props)}</>);
		expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
	});

	it('renders skeleton without className', () => {
		const props = {
			useSkeleton: true,
			skeletonComponent: <div data-testid="custom-skeleton">Custom Skeleton</div>,
			props: {},
		};

		render(<>{renderLoadingState(props)}</>);
		expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
	});

	it('renders skeleton with className', () => {
		const props = {
			useSkeleton: true,
			skeletonComponent: <div data-testid="custom-skeleton">Custom Skeleton</div>,
			className: 'skeleton-class',
			props: {},
		};

		render(<>{renderLoadingState(props)}</>);
		const wrapper = screen.getByTestId(SKELETON_WRAPPER_TEST_ID);
		expect(wrapper).toHaveClass('skeleton-class');
	});
});

describe('renderLoadingState - spinner', () => {
	it('renders spinner when useSkeleton is false and no custom component', () => {
		const props = {
			useSkeleton: false,
			props: {},
		};

		render(<>{renderLoadingState(props)}</>);
		// Should render spinner (may have multiple elements with same label)
		const containers = screen.getAllByLabelText(/loading/i);
		expect(containers.length).toBeGreaterThan(0);
	});

	it('renders spinner without className', () => {
		const props = {
			useSkeleton: false,
			loadingText: LOADING_TEXT,
			props: {},
		};

		render(<>{renderLoadingState(props)}</>);
		const containers = screen.getAllByLabelText(/loading/i);
		expect(containers.length).toBeGreaterThan(0);
	});

	it('renders spinner with className', () => {
		const props = {
			useSkeleton: false,
			loadingText: LOADING_TEXT,
			className: 'spinner-class',
			props: {},
		};

		render(<>{renderLoadingState(props)}</>);
		const containers = screen.getAllByLabelText(/loading/i);
		expect(containers.length).toBeGreaterThan(0);
		expect(containers[0]).toHaveClass('spinner-class');
	});
});

describe('renderLoadingStateIfPresent - not loading', () => {
	it('returns null when not loading', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: null,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: NO_DATA_TITLE,
			props: {},
		};

		const view = renderLoadingStateIfPresent(params);
		expect(view).toBeNull();
	});
});

describe('renderLoadingStateIfPresent - loading state with spinner', () => {
	it('renders loading state when isLoading is true', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: true,
			error: null,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: NO_DATA_TITLE,
			props: {},
		};

		render(<>{renderLoadingStateIfPresent(params)}</>);
		// Should render spinner (may have multiple elements with same label)
		const containers = screen.getAllByLabelText(/loading/i);
		expect(containers.length).toBeGreaterThan(0);
	});

	it('renders custom loading component when provided', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: true,
			error: null,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: NO_DATA_TITLE,
			loadingComponent: <div data-testid="custom-loading">Custom</div>,
			props: {},
		};

		render(<>{renderLoadingStateIfPresent(params)}</>);
		expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
	});

	it('renders loading state without className', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: true,
			error: null,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: NO_DATA_TITLE,
			loadingText: LOADING_TEXT,
			props: {},
		};

		render(<>{renderLoadingStateIfPresent(params)}</>);
		const containers = screen.getAllByLabelText(/loading/i);
		expect(containers.length).toBeGreaterThan(0);
	});

	it('renders loading state with className', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: true,
			error: null,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: NO_DATA_TITLE,
			className: 'loading-class',
			props: {},
		};

		render(<>{renderLoadingStateIfPresent(params)}</>);
		const containers = screen.getAllByLabelText(/loading/i);
		expect(containers.length).toBeGreaterThan(0);
		expect(containers[0]).toHaveClass('loading-class');
	});
});

describe('renderLoadingStateIfPresent - loading state with skeleton', () => {
	it('renders skeleton loading state without className', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: true,
			error: null,
			isEmpty: false,
			useSkeleton: true,
			emptyTitle: NO_DATA_TITLE,
			props: {},
		};

		render(<>{renderLoadingStateIfPresent(params)}</>);
		expect(screen.getByTestId(SKELETON_WRAPPER_TEST_ID)).toBeInTheDocument();
	});

	it('renders skeleton loading state with className', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: true,
			error: null,
			isEmpty: false,
			useSkeleton: true,
			emptyTitle: NO_DATA_TITLE,
			className: 'skeleton-loading-class',
			props: {},
		};

		render(<>{renderLoadingStateIfPresent(params)}</>);
		const wrapper = screen.getByTestId(SKELETON_WRAPPER_TEST_ID);
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveClass('skeleton-loading-class');
	});
});
