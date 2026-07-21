const API_URL = process.env.NEXT_PUBLIC_API_URL;

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

function getToken() {
    const token = localStorage.getItem('access');
    if (token == null) {
        throw new Error('Token is null.');
    }
    return token;
}

async function request(method: HttpMethod, caminho: string, data?: unknown) {
    const token = getToken();

    const response = await fetch(`${API_URL}${caminho}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
        throw new Error(`${method} request failed.`);
    }
    return await response.json();
}

async function post(caminho: string, data: unknown) {
    return request('POST', caminho, data);
}

async function get(caminho: string) {
    return request('GET', caminho);
}

async function update(caminho: string, data: unknown) {
    return request('PATCH', caminho, data);
}

async function remove(caminho: string) {
    return request('DELETE', caminho);
}
export { get, post, update, remove };
