const API_URL = process.env.NEXT_PUBLIC_API_URL;

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

function getToken() {
    const token = localStorage.getItem('access');
    if (token == null) {
        throw new Error('Token is null.');
    }
    return token;
}

async function request<T>(
    method: HttpMethod,
    caminho: string,
    data?: unknown,
    requiresAuth: boolean = true
) {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (requiresAuth) {
        headers.Authorization = `Bearer ${getToken()}`;
    }

    const response = await fetch(`${API_URL}${caminho}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 204) {
        return undefined as T;
    }

    let json;
    try {
        json = await response.json();
    } catch {
        throw new Error(`${method} request failed.`);
    }
    if (!response.ok) {
        throw new Error(json.detail ?? json.message ?? json.error ?? `${method} request failed.`);
    }
    return json as T;
}

async function post<T>(caminho: string, data: unknown, requiresAuth = true) {
    return request<T>('POST', caminho, data, requiresAuth);
}

async function get<T>(caminho: string, requiresAuth = true) {
    return request<T>('GET', caminho, undefined, requiresAuth);
}

async function update<T>(caminho: string, data: unknown, requiresAuth = true) {
    return request<T>('PATCH', caminho, data, requiresAuth);
}

async function remove<T>(caminho: string, requiresAuth = true) {
    return request<T>('DELETE', caminho, undefined, requiresAuth);
}
export { get, post, update, remove };
