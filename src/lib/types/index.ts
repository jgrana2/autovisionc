// Detection type for car plate recognition
export interface Detection {
	id: string; // Short UUID like "a9f3c2"
	placa: string; // Plate number
	marca: string; // Brand
	modelo: string; // Model
	color: string; // Color
	tipoCarroceria: string; // Body type
	timestamp: Date;
	imagenUrl: string; // Image URL
	cameraId: string;
	confidence?: number; // Detection confidence (0-1)
}

// Camera type
export interface Camera {
	id: string;
	nombre: string;
	ubicacion: string;
	estado: 'activo' | 'inactivo';
}

// User type for authentication
export interface User {
	id: string;
	nombre: string;
	email: string;
}

// Console log entry type
export interface ConsoleEntry {
	id: string;
	timestamp: Date;
	type: 'info' | 'warning' | 'error' | 'detection';
	message: string;
}

// Filter state type
export interface DetectionFilters {
	placa: string;
	marca: string;
	modelo: string;
	color: string;
	tipoCarroceria: string;
	fechaDesde: Date | null;
	fechaHasta: Date | null;
}

// Body types enum
export const TIPOS_CARROCERIA = [
	'sedan',
	'hatchback',
	'suv',
	'pickup',
	'camioneta',
	'coupe',
	'convertible',
	'minivan',
	'van',
	'camión'
] as const;

export type TipoCarroceria = (typeof TIPOS_CARROCERIA)[number];

// Common car brands
export const MARCAS = [
	'Suzuki',
	'Chevrolet',
	'Renault',
	'Mazda',
	'Toyota',
	'Nissan',
	'Kia',
	'Hyundai',
	'Ford',
	'Volkswagen',
	'Honda',
	'Mitsubishi'
] as const;

// Common car colors in Spanish
export const COLORES = [
	'blanco',
	'negro',
	'gris',
	'plata',
	'rojo',
	'azul',
	'verde',
	'amarillo',
	'naranja',
	'café',
	'beige'
] as const;


