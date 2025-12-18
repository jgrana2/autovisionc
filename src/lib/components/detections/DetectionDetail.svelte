<script lang="ts">
	import { X, Car, Calendar, Camera, Hash, Palette, Tag, Gauge } from 'lucide-svelte';
	import type { Detection } from '$lib/types';
	import { cameras } from '$lib/stores/cameras';
	import { format } from 'date-fns';
	import { es } from 'date-fns/locale';
	import Dialog from '$lib/components/ui/dialog.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Separator from '$lib/components/ui/separator.svelte';

	interface Props {
		detection: Detection | null;
		open: boolean;
		onClose: () => void;
	}

	let { detection, open = $bindable(), onClose }: Props = $props();

	let cameraName = $derived(
		detection ? $cameras.find((c) => c.id === detection.cameraId)?.nombre || 'Desconocida' : ''
	);

	function formatTimestamp(date: Date): string {
		return format(new Date(date), "EEEE, d 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es });
	}
</script>

<Dialog {open} {onClose} class="max-w-2xl">
	{#if detection}
		<div class="flex flex-col gap-6">
			<!-- Header -->
			<div class="flex items-start justify-between">
				<div>
					<div class="flex items-center gap-3">
						<code class="rounded-lg bg-muted px-3 py-1 font-mono text-lg font-bold">
							{detection.placa}
						</code>
						<Badge variant="secondary" class="capitalize">{detection.tipoCarroceria}</Badge>
					</div>
					<p class="mt-2 text-sm text-muted-foreground">
						ID de detección:
						<code class="ml-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
							{detection.id}
						</code>
					</p>
				</div>
			</div>

			<!-- Image -->
			<div class="relative aspect-video overflow-hidden rounded-lg border bg-muted">
				<img
					src={detection.imagenUrl}
					alt="Vehículo {detection.placa}"
					class="h-full w-full object-contain"
				/>
			</div>

			<Separator />

			<!-- Details Grid -->
			<div class="grid grid-cols-2 gap-4">
				<div class="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
						<Car class="h-4 w-4 text-primary" />
					</div>
					<div>
						<p class="text-xs text-muted-foreground">Marca / Modelo</p>
						<p class="font-medium">{detection.marca}{detection.modelo !== "No detectado" ? ` / ${detection.modelo}` : ""}</p>
					</div>
				</div>

				<div class="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
						<Palette class="h-4 w-4 text-primary" />
					</div>
					<div>
						<p class="text-xs text-muted-foreground">Color</p>
						<p class="font-medium capitalize">{detection.color}</p>
					</div>
				</div>

				<div class="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
						<Tag class="h-4 w-4 text-primary" />
					</div>
					<div>
						<p class="text-xs text-muted-foreground">Tipo de carrocería</p>
						<p class="font-medium capitalize">{detection.tipoCarroceria}</p>
					</div>
				</div>

				<div class="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
						<Camera class="h-4 w-4 text-primary" />
					</div>
					<div>
						<p class="text-xs text-muted-foreground">Cámara</p>
						<p class="font-medium">{cameraName}</p>
					</div>
				</div>

				<div class="col-span-2 flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
						<Calendar class="h-4 w-4 text-primary" />
					</div>
					<div>
						<p class="text-xs text-muted-foreground">Fecha y hora de detección</p>
						<p class="font-medium">{formatTimestamp(detection.timestamp)}</p>
					</div>
				</div>

				{#if detection.confidence}
					<div class="col-span-2 flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
						<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
							<Gauge class="h-4 w-4 text-primary" />
						</div>
						<div class="flex-1">
							<p class="text-xs text-muted-foreground">Confianza de detección</p>
							<div class="mt-1 flex items-center gap-3">
								<div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
									<div
										class="h-full bg-primary transition-all"
										style="width: {detection.confidence * 100}%"
									></div>
								</div>
								<span class="font-mono text-sm font-medium">
									{(detection.confidence * 100).toFixed(1)}%
								</span>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</Dialog>


