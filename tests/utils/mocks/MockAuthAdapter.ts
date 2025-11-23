import type {
	AuthPort,
	AuthTokenChangeListener,
	AuthTokens,
	DecodedAuthToken,
	IsTokenExpiredOptions,
} from '@core/ports/AuthPort';

export class MockAuthAdapter implements AuthPort {
	private tokens: AuthTokens | null = null;
	private readonly listeners = new Set<AuthTokenChangeListener>();
	private mockPayload: Record<string, unknown> | null = {};
	private lastTokensKey: string | null = null;

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
		// Create a key from token values to detect if values actually changed
		const tokensKey = `${tokens.accessToken ?? ''}|${tokens.refreshToken ?? ''}`;

		// Only update and notify if values actually changed
		if (this.lastTokensKey !== tokensKey) {
			this.tokens = { ...tokens };
			this.lastTokensKey = tokensKey;
			this.notify();
		}
	}

	clearTokens(): void {
		if (this.tokens !== null) {
			this.tokens = null;
			this.lastTokensKey = null;
			this.notify();
		}
	}

	subscribe(listener: AuthTokenChangeListener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	decode<TPayload = Record<string, unknown>>(_token: string): DecodedAuthToken<TPayload> | null {
		const payload = (this.mockPayload ?? {}) as TPayload;

		return {
			header: {} as Record<string, unknown>,
			payload,
			signature: null,
			issuedAt: null,
			expiresAt: null,
			notBefore: null,
		};
	}

	setMockPayload(payload: Record<string, unknown> | null): void {
		this.mockPayload = payload ? { ...payload } : null;
		// Note: We don't notify here because tokens haven't changed
		// The metadata will be recalculated on the next render when decode() is called
		// If you need to force a metadata update, call setTokens() with the same tokens
	}

	isTokenExpired(
		token: string | null = this.getAccessToken(),

		_options?: IsTokenExpiredOptions
	): boolean {
		return !token;
	}

	private notify(): void {
		for (const listener of this.listeners) {
			listener(this.tokens);
		}
	}
}
