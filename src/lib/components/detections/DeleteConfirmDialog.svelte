<script lang="ts">
	import { AlertTriangle, Loader2 } from 'lucide-svelte';
	import type { Detection } from '$lib/types';
	import Dialog from '$lib/components/ui/dialog.svelte';
	import Button from '$lib/components/ui/button.svelte';

	interface Props {
		detection: Detection | null;
		open: boolean;
		onClose: () => void;
		onConfirm: () => void;
		loading?: boolean;
	}

	let { detection, open = $bindable(), onClose, onConfirm, loading = false }: Props = $props();
</script>

<Dialog {open} {onClose} class="max-w-md">
	<div class="flex flex-col items-center gap-4 text-center">
		<div class="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
			<AlertTriangle class="h-7 w-7 text-destructive" />
		</div>

		<div>
			<h3 class="text-lg font-semibold">Eliminar detección</h3>
			<p class="mt-2 text-sm text-muted-foreground">
				¿Está seguro que desea eliminar la detección de la placa
				{#if detection}
					<code class="rounded bg-muted px-1.5 py-0.5 font-mono font-semibold">
						{detection.placa}
					</code>
				{/if}?
			</p>
			<p class="mt-1 text-xs text-muted-foreground">Esta acción no se puede deshacer.</p>
		</div>

		<div class="flex w-full gap-3">
			<Button variant="outline" class="flex-1" onclick={onClose} disabled={loading}>
				Cancelar
			</Button>
			<Button variant="destructive" class="flex-1" onclick={onConfirm} disabled={loading}>
				{#if loading}
					<Loader2 class="h-4 w-4 animate-spin" />
					Eliminando...
				{:else}
					Eliminar
				{/if}
			</Button>
		</div>
	</div>
</Dialog>


