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
		this.tokens = { ...tokens };
		this.notify();
	}

	clearTokens(): void {
		this.tokens = null;
		this.notify();
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
