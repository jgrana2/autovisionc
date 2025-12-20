<script lang="ts">
	import { Camera, Eye, EyeOff, Loader2 } from 'lucide-svelte';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardTitle from '$lib/components/ui/card-title.svelte';
	import CardDescription from '$lib/components/ui/card-description.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		const result = await auth.login(email, password);
		
		loading = false;
		
		if (result.success) {
			await goto('/');
		} else {
			error = result.error || 'Error al iniciar sesión';
		}
	}
</script>

<svelte:head>
	<title>Iniciar sesión - AutoVision</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4">
	<div class="w-full max-w-md">
		<!-- Logo -->
		<div class="flex flex-col items-center mb-8">
			<div class="flex h-24 w-64 items-center justify-center rounded-2xl bg-primary">
				<img src="/logow.png" alt="AutoVision Logo" class="h-64 w-64" />
			</div>
			<h1 class="mt-4 text-2xl font-bold tracking-tight text-black">AutoVision</h1>
			<p class="text-sm text-muted-foreground">Sistema de Detección de Placas</p>
		</div>

		<Card class="border-zinc-200 shadow-xl">
			<CardHeader class="space-y-1">
				<CardTitle class="text-2xl">Iniciar sesión</CardTitle>
				<CardDescription>
					Ingrese sus credenciales para acceder al sistema
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onsubmit={handleSubmit} class="flex flex-col gap-4">
					{#if error}
						<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
							{error}
						</div>
					{/if}

					<div class="flex flex-col gap-2">
						<Label for="email">Correo electrónico</Label>
						<Input
							id="email"
							type="email"
							placeholder="correo@ejemplo.com"
							bind:value={email}
							disabled={loading}
							required
						/>
					</div>

					<div class="flex flex-col gap-2">
						<Label for="password">Contraseña</Label>
						<div class="relative">
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								placeholder="••••••••"
								bind:value={password}
								disabled={loading}
								required
								class="pr-10"
							/>
							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{#if showPassword}
									<EyeOff class="h-4 w-4" />
								{:else}
									<Eye class="h-4 w-4" />
								{/if}
							</button>
						</div>
					</div>

					<Button type="submit" class="mt-2 w-full" disabled={loading}>
						{#if loading}
							<Loader2 class="h-4 w-4 animate-spin" />
							Iniciando sesión...
						{:else}
							Iniciar sesión
						{/if}
					</Button>

					<p class="text-center text-sm text-muted-foreground">
						¿No tiene una cuenta?
						<a href="/register" class="font-medium text-primary hover:underline">
							Regístrese
						</a>
					</p>
				</form>
			</CardContent>
		</Card>

		<p class="mt-6 text-center text-xs text-muted-foreground">
			© 2025 AutoVision. Todos los derechos reservados.
		</p>
	</div>
</div>


