<script lang="ts">
	import { ChevronUp, ChevronDown, Terminal, Trash2 } from 'lucide-svelte';
	import { consoleStore, consoleExpanded } from '$lib/stores/console';
	import ScrollArea from '$lib/components/ui/scroll-area.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { format } from 'date-fns';
	import { es } from 'date-fns/locale';

	function toggleConsole() {
		consoleExpanded.update((v) => !v);
	}

	function clearConsole() {
		consoleStore.clear();
	}

	function getTypeColor(type: string): string {
		switch (type) {
			case 'info':
				return 'text-zinc-400';
			case 'warning':
				return 'text-yellow-500';
			case 'error':
				return 'text-red-500';
			case 'detection':
				return 'text-green-500';
			default:
				return 'text-zinc-400';
		}
	}

	function getTypePrefix(type: string): string {
		switch (type) {
			case 'info':
				return 'INFO';
			case 'warning':
				return 'WARN';
			case 'error':
				return 'ERROR';
			case 'detection':
				return 'DETECT';
			default:
				return 'LOG';
		}
	}
</script>

<div
	class="flex flex-col border-t bg-zinc-950 text-zinc-100 transition-all duration-300 {$consoleExpanded
		? 'h-64'
		: 'h-10'}"
>
	<!-- Header -->
	<button
		onclick={toggleConsole}
		class="flex h-10 shrink-0 items-center justify-between border-b border-zinc-800 px-4 hover:bg-zinc-900"
	>
		<div class="flex items-center gap-2">
			<Terminal class="h-4 w-4 text-zinc-500" />
			<span class="text-sm font-medium text-zinc-400">Consola del Sistema</span>
			<span class="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">
				{$consoleStore.length} mensajes
			</span>
		</div>
		<div class="flex items-center gap-2">
			{#if $consoleExpanded}
				<Button
					variant="ghost"
					size="icon"
					class="h-6 w-6 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
					onclick={(e) => {
						e.stopPropagation();
						clearConsole();
					}}
				>
					<Trash2 class="h-3.5 w-3.5" />
				</Button>
			{/if}
			{#if $consoleExpanded}
				<ChevronDown class="h-4 w-4 text-zinc-500" />
			{:else}
				<ChevronUp class="h-4 w-4 text-zinc-500" />
			{/if}
		</div>
	</button>

	<!-- Console Content -->
	{#if $consoleExpanded}
		<ScrollArea class="flex-1 p-2 font-mono text-xs">
			<div class="flex flex-col gap-0.5">
				{#each $consoleStore as entry (entry.id)}
					<div class="flex gap-2 rounded px-2 py-1 hover:bg-zinc-900">
						<span class="shrink-0 text-zinc-600">
							[{format(new Date(entry.timestamp), 'HH:mm:ss', { locale: es })}]
						</span>
						<span class="shrink-0 {getTypeColor(entry.type)}">
							[{getTypePrefix(entry.type)}]
						</span>
						<span class="text-zinc-300">{entry.message}</span>
					</div>
				{/each}
				{#if $consoleStore.length === 0}
					<div class="flex items-center justify-center py-8 text-zinc-600">
						No hay mensajes en la consola
					</div>
				{/if}
			</div>
		</ScrollArea>
	{/if}
</div>


