import type { AuthTokens } from '@core/ports/AuthPort';
import { JwtAuthAdapter } from '@infra/auth/jwtAuthAdapter';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Helper to create tokens with expiration
 */
function createTokens(overrides: Partial<AuthTokens> = {}): AuthTokens {
	const encodeBase64Url = (obj: Record<string, unknown>): string => {
		const json = JSON.stringify(obj);
		const base64 = btoa(json);
		return base64.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
	};

	const createJwtToken = (
		header: Record<string, unknown>,
		payload: Record<string, unknown>,
		signature = 'signature'
	): string => {
		return `${encodeBase64Url(header)}.${encodeBase64Url(payload)}.${signature}`;
	};

	return {
		accessToken: createJwtToken({ alg: 'HS256', typ: 'JWT' }, { sub: 'user123' }),
		refreshToken: 'refresh-token-456',
		expiresAt: Date.now() + 3600000, // 1 hour from now
		...overrides,
	};
}

describe('JwtAuthAdapter - token change listeners - basic listener functionality', () => {
	let adapter: JwtAuthAdapter;

	beforeEach(() => {
		adapter = new JwtAuthAdapter();
	});

	it('notifies listeners when tokens are set', () => {
		const listener = vi.fn();
		adapter.subscribe(listener);
		const tokens = createTokens();

		adapter.setTokens(tokens);

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith(tokens);
	});

	it('notifies listeners when tokens are cleared', () => {
		const listener = vi.fn();
		adapter.subscribe(listener);
		adapter.setTokens(createTokens());

		adapter.clearTokens();

		expect(listener).toHaveBeenCalledTimes(2); // Once for set, once for clear
		expect(listener).toHaveBeenLastCalledWith(null);
	});

	it('notifies multiple listeners', () => {
		const listener1 = vi.fn();
		const listener2 = vi.fn();
		adapter.subscribe(listener1);
		adapter.subscribe(listener2);
		const tokens = createTokens();

		adapter.setTokens(tokens);

		expect(listener1).toHaveBeenCalledWith(tokens);
		expect(listener2).toHaveBeenCalledWith(tokens);
	});

	it('unsubscribes listener', () => {
		const listener = vi.fn();
		const unsubscribe = adapter.subscribe(listener);
		adapter.setTokens(createTokens());

		unsubscribe();
		adapter.setTokens(createTokens());

		expect(listener).toHaveBeenCalledTimes(1); // Only first setTokens call
	});
});

describe('JwtAuthAdapter - token change listeners - advanced listener scenarios', () => {
	let adapter: JwtAuthAdapter;

	beforeEach(() => {
		adapter = new JwtAuthAdapter();
	});

	it('handles listener errors gracefully', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const errorListener = vi.fn(() => {
			throw new Error('Listener error');
		});
		const normalListener = vi.fn();
		adapter.subscribe(errorListener);
		adapter.subscribe(normalListener);
		const tokens = createTokens();

		adapter.setTokens(tokens);

		expect(consoleSpy).toHaveBeenCalledWith(
			'Auth token listener threw an error',
			expect.any(Error)
		);
		expect(normalListener).toHaveBeenCalledWith(tokens); // Other listeners still called

		consoleSpy.mockRestore();
	});

	it('allows multiple subscriptions and unsubscriptions', () => {
		const listener1 = vi.fn();
		const listener2 = vi.fn();
		const unsubscribe1 = adapter.subscribe(listener1);
		const unsubscribe2 = adapter.subscribe(listener2);
		const tokens = createTokens();

		adapter.setTokens(tokens);
		expect(listener1).toHaveBeenCalledTimes(1);
		expect(listener2).toHaveBeenCalledTimes(1);

		unsubscribe1();
		adapter.setTokens(createTokens());
		expect(listener1).toHaveBeenCalledTimes(1); // No longer called
		expect(listener2).toHaveBeenCalledTimes(2); // Still called

		unsubscribe2();
		adapter.setTokens(createTokens());
		expect(listener1).toHaveBeenCalledTimes(1); // Still not called
		expect(listener2).toHaveBeenCalledTimes(2); // No longer called
	});
});
