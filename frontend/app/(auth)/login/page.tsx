"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch(
      `${API_URL}/api/token/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    console.log(data);
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    const meresponse = await fetch(
      `${API_URL}/api/users/me/`,
      {
        headers: {
          Authorization: `Bearer ${data.access}`,
        }
      })
    console.log(meresponse.status);
    const meData = await meresponse.json()

    localStorage.setItem("is_staff", String(meData.is_staff),)

    router.push("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4">

          <div>
            <label className="block mb-1">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black p-2 rounded"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}