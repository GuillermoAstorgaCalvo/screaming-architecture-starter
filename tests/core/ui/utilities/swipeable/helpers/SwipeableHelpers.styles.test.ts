/**
 * SwipeableHelpers.styles Tests
 *
 * Tests for style calculation functions:
 * - getContentStyle
 * - getActionsContainerStyle
 */

import {
	getActionsContainerStyle,
	getContentStyle,
} from '@core/ui/utilities/swipeable/helpers/SwipeableHelpers.styles';
import { describe, expect, it } from 'vitest';

describe('SwipeableHelpers.styles - getContentStyle', () => {
	it('returns correct transform style for positive deltaX and deltaY', () => {
		const style = getContentStyle(100, 50);
		expect(style).toEqual({
			transform: 'translate(100px, 50px)',
		});
	});

	it('returns correct transform style for negative deltaX and deltaY', () => {
		const style = getContentStyle(-100, -50);
		expect(style).toEqual({
			transform: 'translate(-100px, -50px)',
		});
	});

	it('returns correct transform style for zero deltas', () => {
		const style = getContentStyle(0, 0);
		expect(style).toEqual({
			transform: 'translate(0px, 0px)',
		});
	});

	it('returns correct transform style for mixed positive and negative deltas', () => {
		const style = getContentStyle(100, -50);
		expect(style).toEqual({
			transform: 'translate(100px, -50px)',
		});
	});

	it('handles decimal values', () => {
		const style = getContentStyle(50.5, 25.3);
		expect(style).toEqual({
			transform: 'translate(50.5px, 25.3px)',
		});
	});
});

describe('SwipeableHelpers.styles - getActionsContainerStyle', () => {
	it('returns empty object when swipeDirection is null', () => {
		const style = getActionsContainerStyle({
			swipeDirection: null,
			deltaX: 100,
			deltaY: 50,
			threshold: 50,
		});
		expect(style).toEqual({});
	});
});

describe('SwipeableHelpers.styles - getActionsContainerStyle - Left swipe', () => {
	it('returns correct style for left swipe', () => {
		const style = getActionsContainerStyle({
			swipeDirection: 'left',
			deltaX: -100,
			deltaY: 0,
			threshold: 50,
		});
		expect(style).toEqual({
			left: 0,
			width: '100px',
		});
	});

	it('caps width at threshold * 2 for left swipe', () => {
		const style = getActionsContainerStyle({
			swipeDirection: 'left',
			deltaX: -200,
			deltaY: 0,
			threshold: 50,
		});
		expect(style).toEqual({
			left: 0,
			width: '100px', // threshold * 2 = 100
		});
	});

	it('uses absolute value of deltaX for width calculation', () => {
		const style = getActionsContainerStyle({
			swipeDirection: 'left',
			deltaX: -75,
			deltaY: 0,
			threshold: 50,
		});
		expect(style).toEqual({
			left: 0,
			width: '75px',
		});
	});
});

describe('SwipeableHelpers.styles - getActionsContainerStyle - Right swipe', () => {
	it('returns correct style for right swipe', () => {
		const style = getActionsContainerStyle({
			swipeDirection: 'right',
			deltaX: 100,
			deltaY: 0,
			threshold: 50,
		});
		expect(style).toEqual({
			right: 0,
			width: '100px',
		});
	});

	it('caps width at threshold * 2 for right swipe', () => {
		const style = getActionsContainerStyle({
			swipeDirection: 'right',
			deltaX: 200,
			deltaY: 0,
			threshold: 50,
		});
		expect(style).toEqual({
			right: 0,
			width: '100px', // threshold * 2 = 100
		});
	});
});

describe('SwipeableHelpers.styles - getActionsContainerStyle - Up swipe', () => {
	it('returns correct style for up swipe', () => {
		const style = getActionsContainerStyle({
			swipeDirection: 'up',
			deltaX: 0,
			deltaY: -100,
			threshold: 50,
		});
		expect(style).toEqual({
			top: 0,
			height: '100px',
			width: '100%',
		});
	});

	it('caps height at threshold * 2 for up swipe', () => {
		const style = getActionsContainerStyle({
			swipeDirection: 'up',
			deltaX: 0,
			deltaY: -200,
			threshold: 50,
		});
		expect(style).toEqual({
			top: 0,
			height: '100px', // threshold * 2 = 100
			width: '100%',
		});
	});

	it('uses absolute value of deltaY for height calculation', () => {
		const style = getActionsContainerStyle({
			swipeDirection: 'up',
			deltaX: 0,
			deltaY: -75,
			threshold: 50,
		});
		expect(style).toEqual({
			top: 0,
			height: '75px',
			width: '100%',
		});
	});
});

describe('SwipeableHelpers.styles - getActionsContainerStyle - Down swipe', () => {
	it('returns correct style for down swipe', () => {
		const style = getActionsContainerStyle({
			swipeDirection: 'down',
			deltaX: 0,
			deltaY: 100,
			threshold: 50,
		});
		expect(style).toEqual({
			bottom: 0,
			height: '100px',
			width: '100%',
		});
	});

	it('caps height at threshold * 2 for down swipe', () => {
		const style = getActionsContainerStyle({
			swipeDirection: 'down',
			deltaX: 0,
			deltaY: 200,
			threshold: 50,
		});
		expect(style).toEqual({
			bottom: 0,
			height: '100px', // threshold * 2 = 100
			width: '100%',
		});
	});
});

describe('SwipeableHelpers.styles - getActionsContainerStyle - Threshold handling', () => {
	it('handles different threshold values', () => {
		const style = getActionsContainerStyle({
			swipeDirection: 'left',
			deltaX: -150,
			deltaY: 0,
			threshold: 75,
		});
		expect(style).toEqual({
			left: 0,
			width: '150px', // threshold * 2 = 150
		});
	});
});
