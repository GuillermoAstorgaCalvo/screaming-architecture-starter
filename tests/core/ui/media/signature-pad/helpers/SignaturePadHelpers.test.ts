/**
 * SignaturePadHelpers Tests
 *
 * Tests for SignaturePad helper functions including:
 * - getAriaDescribedBy
 * - generateSignaturePadId
 */

import {
	generateSignaturePadId,
	getAriaDescribedBy,
} from '@core/ui/media/signature-pad/helpers/SignaturePadHelpers';
import { describe, expect, it } from 'vitest';

describe('SignaturePadHelpers - getAriaDescribedBy', () => {
	it('returns error ID when error is provided', () => {
		const result = getAriaDescribedBy('signature-pad-1', 'Invalid signature');
		expect(result).toBe('signature-pad-1-error');
	});

	it('returns helper ID when helperText is provided and no error', () => {
		const result = getAriaDescribedBy('signature-pad-1', undefined, 'Please sign here');
		expect(result).toBe('signature-pad-1-helper');
	});

	it('returns error ID when both error and helperText are provided', () => {
		const result = getAriaDescribedBy('signature-pad-1', 'Invalid signature', 'Please sign here');
		expect(result).toBe('signature-pad-1-error');
	});

	it('returns undefined when neither error nor helperText are provided', () => {
		const result = getAriaDescribedBy('signature-pad-1');
		expect(result).toBeUndefined();
	});

	it('handles empty string error as falsy', () => {
		const result = getAriaDescribedBy('signature-pad-1', '');
		expect(result).toBeUndefined();
	});

	it('handles empty string helperText as falsy', () => {
		const result = getAriaDescribedBy('signature-pad-1', undefined, '');
		expect(result).toBeUndefined();
	});

	it('handles different signature pad IDs', () => {
		const result1 = getAriaDescribedBy('custom-id', 'Error');
		expect(result1).toBe('custom-id-error');

		const result2 = getAriaDescribedBy('another-id', undefined, 'Helper');
		expect(result2).toBe('another-id-helper');
	});
});

describe('SignaturePadHelpers - generateSignaturePadId', () => {
	it('returns provided signaturePadId when given', () => {
		const result = generateSignaturePadId('generated-id', 'custom-id');
		expect(result).toBe('custom-id');
	});

	it('returns generated ID when label is provided and no signaturePadId', () => {
		const generatedId = 'r1:r2:r3';
		const result = generateSignaturePadId(generatedId, undefined, 'Signature');
		expect(result).toBe('signature-pad-r1r2r3');
	});

	it('returns undefined when no label and no signaturePadId', () => {
		const result = generateSignaturePadId('generated-id');
		expect(result).toBeUndefined();
	});

	it('removes colons from generated ID', () => {
		const generatedId = 'r1:r2:r3:r4';
		const result = generateSignaturePadId(generatedId, undefined, 'Signature');
		expect(result).toBe('signature-pad-r1r2r3r4');
		expect(result).not.toContain(':');
	});

	it('prioritizes signaturePadId over label', () => {
		const result = generateSignaturePadId('generated-id', 'custom-id', 'Signature');
		expect(result).toBe('custom-id');
	});

	it('handles empty string label', () => {
		const result = generateSignaturePadId('generated-id', undefined, '');
		expect(result).toBeUndefined();
	});

	it('handles complex generated IDs', () => {
		const generatedId = 'r1:r2:r3:r4:r5';
		const result = generateSignaturePadId(generatedId, undefined, 'My Signature');
		expect(result).toBe('signature-pad-r1r2r3r4r5');
	});

	it('handles generated ID without colons', () => {
		const generatedId = 'simple-id';
		const result = generateSignaturePadId(generatedId, undefined, 'Signature');
		expect(result).toBe('signature-pad-simple-id');
	});
});
