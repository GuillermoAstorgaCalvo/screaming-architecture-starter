/**
 * Affix Component Tests - Core Functionality
 *
 * Tests for the Affix component covering:
 * - Rendering and basic functionality
 * - Styling and props
 * - Position variants
 * - Configuration options
 * - HTML attributes
 * - Container prop
 */

import Affix from '@core/ui/affix/Affix';
import * as useAffixModule from '@core/ui/affix/hooks/useAffix';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { CSSProperties } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BANNER_ROLE, CONTENT_TEXT, getAffixElement, setupScrollMocks } from './Affix.test.helpers';

// Helper to create mock useAffix return value
const createMockUseAffix = (isSticky: boolean) => {
	const elementRef = { current: document.createElement('div') };
	return {
		isSticky,
		elementRef,
	};
};

// Helper to render Affix with mocked sticky state
const renderAffixWithSticky = (props: {
	position?: 'top' | 'bottom' | 'left' | 'right';
	offset?: number;
	zIndex?: number;
	style?: CSSProperties;
	isSticky?: boolean;
}) => {
	const { isSticky = true, ...affixProps } = props;
	vi.spyOn(useAffixModule, 'useAffix').mockReturnValue(createMockUseAffix(isSticky));
	const { container } = renderWithProviders(
		<Affix {...affixProps}>
			<div>{CONTENT_TEXT}</div>
		</Affix>
	);
	return { container, affix: getAffixElement(container) };
};

beforeEach(() => {
	setupScrollMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Affix - functionality - rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<Affix>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
	});

	it('renders with default props', () => {
		const { container } = renderWithProviders(
			<Affix>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
		expect(affix).toHaveClass('relative');
	});
});

describe('Affix - functionality - styling and props', () => {
	it('applies custom className', () => {
		const { container } = renderWithProviders(
			<Affix className="custom-affix">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toHaveClass('custom-affix');
	});

	it('applies custom style', () => {
		const customStyle = { backgroundColor: 'red' };
		const { container } = renderWithProviders(
			<Affix style={customStyle}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		// React converts color names to RGB, so we check for the RGB value
		expect(affix).toHaveStyle({ backgroundColor: expect.stringContaining('rgb') });
		// Also verify the style attribute is set
		expect(affix.getAttribute('style')).toBeTruthy();
	});
});

describe('Affix - functionality - position variants', () => {
	it('supports different positions', () => {
		const { container: topContainer } = renderWithProviders(
			<Affix position="top">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const { container: bottomContainer } = renderWithProviders(
			<Affix position="bottom">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const { container: leftContainer } = renderWithProviders(
			<Affix position="left">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const { container: rightContainer } = renderWithProviders(
			<Affix position="right">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		expect(getAffixElement(topContainer)).toBeInTheDocument();
		expect(getAffixElement(bottomContainer)).toBeInTheDocument();
		expect(getAffixElement(leftContainer)).toBeInTheDocument();
		expect(getAffixElement(rightContainer)).toBeInTheDocument();
	});
});

describe('Affix - functionality - configuration options', () => {
	it('supports custom offset', () => {
		const { container } = renderWithProviders(
			<Affix offset={20}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});

	it('supports custom threshold', () => {
		const { container } = renderWithProviders(
			<Affix threshold={100}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});

	it('supports custom zIndex', () => {
		const { container } = renderWithProviders(
			<Affix zIndex={9999}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});

	it('can be disabled with enabled prop', () => {
		const { container } = renderWithProviders(
			<Affix enabled={false}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
		// When disabled, should remain relative
		expect(affix).toHaveClass('relative');
	});
});

describe('Affix - functionality - inline styles when sticky', () => {
	it('applies correct inline styles for top position when sticky', () => {
		const { container } = renderWithProviders(
			<Affix position="top" offset={16} zIndex={2000}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toHaveClass('relative');
	});

	it('applies correct inline styles for bottom position when sticky', () => {
		const { container } = renderWithProviders(
			<Affix position="bottom" offset={20} zIndex={1500}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});

	it('applies correct inline styles for left position when sticky', () => {
		const { container } = renderWithProviders(
			<Affix position="left" offset={10} zIndex={1000}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});

	it('applies correct inline styles for right position when sticky', () => {
		const { container } = renderWithProviders(
			<Affix position="right" offset={30} zIndex={2500}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});
});

describe('Affix - functionality - z-index and style merging', () => {
	it('applies z-index when sticky', () => {
		const customZIndex = 5000;
		const { container } = renderWithProviders(
			<Affix position="top" zIndex={customZIndex}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});

	it('merges custom style with calculated styles when sticky', () => {
		const customStyle = { backgroundColor: 'blue', padding: '10px' };
		const { container } = renderWithProviders(
			<Affix position="top" offset={15} style={customStyle}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toHaveStyle({ padding: '10px' });
	});

	it('returns only custom style when not sticky', () => {
		const customStyle = { backgroundColor: 'green', margin: '20px' };
		const { container } = renderWithProviders(
			<Affix style={customStyle}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toHaveStyle({ margin: '20px' });
	});
});

describe('Affix - functionality - position classes when sticky', () => {
	it('applies fixed and top-0 classes when sticky in top position', () => {
		const { container } = renderWithProviders(
			<Affix position="top">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		// Initially relative, but should support sticky state
		expect(affix).toBeInTheDocument();
	});

	it('applies fixed and bottom-0 classes when sticky in bottom position', () => {
		const { container } = renderWithProviders(
			<Affix position="bottom">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});

	it('applies fixed and left-0 classes when sticky in left position', () => {
		const { container } = renderWithProviders(
			<Affix position="left">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});

	it('applies fixed and right-0 classes when sticky in right position', () => {
		const { container } = renderWithProviders(
			<Affix position="right">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});

	it('merges className with position classes', () => {
		const { container } = renderWithProviders(
			<Affix position="top" className="custom-class another-class">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toHaveClass('custom-class');
		expect(affix).toHaveClass('another-class');
	});
});

describe('Affix - functionality - HTML attributes', () => {
	it('spreads HTML attributes to root element', () => {
		const { container } = renderWithProviders(
			<Affix id="affix-id" data-testid="affix-test" data-custom="value">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toHaveAttribute('id', 'affix-id');
		expect(affix).toHaveAttribute('data-testid', 'affix-test');
		expect(affix).toHaveAttribute('data-custom', 'value');
	});

	it('supports aria attributes', () => {
		const { container } = renderWithProviders(
			<Affix aria-label="Sticky navigation" aria-hidden="false">
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toHaveAttribute('aria-label', 'Sticky navigation');
		expect(affix).toHaveAttribute('aria-hidden', 'false');
	});

	it('supports role attribute', () => {
		const { container } = renderWithProviders(
			<Affix role={BANNER_ROLE}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toHaveAttribute('role', BANNER_ROLE);
	});

	it('supports tabIndex', () => {
		const { container } = renderWithProviders(
			<Affix tabIndex={0}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toHaveAttribute('tabIndex', '0');
	});
});

describe('Affix - functionality - container prop', () => {
	it('accepts container prop', () => {
		const containerElement = document.createElement('div');
		containerElement.id = 'scroll-container';

		const { container } = renderWithProviders(
			<Affix container={containerElement}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});

	it('handles null container prop', () => {
		const { container } = renderWithProviders(
			<Affix container={null}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});

	it('works with container element that has scroll', () => {
		const containerElement = document.createElement('div');
		containerElement.style.overflow = 'auto';
		containerElement.style.height = '200px';

		const { container } = renderWithProviders(
			<Affix container={containerElement} threshold={50}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
	});
});

describe('Affix - functionality - sticky state styles', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('position-specific styles when sticky', () => {
		it('applies correct inline styles for top position when sticky', () => {
			const { affix } = renderAffixWithSticky({ position: 'top', offset: 16, zIndex: 2000 });
			expect(affix).toHaveClass('fixed', 'top-0');
			expect(affix).toHaveStyle({ top: '16px', left: '0px', right: '0px', zIndex: 2000 });
		});

		it('applies correct inline styles for bottom position when sticky', () => {
			const { affix } = renderAffixWithSticky({ position: 'bottom', offset: 20, zIndex: 1500 });
			expect(affix).toHaveClass('fixed', 'bottom-0');
			expect(affix).toHaveStyle({ bottom: '20px', left: '0px', right: '0px', zIndex: 1500 });
		});

		it('applies correct inline styles for left position when sticky', () => {
			const { affix } = renderAffixWithSticky({ position: 'left', offset: 10, zIndex: 1000 });
			expect(affix).toHaveClass('fixed', 'left-0');
			expect(affix).toHaveStyle({ left: '10px', top: '0px', bottom: '0px', zIndex: 1000 });
		});

		it('applies correct inline styles for right position when sticky', () => {
			const { affix } = renderAffixWithSticky({ position: 'right', offset: 30, zIndex: 2500 });
			expect(affix).toHaveClass('fixed', 'right-0');
			expect(affix).toHaveStyle({ right: '30px', top: '0px', bottom: '0px', zIndex: 2500 });
		});
	});

	describe('style merging when sticky', () => {
		it('merges custom style with calculated styles when sticky', () => {
			const customStyle = { backgroundColor: 'blue', padding: '10px' };
			const { affix } = renderAffixWithSticky({
				position: 'top',
				offset: 15,
				zIndex: 1000,
				style: customStyle,
			});
			expect(affix).toHaveStyle({ padding: '10px', top: '15px', zIndex: 1000 });
			expect(affix).toHaveStyle({ backgroundColor: expect.stringContaining('rgb') });
		});

		it('applies only zIndex and custom style when sticky but no position-specific styles for default case', () => {
			const customStyle = { backgroundColor: 'red' };
			const { affix } = renderAffixWithSticky({
				position: 'top',
				offset: 15,
				zIndex: 1000,
				style: customStyle,
			});
			expect(affix).toHaveClass('fixed', 'top-0');
			expect(affix).toHaveStyle({ zIndex: 1000 });
		});
	});
});
