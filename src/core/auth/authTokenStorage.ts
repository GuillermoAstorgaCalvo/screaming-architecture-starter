import type { AuthTokens } from '@core/ports/AuthPort';
import type { StoragePort } from '@core/ports/StoragePort';

export interface CreateAuthTokenStorageOptions {
	/**
	 * Storage key used to persist auth tokens
	 * Defaults to "app.auth.tokens"
	 */
	readonly key?: string;
}

export interface AuthTokenStorage {
	/**
	 * Load auth tokens from storage
	 */
	loadTokens(): AuthTokens | null;
	/**
	 * Persist auth tokens to storage
	 */
	saveTokens(tokens: AuthTokens): boolean;
	/**
	 * Remove auth tokens from storage
	 */
	clearTokens(): boolean;
}

const DEFAULT_STORAGE_KEY = 'app.auth.tokens';

/**
 * Create an auth token storage helper backed by StoragePort
 *
 * Handles JSON serialization, expiration normalization, and storage fallbacks.
 */
export function createAuthTokenStorage(
	storage: StoragePort,
	options: CreateAuthTokenStorageOptions = {}
): AuthTokenStorage {
	const key = options.key?.trim() ?? DEFAULT_STORAGE_KEY;

	return {
		loadTokens: () => loadTokensFromStorage(storage, key),
		saveTokens: tokens => saveTokensToStorage(storage, key, tokens),
		clearTokens: () => storage.removeItem(key),
	};
}

interface StoredAuthTokens {
	readonly accessToken?: unknown;
	readonly refreshToken?: unknown;
	readonly expiresAt?: unknown;
}

interface NormalizableTokens {
	readonly accessToken: string;
	readonly refreshToken?: string | null;
	readonly expiresAt?: unknown;
}

function normalizeTokens(tokens: NormalizableTokens): AuthTokens {
	const expiresAt = normalizeExpiresAt(tokens.expiresAt);
	const refreshToken = tokens.refreshToken ?? null;

	return expiresAt === undefined
		? {
				accessToken: tokens.accessToken,
				refreshToken,
			}
		: {
				accessToken: tokens.accessToken,
				refreshToken,
				expiresAt,
			};
}

function loadTokensFromStorage(storage: StoragePort, key: string): AuthTokens | null {
	const raw = storage.getItem(key);
	if (!raw) {
		return null;
	}

	try {
		const parsed = JSON.parse(raw) as StoredAuthTokens | null;
		if (!parsed || typeof parsed !== 'object') {
			return null;
		}

		const accessToken = typeof parsed.accessToken === 'string' ? parsed.accessToken : null;
		if (!accessToken) {
			return null;
		}

		return normalizeTokens({
			accessToken,
			refreshToken:
				typeof parsed.refreshToken === 'string' || parsed.refreshToken === null
					? parsed.refreshToken
					: null,
			expiresAt: parsed.expiresAt,
		});
	} catch (error) {
		storage.removeItem(key);
		console.warn('Invalid auth token payload in storage, clearing value', error);
		return null;
	}
}

function saveTokensToStorage(storage: StoragePort, key: string, tokens: AuthTokens): boolean {
	const normalized = normalizeTokens(tokens);
	const serialized = JSON.stringify({
		accessToken: normalized.accessToken,
		refreshToken: normalized.refreshToken,
		...(normalized.expiresAt === undefined ? {} : { expiresAt: normalized.expiresAt }),
	});
	return storage.setItem(key, serialized);
}

export function normalizeExpiresAt(value: unknown): number | null | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (value === null) {
		return null;
	}

	if (typeof value === 'number') {
		return Number.isFinite(value) ? value : null;
	}

	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (!trimmed) {
			return null;
		}

		const numericValue = Number(trimmed);
		if (!Number.isNaN(numericValue)) {
			return numericValue;
		}

		const dateValue = Date.parse(trimmed);
		if (!Number.isNaN(dateValue)) {
			return dateValue;
		}
	}

	return null;
}
