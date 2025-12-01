import { API_URL } from '$lib/config';

export interface ApiUser {
	id: string;
	email: string;
	nombre: string;
}

export interface AuthResponse {
	token: string;
	user: ApiUser;
}

export interface ApiPlate {
	id: number;
	plate_number: string;
	image_filename: string;
	brand: string;
	model: string;
	color: string;
	body_type: string;
	camera_id: string;
	timestamp: string;
}

export interface PlatesResponse {
	plates: ApiPlate[];
	total: number;
}

function authHeaders(token: string): HeadersInit {
	return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Error de conexión' }));
		throw new Error(error.detail || 'Error del servidor');
	}
	return response.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/api/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});
	return handleResponse<AuthResponse>(response);
}

export async function register(
	nombre: string,
	email: string,
	password: string
): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/api/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ nombre, email, password })
	});
	return handleResponse<AuthResponse>(response);
}

export async function getMe(token: string): Promise<ApiUser> {
	const response = await fetch(`${API_URL}/api/auth/me`, {
		headers: authHeaders(token)
	});
	return handleResponse<ApiUser>(response);
}

export async function getPlates(
	token: string,
	params?: { camera_id?: string; placa?: string; limit?: number; offset?: number }
): Promise<PlatesResponse> {
	const searchParams = new URLSearchParams();
	if (params?.camera_id) searchParams.set('camera_id', params.camera_id);
	if (params?.placa) searchParams.set('placa', params.placa);
	if (params?.limit) searchParams.set('limit', params.limit.toString());
	if (params?.offset) searchParams.set('offset', params.offset.toString());

	const url = `${API_URL}/api/plates${searchParams.toString() ? `?${searchParams}` : ''}`;
	const response = await fetch(url, { headers: authHeaders(token) });
	return handleResponse<PlatesResponse>(response);
}

export async function deletePlate(token: string, id: number): Promise<void> {
	const response = await fetch(`${API_URL}/api/plates/${id}`, {
		method: 'DELETE',
		headers: authHeaders(token)
	});
	await handleResponse(response);
}
