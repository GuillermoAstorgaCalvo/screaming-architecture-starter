#!/usr/bin/env node
/* eslint-env node */
/* global process, console */

import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const runtimeDir = resolve(projectRoot, 'config', 'runtime');
const destinationFile = resolve(projectRoot, 'public', 'runtime-config.json');

const normalize = value => value?.trim().toLowerCase();

const requestedEnv =
	normalize(process.env.RUNTIME_CONFIG_ENV) ??
	normalize(process.env.APP_RUNTIME_ENV) ??
	normalize(process.env.VERCEL_ENV) ??
	'development';

const sourceFile = resolve(runtimeDir, `runtime-config.${requestedEnv}.json`);
const fallbackFile = resolve(runtimeDir, 'runtime-config.development.json');

if (!existsSync(runtimeDir)) {
	mkdirSync(runtimeDir, { recursive: true });
}

const copyRuntimeConfig = (filePath, label) => {
	cpSync(filePath, destinationFile);
	console.log(`[runtime-config] Applied "${label}" → public/runtime-config.json`);
};

if (existsSync(sourceFile)) {
	copyRuntimeConfig(sourceFile, requestedEnv);
	process.exit(0);
}

if (existsSync(fallbackFile)) {
	console.warn(
		`[runtime-config] Missing runtime-config.${requestedEnv}.json. Falling back to development.`
	);
	copyRuntimeConfig(fallbackFile, 'development');
	process.exit(0);
}

console.warn(
	`[runtime-config] No runtime config files found. Skipping update (public/runtime-config.json unchanged).`
);
