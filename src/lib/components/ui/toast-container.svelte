<script lang="ts">
	import { notifications } from '$lib/stores/notifications';
	import { selectedDetection } from '$lib/stores/detections';
	import Toast from './toast.svelte';

	interface Props {
		onViewDetails?: () => void;
	}

	let { onViewDetails }: Props = $props();

	function handleToastClick(notification: (typeof $notifications)[0]) {
		selectedDetection.set(notification.detection);
		notifications.removeNotification(notification.id);
		if (onViewDetails) {
			onViewDetails();
		}
	}
</script>

{#if $notifications.length > 0}
	<div class="toast-container">
		{#each $notifications as notification (notification.id)}
			<Toast {notification} onclick={() => handleToastClick(notification)} />
		{/each}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		bottom: 24px;
		right: 24px;
		z-index: 9999;
		display: flex;
		flex-direction: column-reverse;
		gap: 12px;
		pointer-events: none;
	}

	.toast-container :global(.toast) {
		pointer-events: auto;
	}
</style>







