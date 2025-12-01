<script lang="ts">
	import type { Notification } from '$lib/stores/notifications';
	import { notifications } from '$lib/stores/notifications';

	interface Props {
		notification: Notification;
		onclick?: () => void;
	}

	let { notification, onclick }: Props = $props();

	let isExiting = $state(false);

	function handleDismiss(e: MouseEvent) {
		e.stopPropagation();
		isExiting = true;
		setTimeout(() => {
			notifications.removeNotification(notification.id);
		}, 200);
	}

	function handleClick() {
		if (onclick) {
			onclick();
		}
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('es-CO', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}
</script>

<div
	class="toast {isExiting ? 'toast-exit' : 'toast-enter'}"
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
	role="button"
	tabindex="0"
>
	<!-- Car thumbnail -->
	<div class="toast-image">
		<img
			src={notification.detection.imagenUrl}
			alt="Vehículo detectado"
			class="h-full w-full object-cover"
		/>
	</div>

	<!-- Content -->
	<div class="toast-content">
		<div class="toast-header">
			<span class="toast-plate">{notification.detection.placa}</span>
			<button class="toast-close" onclick={handleDismiss} aria-label="Cerrar notificación">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg>
			</button>
		</div>
		<p class="toast-vehicle">
			{notification.detection.marca}
			{notification.detection.modelo} • {notification.detection.color}
		</p>
		<div class="toast-footer">
			<span class="toast-camera">{notification.cameraName}</span>
			<span class="toast-time">{formatTime(notification.timestamp)}</span>
		</div>
	</div>

	<!-- New badge indicator -->
	<div class="toast-indicator"></div>
</div>

<style>
	.toast {
		display: flex;
		position: relative;
		width: 320px;
		background-color: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.15s ease;
	}

	.toast:hover {
		transform: translateY(-2px);
	}

	.toast-enter {
		animation: slideInRight 0.3s ease-out forwards;
	}

	.toast-exit {
		animation: slideOutRight 0.2s ease-in forwards;
	}

	@keyframes slideInRight {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slideOutRight {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(100%);
		}
	}

	.toast-indicator {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: linear-gradient(to bottom, #10b981, #059669);
	}

	.toast-image {
		width: 70px;
		height: 70px;
		flex-shrink: 0;
		background-color: var(--color-muted);
		margin: 8px;
		margin-left: 12px;
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.toast-content {
		flex: 1;
		padding: 10px 12px 10px 8px;
		min-width: 0;
	}

	.toast-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.toast-plate {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 1rem;
		letter-spacing: 0.05em;
		color: var(--color-foreground);
	}

	.toast-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border: none;
		background: transparent;
		color: var(--color-muted-foreground);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all 0.15s ease;
	}

	.toast-close:hover {
		background-color: var(--color-muted);
		color: var(--color-foreground);
	}

	.toast-vehicle {
		font-size: 0.8rem;
		color: var(--color-muted-foreground);
		margin-top: 2px;
		text-transform: capitalize;
	}

	.toast-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 6px;
		font-size: 0.7rem;
	}

	.toast-camera {
		color: var(--color-muted-foreground);
		font-weight: 500;
	}

	.toast-time {
		color: var(--color-muted-foreground);
		font-family: var(--font-mono);
	}
</style>







