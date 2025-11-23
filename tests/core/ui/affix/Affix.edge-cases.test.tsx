/**
 * Affix Component Tests - Edge Cases and Prop Combinations
 *
 * Tests for the Affix component covering:
 * - Edge cases (zero, negative, large values)
 * - Prop combinations
 * - Special children handling
 */

import Affix from '@core/ui/affix/Affix';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	assertAffixExists,
	CONTENT_TEXT,
	getAffixElement,
	renderAndAssertAffixExists,
	setupScrollMocks,
	testAllPositionsWithOffset,
	testDisabledStateWithAllPositions,
} from './Affix.test.helpers';

beforeEach(() => {
	setupScrollMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Affix - functionality - edge cases - numeric values', () => {
	it('handles zero threshold', () => {
		assertAffixExists(
			<Affix threshold={0}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);
	});

	it('handles negative offset', () => {
		assertAffixExists(
			<Affix offset={-10}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);
	});

	it('handles large threshold values', () => {
		assertAffixExists(
			<Affix threshold={10000}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);
	});

	it('handles large offset values', () => {
		assertAffixExists(
			<Affix offset={5000}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);
	});

	it('handles zero zIndex', () => {
		assertAffixExists(
			<Affix zIndex={0}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);
	});

	it('handles negative zIndex', () => {
		assertAffixExists(
			<Affix zIndex={-1}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);
	});
});

describe('Affix - functionality - edge cases - children', () => {
	it('handles empty children', () => {
		assertAffixExists(<Affix />);
	});

	it('handles null children', () => {
		assertAffixExists(<Affix>{null}</Affix>);
	});

	it('handles multiple children', () => {
		renderWithProviders(
			<Affix>
				<div>Child 1</div>
				<div>Child 2</div>
				<div>Child 3</div>
			</Affix>
		);

		expect(screen.getByText('Child 1')).toBeInTheDocument();
		expect(screen.getByText('Child 2')).toBeInTheDocument();
		expect(screen.getByText('Child 3')).toBeInTheDocument();
	});

	it('handles fragment children', () => {
		renderWithProviders(
			<Affix>
				<>
					<div>Fragment Child 1</div>
					<div>Fragment Child 2</div>
				</>
			</Affix>
		);

		expect(screen.getByText('Fragment Child 1')).toBeInTheDocument();
		expect(screen.getByText('Fragment Child 2')).toBeInTheDocument();
	});
});

describe('Affix - functionality - prop combinations', () => {
	it('handles all position variants with offset', () => {
		testAllPositionsWithOffset();
	});

	it('handles position with custom zIndex and offset', () => {
		renderAndAssertAffixExists(
			<Affix position="top" offset={16} zIndex={3000}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);
	});

	it('handles position with threshold and offset', () => {
		renderAndAssertAffixExists(
			<Affix position="bottom" threshold={100} offset={20}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);
	});

	it('handles position with className and style', () => {
		const { container } = renderWithProviders(
			<Affix position="left" className="custom" style={{ padding: '10px' }}>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toHaveClass('custom');
		expect(affix).toHaveStyle({ padding: '10px' });
	});

	it('handles disabled state with all position variants', () => {
		testDisabledStateWithAllPositions();
	});
});
