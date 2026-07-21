const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
    const token = localStorage.getItem('access')
    if (token == null){
          throw new Error("Token is null.")
    }
    return token
}

async function post(caminho: string, data: any) {
    
    const response = await fetch(`${API_URL}${caminho}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data) 
        },
    )

    if (!response.ok) {
        throw new Error("POST request failed.")
    }
    
    return await response.json();
    
    }

async function get(caminho: string) {
    const response = await fetch(`${API_URL}${caminho}`,
        {   
            method:"GET",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            }
            
        }
    )

    if (!response.ok) {
    throw new Error("GET request failed.")
    }
    
    return await response.json();
    
    }


async function update(caminho: string, data: any) {
    const response = await fetch(`${API_URL}${caminho}`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data) 
        }
    )
    if (!response.ok) {
    throw new Error("PATCH request failed.")
    }
    
    return await response.json();
    
}

async function remove(caminho: string) {
        const response = await fetch(`${API_URL}${caminho}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        }
    )
    if (!response.ok) {
    throw new Error("DELETE request failed.")
    }
    
    return await response.json();
}

