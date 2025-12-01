import { writable, derived } from 'svelte/store';
import type { Camera } from '$lib/types';
import { mockCameras } from '$lib/data/mock-data';

// Cameras store
function createCamerasStore() {
	const { subscribe, set, update } = writable<Camera[]>(mockCameras);

	return {
		subscribe,
		set,
		update,
		addCamera: (camera: Camera) => update((cameras) => [...cameras, camera]),
		removeCamera: (id: string) => update((cameras) => cameras.filter((c) => c.id !== id)),
		updateCamera: (id: string, data: Partial<Camera>) =>
			update((cameras) => cameras.map((c) => (c.id === id ? { ...c, ...data } : c)))
	};
}

export const cameras = createCamerasStore();

// Selected camera store
export const selectedCameraId = writable<string | null>('cam-001');

// Derived store for the selected camera
export const selectedCamera = derived(
	[cameras, selectedCameraId],
	([$cameras, $selectedCameraId]) => {
		return $cameras.find((c) => c.id === $selectedCameraId) || null;
	}
);


