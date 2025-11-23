import {
	type AuthCredentials,
	authCredentialsSchema,
	AuthErrorCode,
	type AuthErrorCodeType,
	type AuthResponse,
	authResponseSchema,
	type AuthSession,
	authSessionSchema,
	type ChangePasswordRequest,
	changePasswordRequestSchema,
	type PasswordResetConfirm,
	passwordResetConfirmSchema,
	type PasswordResetRequest,
	passwordResetRequestSchema,
	type RefreshTokenRequest,
	refreshTokenRequestSchema,
	type TokenPayload,
	tokenPayloadSchema,
	type UserInfo,
	userInfoSchema,
} from '@src-types/api/auth';
import { describe, expect, it } from 'vitest';

describe('auth types', () => {
	const TEST_USER_ID = '123';
	const TEST_USER_ID_NUM = 123;
	const TEST_USERNAME = 'testuser';
	const TEST_EMAIL = 'test@example.com';
	const TEST_PASSWORD = 'password123';
	const TEST_NEW_PASSWORD = 'newpassword123';
	const TEST_OLD_PASSWORD = 'oldpassword123';
	const TEST_JWT_TOKEN = 'jwt-token';
	const TEST_REFRESH_TOKEN = 'refresh-token';
	const TEST_RESET_TOKEN = 'reset-token';
	const TEST_EXPIRES_AT = '2023-12-31T23:59:59Z';
	const TEST_EXPIRES_AT_NUM = 1704067199000;
	const TEST_IAT = 1704067199;
	const TEST_EXP = 1704153599;
	const TEST_SUB = 'user123';

	const createMinimalUserInfo = (): UserInfo => ({
		id: TEST_USER_ID,
		username: TEST_USERNAME,
		email: TEST_EMAIL,
	});

	describe('UserInfo and userInfoSchema', () => {
		it('should allow UserInfo with all properties', () => {
			const user: UserInfo = {
				id: TEST_USER_ID,
				username: TEST_USERNAME,
				email: TEST_EMAIL,
				name: 'Test User',
				avatar: 'https://example.com/avatar.jpg',
				roles: ['user', 'admin'],
				permissions: ['read', 'write'],
			};
			expect(user.id).toBe(TEST_USER_ID);
			expect(user.username).toBe(TEST_USERNAME);
			expect(user.email).toBe(TEST_EMAIL);
			expect(user.name).toBe('Test User');
			expect(user.avatar).toBe('https://example.com/avatar.jpg');
			expect(user.roles).toEqual(['user', 'admin']);
			expect(user.permissions).toEqual(['read', 'write']);
		});

		it('should allow UserInfo with numeric id and validate schema', () => {
			const user: UserInfo = {
				id: TEST_USER_ID_NUM,
				username: TEST_USERNAME,
				email: TEST_EMAIL,
			};
			expect(user.id).toBe(TEST_USER_ID_NUM);
			expect(userInfoSchema.safeParse(user).success).toBe(true);
		});

		it('should allow UserInfo without optional properties', () => {
			const user = createMinimalUserInfo();
			expect(user.id).toBe(TEST_USER_ID);
			expect(userInfoSchema.safeParse(user).success).toBe(true);
		});

		it('should reject invalid email', () => {
			const result = userInfoSchema.safeParse({
				id: TEST_USER_ID,
				username: TEST_USERNAME,
				email: 'invalid-email',
			});
			expect(result.success).toBe(false);
		});
	});

	describe('AuthCredentials and authCredentialsSchema', () => {
		it('should allow AuthCredentials with all properties', () => {
			const credentials: AuthCredentials = {
				username: TEST_USERNAME,
				password: TEST_PASSWORD,
				rememberMe: true,
			};
			expect(credentials.username).toBe(TEST_USERNAME);
			expect(credentials.password).toBe(TEST_PASSWORD);
			expect(credentials.rememberMe).toBe(true);
		});

		it('should allow AuthCredentials without rememberMe and validate', () => {
			const credentials: AuthCredentials = {
				username: TEST_USERNAME,
				password: TEST_PASSWORD,
			};
			expect(credentials.username).toBe(TEST_USERNAME);
			expect(authCredentialsSchema.safeParse(credentials).success).toBe(true);
		});

		it('should reject empty username or password', () => {
			expect(
				authCredentialsSchema.safeParse({ username: '', password: TEST_PASSWORD }).success
			).toBe(false);
			expect(
				authCredentialsSchema.safeParse({ username: TEST_USERNAME, password: '' }).success
			).toBe(false);
		});
	});

	describe('AuthResponse and authResponseSchema', () => {
		it('should allow AuthResponse with all properties', () => {
			const response: AuthResponse = {
				token: TEST_JWT_TOKEN,
				refreshToken: TEST_REFRESH_TOKEN,
				expiresAt: TEST_EXPIRES_AT,
				user: createMinimalUserInfo(),
			};
			expect(response.token).toBe(TEST_JWT_TOKEN);
			expect(response.refreshToken).toBe(TEST_REFRESH_TOKEN);
			expect(response.expiresAt).toBe(TEST_EXPIRES_AT);
			expect(response.user.id).toBe(TEST_USER_ID);
		});

		it('should validate valid auth response and reject empty token', () => {
			expect(
				authResponseSchema.safeParse({ token: TEST_JWT_TOKEN, user: createMinimalUserInfo() })
					.success
			).toBe(true);
			expect(
				authResponseSchema.safeParse({ token: '', user: createMinimalUserInfo() }).success
			).toBe(false);
		});
	});

	describe('RefreshTokenRequest and refreshTokenRequestSchema', () => {
		it('should allow RefreshTokenRequest and validate schema', () => {
			const request: RefreshTokenRequest = { refreshToken: TEST_REFRESH_TOKEN };
			expect(request.refreshToken).toBe(TEST_REFRESH_TOKEN);
			expect(refreshTokenRequestSchema.safeParse(request).success).toBe(true);
		});

		it('should reject empty refresh token', () => {
			expect(refreshTokenRequestSchema.safeParse({ refreshToken: '' }).success).toBe(false);
		});
	});

	describe('PasswordResetRequest and passwordResetRequestSchema', () => {
		it('should allow PasswordResetRequest and validate schema', () => {
			const request: PasswordResetRequest = { email: TEST_EMAIL };
			expect(request.email).toBe(TEST_EMAIL);
			expect(passwordResetRequestSchema.safeParse(request).success).toBe(true);
		});

		it('should reject invalid email', () => {
			expect(passwordResetRequestSchema.safeParse({ email: 'invalid-email' }).success).toBe(false);
		});
	});

	describe('PasswordResetConfirm and passwordResetConfirmSchema', () => {
		it('should allow PasswordResetConfirm and validate schema', () => {
			const confirm: PasswordResetConfirm = {
				token: TEST_RESET_TOKEN,
				newPassword: TEST_NEW_PASSWORD,
				confirmPassword: TEST_NEW_PASSWORD,
			};
			expect(confirm.token).toBe(TEST_RESET_TOKEN);
			expect(confirm.newPassword).toBe(TEST_NEW_PASSWORD);
			expect(passwordResetConfirmSchema.safeParse(confirm).success).toBe(true);
		});

		it('should reject empty token', () => {
			expect(
				passwordResetConfirmSchema.safeParse({
					token: '',
					newPassword: TEST_NEW_PASSWORD,
					confirmPassword: TEST_NEW_PASSWORD,
				}).success
			).toBe(false);
		});
	});

	describe('ChangePasswordRequest and changePasswordRequestSchema', () => {
		it('should allow ChangePasswordRequest and validate schema', () => {
			const request: ChangePasswordRequest = {
				currentPassword: TEST_OLD_PASSWORD,
				newPassword: TEST_NEW_PASSWORD,
				confirmPassword: TEST_NEW_PASSWORD,
			};
			expect(request.currentPassword).toBe(TEST_OLD_PASSWORD);
			expect(request.newPassword).toBe(TEST_NEW_PASSWORD);
			expect(changePasswordRequestSchema.safeParse(request).success).toBe(true);
		});

		it('should reject empty current password', () => {
			expect(
				changePasswordRequestSchema.safeParse({
					currentPassword: '',
					newPassword: TEST_NEW_PASSWORD,
					confirmPassword: TEST_NEW_PASSWORD,
				}).success
			).toBe(false);
		});
	});

	describe('AuthSession and authSessionSchema', () => {
		it('should allow AuthSession with all properties', () => {
			const session: AuthSession = {
				token: TEST_JWT_TOKEN,
				user: createMinimalUserInfo(),
				expiresAt: TEST_EXPIRES_AT,
				isValid: true,
			};
			expect(session.token).toBe(TEST_JWT_TOKEN);
			expect(session.user.id).toBe(TEST_USER_ID);
			expect(session.expiresAt).toBe(TEST_EXPIRES_AT);
			expect(session.isValid).toBe(true);
		});

		it('should allow AuthSession with numeric expiresAt and validate schema', () => {
			const session: AuthSession = {
				token: TEST_JWT_TOKEN,
				user: createMinimalUserInfo(),
				expiresAt: TEST_EXPIRES_AT_NUM,
				isValid: true,
			};
			expect(session.expiresAt).toBe(TEST_EXPIRES_AT_NUM);
			expect(authSessionSchema.safeParse(session).success).toBe(true);
		});
	});

	describe('TokenPayload and tokenPayloadSchema', () => {
		it('should allow TokenPayload with all properties', () => {
			const payload: TokenPayload = {
				sub: TEST_SUB,
				username: TEST_USERNAME,
				email: TEST_EMAIL,
				roles: ['user'],
				permissions: ['read'],
				iat: TEST_IAT,
				exp: TEST_EXP,
			};
			expect(payload.sub).toBe(TEST_SUB);
			expect(payload.username).toBe(TEST_USERNAME);
			expect(payload.email).toBe(TEST_EMAIL);
			expect(payload.roles).toEqual(['user']);
			expect(payload.permissions).toEqual(['read']);
			expect(payload.iat).toBe(TEST_IAT);
			expect(payload.exp).toBe(TEST_EXP);
		});

		it('should validate valid token payload and reject empty sub', () => {
			expect(tokenPayloadSchema.safeParse({ sub: TEST_SUB, email: TEST_EMAIL }).success).toBe(true);
			expect(tokenPayloadSchema.safeParse({ sub: '', email: TEST_EMAIL }).success).toBe(false);
		});
	});

	describe('AuthErrorCode', () => {
		it('should have all error codes', () => {
			expect(AuthErrorCode.InvalidCredentials).toBe('INVALID_CREDENTIALS');
			expect(AuthErrorCode.TokenExpired).toBe('TOKEN_EXPIRED');
			expect(AuthErrorCode.TokenInvalid).toBe('TOKEN_INVALID');
			expect(AuthErrorCode.RefreshTokenExpired).toBe('REFRESH_TOKEN_EXPIRED');
			expect(AuthErrorCode.RefreshTokenInvalid).toBe('REFRESH_TOKEN_INVALID');
			expect(AuthErrorCode.AccountLocked).toBe('ACCOUNT_LOCKED');
			expect(AuthErrorCode.AccountDisabled).toBe('ACCOUNT_DISABLED');
			expect(AuthErrorCode.EmailNotVerified).toBe('EMAIL_NOT_VERIFIED');
			expect(AuthErrorCode.RateLimitExceeded).toBe('RATE_LIMIT_EXCEEDED');
		});

		it('should accept AuthErrorCodeType', () => {
			const code: AuthErrorCodeType = AuthErrorCode.InvalidCredentials;
			expect(code).toBe('INVALID_CREDENTIALS');
		});
	});
});
