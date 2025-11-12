import { z } from 'zod';

/**
 * Authentication-related API schemas and types
 *
 * Schemas provide runtime validation for authentication, authorization, and user session
 * management structures. Types are derived with `z.infer` to keep compile-time types and
 * runtime validation in sync.
 */

/**
 * User information
 */
export const userInfoSchema = z.object({
	/** User ID */
	id: z.union([z.string(), z.number()]),
	/** Username */
	username: z.string(),
	/** Email address */
	email: z.email(),
	/** Display name */
	name: z.string().optional(),
	/** Avatar URL */
	avatar: z.url().optional(),
	/** User roles */
	roles: z.array(z.string()).optional(),
	/** User permissions */
	permissions: z.array(z.string()).optional(),
});
export type UserInfo = z.infer<typeof userInfoSchema>;

/**
 * User authentication credentials
 */
export const authCredentialsSchema = z.object({
	/** Username or email */
	username: z.string().min(1),
	/** Password */
	password: z.string().min(1),
	/** Whether to remember the session */
	rememberMe: z.boolean().optional(),
});
export type AuthCredentials = z.infer<typeof authCredentialsSchema>;

/**
 * Authentication response
 */
export const authResponseSchema = z.object({
	/** Authentication token (JWT, session token, etc.) */
	token: z.string().min(1),
	/** Refresh token (if applicable) */
	refreshToken: z.string().min(1).optional(),
	/** Token expiration time (ISO 8601 string or timestamp) */
	expiresAt: z.union([z.string(), z.number()]).optional(),
	/** User information */
	user: userInfoSchema,
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

/**
 * Refresh token request
 */
export const refreshTokenRequestSchema = z.object({
	/** Refresh token */
	refreshToken: z.string().min(1),
});
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;

/**
 * Password reset request
 */
export const passwordResetRequestSchema = z.object({
	/** Email address */
	email: z.email(),
});
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password reset confirmation
 */
export const passwordResetConfirmSchema = z.object({
	/** Reset token */
	token: z.string().min(1),
	/** New password */
	newPassword: z.string().min(1),
	/** Confirm new password */
	confirmPassword: z.string().min(1),
});
export type PasswordResetConfirm = z.infer<typeof passwordResetConfirmSchema>;

/**
 * Change password request
 */
export const changePasswordRequestSchema = z.object({
	/** Current password */
	currentPassword: z.string().min(1),
	/** New password */
	newPassword: z.string().min(1),
	/** Confirm new password */
	confirmPassword: z.string().min(1),
});
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;

/**
 * Authentication session
 */
export const authSessionSchema = z.object({
	/** Session token */
	token: z.string().min(1),
	/** User information */
	user: userInfoSchema,
	/** Session expiration time */
	expiresAt: z.union([z.string(), z.number()]),
	/** Whether session is valid */
	isValid: z.boolean(),
});
export type AuthSession = z.infer<typeof authSessionSchema>;

/**
 * Token payload (decoded JWT structure)
 */
export const tokenPayloadSchema = z.object({
	/** User ID */
	sub: z.string().min(1),
	/** Username */
	username: z.string().optional(),
	/** Email */
	email: z.email().optional(),
	/** Roles */
	roles: z.array(z.string()).optional(),
	/** Issued at timestamp */
	iat: z.number().optional(),
	/** Expiration timestamp */
	exp: z.number().optional(),
});
export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

/**
 * Authentication error codes
 */
export const AuthErrorCode = {
	InvalidCredentials: 'INVALID_CREDENTIALS',
	TokenExpired: 'TOKEN_EXPIRED',
	TokenInvalid: 'TOKEN_INVALID',
	RefreshTokenExpired: 'REFRESH_TOKEN_EXPIRED',
	RefreshTokenInvalid: 'REFRESH_TOKEN_INVALID',
	AccountLocked: 'ACCOUNT_LOCKED',
	AccountDisabled: 'ACCOUNT_DISABLED',
	EmailNotVerified: 'EMAIL_NOT_VERIFIED',
	RateLimitExceeded: 'RATE_LIMIT_EXCEEDED',
} as const;

export type AuthErrorCodeType = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];
