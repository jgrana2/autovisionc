import type { Detection } from '$lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Exports an array of detections to a CSV file and triggers a download
 */
export function exportToCSV(detections: Detection[], cameraName: string): void {
	if (detections.length === 0) {
		return;
	}

	// CSV Headers
	const headers = [
		'ID',
		'Placa',
		'Marca',
		'Modelo',
		'Color',
		'Tipo de Carrocería',
		'Timestamp',
		'Confianza',
		'URL de Imagen'
	];

	// Convert detections to CSV rows
	const rows = detections.map((detection) => [
		detection.id,
		detection.placa,
		detection.marca,
		detection.modelo,
		detection.color,
		detection.tipoCarroceria,
		format(new Date(detection.timestamp), 'yyyy-MM-dd HH:mm:ss', { locale: es }),
		detection.confidence ? `${(detection.confidence * 100).toFixed(1)}%` : 'N/A',
		detection.imagenUrl
	]);

	// Build CSV content
	const csvContent = [
		headers.join(','),
		...rows.map((row) =>
			row
				.map((cell) => {
					// Escape quotes and wrap in quotes if contains comma or quote
					const stringCell = String(cell);
					if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
						return `"${stringCell.replace(/"/g, '""')}"`;
					}
					return stringCell;
				})
				.join(',')
		)
	].join('\n');

	// Create blob and download
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);

	// Generate filename
	const sanitizedCameraName = cameraName.replace(/[^a-zA-Z0-9]/g, '_');
	const dateStr = format(new Date(), 'yyyy-MM-dd_HHmmss');
	const filename = `detecciones_${sanitizedCameraName}_${dateStr}.csv`;

	// Create download link and trigger download
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	// Clean up URL
	URL.revokeObjectURL(url);
}

/**
 * Exports all detections across all cameras
 */
export function exportAllToCSV(detections: Detection[]): void {
	exportToCSV(detections, 'todas_las_camaras');
}


