import { parseJsonResponse, parseResponse } from '@core/lib/http/httpClientResponseParsing';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

describe('parseJsonResponse', () => {
	it('parses valid JSON string', async () => {
		const text = JSON.stringify({ key: 'value', number: 123 });
		const result = await parseJsonResponse<{ key: string; number: number }>(text);
		expect(result).toEqual({ key: 'value', number: 123 });
	});

	it('returns null for empty string', async () => {
		const result = await parseJsonResponse('');
		expect(result).toBeNull();
	});

	it('returns null for whitespace-only string', async () => {
		const result = await parseJsonResponse('   ');
		expect(result).toBeNull();
	});

	it('validates with Zod schema when provided', async () => {
		const schema = z.object({
			key: z.string(),
			number: z.number(),
		});
		const text = JSON.stringify({ key: 'value', number: 123 });
		const result = await parseJsonResponse(text, schema);
		expect(result).toEqual({ key: 'value', number: 123 });
	});

	it('throws error when Zod schema validation fails', async () => {
		const schema = z.object({
			key: z.string(),
			number: z.number(),
		});
		const text = JSON.stringify({ key: 'value', number: 'not a number' });
		await expect(parseJsonResponse(text, schema)).rejects.toThrow('Response validation failed');
	});

	it('returns parsed data without schema when schema is not provided', async () => {
		const text = JSON.stringify({ key: 'value' });
		const result = await parseJsonResponse<{ key: string }>(text);
		expect(result).toEqual({ key: 'value' });
	});

	it('handles array JSON', async () => {
		const text = JSON.stringify([1, 2, 3]);
		const result = await parseJsonResponse<number[]>(text);
		expect(result).toEqual([1, 2, 3]);
	});

	it('handles null JSON', async () => {
		const text = JSON.stringify(null);
		const result = await parseJsonResponse<null>(text);
		expect(result).toBeNull();
	});

	it('handles invalid JSON by rethrowing error', async () => {
		const text = 'invalid json';
		await expect(parseJsonResponse(text)).rejects.toThrow();
	});
});

describe('parseResponse - JSON responses', () => {
	it('parses JSON response when Content-Type is application/json', async () => {
		const response = new Response(JSON.stringify({ key: 'value' }), {
			headers: { 'Content-Type': 'application/json' },
		});
		const result = await parseResponse<{ key: string }>(response);
		expect(result).toEqual({ key: 'value' });
	});

	it('parses JSON response when Content-Type includes application/json', async () => {
		const response = new Response(JSON.stringify({ key: 'value' }), {
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		});
		const result = await parseResponse<{ key: string }>(response);
		expect(result).toEqual({ key: 'value' });
	});

	it('returns null for empty JSON response', async () => {
		const response = new Response('', {
			headers: { 'Content-Type': 'application/json' },
		});
		const result = await parseResponse<null>(response);
		expect(result).toBeNull();
	});

	it('validates JSON response with Zod schema', async () => {
		const schema = z.object({
			key: z.string(),
		});
		const response = new Response(JSON.stringify({ key: 'value' }), {
			headers: { 'Content-Type': 'application/json' },
		});
		const result = await parseResponse(response, schema);
		expect(result).toEqual({ key: 'value' });
	});

	it('throws error when JSON response fails Zod validation', async () => {
		const schema = z.object({
			key: z.string(),
		});
		const response = new Response(JSON.stringify({ key: 123 }), {
			headers: { 'Content-Type': 'application/json' },
		});
		await expect(parseResponse(response, schema)).rejects.toThrow('Response validation failed');
	});
});

describe('parseResponse - text responses', () => {
	it('parses text response when Content-Type is text/*', async () => {
		const response = new Response('plain text', {
			headers: { 'Content-Type': 'text/plain' },
		});
		const result = await parseResponse<string>(response);
		expect(result).toBe('plain text');
	});

	it('parses text response when Content-Type is text/html', async () => {
		const response = new Response('<html></html>', {
			headers: { 'Content-Type': 'text/html' },
		});
		const result = await parseResponse<string>(response);
		expect(result).toBe('<html></html>');
	});
});

describe('parseResponse - blob responses', () => {
	it('parses blob response for binary content types', async () => {
		const blob = new Blob(['binary data'], { type: 'application/octet-stream' });
		const response = new Response(blob, {
			headers: { 'Content-Type': 'application/octet-stream' },
		});
		const result = await parseResponse<Blob>(response);
		// Check if it's a Blob by checking its properties and constructor
		expect(result).toBeDefined();
		expect(result).toHaveProperty('size');
		expect(result).toHaveProperty('type');
		expect(result.constructor.name).toBe('Blob');
	});

	it('parses blob response for image content types', async () => {
		const blob = new Blob(['image data'], { type: 'image/png' });
		const response = new Response(blob, {
			headers: { 'Content-Type': 'image/png' },
		});
		const result = await parseResponse<Blob>(response);
		// Check if it's a Blob by checking its properties and constructor
		expect(result).toBeDefined();
		expect(result).toHaveProperty('size');
		expect(result).toHaveProperty('type');
		expect(result.constructor.name).toBe('Blob');
	});

	it('parses blob response for video content types', async () => {
		const blob = new Blob(['video data'], { type: 'video/mp4' });
		const response = new Response(blob, {
			headers: { 'Content-Type': 'video/mp4' },
		});
		const result = await parseResponse<Blob>(response);
		// Check if it's a Blob by checking its properties and constructor
		expect(result).toBeDefined();
		expect(result).toHaveProperty('size');
		expect(result).toHaveProperty('type');
		expect(result.constructor.name).toBe('Blob');
	});

	it('parses blob response for audio content types', async () => {
		const blob = new Blob(['audio data'], { type: 'audio/mpeg' });
		const response = new Response(blob, {
			headers: { 'Content-Type': 'audio/mpeg' },
		});
		const result = await parseResponse<Blob>(response);
		// Check if it's a Blob by checking its properties and constructor
		expect(result).toBeDefined();
		expect(result).toHaveProperty('size');
		expect(result).toHaveProperty('type');
		expect(result.constructor.name).toBe('Blob');
	});
});

describe('parseResponse - edge cases', () => {
	it('defaults to text parsing when Content-Type is not recognized', async () => {
		const response = new Response('unknown content', {
			headers: { 'Content-Type': 'unknown/type' },
		});
		const result = await parseResponse<string>(response);
		expect(result).toBe('unknown content');
	});

	it('defaults to text parsing when Content-Type is missing', async () => {
		const response = new Response('no content type');
		const result = await parseResponse<string>(response);
		expect(result).toBe('no content type');
	});

	it('handles response with null Content-Type', async () => {
		const response = new Response('content', {
			headers: {},
		});
		// Mock get to return null
		const originalGet = response.headers.get.bind(response.headers);
		response.headers.get = vi.fn().mockReturnValue(null);
		const result = await parseResponse<string>(response);
		expect(result).toBe('content');
		response.headers.get = originalGet;
	});
});
