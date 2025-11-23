/**
 * NoopAnalyticsAdapter - Tests
 *
 * Tests for the no-op analytics adapter that provides a safe fallback
 * when analytics is disabled or unavailable.
 */

import type {
	AnalyticsEvent,
	AnalyticsIdentity,
	AnalyticsInitOptions,
	AnalyticsPageView,
	AnalyticsUserProperties,
} from '@core/ports/AnalyticsPort';
import { noopAnalyticsAdapter } from '@infra/analytics/noopAnalyticsAdapter';
import { describe, expect, it } from 'vitest';

// Test constants
const TEST_CONTAINER_ID = 'GTM-XXXXXX';
const TEST_WRITE_KEY = 'test-key';
const TEST_PAGE_PATH = '/test-page';
const TEST_USER_ID = 'user123';
const TEST_USER_NAME = 'John Doe';
const TEST_USER_EMAIL = 'john@example.com';

describe('NoopAnalyticsAdapter - Initialization', () => {
	describe('Successful Initialization', () => {
		it('should initialize without errors with valid config', () => {
			const config: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
				writeKey: TEST_WRITE_KEY,
				dataLayerName: 'dataLayer',
				debug: true,
			};

			expect(() => {
				noopAnalyticsAdapter.initialize?.(config);
			}).not.toThrow();
		});

		it('should initialize without errors with minimal config', () => {
			const config: AnalyticsInitOptions = {};

			expect(() => {
				noopAnalyticsAdapter.initialize?.(config);
			}).not.toThrow();
		});
	});

	describe('Initialization with Specific Options', () => {
		it('should initialize without errors with only containerId', () => {
			const config: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
			};

			expect(() => {
				noopAnalyticsAdapter.initialize?.(config);
			}).not.toThrow();
		});

		it('should initialize without errors with only writeKey', () => {
			const config: AnalyticsInitOptions = {
				writeKey: TEST_WRITE_KEY,
			};

			expect(() => {
				noopAnalyticsAdapter.initialize?.(config);
			}).not.toThrow();
		});
	});
});

describe('NoopAnalyticsAdapter - Initialization Return Values', () => {
	it('should return undefined when initialized', () => {
		const config: AnalyticsInitOptions = {
			containerId: TEST_CONTAINER_ID,
		};

		const result = noopAnalyticsAdapter.initialize?.(config);
		expect(result).toBeUndefined();
	});
});

describe('NoopAnalyticsAdapter - Initialization Error Handling', () => {
	it('should not throw when initialize is called multiple times', () => {
		const config: AnalyticsInitOptions = {
			containerId: TEST_CONTAINER_ID,
		};

		expect(() => {
			noopAnalyticsAdapter.initialize?.(config);
			noopAnalyticsAdapter.initialize?.(config);
			noopAnalyticsAdapter.initialize?.(config);
		}).not.toThrow();
	});

	it('should handle null config gracefully', () => {
		// TypeScript won't allow null, but test runtime behavior
		expect(() => {
			noopAnalyticsAdapter.initialize?.({} as AnalyticsInitOptions);
		}).not.toThrow();
	});
});

describe('NoopAnalyticsAdapter - Page View Tracking', () => {
	describe('Successful Tracking', () => {
		it('should track page view with all properties without errors', () => {
			const page: AnalyticsPageView = {
				path: TEST_PAGE_PATH,
				title: 'Test Page',
				location: 'https://example.com/test-page',
			};

			expect(() => {
				noopAnalyticsAdapter.trackPageView(page);
			}).not.toThrow();
		});

		it('should track page view with minimal properties without errors', () => {
			const page: AnalyticsPageView = {
				path: TEST_PAGE_PATH,
			};

			expect(() => {
				noopAnalyticsAdapter.trackPageView(page);
			}).not.toThrow();
		});
	});

	describe('Page View Error Handling', () => {
		it('should not throw with empty path', () => {
			const page: AnalyticsPageView = {
				path: '',
			};

			expect(() => {
				noopAnalyticsAdapter.trackPageView(page);
			}).not.toThrow();
		});

		it('should not throw with very long path', () => {
			const page: AnalyticsPageView = {
				path: '/'.repeat(1000),
			};

			expect(() => {
				noopAnalyticsAdapter.trackPageView(page);
			}).not.toThrow();
		});
	});
});

describe('NoopAnalyticsAdapter - Page View Multiple Calls', () => {
	it('should handle multiple consecutive page view calls', () => {
		const pages: AnalyticsPageView[] = [
			{ path: '/page1' },
			{ path: '/page2', title: 'Page 2' },
			{ path: '/page3', location: 'https://example.com/page3' },
		];

		const trackPages = () => {
			for (const page of pages) {
				noopAnalyticsAdapter.trackPageView(page);
			}
		};

		expect(trackPages).not.toThrow();
	});
});

describe('NoopAnalyticsAdapter - Event Tracking', () => {
	describe('Successful Tracking', () => {
		it('should track event with name and params without errors', () => {
			const event: AnalyticsEvent = {
				name: 'button_click',
				params: {
					button_id: 'submit',
					button_text: 'Submit',
				},
			};

			expect(() => {
				noopAnalyticsAdapter.trackEvent(event);
			}).not.toThrow();
		});

		it('should track event with name only without errors', () => {
			const event: AnalyticsEvent = {
				name: 'simple_event',
			};

			expect(() => {
				noopAnalyticsAdapter.trackEvent(event);
			}).not.toThrow();
		});
	});

	describe('Event Error Handling', () => {
		it('should not throw with empty event name', () => {
			const event: AnalyticsEvent = {
				name: '',
			};

			expect(() => {
				noopAnalyticsAdapter.trackEvent(event);
			}).not.toThrow();
		});

		it('should not throw with null params', () => {
			const event: AnalyticsEvent = {
				name: 'test_event',
				params: null as unknown as Record<string, unknown>,
			};

			expect(() => {
				noopAnalyticsAdapter.trackEvent(event);
			}).not.toThrow();
		});
	});
});

describe('NoopAnalyticsAdapter - Complex Event Tracking', () => {
	it('should track event with complex params without errors', () => {
		const event: AnalyticsEvent = {
			name: 'purchase',
			params: {
				transaction_id: '12345',
				value: 99.99,
				currency: 'USD',
				items: [
					{ id: 'item1', name: 'Product 1', price: 49.99 },
					{ id: 'item2', name: 'Product 2', price: 50 },
				],
			},
		};

		expect(() => {
			noopAnalyticsAdapter.trackEvent(event);
		}).not.toThrow();
	});
});

describe('NoopAnalyticsAdapter - Event Multiple Calls', () => {
	it('should handle multiple consecutive event calls', () => {
		const events: AnalyticsEvent[] = [
			{ name: 'event1' },
			{ name: 'event2', params: { key: 'value' } },
			{ name: 'event3', params: { nested: { data: 'value' } } },
		];

		const trackEvents = () => {
			for (const event of events) {
				noopAnalyticsAdapter.trackEvent(event);
			}
		};

		expect(trackEvents).not.toThrow();
	});
});

describe('NoopAnalyticsAdapter - User Identification', () => {
	describe('Successful Identification', () => {
		it('should identify user with userId without errors', () => {
			const identity: AnalyticsIdentity = {
				userId: TEST_USER_ID,
			};

			expect(() => {
				noopAnalyticsAdapter.identify(identity);
			}).not.toThrow();
		});

		it('should identify user with traits without errors', () => {
			const identity: AnalyticsIdentity = {
				traits: {
					name: TEST_USER_NAME,
					email: TEST_USER_EMAIL,
				},
			};

			expect(() => {
				noopAnalyticsAdapter.identify(identity);
			}).not.toThrow();
		});

		it('should identify user with both userId and traits without errors', () => {
			const identity: AnalyticsIdentity = {
				userId: TEST_USER_ID,
				traits: {
					name: TEST_USER_NAME,
					email: TEST_USER_EMAIL,
				},
			};

			expect(() => {
				noopAnalyticsAdapter.identify(identity);
			}).not.toThrow();
		});
	});

	describe('Identification Error Handling', () => {
		it('should not throw with empty identity object', () => {
			const identity: AnalyticsIdentity = {};

			expect(() => {
				noopAnalyticsAdapter.identify(identity);
			}).not.toThrow();
		});

		it('should not throw with empty userId', () => {
			const identity: AnalyticsIdentity = {
				userId: '',
			};

			expect(() => {
				noopAnalyticsAdapter.identify(identity);
			}).not.toThrow();
		});

		it('should not throw with empty traits', () => {
			const identity: AnalyticsIdentity = {
				traits: {},
			};

			expect(() => {
				noopAnalyticsAdapter.identify(identity);
			}).not.toThrow();
		});
	});
});

describe('NoopAnalyticsAdapter - Complex Identification', () => {
	it('should handle complex traits without errors', () => {
		const identity: AnalyticsIdentity = {
			userId: TEST_USER_ID,
			traits: {
				name: TEST_USER_NAME,
				age: 30,
				preferences: {
					theme: 'dark',
					notifications: true,
				},
				tags: ['premium', 'beta'],
			},
		};

		expect(() => {
			noopAnalyticsAdapter.identify(identity);
		}).not.toThrow();
	});
});

describe('NoopAnalyticsAdapter - User Properties', () => {
	describe('Successful Property Setting', () => {
		it('should set user properties without errors', () => {
			const properties: AnalyticsUserProperties = {
				name: TEST_USER_NAME,
				email: TEST_USER_EMAIL,
				plan: 'premium',
			};

			expect(() => {
				noopAnalyticsAdapter.setUserProperties(properties);
			}).not.toThrow();
		});

		it('should handle complex nested properties', () => {
			const properties: AnalyticsUserProperties = {
				preferences: {
					theme: 'dark',
					language: 'en',
					notifications: {
						email: true,
						push: false,
					},
				},
			};

			expect(() => {
				noopAnalyticsAdapter.setUserProperties(properties);
			}).not.toThrow();
		});
	});

	describe('User Properties Error Handling', () => {
		it('should not throw with empty properties object', () => {
			const properties: AnalyticsUserProperties = {};

			expect(() => {
				noopAnalyticsAdapter.setUserProperties(properties);
			}).not.toThrow();
		});

		it('should handle properties with various value types', () => {
			const properties: AnalyticsUserProperties = {
				string: 'value',
				number: 123,
				boolean: true,
				null: null,
				array: [1, 2, 3],
				object: { nested: 'value' },
			};

			expect(() => {
				noopAnalyticsAdapter.setUserProperties(properties);
			}).not.toThrow();
		});
	});
});

describe('NoopAnalyticsAdapter - User Properties Multiple Updates', () => {
	it('should handle multiple consecutive property updates', () => {
		const propertiesList: AnalyticsUserProperties[] = [
			{ name: 'John' },
			{ email: TEST_USER_EMAIL },
			{ plan: 'premium' },
		];

		const setProperties = () => {
			for (const properties of propertiesList) {
				noopAnalyticsAdapter.setUserProperties(properties);
			}
		};

		expect(setProperties).not.toThrow();
	});
});

describe('NoopAnalyticsAdapter - Reset', () => {
	describe('Successful Reset', () => {
		it('should reset without errors when called without options', () => {
			expect(() => {
				noopAnalyticsAdapter.reset?.();
			}).not.toThrow();
		});

		it('should reset without errors when called with options', () => {
			expect(() => {
				noopAnalyticsAdapter.reset?.({ clearCache: true });
			}).not.toThrow();
		});

		it('should return undefined when reset is called', () => {
			const result = noopAnalyticsAdapter.reset?.();
			expect(result).toBeUndefined();
		});
	});

	describe('Reset Error Handling', () => {
		it('should handle multiple consecutive reset calls', () => {
			expect(() => {
				noopAnalyticsAdapter.reset?.();
				noopAnalyticsAdapter.reset?.();
				noopAnalyticsAdapter.reset?.();
			}).not.toThrow();
		});

		it('should handle reset after other operations', () => {
			expect(() => {
				noopAnalyticsAdapter.initialize?.({ containerId: TEST_CONTAINER_ID });
				noopAnalyticsAdapter.trackPageView({ path: '/test' });
				noopAnalyticsAdapter.trackEvent({ name: 'test' });
				noopAnalyticsAdapter.reset?.();
			}).not.toThrow();
		});
	});
});

describe('NoopAnalyticsAdapter - Integration', () => {
	it('should handle complete analytics workflow without errors', () => {
		const runWorkflow = () => {
			// Initialize
			noopAnalyticsAdapter.initialize?.({
				containerId: TEST_CONTAINER_ID,
				debug: true,
			});

			// Track page view
			noopAnalyticsAdapter.trackPageView({
				path: '/home',
				title: 'Home Page',
				location: 'https://example.com/home',
			});

			// Identify user
			noopAnalyticsAdapter.identify({
				userId: TEST_USER_ID,
				traits: {
					name: TEST_USER_NAME,
					email: TEST_USER_EMAIL,
				},
			});

			// Set user properties
			noopAnalyticsAdapter.setUserProperties({
				plan: 'premium',
				signupDate: '2024-01-01',
			});

			// Track events
			noopAnalyticsAdapter.trackEvent({
				name: 'button_click',
				params: { button_id: 'submit' },
			});

			// Reset
			noopAnalyticsAdapter.reset?.();
		};

		expect(runWorkflow).not.toThrow();
	});

	it('should be safe to use without initialization', () => {
		const useWithoutInit = () => {
			// Use adapter without calling initialize first
			noopAnalyticsAdapter.trackPageView({ path: '/test' });
			noopAnalyticsAdapter.trackEvent({ name: 'test' });
			noopAnalyticsAdapter.identify({ userId: TEST_USER_ID });
			noopAnalyticsAdapter.setUserProperties({ key: 'value' });
			noopAnalyticsAdapter.reset?.();
		};

		expect(useWithoutInit).not.toThrow();
	});
});
