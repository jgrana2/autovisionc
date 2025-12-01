import { writable } from 'svelte/store';
import type { Detection } from '$lib/types';

export interface Notification {
	id: string;
	detection: Detection;
	cameraName: string;
	timestamp: Date;
}

const NOTIFICATION_DURATION = 5000; // 5 seconds

function createNotificationsStore() {
	const { subscribe, update } = writable<Notification[]>([]);
	const timers = new Map<string, ReturnType<typeof setTimeout>>();

	function addNotification(detection: Detection, cameraName: string) {
		const notification: Notification = {
			id: `notif-${detection.id}-${Date.now()}`,
			detection,
			cameraName,
			timestamp: new Date()
		};

		update((notifications) => [...notifications, notification]);

		// Auto-dismiss after duration
		const timer = setTimeout(() => {
			removeNotification(notification.id);
		}, NOTIFICATION_DURATION);

		timers.set(notification.id, timer);
	}

	function removeNotification(id: string) {
		// Clear the timer if it exists
		const timer = timers.get(id);
		if (timer) {
			clearTimeout(timer);
			timers.delete(id);
		}

		update((notifications) => notifications.filter((n) => n.id !== id));
	}

	function clearAll() {
		// Clear all timers
		timers.forEach((timer) => clearTimeout(timer));
		timers.clear();

		update(() => []);
	}

	return {
		subscribe,
		addNotification,
		removeNotification,
		clearAll
	};
}

export const notifications = createNotificationsStore();







