import {
	AppEnvironment,
	type AppEnvironmentType,
	AsyncStatus,
	type AsyncStatusType,
	ComponentState,
	type ComponentStateType,
	HttpStatusCategory,
	type HttpStatusCategoryType,
	StorageType,
	type StorageTypeType,
	ThemeMode,
	type ThemeModeType,
	ValidationStatus,
	type ValidationStatusType,
} from '@src-types/enums';
import { describe, expect, it } from 'vitest';

describe('enums types', () => {
	describe('AppEnvironment', () => {
		it('should have all environment values', () => {
			expect(AppEnvironment.Development).toBe('development');
			expect(AppEnvironment.Staging).toBe('staging');
			expect(AppEnvironment.Production).toBe('production');
			expect(AppEnvironment.Test).toBe('test');
		});

		it('should accept AppEnvironmentType', () => {
			const env: AppEnvironmentType = AppEnvironment.Development;
			expect(env).toBe('development');
		});

		it('should accept all environment types', () => {
			const envs: AppEnvironmentType[] = [
				AppEnvironment.Development,
				AppEnvironment.Staging,
				AppEnvironment.Production,
				AppEnvironment.Test,
			];
			expect(envs).toHaveLength(4);
		});
	});

	describe('ThemeMode', () => {
		it('should have all theme mode values', () => {
			expect(ThemeMode.Light).toBe('light');
			expect(ThemeMode.Dark).toBe('dark');
			expect(ThemeMode.System).toBe('system');
		});

		it('should accept ThemeModeType', () => {
			const mode: ThemeModeType = ThemeMode.Light;
			expect(mode).toBe('light');
		});

		it('should accept all theme mode types', () => {
			const modes: ThemeModeType[] = [ThemeMode.Light, ThemeMode.Dark, ThemeMode.System];
			expect(modes).toHaveLength(3);
		});
	});

	describe('HttpStatusCategory', () => {
		it('should have all status category values', () => {
			expect(HttpStatusCategory.Success).toBe('success');
			expect(HttpStatusCategory.ClientError).toBe('clientError');
			expect(HttpStatusCategory.ServerError).toBe('serverError');
			expect(HttpStatusCategory.Unknown).toBe('unknown');
		});

		it('should accept HttpStatusCategoryType', () => {
			const category: HttpStatusCategoryType = HttpStatusCategory.Success;
			expect(category).toBe('success');
		});

		it('should accept all status category types', () => {
			const categories: HttpStatusCategoryType[] = [
				HttpStatusCategory.Success,
				HttpStatusCategory.ClientError,
				HttpStatusCategory.ServerError,
				HttpStatusCategory.Unknown,
			];
			expect(categories).toHaveLength(4);
		});
	});

	describe('StorageType', () => {
		it('should have all storage type values', () => {
			expect(StorageType.LocalStorage).toBe('localStorage');
			expect(StorageType.SessionStorage).toBe('sessionStorage');
			expect(StorageType.Cookie).toBe('cookie');
			expect(StorageType.Memory).toBe('memory');
		});

		it('should accept StorageTypeType', () => {
			const type: StorageTypeType = StorageType.LocalStorage;
			expect(type).toBe('localStorage');
		});

		it('should accept all storage types', () => {
			const types: StorageTypeType[] = [
				StorageType.LocalStorage,
				StorageType.SessionStorage,
				StorageType.Cookie,
				StorageType.Memory,
			];
			expect(types).toHaveLength(4);
		});
	});

	describe('AsyncStatus', () => {
		it('should have all async status values', () => {
			expect(AsyncStatus.Idle).toBe('idle');
			expect(AsyncStatus.Loading).toBe('loading');
			expect(AsyncStatus.Success).toBe('success');
			expect(AsyncStatus.Error).toBe('error');
		});

		it('should accept AsyncStatusType', () => {
			const status: AsyncStatusType = AsyncStatus.Idle;
			expect(status).toBe('idle');
		});

		it('should accept all async status types', () => {
			const statuses: AsyncStatusType[] = [
				AsyncStatus.Idle,
				AsyncStatus.Loading,
				AsyncStatus.Success,
				AsyncStatus.Error,
			];
			expect(statuses).toHaveLength(4);
		});
	});

	describe('ValidationStatus', () => {
		it('should have all validation status values', () => {
			expect(ValidationStatus.Valid).toBe('valid');
			expect(ValidationStatus.Invalid).toBe('invalid');
			expect(ValidationStatus.Pending).toBe('pending');
		});

		it('should accept ValidationStatusType', () => {
			const status: ValidationStatusType = ValidationStatus.Valid;
			expect(status).toBe('valid');
		});

		it('should accept all validation status types', () => {
			const statuses: ValidationStatusType[] = [
				ValidationStatus.Valid,
				ValidationStatus.Invalid,
				ValidationStatus.Pending,
			];
			expect(statuses).toHaveLength(3);
		});
	});

	describe('ComponentState', () => {
		it('should have all component state values', () => {
			expect(ComponentState.Default).toBe('default');
			expect(ComponentState.Loading).toBe('loading');
			expect(ComponentState.Disabled).toBe('disabled');
			expect(ComponentState.Error).toBe('error');
			expect(ComponentState.Success).toBe('success');
		});

		it('should accept ComponentStateType', () => {
			const state: ComponentStateType = ComponentState.Default;
			expect(state).toBe('default');
		});

		it('should accept all component state types', () => {
			const states: ComponentStateType[] = [
				ComponentState.Default,
				ComponentState.Loading,
				ComponentState.Disabled,
				ComponentState.Error,
				ComponentState.Success,
			];
			expect(states).toHaveLength(5);
		});
	});
});
