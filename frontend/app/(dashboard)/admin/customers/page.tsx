"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

interface Customer {
    id: Number,
    name: string,
    cpf: String,
    phone: string,
    email: string,
    is_active: Boolean,

}

export default function CustomerPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] =
        useState<Customer | null>(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [cpf, setCpf] = useState('')
    const router = useRouter();

    async function fetchCustomers() {

        const token = localStorage.getItem('access')

        const response = await fetch(
            `${API_URL}/api/customers/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )

        if (response.ok) {
            const data = await response.json();
            setCustomers(data);
        } else {
            toast.error('error ao buscar clientes')
        }
    }

    async function handleCreateCustomer() {
        const token = localStorage.getItem('access')

        const response = await fetch(
            `${API_URL}/api/customers/`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    cpf,
                    phone,
                    email,
                    is_active: isActive
                })
            })

        if (response.ok) {
            toast.success('cliente criado com sucesso')

            setIsActive(true);
            setName('')
            setPhone('')
            setEmail('')
            setCpf('')

            await fetchCustomers()
        }
    }

    async function handleUpdateCustomer() {

        if (!selectedCustomer) return;

        const token = localStorage.getItem('access')

        const response = await fetch(
            `${API_URL}/api/customers/${selectedCustomer.id}/`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    cpf,
                    phone,
                    email,
                })
            })

        if (response.ok) {
            toast.success('cliente atualizado com sucesso')

            setSelectedCustomer(null);
            setIsActive(true);
            setName('')
            setPhone('')
            setEmail('')
            setCpf('')

            await fetchCustomers()

        }
    }

    async function handleToggleCustomer(customer: Customer) {

        const token = localStorage.getItem('access')

        const response = await fetch(
            `${API_URL}/api/customers/${customer.id}/`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    is_active: !customer.is_active,
                })
            })

        if (response.ok) {
            toast.success(customer.is_active ? 'Cliente desativado' : 'CLiente ativado')
        } else { toast.error("Erro ao alterar cliente"); }

        await fetchCustomers()

    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <main className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                Clientes
            </h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    if (selectedCustomer) {
                        handleUpdateCustomer();
                    } else {
                        handleCreateCustomer();
                    }
                }}
                className="flex flex-col gap-4 mb-10"
            >

                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded"
                />

                <input
                    type="text"
                    placeholder="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="border p-2 rounded"
                />

                <input
                    type="text"
                    placeholder="Telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border p-2 rounded"
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                />

                <button
                    type="submit"
                    className="border px-4 py-2 rounded"
                >
                    {selectedCustomer
                        ? "Atualizar Cliente"
                        : "Criar Cliente"}
                </button>

            </form>

            <div className="grid gap-4">

                {customers.map((customer) => (

                    <div
                        key={customer.id}
                        className="border p-4 rounded"
                    >

                        <h2 className="font-bold">
                            {customer.name}
                        </h2>

                        <p>{customer.phone}</p>

                        <p>{customer.email}</p>

                        <p>
                            Ativo:
                            {" "}
                            {customer.is_active
                                ? "Sim"
                                : "Não"}
                        </p>

                        <div className="flex gap-2 mt-4">

                            <button
                                onClick={() => {

                                    setSelectedCustomer(customer);

                                    setName(customer.name);
                                    setPhone(customer.phone);
                                    setEmail(customer.email);

                                }}
                                className="border px-3 py-1 rounded"
                            >
                                Editar
                            </button>

                            <button
                                className="border px-3 py-1 rounded"
                                type="button"
                                onClick={() => {
                                    setSelectedCustomer(null);

                                    setName("");
                                    setPhone("");
                                    setEmail("");

                                    setIsActive(true);
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={() =>
                                    handleToggleCustomer(customer)
                                }
                                className="border px-3 py-1 rounded"
                            >
                                {customer.is_active
                                    ? "Desativar"
                                    : "Ativar"}
                            </button>

                            <button
                                onClick={() =>
                                    router.push(`/admin/customers/${customer.id}`)
                                }
                                className="border px-3 py-1 rounded"
                            >
                                Histórico
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </main>
    )
}