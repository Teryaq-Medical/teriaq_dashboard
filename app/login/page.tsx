"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ 1. Login (sets cookie)
      await AuthService.login(email, password);

      // ✅ 2. wait a bit (important for cookies)
      await new Promise((res) => setTimeout(res, 150));

      // ✅ 3. Get current user
      const user = await AuthService.getCurrentUser();

      console.log("USER:", user);

      // ✅ SUPERUSER → dashboard
      if (user.is_superuser) {
        router.push("/dashboard");
        return;
      }

      // ✅ ENTITY USERS → dynamic profile
      if (user.user_type && user.entity_id) {
        router.push(`/entities/${user.user_type}/${user.entity_id}`);
        return;
      }

      // ⚠️ No entity linked
      setError("This account is not linked to any entity yet.");

    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Teriaq</h1>
          <p className="text-gray-500 text-sm mt-2">
            Login to your medical dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Teriaq
        </p>

      </div>
    </div>
  );
}