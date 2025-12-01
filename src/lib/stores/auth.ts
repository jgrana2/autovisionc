import { writable, derived } from 'svelte/store';
import type { User } from '$lib/types';
import { browser } from '$app/environment';
import * as api from '$lib/services/api';

const STORAGE_KEY = 'autovision_auth';

interface AuthState {
	user: User | null;
	token: string | null;
}

function getStoredAuth(): AuthState {
	if (!browser) return { user: null, token: null };
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		try {
			return JSON.parse(stored);
		} catch {
			return { user: null, token: null };
		}
	}
	return { user: null, token: null };
}

function createAuthStore() {
	const { subscribe, set } = writable<AuthState>(getStoredAuth());

	function saveAndSet(state: AuthState) {
		if (browser) {
			if (state.token) {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
			} else {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
		set(state);
	}

	return {
		subscribe,
		login: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
			try {
				const response = await api.login(email, password);
				saveAndSet({
					user: { id: response.user.id, nombre: response.user.nombre, email: response.user.email },
					token: response.token
				});
				return { success: true };
			} catch (e) {
				return { success: false, error: e instanceof Error ? e.message : 'Error al iniciar sesión' };
			}
		},
		register: async (nombre: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
			try {
				const response = await api.register(nombre, email, password);
				saveAndSet({
					user: { id: response.user.id, nombre: response.user.nombre, email: response.user.email },
					token: response.token
				});
				return { success: true };
			} catch (e) {
				return { success: false, error: e instanceof Error ? e.message : 'Error al registrar' };
			}
		},
		logout: () => {
			saveAndSet({ user: null, token: null });
		}
	};
}

export const auth = createAuthStore();

export const isAuthenticated = derived(auth, ($auth) => $auth.token !== null);

export function getToken(): string | null {
	if (!browser) return null;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		try {
			return JSON.parse(stored).token;
		} catch {
			return null;
		}
	}
	return null;
}


