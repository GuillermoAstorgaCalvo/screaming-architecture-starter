import { AuthContext, type AuthContextValue } from '@core/providers/auth/AuthContext';
import { useContext } from 'react';

/**
 * Hook to access authentication context
 *
 * @returns AuthContextValue containing auth port and token state
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}
