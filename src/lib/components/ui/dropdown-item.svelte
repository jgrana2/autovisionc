<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		class?: string;
		destructive?: boolean;
	}

	let { class: className, destructive = false, children, ...restProps }: Props = $props();
</script>

<button
	class={cn(
		'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
		destructive && 'text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</button>


