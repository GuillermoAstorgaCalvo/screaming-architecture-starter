/**
 * GoogleTagManagerAdapter - User Tests (Identification, Properties, Reset)
 */

import type { AnalyticsIdentity, AnalyticsUserProperties } from '@core/ports/AnalyticsPort';
import { GoogleTagManagerAdapter } from '@infra/analytics/googleTagManagerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	clearDataLayer,
	getDataLayer,
	getWindowAsRecord,
	restoreGlobals,
	setupInitializedAdapter,
	TEST_CONTAINER_ID,
	TEST_USER_EMAIL,
	TEST_USER_NAME,
	TEST_USER_PLAN,
} from './googleTagManagerAdapter.test-utils';

describe('GoogleTagManagerAdapter - User Identification', () => {
	describe('With userId', () => {
		let adapter: GoogleTagManagerAdapter;
		let originalWindow: typeof globalThis.window;
		let originalDocument: Document;

		beforeEach(() => {
			({ adapter, originalWindow, originalDocument } = setupInitializedAdapter());
		});

		afterEach(() => {
			restoreGlobals(originalWindow, originalDocument);
			vi.clearAllMocks();
		});

		it('should identify user with userId only', () => {
			const identity: AnalyticsIdentity = {
				userId: 'user123',
			};

			adapter.identify(identity);

			const dataLayer = getDataLayer(getWindowAsRecord());
			expect(dataLayer.length).toBe(1);
			expect(dataLayer[0]).toMatchObject({
				event: 'identify',
				user_id: 'user123',
			});
			expect(dataLayer[0]).not.toHaveProperty('user_traits');
		});
	});
});

describe('GoogleTagManagerAdapter - User Identification with Traits Only', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		({ adapter, originalWindow, originalDocument } = setupInitializedAdapter());
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should identify user with traits only', () => {
		const identity: AnalyticsIdentity = {
			traits: {
				email: TEST_USER_EMAIL,
				name: TEST_USER_NAME,
			},
		};

		adapter.identify(identity);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(2); // identify event + set_user_properties event
		expect(dataLayer[0]).toMatchObject({
			event: 'identify',
			user_traits: {
				email: TEST_USER_EMAIL,
				name: TEST_USER_NAME,
			},
		});
		expect(dataLayer[1]).toMatchObject({
			event: 'set_user_properties',
			user_properties: {
				email: TEST_USER_EMAIL,
				name: TEST_USER_NAME,
			},
		});
	});
});

describe('GoogleTagManagerAdapter - User Identification with userId and Traits', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		({ adapter, originalWindow, originalDocument } = setupInitializedAdapter());
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should identify user with both userId and traits', () => {
		const identity: AnalyticsIdentity = {
			userId: 'user123',
			traits: {
				email: 'user@example.com',
				name: 'John Doe',
			},
		};

		adapter.identify(identity);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(2); // identify event + set_user_properties event
		expect(dataLayer[0]).toMatchObject({
			event: 'identify',
			user_id: 'user123',
			user_traits: {
				email: TEST_USER_EMAIL,
				name: TEST_USER_NAME,
			},
		});
		expect(dataLayer[1]).toMatchObject({
			event: 'set_user_properties',
			user_properties: {
				email: TEST_USER_EMAIL,
				name: TEST_USER_NAME,
			},
		});
	});
});

describe('GoogleTagManagerAdapter - User Identification Errors', () => {
	describe('Identification Error Handling', () => {
		let adapter: GoogleTagManagerAdapter;
		let originalWindow: typeof globalThis.window;
		let originalDocument: Document;

		beforeEach(() => {
			({ adapter, originalWindow, originalDocument } = setupInitializedAdapter());
		});

		afterEach(() => {
			restoreGlobals(originalWindow, originalDocument);
			vi.clearAllMocks();
		});

		it('should not identify when userId and traits are both missing', () => {
			const identity: AnalyticsIdentity = {};

			adapter.identify(identity);

			const dataLayer = getDataLayer(getWindowAsRecord());
			expect(dataLayer.length).toBe(0);
		});
	});

	describe('Identification Initialization Errors', () => {
		afterEach(() => {
			vi.clearAllMocks();
		});

		it('should not identify when not initialized', () => {
			const uninitializedAdapter = new GoogleTagManagerAdapter();
			const identity: AnalyticsIdentity = {
				userId: 'user123',
			};

			uninitializedAdapter.identify(identity);

			const dataLayer = getDataLayer(getWindowAsRecord());
			expect(dataLayer.length).toBe(0);
		});

		it('should not identify when containerId is missing', () => {
			const uninitializedAdapter = new GoogleTagManagerAdapter();
			uninitializedAdapter.initialize({});
			const identity: AnalyticsIdentity = {
				userId: 'user123',
			};

			uninitializedAdapter.identify(identity);

			const dataLayer = getDataLayer(getWindowAsRecord());
			expect(dataLayer.length).toBe(0);
		});
	});
});

describe('GoogleTagManagerAdapter - User Properties', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		adapter = new GoogleTagManagerAdapter();
		originalWindow = globalThis.window;
		originalDocument = globalThis.document;
		clearDataLayer(getWindowAsRecord());

		// Initialize adapter
		adapter.initialize({ containerId: TEST_CONTAINER_ID });
		// Clear initialization events
		clearDataLayer(getWindowAsRecord());
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should set user properties', () => {
		const properties: AnalyticsUserProperties = {
			email: TEST_USER_EMAIL,
			name: TEST_USER_NAME,
			plan: TEST_USER_PLAN,
		};

		adapter.setUserProperties(properties);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(1);
		expect(dataLayer[0]).toMatchObject({
			event: 'set_user_properties',
			user_properties: {
				email: TEST_USER_EMAIL,
				name: TEST_USER_NAME,
				plan: TEST_USER_PLAN,
			},
		});
	});

	it('should not set user properties when empty object', () => {
		const properties: AnalyticsUserProperties = {};

		adapter.setUserProperties(properties);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(0);
	});

	it('should not set user properties when not initialized', () => {
		const uninitializedAdapter = new GoogleTagManagerAdapter();
		const properties: AnalyticsUserProperties = {
			email: TEST_USER_EMAIL,
		};

		uninitializedAdapter.setUserProperties(properties);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(0);
	});

	it('should not set user properties when containerId is missing', () => {
		const uninitializedAdapter = new GoogleTagManagerAdapter();
		uninitializedAdapter.initialize({});
		const properties: AnalyticsUserProperties = {
			email: TEST_USER_EMAIL,
		};

		uninitializedAdapter.setUserProperties(properties);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(0);
	});
});

describe('GoogleTagManagerAdapter - Reset', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		adapter = new GoogleTagManagerAdapter();
		originalWindow = globalThis.window;
		originalDocument = globalThis.document;
		clearDataLayer(getWindowAsRecord());

		// Initialize adapter
		adapter.initialize({ containerId: TEST_CONTAINER_ID });
		// Clear initialization events
		clearDataLayer(getWindowAsRecord());
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should reset user', () => {
		adapter.reset();

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(1);
		expect(dataLayer[0]).toMatchObject({
			event: 'reset_user',
		});
	});

	it('should not reset when not initialized', () => {
		const uninitializedAdapter = new GoogleTagManagerAdapter();

		uninitializedAdapter.reset();

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(0);
	});

	it('should not reset when containerId is missing', () => {
		const uninitializedAdapter = new GoogleTagManagerAdapter();
		uninitializedAdapter.initialize({});

		uninitializedAdapter.reset();

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(0);
	});
});
