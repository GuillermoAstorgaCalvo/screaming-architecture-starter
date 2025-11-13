import type { AuthPort, AuthTokens } from '@core/ports/AuthPort';
import { createContext } from 'react';

export interface AuthContextValue {
	/**
	 * Auth port implementation injected from infrastructure
	 */
	readonly auth: AuthPort;
	/**
	 * Currently stored auth tokens (if any)
	 */
	readonly tokens: AuthTokens | null;
	/**
	 * Convenience access token reference
	 */
	readonly accessToken: string | null;
	/**
	 * Convenience refresh token reference
	 */
	readonly refreshToken: string | null;
	/**
	 * Indicates whether the user is currently authenticated
	 */
	readonly isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

AuthContext.displayName = 'AuthContext';
