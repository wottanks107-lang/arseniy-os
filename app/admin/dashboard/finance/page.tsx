"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowLeft,
  Loader2,
  Calendar,
} from "lucide-react";
import Link from "next/link";

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string | null;
  description: string | null;
  date: string;
  created_at: string;
};

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Состояние формы
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<"income" | "expense">("expense");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("finance")
      .select("*")
      .order("date", { ascending: false });

    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || isNaN(Number(newAmount))) return;

    setIsAdding(true);
    const { error } = await supabase.from("finance").insert({
      amount: Number(newAmount),
      type: newType,
      category: newCategory || null,
      description: newDescription || null,
      date: new Date().toISOString(),
    });

    if (!error) {
      setNewAmount("");
      setNewCategory("");
      setNewDescription("");
      fetchTransactions();
    }
    setIsAdding(false);
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from("finance").delete().eq("id", id);
    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Подсчет итогов
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpense;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              Финансы
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Сводка (Summary) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-[#171717] border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-neutral-400" />
              <span className="text-sm text-neutral-400">Общий баланс</span>
            </div>
            <p className={`text-2xl font-bold ${balance >= 0 ? "text-white" : "text-red-400"}`}>
              {formatMoney(balance)}
            </p>
          </div>

          <div className="bg-[#171717] border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-neutral-400">Доходы</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">
              {formatMoney(totalIncome)}
            </p>
          </div>

          <div className="bg-[#171717] border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="text-sm text-neutral-400">Расходы</span>
            </div>
            <p className="text-2xl font-bold text-red-400">
              {formatMoney(totalExpense)}
            </p>
          </div>
        </motion.div>

        {/* Форма добавления */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#171717] border border-neutral-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            Новая операция
          </h2>
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as "income" | "expense")}
                className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="expense">Расход (красный)</option>
                <option value="income">Доход (белый/зеленый)</option>
              </select>
              
              <input
                type="number"
                step="0.01"
                placeholder="Сумма"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              
              <input
                type="text"
                placeholder="Категория (например, Еда)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              
              <button
                type="submit"
                disabled={isAdding}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Добавить
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Описание (необязательно)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </form>
        </motion.div>

        {/* Список операций */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white mb-4">История операций</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12 text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Загрузка...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 bg-[#171717] border border-neutral-800 rounded-xl">
              <Wallet className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Операций пока нет.</p>
            </div>
          ) : (
            <AnimatePresence>
              {transactions.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group flex items-center justify-between p-4 bg-[#171717] border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        t.type === "income"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {t.type === "income" ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white">
                        {t.category || "Без категории"}
                      </h3>
                      {t.description && (
                        <p className="text-sm text-neutral-500">{t.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(t.date).toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-lg font-bold ${
                        t.type === "income" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatMoney(t.amount)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}