import '@styles/globals.css';

import App from '@app/App';
import { SpeedInsightsLoader } from '@app/components/SpeedInsightsLoader';
import { initConfig } from '@core/config/init';
import { isProduction, isSpeedInsightsEnabled } from '@core/constants/env';
import i18n, { i18nInitPromise } from '@core/i18n/i18n';
import { reportWebVitals } from '@core/perf/reportWebVitals';
import { loggerAdapter } from '@infra/logging/loggerAdapter';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Initialize application configuration and i18n in parallel to reduce
 * the critical path during startup.
 */
await Promise.all([initConfig(), i18nInitPromise]);

const container = document.querySelector('#root');
if (!container) {
	throw new Error(i18n.t('errors.rootElementNotFound', { ns: 'common' }));
}

const shouldLoadSpeedInsights = isProduction() && isSpeedInsightsEnabled();

createRoot(container).render(
	<StrictMode>
		<App />
		{shouldLoadSpeedInsights ? <SpeedInsightsLoader /> : null}
	</StrictMode>
);

const WEB_VITAL_TRIGGER_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'mousemove'] as const;

async function runWebVitalsReporter() {
	await Promise.resolve(reportWebVitals(loggerAdapter));
}

function triggerWebVitalsReport() {
	runWebVitalsReporter().catch(error => {
		loggerAdapter.warn('reportWebVitals failed', {
			error: error instanceof Error ? error.message : String(error),
		});
	});
}

function hasWebVitalSupport(doc: Document | null): doc is Document {
	return (
		typeof globalThis.addEventListener === 'function' &&
		typeof globalThis.removeEventListener === 'function' &&
		Boolean(doc)
	);
}

function createWebVitalActivation(doc: Document) {
	let activated = false;

	function removeListeners() {
		for (const eventName of WEB_VITAL_TRIGGER_EVENTS) {
			globalThis.removeEventListener(eventName, activate);
		}
		doc.removeEventListener('visibilitychange', handleVisibilityChange);
		globalThis.removeEventListener('pagehide', activate);
	}

	function activate() {
		if (activated) {
			return;
		}
		activated = true;
		removeListeners();
		triggerWebVitalsReport();
	}

	function handleVisibilityChange() {
		if (doc.visibilityState === 'hidden') {
			activate();
		}
	}

	function register() {
		for (const eventName of WEB_VITAL_TRIGGER_EVENTS) {
			globalThis.addEventListener(eventName, activate, { once: true, passive: true });
		}
		doc.addEventListener('visibilitychange', handleVisibilityChange, { once: true });
		globalThis.addEventListener('pagehide', activate, { once: true });
	}

	return { activate, register };
}

/**
 * Initialize Core Web Vitals tracking
 * Deferred until the user interacts with the page or the tab loses visibility.
 */
function scheduleWebVitals() {
	const doc = 'document' in globalThis ? globalThis.document : null;

	if (!hasWebVitalSupport(doc)) {
		triggerWebVitalsReport();
		return;
	}

	const { activate, register } = createWebVitalActivation(doc);

	register();

	if (doc.visibilityState === 'hidden') {
		activate();
	}
}

scheduleWebVitals();
