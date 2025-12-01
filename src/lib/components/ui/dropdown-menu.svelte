<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		class?: string;
		trigger?: Snippet;
		children?: Snippet;
	}

	let { open = $bindable(false), class: className, trigger, children }: Props = $props();

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.dropdown-container')) {
			open = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="dropdown-container relative inline-block">
	<button
		class="inline-flex items-center"
		onclick={(e) => {
			e.stopPropagation();
			open = !open;
		}}
	>
		{@render trigger?.()}
	</button>

	{#if open}
		<div
			class={cn(
				'absolute right-0 top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
				className
			)}
		>
			{@render children?.()}
		</div>
	{/if}
</div>


