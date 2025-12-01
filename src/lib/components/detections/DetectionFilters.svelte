<script lang="ts">
	import { Search, X, Download } from 'lucide-svelte';
	import { filters, resetFilters } from '$lib/stores/detections';
	import { TIPOS_CARROCERIA } from '$lib/types';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import Select from '$lib/components/ui/select.svelte';

	interface Props {
		onExport: () => void;
	}

	let { onExport }: Props = $props();

	// Local state for date inputs
	let fechaDesde = $state('');
	let fechaHasta = $state('');

	// Sync date inputs with store
	$effect(() => {
		filters.update((f) => ({
			...f,
			fechaDesde: fechaDesde ? new Date(fechaDesde) : null,
			fechaHasta: fechaHasta ? new Date(fechaHasta) : null
		}));
	});

	function handleReset() {
		fechaDesde = '';
		fechaHasta = '';
		resetFilters();
	}

	function updateFilter(key: keyof typeof $filters, value: string) {
		filters.update((f) => ({ ...f, [key]: value }));
	}
</script>

<div class="flex flex-col gap-4 rounded-lg border bg-card p-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<Search class="h-4 w-4 text-muted-foreground" />
			<h3 class="text-sm font-medium">Filtros</h3>
		</div>
		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm" onclick={handleReset}>
				<X class="h-4 w-4" />
				Limpiar
			</Button>
			<Button size="sm" onclick={onExport}>
				<Download class="h-4 w-4" />
				Exportar CSV
			</Button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
		<div class="flex flex-col gap-1.5">
			<Label for="filter-placa" class="text-xs">Placa</Label>
			<Input
				id="filter-placa"
				type="text"
				placeholder="ABC123"
				value={$filters.placa}
				oninput={(e) => updateFilter('placa', e.currentTarget.value)}
				class="h-8 text-sm"
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="filter-marca" class="text-xs">Marca</Label>
			<Input
				id="filter-marca"
				type="text"
				placeholder="Suzuki"
				value={$filters.marca}
				oninput={(e) => updateFilter('marca', e.currentTarget.value)}
				class="h-8 text-sm"
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="filter-modelo" class="text-xs">Modelo</Label>
			<Input
				id="filter-modelo"
				type="text"
				placeholder="Swift"
				value={$filters.modelo}
				oninput={(e) => updateFilter('modelo', e.currentTarget.value)}
				class="h-8 text-sm"
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="filter-color" class="text-xs">Color</Label>
			<Input
				id="filter-color"
				type="text"
				placeholder="blanco"
				value={$filters.color}
				oninput={(e) => updateFilter('color', e.currentTarget.value)}
				class="h-8 text-sm"
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="filter-tipo" class="text-xs">Tipo de carrocería</Label>
			<Select
				id="filter-tipo"
				value={$filters.tipoCarroceria}
				onchange={(e) => updateFilter('tipoCarroceria', e.currentTarget.value)}
				class="h-8 text-sm"
			>
				<option value="">Todos</option>
				{#each TIPOS_CARROCERIA as tipo}
					<option value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>
				{/each}
			</Select>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="filter-desde" class="text-xs">Desde</Label>
			<Input
				id="filter-desde"
				type="date"
				bind:value={fechaDesde}
				class="h-8 text-sm"
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="filter-hasta" class="text-xs">Hasta</Label>
			<Input
				id="filter-hasta"
				type="date"
				bind:value={fechaHasta}
				class="h-8 text-sm"
			/>
		</div>
	</div>
</div>


