/**
 * User-related factories
 * Build test data for user entities, forms, and authentication
 */

/**
 * Basic user structure
 */
export interface User {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Partial type for building User with overrides
 */
export interface UserOverrides extends Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> {
	id?: string;
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Build a User with sensible defaults
 *
 * @param overrides - Optional fields to override
 * @returns Complete User object
 *
 * @example
 * ```ts
 * // Default user
 * const user = buildUser();
 *
 * // Custom name
 * const user = buildUser({ name: 'Jane Doe', email: 'jane@example.com' });
 * ```
 */
export function buildUser(overrides: UserOverrides = {}): User {
	const now = new Date().toISOString();
	const id = overrides.id ?? `user-${Math.random().toString(36).slice(2, 9)}`;

	return {
		id,
		name: overrides.name ?? 'John Doe',
		email: overrides.email ?? 'john.doe@example.com',
		createdAt: overrides.createdAt ?? now,
		updatedAt: overrides.updatedAt ?? now,
	};
}

/**
 * Build multiple users
 *
 * @param count - Number of users to generate (must be >= 0)
 * @param overrides - Optional function to customize each user
 * @returns Array of User objects (empty array if count is 0 or negative)
 *
 * @example
 * ```ts
 * // Generate 5 default users
 * const users = buildUsers(5);
 *
 * // Generate users with custom names
 * const users = buildUsers(3, (index) => ({
 *   name: `User ${index + 1}`,
 *   email: `user${index + 1}@example.com`
 * }));
 * ```
 */
export function buildUsers(count: number, overrides?: (index: number) => UserOverrides): User[] {
	if (count <= 0) {
		return [];
	}

	return Array.from({ length: count }, (_, index) => {
		const userOverrides = overrides ? overrides(index) : {};
		return buildUser({
			...userOverrides,
			id: userOverrides.id ?? `user-${index + 1}`,
		});
	});
}

/**
 * User form data structure (from UserNameForm)
 */
export interface UserFormData {
	name: string;
}

/**
 * Build user form data
 *
 * @param overrides - Optional fields to override
 * @returns UserFormData object
 */
export function buildUserFormData(overrides: Partial<UserFormData> = {}): UserFormData {
	return {
		name: overrides.name ?? 'Test User',
	};
}
