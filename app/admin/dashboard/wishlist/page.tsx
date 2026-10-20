"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  ExternalLink,
  TrendingUp,
  Target,
} from "lucide-react";
import Link from "next/link";

type Wish = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  saved_amount: number;
  priority: string;
  link: string | null;
  created_at: string;
};

export default function WishlistPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newLink, setNewLink] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("wishlist")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setWishes(data);
    }
    setLoading(false);
  };

  const handleAddWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;

    setIsAdding(true);
    const { error } = await supabase.from("wishlist").insert({
      title: newTitle,
      price: Number(newPrice),
      link: newLink || null,
      saved_amount: 0,
      priority: "medium",
    });

    if (!error) {
      setNewTitle("");
      setNewPrice("");
      setNewLink("");
      fetchWishes();
    }
    setIsAdding(false);
  };

  const addToSavings = async (wish: Wish, amount: number) => {
    const newSaved = wish.saved_amount + amount;
    const { error } = await supabase
      .from("wishlist")
      .update({ saved_amount: newSaved })
      .eq("id", wish.id);

    if (!error) {
      fetchWishes();
    }
  };

  const deleteWish = async (id: string) => {
    const { error } = await supabase.from("wishlist").delete().eq("id", id);
    if (!error) {
      setWishes((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              Хотелки
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#171717] border border-neutral-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-400" />
            Добавить новую цель
          </h2>
          <form onSubmit={handleAddWish} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Название (например, MacBook)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="md:col-span-2 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
              <input
                type="number"
                placeholder="Цена (₽)"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="url"
                placeholder="Ссылка на товар (необязательно)"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="md:col-span-3 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isAdding}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Добавить
              </button>
            </div>
          </form>
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Мои цели
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Загрузка...
            </div>
          ) : wishes.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 bg-[#171717] border border-neutral-800 rounded-xl">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Список хотелок пуст. Добавь свою первую цель!</p>
            </div>
          ) : (
            <AnimatePresence>
              {wishes.map((wish) => {
                const percent = wish.price > 0 ? Math.min(100, Math.round((wish.saved_amount / wish.price) * 100)) : 0;
                const isCompleted = percent >= 100;

                return (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`group bg-[#171717] border rounded-xl p-6 transition-all ${
                      isCompleted ? "border-emerald-500/50" : "border-neutral-800 hover:border-purple-500/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`text-xl font-bold ${isCompleted ? "text-emerald-400" : "text-white"}`}>
                            {wish.title}
                          </h3>
                          {wish.link && (
                            <a
                              href={wish.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-500 hover:text-purple-400 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-neutral-400">
                          Нужно: {formatMoney(wish.price)} · Накоплено: {formatMoney(wish.saved_amount)}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteWish(wish.id)}
                        className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <span>Прогресс</span>
                        <span className={isCompleted ? "text-emerald-400 font-bold" : ""}>{percent}%</span>
                      </div>
                      <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            isCompleted ? "bg-emerald-500" : "bg-purple-500"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => addToSavings(wish, 100)}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm rounded-lg transition-colors flex items-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3" /> +100
                      </button>
                      <button
                        onClick={() => addToSavings(wish, 500)}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm rounded-lg transition-colors flex items-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3" /> +500
                      </button>
                      <button
                        onClick={() => addToSavings(wish, 1000)}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm rounded-lg transition-colors flex items-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3" /> +1000
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}