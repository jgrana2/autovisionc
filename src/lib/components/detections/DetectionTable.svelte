<script lang="ts">
	import { Eye, Trash2, Car, Clock } from 'lucide-svelte';
	import type { Detection } from '$lib/types';
	import { format } from 'date-fns';
	import { es } from 'date-fns/locale';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area.svelte';

	interface Props {
		detections: Detection[];
		onViewDetails: (detection: Detection) => void;
		onDelete: (detection: Detection) => void;
	}

	let { detections, onViewDetails, onDelete }: Props = $props();

	function formatTimestamp(date: Date): string {
		return format(new Date(date), 'dd/MM/yyyy HH:mm:ss', { locale: es });
	}

	function getColorBadgeClass(color: string): string {
		const colorMap: Record<string, string> = {
			blanco: 'bg-white text-zinc-900 border border-zinc-300',
			negro: 'bg-zinc-900 text-white',
			gris: 'bg-zinc-500 text-white',
			plata: 'bg-zinc-300 text-zinc-900',
			rojo: 'bg-red-500 text-white',
			azul: 'bg-blue-500 text-white',
			verde: 'bg-green-500 text-white',
			amarillo: 'bg-yellow-400 text-zinc-900',
			naranja: 'bg-orange-500 text-white',
			café: 'bg-amber-800 text-white',
			beige: 'bg-amber-100 text-zinc-900'
		};
		return colorMap[color.toLowerCase()] || 'bg-zinc-200 text-zinc-900';
	}
</script>

<div class="flex flex-col rounded-lg border bg-card">
	<ScrollArea class="max-h-[calc(100vh-380px)]" orientation="both">
		<table class="w-full">
			<thead class="sticky top-0 bg-muted/50 backdrop-blur-sm">
				<tr class="border-b text-left text-xs font-medium text-muted-foreground">
					<th class="whitespace-nowrap px-4 py-3">ID</th>
					<th class="whitespace-nowrap px-4 py-3">Placa</th>
					<th class="whitespace-nowrap px-4 py-3">Marca</th>
					<th class="whitespace-nowrap px-4 py-3">Modelo</th>
					<th class="whitespace-nowrap px-4 py-3">Color</th>
					<th class="whitespace-nowrap px-4 py-3">Tipo</th>
					<th class="whitespace-nowrap px-4 py-3">Timestamp</th>
					<th class="whitespace-nowrap px-4 py-3">Imagen</th>
					<th class="whitespace-nowrap px-4 py-3 text-right">Acciones</th>
				</tr>
			</thead>
			<tbody class="divide-y">
				{#if detections.length === 0}
					<tr>
						<td colspan="9" class="px-4 py-12 text-center">
							<div class="flex flex-col items-center gap-2 text-muted-foreground">
								<Car class="h-10 w-10" />
								<p class="text-sm">No se encontraron detecciones</p>
								<p class="text-xs">Ajuste los filtros o espere nuevas detecciones</p>
							</div>
						</td>
					</tr>
				{:else}
					{#each detections as detection (detection.id)}
						<tr class="group transition-colors hover:bg-muted/30">
							<td class="whitespace-nowrap px-4 py-3">
								<code class="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
									{detection.id}
								</code>
							</td>
							<td class="whitespace-nowrap px-4 py-3">
								<span class="font-mono font-semibold tracking-wider">{detection.placa}</span>
							</td>
							<td class="whitespace-nowrap px-4 py-3 text-sm">{detection.marca}</td>
							<td class="whitespace-nowrap px-4 py-3 text-sm">{detection.modelo}</td>
							<td class="whitespace-nowrap px-4 py-3">
								<span
									class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium {getColorBadgeClass(
										detection.color
									)}"
								>
									{detection.color}
								</span>
							</td>
							<td class="whitespace-nowrap px-4 py-3">
								<Badge variant="secondary" class="text-xs capitalize">
									{detection.tipoCarroceria}
								</Badge>
							</td>
							<td class="whitespace-nowrap px-4 py-3">
								<div class="flex items-center gap-1.5 text-xs text-muted-foreground">
									<Clock class="h-3 w-3" />
									{formatTimestamp(detection.timestamp)}
								</div>
							</td>
							<td class="px-4 py-3">
								<div class="relative h-10 w-16 overflow-hidden rounded border bg-muted">
									<img
										src={detection.imagenUrl}
										alt="Vehículo {detection.placa}"
										class="h-full w-full object-cover"
									/>
								</div>
							</td>
							<td class="whitespace-nowrap px-4 py-3">
								<div class="flex items-center justify-end gap-1">
									<Button
										variant="ghost"
										size="sm"
										onclick={() => onViewDetails(detection)}
										class="h-8 px-2 text-xs"
									>
										<Eye class="h-3.5 w-3.5" />
										Ver detalles
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onclick={() => onDelete(detection)}
										class="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
									>
										<Trash2 class="h-3.5 w-3.5" />
										Eliminar
									</Button>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</ScrollArea>

	{#if detections.length > 0}
		<div class="flex items-center justify-between border-t bg-muted/30 px-4 py-2">
			<p class="text-xs text-muted-foreground">
				Mostrando {detections.length} detección{detections.length !== 1 ? 'es' : ''}
			</p>
		</div>
	{/if}
</div>


