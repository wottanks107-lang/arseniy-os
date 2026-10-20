"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Аккаунт создан! Теперь войди на странице входа.");
      setTimeout(() => router.push("/admin"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к входу
        </Link>

        <div className="bg-[#171717] border border-neutral-800 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Регистрация
          </h1>
          <p className="text-neutral-400 text-center mb-8">
            Создай аккаунт для доступа к админке
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Пароль (минимум 6 символов)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {message && (
              <div
                className={`p-3 border rounded-lg text-sm ${
                  message.includes("создан") || message.includes("войди")
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}