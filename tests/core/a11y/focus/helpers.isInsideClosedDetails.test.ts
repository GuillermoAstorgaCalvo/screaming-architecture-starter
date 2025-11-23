/**
 * isInsideClosedDetails Tests
 */

import { isInsideClosedDetails } from '@core/a11y/focus/helpers';
import { describe, expect, it } from 'vitest';

describe('isInsideClosedDetails - basic open and closed states', () => {
	it('should return true when element is inside closed details', () => {
		const details = document.createElement('details');
		details.open = false;
		const element = document.createElement('div');
		details.append(element);
		expect(isInsideClosedDetails(element)).toBe(true);
	});

	it('should return false when element is inside open details', () => {
		const details = document.createElement('details');
		details.open = true;
		const element = document.createElement('div');
		details.append(element);
		expect(isInsideClosedDetails(element)).toBe(false);
	});

	it('should return false when element is not inside details', () => {
		const element = document.createElement('div');
		expect(isInsideClosedDetails(element)).toBe(false);
	});

	it('should return false when element is directly inside open details', () => {
		const details = document.createElement('details');
		details.open = true;
		const element = document.createElement('div');
		details.append(element);
		expect(isInsideClosedDetails(element)).toBe(false);
	});

	it('should return false when element is not inside any details', () => {
		const element = document.createElement('div');
		document.body.append(element);
		expect(isInsideClosedDetails(element)).toBe(false);
		element.remove();
	});
});

describe('isInsideClosedDetails - nested details elements', () => {
	it('should return true when element is nested inside closed details', () => {
		const details = document.createElement('details');
		details.open = false;
		const parent = document.createElement('div');
		const child = document.createElement('div');
		details.append(parent);
		parent.append(child);
		expect(isInsideClosedDetails(child)).toBe(true);
	});

	it('should return false when element is nested inside open details', () => {
		const details = document.createElement('details');
		details.open = true;
		const parent = document.createElement('div');
		const child = document.createElement('div');
		details.append(parent);
		parent.append(child);
		expect(isInsideClosedDetails(child)).toBe(false);
	});

	it('should return false when element is inside open details but ancestor is closed', () => {
		const outerDetails = document.createElement('details');
		outerDetails.open = false;
		const innerDetails = document.createElement('details');
		innerDetails.open = true;
		const element = document.createElement('div');
		outerDetails.append(innerDetails);
		innerDetails.append(element);
		// Should return true because outer details is closed
		expect(isInsideClosedDetails(element)).toBe(true);
	});

	it('should handle element inside multiple nested details with mixed states', () => {
		const outerDetails = document.createElement('details');
		outerDetails.open = true;
		const middleDetails = document.createElement('details');
		middleDetails.open = false;
		const innerDetails = document.createElement('details');
		innerDetails.open = true;
		const element = document.createElement('div');
		outerDetails.append(middleDetails);
		middleDetails.append(innerDetails);
		innerDetails.append(element);
		// Should return true because middle details is closed
		expect(isInsideClosedDetails(element)).toBe(true);
	});
});
