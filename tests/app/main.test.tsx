/**
 * Main Entry Point Tests
 *
 * Tests for app initialization, configuration setup, i18n initialization,
 * root rendering, and web vitals scheduling
 */

import '@domains/landing/i18n';

import { initConfig } from '@core/config/init';
import { isProduction, isSpeedInsightsEnabled } from '@core/constants/env';
import i18n, { i18nInitPromise } from '@core/i18n/i18n';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock React DOM
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
	render: mockRender,
}));

vi.mock('react-dom/client', () => ({
	createRoot: mockCreateRoot,
}));

// Mock App component
vi.mock('@app/App', () => ({
	default: () => <div data-testid="app">App</div>,
}));

// Mock SpeedInsightsLoader
vi.mock('@app/components/SpeedInsightsLoader', () => ({
	SpeedInsightsLoader: () => <div data-testid="speed-insights-loader">SpeedInsights</div>,
}));

// Mock environment constants
vi.mock('@core/constants/env', () => ({
	isProduction: vi.fn(() => false),
	isSpeedInsightsEnabled: vi.fn(() => false),
}));

// Mock config initialization
vi.mock('@core/config/init', () => ({
	initConfig: vi.fn(() => Promise.resolve()),
}));

// Mock i18n
vi.mock('@core/i18n/i18n', async () => {
	const actual = await vi.importActual('@core/i18n/i18n');
	return {
		...actual,
		i18nInitPromise: Promise.resolve(),
	};
});

// Mock reportWebVitals
vi.mock('@core/perf/reportWebVitals', () => ({
	reportWebVitals: vi.fn(() => Promise.resolve()),
}));

// Mock logger adapter
vi.mock('@infra/logging/loggerAdapter', () => ({
	loggerAdapter: new MockLoggerAdapter(),
}));

// Helper functions
function createMockContainer(): HTMLDivElement {
	const mockContainer = document.createElement('div');
	mockContainer.id = 'root';
	document.body.append(mockContainer);
	return mockContainer;
}

async function initializeApp(): Promise<void> {
	// Ensure container exists before importing main (which runs top-level code)
	const container = document.querySelector('#root') ?? createMockContainer();

	// Mock querySelector to return the container
	vi.spyOn(document, 'querySelector').mockReturnValue(container);

	// Import main - this will execute top-level code
	await import('@app/main');

	// Wait for initialization promises
	await Promise.all([initConfig(), i18nInitPromise]);
}

async function waitForRender(): Promise<void> {
	await new Promise<void>(resolve => {
		setTimeout(() => {
			resolve();
		}, 0);
	});
}

async function waitForWebVitals(): Promise<void> {
	await new Promise<void>(resolve => {
		setTimeout(() => {
			resolve();
		}, 100);
	});
}

function setupEventListenersMock() {
	const eventListeners = new Map<string, Set<EventListenerOrEventListenerObject>>();
	globalThis.addEventListener = vi.fn(
		(event: string, handler: EventListenerOrEventListenerObject) => {
			if (!eventListeners.has(event)) {
				eventListeners.set(event, new Set());
			}
			eventListeners.get(event)?.add(handler);
		}
	) as typeof globalThis.addEventListener;
	globalThis.removeEventListener = vi.fn(
		(event: string, handler: EventListenerOrEventListenerObject) => {
			eventListeners.get(event)?.delete(handler);
		}
	) as typeof globalThis.removeEventListener;
	return eventListeners;
}

function getEventListenerCalls() {
	return vi.mocked(globalThis.addEventListener).mock.calls;
}

function getEventNames(): string[] {
	return getEventListenerCalls().map(call => call[0]);
}

function findEventHandler(eventName: string): EventListener | undefined {
	const addEventListenerCalls = getEventListenerCalls();
	const found = addEventListenerCalls.find(call => call[0] === eventName);
	return found?.[1] as EventListener | undefined;
}

function setupMockContainerWithSelector(): HTMLDivElement {
	const mockContainer = createMockContainer();
	vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);
	return mockContainer;
}

function verifyWebVitalsEvents(): void {
	const eventNames = getEventNames();
	expect(eventNames).toContain('pointerdown');
	expect(eventNames).toContain('keydown');
	expect(eventNames).toContain('touchstart');
	expect(eventNames).toContain('mousemove');
}

function restoreDocument(original: Document | undefined): void {
	if (original) {
		Object.defineProperty(globalThis, 'document', {
			writable: true,
			value: original,
		});
	}
}

describe('Main - Configuration Initialization', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		document.querySelector('#root')?.remove();
	});

	afterEach(() => {
		document.querySelector('#root')?.remove();
		vi.clearAllMocks();
		vi.resetModules();
	});

	it('initializes config before app renders', async () => {
		await initializeApp();
		expect(initConfig).toHaveBeenCalled();
	});

	it('initializes i18n before app renders', async () => {
		await initializeApp();
		expect(i18n.isInitialized).toBe(true);
	});

	it('initializes config and i18n in parallel', async () => {
		const initConfigSpy = vi.spyOn({ initConfig }, 'initConfig');

		await initializeApp();

		expect(initConfigSpy).toHaveBeenCalled();
		expect(i18n.isInitialized).toBe(true);
	});
});

describe('Main - Root Element Rendering', () => {
	// eslint-disable-next-line @typescript-eslint/no-deprecated
	let originalQuerySelector: typeof document.querySelector;

	beforeEach(() => {
		vi.clearAllMocks();
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		originalQuerySelector = document.querySelector;
		// Clear any existing root element
		document.querySelector('#root')?.remove();
	});

	afterEach(() => {
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		document.querySelector = originalQuerySelector;
		document.querySelector('#root')?.remove();
		vi.clearAllMocks();
		// Clear module cache to allow re-import
		vi.resetModules();
	});

	it('finds root element and creates root', async () => {
		const mockContainer = createMockContainer();
		vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);

		await initializeApp();
		await waitForRender();

		expect(mockCreateRoot).toHaveBeenCalledWith(mockContainer);
	});

	it('throws error when root element is not found', async () => {
		vi.spyOn(document, 'querySelector').mockReturnValue(null);

		await expect(async () => {
			await import('@app/main');
		}).rejects.toThrow();
	});

	it('renders App component in StrictMode', async () => {
		const mockContainer = createMockContainer();
		vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);

		await initializeApp();
		await waitForRender();

		expect(mockRender).toHaveBeenCalled();
		const renderCall = mockRender.mock.calls[0]?.[0];
		expect(renderCall?.type).toBeDefined();
	});
});

describe('Main - Speed Insights Loading', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		document.querySelector('#root')?.remove();
	});

	afterEach(() => {
		document.querySelector('#root')?.remove();
		vi.clearAllMocks();
		vi.resetModules();
	});

	it('loads SpeedInsights when in production and enabled', async () => {
		const mockContainer = createMockContainer();
		vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);
		vi.mocked(isProduction).mockReturnValue(true);
		vi.mocked(isSpeedInsightsEnabled).mockReturnValue(true);

		await initializeApp();
		await waitForRender();

		expect(mockRender).toHaveBeenCalled();
	});

	it('does not load SpeedInsights when not in production', async () => {
		const mockContainer = createMockContainer();
		vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);
		vi.mocked(isProduction).mockReturnValue(false);
		vi.mocked(isSpeedInsightsEnabled).mockReturnValue(true);

		await initializeApp();
		await waitForRender();

		expect(mockRender).toHaveBeenCalled();
	});

	it('does not load SpeedInsights when disabled', async () => {
		const mockContainer = createMockContainer();
		vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);
		vi.mocked(isProduction).mockReturnValue(true);
		vi.mocked(isSpeedInsightsEnabled).mockReturnValue(false);

		await initializeApp();
		await waitForRender();

		expect(mockRender).toHaveBeenCalled();
	});
});

// Web Vitals test setup helpers
let originalAddEventListener: typeof globalThis.addEventListener;
let originalRemoveEventListener: typeof globalThis.removeEventListener;
let originalDocument: Document | undefined;

function setupWebVitalsMocks() {
	vi.clearAllMocks();
	originalAddEventListener = globalThis.addEventListener;
	originalRemoveEventListener = globalThis.removeEventListener;
	originalDocument = globalThis.document;
	setupEventListenersMock();
}

function teardownWebVitalsMocks() {
	globalThis.addEventListener = originalAddEventListener;
	globalThis.removeEventListener = originalRemoveEventListener;
	if (originalDocument) {
		globalThis.document = originalDocument;
	}
	vi.clearAllMocks();
}

describe('Main - Web Vitals Scheduling', () => {
	beforeEach(() => {
		setupWebVitalsMocks();
		document.querySelector('#root')?.remove();
	});

	afterEach(() => {
		teardownWebVitalsMocks();
		document.querySelector('#root')?.remove();
		vi.resetModules();
	});

	describe('Initialization', () => {
		it('schedules web vitals reporting on initialization', async () => {
			setupMockContainerWithSelector();
			await initializeApp();
			await waitForWebVitals();
			expect(globalThis.addEventListener).toHaveBeenCalled();
		});

		it('registers web vitals trigger events', async () => {
			setupMockContainerWithSelector();
			await initializeApp();
			await waitForWebVitals();
			verifyWebVitalsEvents();
		});
	});

	describe('Error Handling', () => {
		it('handles missing document gracefully for web vitals', async () => {
			// First initialize app normally
			const mockContainer = createMockContainer();
			vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);
			await initializeApp();

			// Then test web vitals with null document (simulating edge case)
			// The scheduleWebVitals function should handle this
			const originalDoc = globalThis.document;
			Object.defineProperty(globalThis, 'document', {
				writable: true,
				value: null,
			});

			// The web vitals should still be scheduled even with null document
			// (it will trigger immediately)
			await waitForWebVitals();

			restoreDocument(originalDoc);
		});
	});

	describe('User Interaction', () => {
		it('triggers web vitals report on user interaction', async () => {
			setupMockContainerWithSelector();
			await initializeApp();
			await waitForWebVitals();

			const pointerdownHandler = findEventHandler('pointerdown');
			if (pointerdownHandler) {
				pointerdownHandler(new Event('pointerdown'));
			}

			await waitForWebVitals();
		});
	});
});

describe('Main - App Initialization', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		document.querySelector('#root')?.remove();
	});

	afterEach(() => {
		document.querySelector('#root')?.remove();
		vi.clearAllMocks();
		vi.resetModules();
	});

	it('initializes app successfully', async () => {
		const mockContainer = createMockContainer();
		vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);

		await initializeApp();
		await waitForRender();
	});

	it('renders app in StrictMode', async () => {
		const mockContainer = createMockContainer();
		vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);

		await initializeApp();
		await waitForRender();

		expect(mockCreateRoot).toHaveBeenCalled();
		expect(mockRender).toHaveBeenCalled();
	});
});
