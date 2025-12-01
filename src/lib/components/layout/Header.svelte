<script lang="ts">
	import { User, LogOut, ChevronDown, Camera } from 'lucide-svelte';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import DropdownMenu from '$lib/components/ui/dropdown-menu.svelte';
	import DropdownItem from '$lib/components/ui/dropdown-item.svelte';
	import Separator from '$lib/components/ui/separator.svelte';

	let dropdownOpen = $state(false);
	const user = $derived($auth.user);

	async function handleLogout() {
		auth.logout();
		await goto('/login');
	}
</script>

<header class="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
	<!-- Logo -->
	<div class="flex items-center gap-3">
		<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
			<Camera class="h-5 w-5 text-primary-foreground" />
		</div>
		<div class="flex flex-col">
			<span class="text-lg font-bold tracking-tight">AutoVision</span>
			<span class="text-xs text-muted-foreground">Sistema de Detección de Placas</span>
		</div>
	</div>

	<!-- User Menu -->
	<div class="flex items-center gap-4">
		{#if user}
			<DropdownMenu bind:open={dropdownOpen}>
				{#snippet trigger()}
					<div class="flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors hover:bg-accent">
						<div class="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
							<User class="h-4 w-4" />
						</div>
						<span class="text-sm font-medium">{user.nombre}</span>
						<ChevronDown class="h-4 w-4 text-muted-foreground" />
					</div>
				{/snippet}
				<div class="w-48">
					<div class="px-2 py-1.5">
						<p class="text-sm font-medium">{user.nombre}</p>
						<p class="text-xs text-muted-foreground">{user.email}</p>
					</div>
					<Separator class="my-1" />
					<DropdownItem onclick={() => (dropdownOpen = false)}>
						<User class="mr-2 h-4 w-4" />
						Perfil
					</DropdownItem>
					<DropdownItem onclick={handleLogout} destructive>
						<LogOut class="mr-2 h-4 w-4" />
						Cerrar sesión
					</DropdownItem>
				</div>
			</DropdownMenu>
		{/if}
	</div>
</header>


