const API_URL = process.env.NEXT_PUBLIC_API_URL;

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

function getToken() {
    const token = localStorage.getItem('access');
    if (token == null) {
        throw new Error('Token is null.');
    }
    return token;
}

async function request<T>(method: HttpMethod, caminho: string, data?: unknown) {
    const token = getToken();

    const response = await fetch(`${API_URL}${caminho}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
    });
    if (response.status === 204) {
        return;
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

async function post<T>(caminho: string, data: unknown) {
    return request<T>('POST', caminho, data);
}

async function get<T>(caminho: string) {
    return request<T>('GET', caminho);
}

async function update<T>(caminho: string, data: unknown) {
    return request<T>('PATCH', caminho, data);
}

async function remove<T>(caminho: string) {
    return request<T>('DELETE', caminho);
}
export { get, post, update, remove };
