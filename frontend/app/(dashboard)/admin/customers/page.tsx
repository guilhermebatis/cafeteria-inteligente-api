"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Customer, CreateCustomer, UpdateCustomer, ToggleCustomer } from "@/types/customers";
import CustomerService from '@/services/customersService'

export default function CustomerPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] =
        useState<Customer | null>(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [cpf, setCpf] = useState('')
    const router = useRouter();

    function resetForm() {
        setIsActive(true);
        setName('')
        setPhone('')
        setEmail('')
        setCpf('')
    }

    async function fetchCustomers() {
        try {
            const response = await CustomerService.getCustomers()
            setCustomers(response)

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }

    }

    async function handleCreateCustomer() {

        const data: CreateCustomer = {
            name,
            cpf,
            phone,
            email,
            is_active: isActive
        }

        try {
            await CustomerService.createCustomer(data)
            resetForm()
            toast.success('Cliente criado com sucesso')
            await fetchCustomers()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }
    }


    async function handleUpdateCustomer() {

        if (!selectedCustomer) return;

        const data: UpdateCustomer = {
            name,
            cpf,
            phone,
            email,
            is_active: isActive
        }

        try {
            await CustomerService.updateCustomer(selectedCustomer.id, data)
            resetForm()
            setSelectedCustomer(null)
            toast.success('Cliente atualizado com sucesso')
            await fetchCustomers()

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }
    }

    async function handleToggleCustomer(customer: Customer) {

        const data: ToggleCustomer = {
            is_active: !customer.is_active
        }

        try {
            await CustomerService.toggleCustomer(customer.id, data)
            toast.success(customer.is_active ? 'Cliente desativado' : 'CLiente ativado')
            await fetchCustomers()

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }


    }

    async function handleDeleteCustomer(id: number) {

        try {
            await CustomerService.deleteCustomer(id)
            toast.success('Cliente deletado com sucesso')
            await fetchCustomers()

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado.");
            }
        }
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
                                    setCpf(customer.cpf);
                                    setPhone(customer.phone);
                                    setEmail(customer.email);
                                    setIsActive(customer.is_active);

                                }}
                                className="border px-3 py-1 rounded"
                            >
                                Editar
                            </button>

                            <button
                                className="border px-3 py-1 rounded"
                                type="button"
                                onClick={() => {
                                    handleDeleteCustomer(customer.id);
                                    setSelectedCustomer(null);

                                    resetForm()
                                }}
                            >
                                Remover
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