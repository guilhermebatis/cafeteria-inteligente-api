"use client";
import CouponService from "@/services/couponService";
import { Coupon, CreateCoupon, UpdateCoupon } from "@/types/coupon";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    const [showCouponModal, setShowCouponModal] = useState(false);

    const [editingCoupon, setEditingCoupon] =
        useState<Coupon | null>(null);



    async function fetchCoupons() {
        try {
            const response = await CouponService.getCoupon();
            setCoupons(response)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao buscar coupons.");
            }
            return false
        }
    }

    async function getCouponById(id: number) {
        try {
            const response = await CouponService.getCouponId(id);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao buscar coupon.");
            }
            return false
        }
    }

    async function createCoupon(data: CreateCoupon) {
        try {
            const response = await CouponService.createCoupon(data);
            toast.success("Cupom criado com sucesso!");
            fetchCoupons();
            return response;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao criar coupon.");
            }
            return false
        }
    }

    async function updateCoupon(id: number, data: UpdateCoupon) {
        try {
            await CouponService.updateCoupon(id, data);
            fetchCoupons()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao atualizar o coupon.");
            }
            return false
        }
    }

    async function deleteCoupon(id: number) {
        try {
            await CouponService.deleteCoupon(id);
            fetchCoupons()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao deletar o coupon.");
            }
            return false
        }
    }

    useEffect(() => {
        fetchCoupons();
    }, []);


    return (
        <main className="p-10">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold">
                        Cupons
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Gerencie os cupons de desconto da cafeteria.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingCoupon(null);
                        setShowCouponModal(true);
                    }}
                    className="border px-5 py-3 rounded-lg font-semibold"
                >
                    + Criar cupom
                </button>
            </div>

            {/* TABLE */}
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-4">
                                Código
                            </th>

                            <th className="text-left p-4">
                                Desconto
                            </th>

                            <th className="text-left p-4">
                                Desconto máximo
                            </th>

                            <th className="text-left p-4">
                                Validade
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>

                            <th className="text-left p-4">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {coupons.map((coupon) => (
                            <tr
                                key={coupon.id}
                                className="border-b last:border-b-0"
                            >
                                <td className="p-4 font-semibold">
                                    {coupon.code}
                                </td>

                                <td className="p-4">
                                    {coupon.discount_percent}%
                                </td>

                                <td className="p-4">
                                    R${" "}
                                    {Number(
                                        coupon.max_discount_value
                                    ).toFixed(2)}
                                </td>

                                <td className="p-4">
                                    {new Date(
                                        coupon.expired
                                    ).toLocaleDateString("pt-BR")}
                                </td>

                                <td className="p-4">
                                    <span
                                        className={
                                            coupon.is_active
                                                ? "text-green-600 font-semibold"
                                                : "text-red-600 font-semibold"
                                        }
                                    >
                                        {coupon.is_active
                                            ? "Ativo"
                                            : "Inativo"}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex gap-2">
                                        {/* EDITAR */}
                                        <button
                                            onClick={async () => {
                                                const response =
                                                    await getCouponById(
                                                        coupon.id
                                                    );

                                                if (!response) return;

                                                setEditingCoupon(response);
                                                setShowCouponModal(true);
                                            }}
                                            className="border px-3 py-1 rounded"
                                        >
                                            Editar
                                        </button>

                                        {/* EXCLUIR */}
                                        <button
                                            onClick={() => {
                                                deleteCoupon(
                                                    coupon.id
                                                );
                                            }}
                                            className="border px-3 py-1 rounded"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* EMPTY STATE */}
                {coupons.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        Nenhum cupom cadastrado.
                    </div>
                )}
            </div>

            {/* MODAL CRIAR / EDITAR */}
            {showCouponModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-black p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">
                            {editingCoupon
                                ? "Editar cupom"
                                : "Criar cupom"}
                        </h2>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();

                                const form =
                                    e.currentTarget;

                                const formData =
                                    new FormData(form);

                                const data: Coupon = {
                                    id:
                                        editingCoupon?.id ??
                                        0,

                                    code:
                                        String(
                                            formData.get(
                                                "code"
                                            )
                                        ).toUpperCase(),

                                    max_discount_value:
                                        Number(
                                            formData.get(
                                                "max_discount_value"
                                            )
                                        ),

                                    discount_percent:
                                        Number(
                                            formData.get(
                                                "discount_percent"
                                            )
                                        ),

                                    created_at:
                                        editingCoupon?.created_at ??
                                        new Date().toISOString(),

                                    expired:
                                        String(
                                            formData.get(
                                                "expired"
                                            )
                                        ),

                                    is_active:
                                        formData.get(
                                            "is_active"
                                        ) === "on",
                                };

                                if (editingCoupon) {
                                    await updateCoupon(
                                        editingCoupon.id,
                                        data
                                    );

                                    toast.success(
                                        "Cupom atualizado com sucesso!"
                                    );
                                } else {
                                    await createCoupon(
                                        data
                                    );
                                }

                                setShowCouponModal(false);
                                setEditingCoupon(null);
                            }}
                            className="flex flex-col gap-4"
                        >
                            {/* CÓDIGO */}
                            <div>
                                <label className="block mb-1 font-semibold">
                                    Código
                                </label>

                                <input
                                    name="code"
                                    type="text"
                                    required
                                    defaultValue={
                                        editingCoupon?.code ??
                                        ""
                                    }
                                    placeholder="Ex: CAFE10"
                                    className="border p-3 rounded w-full"
                                />
                            </div>

                            {/* DESCONTO */}
                            <div>
                                <label className="block mb-1 font-semibold">
                                    Desconto (%)
                                </label>

                                <input
                                    name="discount_percent"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    required
                                    defaultValue={
                                        editingCoupon?.discount_percent ??
                                        ""
                                    }
                                    placeholder="10"
                                    className="border p-3 rounded w-full"
                                />
                            </div>

                            {/* DESCONTO MÁXIMO */}
                            <div>
                                <label className="block mb-1 font-semibold">
                                    Desconto máximo
                                </label>

                                <input
                                    name="max_discount_value"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    defaultValue={
                                        editingCoupon?.max_discount_value ??
                                        ""
                                    }
                                    placeholder="10.00"
                                    className="border p-3 rounded w-full"
                                />
                            </div>

                            {/* VALIDADE */}
                            <div>
                                <label className="block mb-1 font-semibold">
                                    Data de expiração
                                </label>

                                <input
                                    name="expired"
                                    type="datetime-local"
                                    required
                                    defaultValue={
                                        editingCoupon?.expired
                                            ? new Date(
                                                editingCoupon.expired
                                            )
                                                .toISOString()
                                                .slice(
                                                    0,
                                                    16
                                                )
                                            : ""
                                    }
                                    className="border p-3 rounded w-full"
                                />
                            </div>

                            {/* STATUS */}
                            <label className="flex items-center gap-2">
                                <input
                                    name="is_active"
                                    type="checkbox"
                                    defaultChecked={
                                        editingCoupon
                                            ? editingCoupon.is_active
                                            : true
                                    }
                                />

                                <span>
                                    Cupom ativo
                                </span>
                            </label>

                            {/* BUTTONS */}
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="submit"
                                    className="border px-5 py-3 rounded font-semibold flex-1"
                                >
                                    {editingCoupon
                                        ? "Salvar alterações"
                                        : "Criar cupom"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCouponModal(
                                            false
                                        );
                                        setEditingCoupon(null);
                                    }}
                                    className="border px-5 py-3 rounded flex-1"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );

}