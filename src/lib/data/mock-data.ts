import type { Camera } from '$lib/types';

export function generateShortId(): string {
	return Math.random().toString(36).substring(2, 8);
}

export const mockCameras: Camera[] = [
	{ id: 'cam-001', nombre: 'Cámara Entrada Principal', ubicacion: 'Entrada Principal', estado: 'activo' },
	{ id: 'cam-002', nombre: 'Cámara Parqueadero A', ubicacion: 'Parqueadero Sección A', estado: 'activo' },
	{ id: 'cam-003', nombre: 'Cámara Parqueadero B', ubicacion: 'Parqueadero Sección B', estado: 'activo' },
	{ id: 'cam-004', nombre: 'Cámara Salida', ubicacion: 'Salida Principal', estado: 'inactivo' }
];


