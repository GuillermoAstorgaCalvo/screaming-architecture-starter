import type { TokenPayload } from '@src-types/api/auth';

interface BufferLike {
	from(input: string, encoding: string): { toString(encoding: string): string };
}

export interface DecodedJwtParts<TPayload = Record<string, unknown>> {
	header: Record<string, unknown>;
	payload: TPayload;
	signature?: string;
}

const BASE64_SEGMENT_LENGTH = 4;
const PAD_CHAR = '=';

export function decodeJwt<TPayload = TokenPayload>(
	token: string
): DecodedJwtParts<TPayload> | null {
	const [headerSegment, payloadSegment, signatureSegment] = token.split('.');
	if (!headerSegment || !payloadSegment) {
		return null;
	}

	const header = parseJson<Record<string, unknown>>(decodeBase64Url(headerSegment));
	const payload = parseJson<TPayload>(decodeBase64Url(payloadSegment));

	if (!header || payload === null) {
		return null;
	}

	return {
		header,
		payload,
		...(typeof signatureSegment === 'string' ? { signature: signatureSegment } : {}),
	};
}

export function extractNumericClaim(
	payload: Record<string, unknown>,
	key: string
): number | null | undefined {
	const value = payload[key];
	if (value === undefined) {
		return undefined;
	}

	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (!trimmed) {
			return null;
		}

		const numeric = Number(trimmed);
		if (!Number.isNaN(numeric)) {
			return numeric;
		}

		const parsedDate = Date.parse(trimmed);
		return Number.isNaN(parsedDate) ? null : parsedDate;
	}

	return null;
}

function decodeBase64Url(input: string): string {
	const normalized = input.replaceAll('-', '+').replaceAll('_', '/');
	const remainder = normalized.length % BASE64_SEGMENT_LENGTH;
	const padding = remainder === 0 ? '' : PAD_CHAR.repeat(BASE64_SEGMENT_LENGTH - remainder);
	const base64 = `${normalized}${padding}`;

	if (typeof globalThis.atob === 'function') {
		return globalThis.atob(base64);
	}

	if ('Buffer' in globalThis) {
		const bufferCtor = (globalThis as typeof globalThis & { Buffer: BufferLike }).Buffer;
		if (typeof bufferCtor.from === 'function') {
			return bufferCtor.from(base64, 'base64').toString('utf-8');
		}
	}

	throw new Error('Base64 decoding not supported in current environment');
}

function parseJson<T>(value: string): T | null {
	try {
		return JSON.parse(value) as T;
	} catch {
		return null;
	}
}
