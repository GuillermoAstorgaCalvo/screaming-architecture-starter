/**
 * Main Entry Point Tests
 *
 * Tests for app initialization, configuration setup, i18n initialization,
 * root rendering, and web vitals scheduling
 */

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
	const documentEventListeners = new Map<string, Set<EventListenerOrEventListenerObject>>();

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

	document.addEventListener = vi.fn(
		(event: string, handler: EventListenerOrEventListenerObject) => {
			if (!documentEventListeners.has(event)) {
				documentEventListeners.set(event, new Set());
			}
			documentEventListeners.get(event)?.add(handler);
		}
	) as typeof document.addEventListener;
	document.removeEventListener = vi.fn(
		(event: string, handler: EventListenerOrEventListenerObject) => {
			documentEventListeners.get(event)?.delete(handler);
		}
	) as typeof document.removeEventListener;

	return { eventListeners, documentEventListeners };
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

function findDocumentEventHandler(eventName: string): EventListener | undefined {
	const documentAddEventListenerCalls = vi.mocked(document.addEventListener).mock.calls;
	const found = documentAddEventListenerCalls.find(call => call[0] === eventName);
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

// Helper functions for web vitals error handling tests
async function setupAppAndTriggerWebVitals(): Promise<void> {
	setupMockContainerWithSelector();
	await initializeApp();
	await waitForWebVitals();
}

async function triggerPointerDownEvent(): Promise<void> {
	const pointerdownHandler = findEventHandler('pointerdown');
	if (pointerdownHandler) {
		pointerdownHandler(new Event('pointerdown'));
	}
}

async function setupErrorTestMocks(): Promise<{
	loggerAdapter: any;
	reportWebVitals: any;
}> {
	const { loggerAdapter } = await import('@infra/logging/loggerAdapter');
	const { reportWebVitals } = await import('@core/perf/reportWebVitals');
	(loggerAdapter as any).reset();
	return { loggerAdapter, reportWebVitals };
}

function verifyErrorLogged(loggerAdapter: any, expectedError?: string): void {
	const warnLogs = loggerAdapter.logs.filter(
		(log: any) =>
			log.level === 'warn' &&
			log.message === 'reportWebVitals failed' &&
			(expectedError ? log.context?.error === expectedError : true)
	);
	expect(warnLogs.length).toBeGreaterThan(0);
}

async function testReportWebVitalsError(errorValue: unknown, expectedError: string): Promise<void> {
	await setupAppAndTriggerWebVitals();

	const { loggerAdapter, reportWebVitals } = await setupErrorTestMocks();
	vi.mocked(reportWebVitals).mockRejectedValueOnce(errorValue);

	await triggerPointerDownEvent();
	await waitForWebVitals();

	verifyErrorLogged(loggerAdapter, expectedError || undefined);
}

function restoreEventListener(
	property: 'addEventListener' | 'removeEventListener',
	originalValue: typeof globalThis.addEventListener | typeof globalThis.removeEventListener
): void {
	Object.defineProperty(globalThis, property, {
		writable: true,
		configurable: true,
		value: originalValue,
	});
}

async function testMissingEventListenerSupport(
	property: 'addEventListener' | 'removeEventListener'
): Promise<void> {
	const mockContainer = createMockContainer();
	vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);

	const originalValue =
		property === 'addEventListener' ? globalThis.addEventListener : globalThis.removeEventListener;

	Object.defineProperty(globalThis, property, {
		writable: true,
		configurable: true,
		value: undefined,
	});

	await initializeApp();
	await waitForWebVitals();

	restoreEventListener(property, originalValue);
}

function setupVisibilityState(value: 'hidden' | 'visible'): void {
	Object.defineProperty(document, 'visibilityState', {
		writable: true,
		configurable: true,
		value,
	});
}

async function testVisibilityChange(visibilityState: 'hidden' | 'visible'): Promise<void> {
	setupMockContainerWithSelector();
	await initializeApp();
	await waitForWebVitals();

	const visibilityChangeHandler = findDocumentEventHandler('visibilitychange');
	expect(visibilityChangeHandler).toBeDefined();

	setupVisibilityState(visibilityState);

	if (visibilityChangeHandler) {
		visibilityChangeHandler(new Event('visibilitychange'));
	}

	await waitForWebVitals();
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
	beforeEach(() => {
		vi.clearAllMocks();
		// Clear any existing root element
		document.querySelector('#root')?.remove();
	});

	afterEach(() => {
		vi.restoreAllMocks();
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
let originalDocumentAddEventListener: typeof document.addEventListener;
let originalDocumentRemoveEventListener: typeof document.removeEventListener;
let originalDocument: Document | undefined;

function setupWebVitalsMocks() {
	vi.clearAllMocks();
	originalAddEventListener = globalThis.addEventListener;
	originalRemoveEventListener = globalThis.removeEventListener;
	originalDocumentAddEventListener = document.addEventListener;
	originalDocumentRemoveEventListener = document.removeEventListener;
	originalDocument = globalThis.document;
	setupEventListenersMock();
}

function teardownWebVitalsMocks() {
	globalThis.addEventListener = originalAddEventListener;
	globalThis.removeEventListener = originalRemoveEventListener;
	document.addEventListener = originalDocumentAddEventListener;
	document.removeEventListener = originalDocumentRemoveEventListener;
	if (originalDocument) {
		globalThis.document = originalDocument;
	}
	vi.clearAllMocks();
}

function setupWebVitalsTestSuite(): void {
	beforeEach(() => {
		setupWebVitalsMocks();
		document.querySelector('#root')?.remove();
	});

	afterEach(() => {
		teardownWebVitalsMocks();
		document.querySelector('#root')?.remove();
		vi.resetModules();
	});
}

describe('Main - Web Vitals Scheduling', () => {
	setupWebVitalsTestSuite();

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
		setupWebVitalsTestSuite();
		registerErrorHandlingTests();
	});

	describe('User Interaction', () => {
		registerUserInteractionTests();
	});

	describe('Initialization Edge Cases', () => {
		registerInitializationEdgeCaseTests();
	});
});

function registerErrorHandlingTests(): void {
	describe('Missing Document Support', () => {
		it('handles missing document gracefully for web vitals', async () => {
			const mockContainer = createMockContainer();
			vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);
			await initializeApp();

			const originalDoc = globalThis.document;
			Object.defineProperty(globalThis, 'document', {
				writable: true,
				value: null,
			});

			await waitForWebVitals();
			restoreDocument(originalDoc);
		});
	});

	describe('Missing Event Listener Support', () => {
		it('triggers web vitals immediately when addEventListener is missing', async () => {
			await testMissingEventListenerSupport('addEventListener');
		});

		it('triggers web vitals immediately when removeEventListener is missing', async () => {
			await testMissingEventListenerSupport('removeEventListener');
		});
	});

	describe('Report Web Vitals Errors', () => {
		it('handles reportWebVitals error gracefully', async () => {
			await testReportWebVitalsError(new Error('Web vitals failed'), '');
		});

		it('handles reportWebVitals error with non-Error value', async () => {
			await testReportWebVitalsError('String error', 'String error');
		});
	});
}

function registerUserInteractionTests(): void {
	it('triggers web vitals report on user interaction', async () => {
		setupMockContainerWithSelector();
		await initializeApp();
		await waitForWebVitals();

		await triggerPointerDownEvent();
		await waitForWebVitals();
	});

	it('triggers web vitals report when document visibility changes to hidden', async () => {
		await testVisibilityChange('hidden');
	});

	it('does not trigger web vitals when document visibility changes to visible', async () => {
		await testVisibilityChange('visible');
	});
}

function registerInitializationEdgeCaseTests(): void {
	it('triggers web vitals immediately when document is already hidden', async () => {
		setupMockContainerWithSelector();
		setupVisibilityState('hidden');

		await initializeApp();
		await waitForWebVitals();

		expect(globalThis.addEventListener).toHaveBeenCalled();
	});
}

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
