<script lang="ts">
	import { Camera, History, Settings, ScanFace, Radio, CircleDot } from 'lucide-svelte';
	import { cameras, selectedCameraId } from '$lib/stores/cameras';
	import Button from '$lib/components/ui/button.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area.svelte';
	import Separator from '$lib/components/ui/separator.svelte';
	import Badge from '$lib/components/ui/badge.svelte';

	// Placeholder ngrok URL for face recognition
	const FACE_RECOGNITION_URL = 'https://your-ngrok-url.ngrok.io';

	const navItems = [
		{ icon: Camera, label: 'Cámaras', active: true },
		{ icon: History, label: 'Historial', active: false },
		{ icon: Settings, label: 'Configuración', active: false }
	];

	function selectCamera(cameraId: string) {
		selectedCameraId.set(cameraId);
	}

	function openFaceRecognition() {
		window.open(FACE_RECOGNITION_URL, '_blank');
	}
</script>

<aside class="flex h-full w-64 flex-col border-r bg-background">
	<!-- Navigation -->
	<nav class="flex flex-col gap-1 p-4">
		{#each navItems as item}
			<button
				class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors {item.active
					? 'bg-primary text-primary-foreground'
					: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
			>
				<item.icon class="h-4 w-4" />
				{item.label}
			</button>
		{/each}
		<Separator class="my-2" />
		<button
			onclick={openFaceRecognition}
			class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
		>
			<ScanFace class="h-4 w-4" />
			Reconocimiento facial
		</button>
	</nav>

	<Separator />

	<!-- Camera List -->
	<div class="flex flex-col flex-1 overflow-hidden">
		<div class="flex items-center justify-between px-4 py-3">
			<h3 class="text-sm font-semibold">Cámaras</h3>
			<Badge variant="secondary" class="text-xs">{$cameras.length}</Badge>
		</div>
		<ScrollArea class="flex-1 px-2 pb-4">
			<div class="flex flex-col gap-1">
				{#each $cameras as camera}
					<button
						onclick={() => selectCamera(camera.id)}
						class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors {$selectedCameraId ===
						camera.id
							? 'bg-accent'
							: 'hover:bg-muted'}"
					>
						<div class="relative">
							<Radio class="h-4 w-4 text-muted-foreground" />
							<CircleDot
								class="absolute -right-0.5 -top-0.5 h-2 w-2 {camera.estado === 'activo'
									? 'text-green-500'
									: 'text-zinc-400'}"
							/>
						</div>
						<div class="flex flex-col flex-1 min-w-0">
							<span
								class="truncate text-sm font-medium {$selectedCameraId === camera.id
									? 'text-foreground'
									: 'text-muted-foreground group-hover:text-foreground'}"
							>
								{camera.nombre}
							</span>
							<span class="truncate text-xs text-muted-foreground">
								{camera.ubicacion}
							</span>
						</div>
						{#if camera.estado === 'activo'}
							<span class="h-2 w-2 rounded-full bg-green-500"></span>
						{:else}
							<span class="h-2 w-2 rounded-full bg-zinc-400"></span>
						{/if}
					</button>
				{/each}
			</div>
		</ScrollArea>
	</div>
</aside>


