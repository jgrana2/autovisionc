import { writable } from 'svelte/store';
import type { ConsoleEntry } from '$lib/types';
import { generateShortId } from '$lib/data/mock-data';

function createConsoleStore() {
	const { subscribe, set, update } = writable<ConsoleEntry[]>([]);

	const addEntry = (type: ConsoleEntry['type'], message: string) =>
		update((entries) => [
			...entries,
			{ id: generateShortId(), timestamp: new Date(), type, message }
		]);

	return {
		subscribe,
		info: (message: string) => addEntry('info', message),
		warning: (message: string) => addEntry('warning', message),
		error: (message: string) => addEntry('error', message),
		detection: (message: string) => addEntry('detection', message),
		clear: () => set([])
	};
}

export const consoleStore = createConsoleStore();
export const consoleExpanded = writable<boolean>(false);


