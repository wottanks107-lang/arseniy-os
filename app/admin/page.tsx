"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError("Произошла ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <div className="bg-[#171717] border border-neutral-800 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Вход в админку
          </h1>
          <p className="text-neutral-400 text-center mb-8">
            Введи свои данные для доступа
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-800">
            <p className="text-neutral-500 text-sm text-center">
              Нет аккаунта?{" "}
              <Link
                href="/admin/register"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}