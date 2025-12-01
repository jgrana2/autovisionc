import { writable, derived } from 'svelte/store';
import type { Detection, DetectionFilters } from '$lib/types';
import { selectedCameraId } from './cameras';

function createDetectionsStore() {
	const { subscribe, set, update } = writable<Detection[]>([]);

	return {
		subscribe,
		set,
		addDetection: (detection: Detection) =>
			update((detections) => [detection, ...detections]),
		removeDetection: (id: string) =>
			update((detections) => detections.filter((d) => d.id !== id)),
		clear: () => set([])
	};
}

export const detections = createDetectionsStore();

export const filters = writable<DetectionFilters>({
	placa: '',
	marca: '',
	modelo: '',
	color: '',
	tipoCarroceria: '',
	fechaDesde: null,
	fechaHasta: null
});

export function resetFilters() {
	filters.set({
		placa: '',
		marca: '',
		modelo: '',
		color: '',
		tipoCarroceria: '',
		fechaDesde: null,
		fechaHasta: null
	});
}

export const filteredDetections = derived(
	[detections, selectedCameraId, filters],
	([$detections, $selectedCameraId, $filters]) => {
		let result = $detections;

		if ($selectedCameraId) {
			result = result.filter((d) => d.cameraId === $selectedCameraId);
		}

		if ($filters.placa) {
			const searchPlaca = $filters.placa.toLowerCase();
			result = result.filter((d) => d.placa.toLowerCase().includes(searchPlaca));
		}

		if ($filters.marca) {
			const searchMarca = $filters.marca.toLowerCase();
			result = result.filter((d) => d.marca.toLowerCase().includes(searchMarca));
		}

		if ($filters.modelo) {
			const searchModelo = $filters.modelo.toLowerCase();
			result = result.filter((d) => d.modelo.toLowerCase().includes(searchModelo));
		}

		if ($filters.color) {
			const searchColor = $filters.color.toLowerCase();
			result = result.filter((d) => d.color.toLowerCase().includes(searchColor));
		}

		if ($filters.tipoCarroceria) {
			result = result.filter((d) => d.tipoCarroceria === $filters.tipoCarroceria);
		}

		if ($filters.fechaDesde) {
			const desde = new Date($filters.fechaDesde);
			desde.setHours(0, 0, 0, 0);
			result = result.filter((d) => new Date(d.timestamp) >= desde);
		}

		if ($filters.fechaHasta) {
			const hasta = new Date($filters.fechaHasta);
			hasta.setHours(23, 59, 59, 999);
			result = result.filter((d) => new Date(d.timestamp) <= hasta);
		}

		return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	}
);

export const selectedDetection = writable<Detection | null>(null);


