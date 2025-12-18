import type { Camera } from '$lib/types';

export function generateShortId(): string {
	return Math.random().toString(36).substring(2, 8);
}

export const mockCameras: Camera[] = [
	{ id: 'cam-001', nombre: 'Cámara Entrada Principal', ubicacion: 'Entrada Principal', estado: 'activo' }
];


