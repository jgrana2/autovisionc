<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { auth, isAuthenticated, getToken } from '$lib/stores/auth';
	import { selectedCamera } from '$lib/stores/cameras';
	import { filteredDetections, detections, selectedDetection } from '$lib/stores/detections';
	import { consoleStore } from '$lib/stores/console';
	import { Header, Sidebar, Console } from '$lib/components/layout';
	import {
		DetectionFilters,
		DetectionTable,
		DetectionDetail,
		DeleteConfirmDialog
	} from '$lib/components/detections';
	import { connectSSE, disconnectSSE } from '$lib/services/sse-client';
	import { getPlates, deletePlate, type ApiPlate } from '$lib/services/api';
	import { API_URL } from '$lib/config';
	import { exportToCSV } from '$lib/services/csv-export';
	import type { Detection } from '$lib/types';
	import Badge from '$lib/components/ui/badge.svelte';
	import ToastContainer from '$lib/components/ui/toast-container.svelte';

	let detailOpen = $state(false);
	let deleteOpen = $state(false);
	let deleteLoading = $state(false);
	let detectionToDelete = $state<Detection | null>(null);

	function transformPlate(plate: ApiPlate): Detection {
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

	async function loadDetections() {
		const token = getToken();
		if (!token) return;

		try {
			const response = await getPlates(token);
			const transformed = response.plates.map(transformPlate);
			detections.set(transformed);
			consoleStore.info(`Cargadas ${transformed.length} detecciones del servidor`);
		} catch (e) {
			consoleStore.error('Error cargando detecciones del servidor');
		}
	}

	$effect(() => {
		if (browser && !$isAuthenticated) {
			goto('/login');
		}
	});

	onMount(() => {
		if (browser && $isAuthenticated) {
			const token = getToken();
			if (token) {
				loadDetections();
				connectSSE(token);
				consoleStore.info('Panel de detecciones cargado');
			}
		}
	});

	onDestroy(() => {
		if (browser) {
			disconnectSSE();
		}
	});

	function handleViewDetails(detection: Detection) {
		selectedDetection.set(detection);
		detailOpen = true;
	}

	function handleCloseDetails() {
		detailOpen = false;
		selectedDetection.set(null);
	}

	function handleDeleteRequest(detection: Detection) {
		detectionToDelete = detection;
		deleteOpen = true;
	}

	function handleCloseDelete() {
		deleteOpen = false;
		detectionToDelete = null;
	}

	async function handleConfirmDelete() {
		if (!detectionToDelete) return;

		deleteLoading = true;
		const token = getToken();

		try {
			if (token) {
				await deletePlate(token, Number(detectionToDelete.id));
			}
			detections.removeDetection(detectionToDelete.id);
			consoleStore.info(`Detección ${detectionToDelete.id} (${detectionToDelete.placa}) eliminada`);
		} catch (e) {
			consoleStore.error('Error eliminando detección');
		}

		deleteLoading = false;
		handleCloseDelete();
	}

	function handleExport() {
		if ($selectedCamera && $filteredDetections.length > 0) {
			exportToCSV($filteredDetections, $selectedCamera.nombre);
			consoleStore.info(
				`Exportadas ${$filteredDetections.length} detecciones de ${$selectedCamera.nombre}`
			);
		}
	}
</script>

<svelte:head>
	<title>Dashboard - AutoVision</title>
</svelte:head>

{#if $isAuthenticated}
	<div class="flex h-screen flex-col bg-background">
		<Header />

		<div class="flex flex-1 overflow-hidden">
			<Sidebar />

			<!-- Main Content -->
			<main class="flex flex-1 flex-col overflow-hidden">
				<div class="flex flex-1 flex-col gap-4 overflow-auto p-6">
					<!-- Page Header -->
					<div class="flex items-center justify-between">
						<div>
							<h1 class="text-2xl font-bold tracking-tight">Detecciones</h1>
							{#if $selectedCamera}
								<p class="text-sm text-muted-foreground">
									{$selectedCamera.nombre} - {$selectedCamera.ubicacion}
								</p>
							{/if}
						</div>
						{#if $selectedCamera}
							<Badge
								variant={$selectedCamera.estado === 'activo' ? 'default' : 'secondary'}
								class="capitalize"
							>
								{$selectedCamera.estado}
							</Badge>
						{/if}
					</div>

					<!-- Filters -->
					<DetectionFilters onExport={handleExport} />

					<!-- Detection Table -->
					<div class="flex-1">
						<DetectionTable
							detections={$filteredDetections}
							onViewDetails={handleViewDetails}
							onDelete={handleDeleteRequest}
						/>
					</div>
				</div>

				<!-- Console -->
				<Console />
			</main>
		</div>
	</div>

	<!-- Detail Modal -->
	<DetectionDetail
		detection={$selectedDetection}
		bind:open={detailOpen}
		onClose={handleCloseDetails}
	/>

	<!-- Delete Confirmation Modal -->
	<DeleteConfirmDialog
		detection={detectionToDelete}
		bind:open={deleteOpen}
		onClose={handleCloseDelete}
		onConfirm={handleConfirmDelete}
		loading={deleteLoading}
	/>

	<!-- Toast Notifications -->
	<ToastContainer onViewDetails={() => (detailOpen = true)} />
{/if}
