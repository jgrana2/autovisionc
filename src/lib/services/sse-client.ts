import { API_URL } from '$lib/config';
import { detections } from '$lib/stores/detections';
import { cameras } from '$lib/stores/cameras';
import { consoleStore } from '$lib/stores/console';
import { notifications } from '$lib/stores/notifications';
import type { ApiPlate } from './api';
import { get } from 'svelte/store';

let eventSource: EventSource | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

function transformPlate(plate: ApiPlate) {
	return {
		id: String(plate.id),
		placa: plate.plate_number,
		marca: plate.brand,
		modelo: plate.model,
		color: plate.color,
		tipoCarroceria: plate.body_type,
		timestamp: new Date(plate.timestamp),
		imagenUrl: `${API_URL}/static/uploads/${plate.image_filename}`,
		cameraId: plate.camera_id,
		confidence: 0.95
	};
}

export function connectSSE(token: string): void {
	if (eventSource) {
		eventSource.close();
	}

	const url = `${API_URL}/api/stream?token=${encodeURIComponent(token)}`;
	eventSource = new EventSource(url);

	eventSource.addEventListener('detection', (event) => {
		try {
			const plate: ApiPlate = JSON.parse(event.data);
			const detection = transformPlate(plate);

			detections.addDetection(detection);

			const cameraList = get(cameras);
			const camera = cameraList.find((c) => c.id === detection.cameraId);
			const cameraName = camera?.nombre || detection.cameraId;

			notifications.addNotification(detection, cameraName);
			consoleStore.detection(
				`[DETECCIÓN] Nueva placa detectada: ${detection.placa} - ${detection.marca} ${detection.modelo} (${cameraName})`
			);
		} catch (e) {
			consoleStore.error('Error procesando detección SSE');
		}
	});

	eventSource.onopen = () => {
		consoleStore.info('Conexión SSE establecida');
	};

	eventSource.onerror = () => {
		consoleStore.warning('Conexión SSE perdida, reconectando...');
		eventSource?.close();
		eventSource = null;

		if (reconnectTimeout) clearTimeout(reconnectTimeout);
		reconnectTimeout = setTimeout(() => connectSSE(token), 5000);
	};
}

export function disconnectSSE(): void {
	if (reconnectTimeout) {
		clearTimeout(reconnectTimeout);
		reconnectTimeout = null;
	}
	if (eventSource) {
		eventSource.close();
		eventSource = null;
		consoleStore.info('Conexión SSE cerrada');
	}
}
