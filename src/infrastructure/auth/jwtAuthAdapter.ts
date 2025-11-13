import {
	type AuthTokenStorage,
	createAuthTokenStorage,
	normalizeExpiresAt,
} from '@core/auth/authTokenStorage';
import type {
	AuthPort,
	AuthTokenChangeListener,
	AuthTokens,
	DecodedAuthToken,
	IsTokenExpiredOptions,
} from '@core/ports/AuthPort';
import type { StoragePort } from '@core/ports/StoragePort';
import type { TokenPayload } from '@src-types/api/auth';

import { decodeJwt, extractNumericClaim } from './jwtUtils';

export interface JwtAuthAdapterOptions {
	/**
	 * Storage adapter used for persisting tokens (optional in-memory fallback if omitted)
	 */
	readonly storage?: StoragePort;
	/**
	 * Custom storage key, defaults to "app.auth.tokens"
	 */
	readonly storageKey?: string;
	/**
	 * Clock skew tolerance applied when checking expiration (seconds)
	 * Defaults to 30 seconds
	 */
	readonly clockSkewSeconds?: number;
}

const DEFAULT_CLOCK_SKEW_SECONDS = 30;
const MIN_CLOCK_SKEW_SECONDS = 0;
const MILLISECONDS_PER_SECOND = 1000;

export class JwtAuthAdapter implements AuthPort {
	private readonly listeners = new Set<AuthTokenChangeListener>();
	private readonly clockSkewMs: number;
	private readonly storage: AuthTokenStorage | null;
	private tokens: AuthTokens | null;

	constructor(options: JwtAuthAdapterOptions = {}) {
		const clockSkewSeconds = Math.max(
			MIN_CLOCK_SKEW_SECONDS,
			options.clockSkewSeconds ?? DEFAULT_CLOCK_SKEW_SECONDS
		);
		this.clockSkewMs = clockSkewSeconds * MILLISECONDS_PER_SECOND;
		const storageOptions = options.storageKey ? { key: options.storageKey } : undefined;
		this.storage = options.storage ? createAuthTokenStorage(options.storage, storageOptions) : null;
		this.tokens = this.storage?.loadTokens() ?? null;
	}

	getTokens(): AuthTokens | null {
		return this.tokens;
	}

	getAccessToken(): string | null {
		return this.tokens?.accessToken ?? null;
	}

	getRefreshToken(): string | null {
		return this.tokens?.refreshToken ?? null;
	}

	setTokens(tokens: AuthTokens): void {
		if (!tokens.accessToken) {
			throw new Error('Auth tokens must include a valid access token');
		}

		const refreshToken = tokens.refreshToken ?? null;
		const expiresAt = normalizeExpiresAt(tokens.expiresAt);
		const normalized: AuthTokens =
			expiresAt === undefined
				? {
						accessToken: tokens.accessToken,
						refreshToken,
					}
				: {
						accessToken: tokens.accessToken,
						refreshToken,
						expiresAt,
					};

		this.tokens = normalized;
		this.persistTokens(normalized);
		this.notifyListeners();
	}

	clearTokens(): void {
		this.tokens = null;
		this.storage?.clearTokens();
		this.notifyListeners();
	}

	subscribe(listener: AuthTokenChangeListener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	decode<TPayload = TokenPayload>(token: string): DecodedAuthToken<TPayload> | null {
		try {
			const decoded = decodeJwt<TPayload>(token);
			if (!decoded) {
				return null;
			}

			return this.buildDecodedToken(decoded);
		} catch {
			return null;
		}
	}

	private buildDecodedToken<TPayload = TokenPayload>(decoded: {
		header: Record<string, unknown>;
		payload: TPayload;
		signature?: string | null;
	}): DecodedAuthToken<TPayload> {
		const { header, payload, signature } = decoded;
		const payloadRecord = (payload ?? {}) as Record<string, unknown>;
		const issuedAt = extractNumericClaim(payloadRecord, 'iat');
		const expiresAt = extractNumericClaim(payloadRecord, 'exp');
		const notBefore = extractNumericClaim(payloadRecord, 'nbf');

		const base: DecodedAuthToken<TPayload> = {
			header,
			payload,
			signature: signature ?? null,
		};

		if (issuedAt === undefined && expiresAt === undefined && notBefore === undefined) {
			return base;
		}

		return {
			...base,
			...(issuedAt === undefined ? {} : { issuedAt }),
			...(expiresAt === undefined ? {} : { expiresAt }),
			...(notBefore === undefined ? {} : { notBefore }),
		};
	}

	isTokenExpired(
		token: string | null = this.getAccessToken(),
		options?: IsTokenExpiredOptions
	): boolean {
		if (!token) {
			return true;
		}

		const skewMs = this.resolveClockSkewMs(options);
		const decoded = this.decode(token);
		const expiryMs = this.resolveExpiryMs(decoded);

		if (expiryMs === null) {
			return false;
		}

		return Date.now() >= expiryMs - skewMs;
	}

	private resolveClockSkewMs(options?: IsTokenExpiredOptions): number {
		if (options?.clockSkewSeconds !== undefined) {
			return Math.max(MIN_CLOCK_SKEW_SECONDS, options.clockSkewSeconds) * MILLISECONDS_PER_SECOND;
		}

		return this.clockSkewMs;
	}

	private resolveExpiryMs(decoded: DecodedAuthToken<TokenPayload> | null): number | null {
		const decodedExpiry = decoded?.expiresAt;
		if (decodedExpiry !== undefined && decodedExpiry !== null) {
			return decodedExpiry * MILLISECONDS_PER_SECOND;
		}

		const storedExpiry = this.tokens?.expiresAt;
		return storedExpiry ?? null;
	}

	private persistTokens(tokens: AuthTokens): void {
		if (!this.storage) {
			return;
		}

		const success = this.storage.saveTokens(tokens);
		if (!success) {
			console.warn('Failed to persist auth tokens to storage');
		}
	}

	private notifyListeners(): void {
		for (const listener of this.listeners) {
			try {
				listener(this.tokens);
			} catch (error) {
				console.error('Auth token listener threw an error', error);
			}
		}
	}
}
