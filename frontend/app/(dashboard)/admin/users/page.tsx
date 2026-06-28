"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
}

export default function UsersPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [users, setUser] = useState<User[]>([]);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isStaff, setIsStaff] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [selectedUser, setSelectedUser] =
        useState<User | null>(null);

    async function fetchUsers() {
        const token = localStorage.getItem('access')

        const response = await fetch(
            `${API_URL}/api/users/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        if (!response.ok) {
            toast.error('error ao buscar usuarios')
            return;
        }

        const data = await response.json();
        setUser(data)
    }

    async function handleCreateUser() {
        const token = localStorage.getItem('access')

        const response = await fetch(
            `${API_URL}/api/users/`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    is_staff: isStaff,
                    is_active: isActive,
                })
            }
        )
        if (response.ok) {

            toast.success('Usuário criado com sucesso')

            setUsername("");
            setEmail("");
            setPassword("");

            setIsStaff(false);
            setIsActive(true);

            await fetchUsers();
        } else {
            const data = await response.json();

            console.log(data);

            toast.error('error ao criar login')
            return;
        }
    }

    async function handleUpdateUser() {

        if (!selectedUser) return;

        const token = localStorage.getItem('access')

        const response = await fetch(
            `${API_URL}/api/users/${selectedUser.id}/`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    is_staff: isStaff,
                    is_active: isActive,
                })
            })

        if (response.ok) {
            toast.success("Usuário atualizado")

            setSelectedUser(null);

            setUsername("");
            setEmail("");
            setPassword("");

            setIsStaff(false);
            setIsActive(true);

            await fetchUsers();

        } else {

            const data = await response.json();

            console.log(data);

            toast.error("Erro ao atualizar usuário");

        }
    }

    async function handleDisableUser(user: User) {

        const token = localStorage.getItem('access')

        const response = await fetch(
            `${API_URL}/api/users/${user.id}/`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    is_active: !user.is_active,
                })
            })

        if (response.ok) {
            toast.success("Usuário desativado")

            setSelectedUser(null);
            await fetchUsers();
        } else {
            toast.error('error ao desativar o Usuário')
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <main className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                Usuários
            </h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedUser) {
                        handleUpdateUser();
                    } else {
                        handleCreateUser();
                    }
                }}
                className="flex flex-col gap-4 mb-10"
            >

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <label className="flex gap-2">

                    <input
                        type="checkbox"
                        checked={isStaff}
                        onChange={(e) =>
                            setIsStaff(e.target.checked)
                        }
                    />

                    Funcionário

                </label>

                <label className="flex gap-2">

                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) =>
                            setIsActive(e.target.checked)
                        }
                    />

                    Ativo

                </label>

                <button
                    type="submit"
                    className="border px-4 py-2 rounded"
                >
                    {selectedUser
                        ? "Atualizar Usuário"
                        : "Criar Usuário"}
                </button>

            </form>

            <div className="grid gap-4">

                {users.map((user) => (

                    <div
                        key={user.id}
                        className="border p-4 rounded"
                    >

                        <h2 className="font-bold">
                            {user.username}
                        </h2>

                        <p>
                            {user.email}
                        </p>

                        <p>
                            Funcionário:
                            {" "}
                            {user.is_staff ? "Sim" : "Não"}
                        </p>

                        <p>
                            Ativo:
                            {" "}
                            {user.is_active ? "Sim" : "Não"}
                        </p>

                        <div className="flex gap-2 mt-4">

                            <button
                                onClick={() => {
                                    setSelectedUser(user);

                                    setUsername(user.username);
                                    setEmail(user.email);

                                    setIsStaff(user.is_staff);
                                    setIsActive(user.is_active);
                                }}
                                className="border px-3 py-1 rounded"
                            >
                                Editar
                            </button>

                            <button
                                onClick={() => handleDisableUser(user)}
                                className="border px-3 py-1 rounded"
                            >
                                {user.is_active ? "Desativar" : "Ativar"}
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </main>
    );
}
