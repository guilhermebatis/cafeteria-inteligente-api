"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, CreateUser, UpdateUser, DisableUser } from "@/types/users";
import UserService from "@/services/userService";

export default function UsersPage() {
    const [users, setUser] = useState<User[]>([]);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isStaff, setIsStaff] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [selectedUser, setSelectedUser] =
        useState<User | null>(null);

    function resetForm() {
        setUsername("");
        setEmail("");
        setPassword("");
        setIsStaff(false);
        setIsActive(true);
    }

    async function fetchUsers() {
        try {
            const response = await UserService.getUsers()
            setUser(response)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao carregar os usuarios.");
            }
        }
    }


    async function handleCreateUser() {

        const data: CreateUser = {
            username,
            email,
            password,
            is_staff: isStaff,
            is_active: isActive,
        }

        try {
            await UserService.createUser(data)
            resetForm()
            toast.success('Usuário criado com sucesso')
            await fetchUsers();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao criar os usuario.");
            }
        }
    }

    async function handleUpdateUser() {

        if (!selectedUser) return;

        const data: UpdateUser = {
            username,
            email,
            password,
            is_staff: isStaff,
            is_active: isActive,
        }
        try {
            await UserService.updateUser(selectedUser.id, data)
            resetForm()
            await fetchUsers();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao atualizar usuário");
            }
        }
    }

    async function handleDisableUser(user: User) {

        const data: DisableUser = {
            is_active: !user.is_active,
        }

        try {
            await UserService.disableUser(user.id, data)

            if (data.is_active) {
                toast.success("Usuário ativado")
            } else {
                toast.success("Usuário desativado")
            }

            setSelectedUser(null);
            await fetchUsers();

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("error ao desativar o Usuário");
            }
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
