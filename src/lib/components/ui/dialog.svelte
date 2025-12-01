<script lang="ts">
	import { cn } from '$lib/utils';
	import { X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
		title?: string;
		description?: string;
		class?: string;
		children?: Snippet;
	}

	let { open = $bindable(), onClose, title, description, class: className, children }: Props = $props();

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
		onclick={handleBackdropClick}
	>
		<div
			class={cn(
				'relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
				className
			)}
		>
			<button
				class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
				onclick={onClose}
			>
				<X class="h-4 w-4" />
				<span class="sr-only">Cerrar</span>
			</button>
			{#if title || description}
				<div class="flex flex-col space-y-1.5 text-center sm:text-left">
					{#if title}
						<h2 class="text-lg font-semibold leading-none tracking-tight">{title}</h2>
					{/if}
					{#if description}
						<p class="text-sm text-muted-foreground">{description}</p>
					{/if}
				</div>
			{/if}
			{@render children?.()}
		</div>
	</div>
{/if}


