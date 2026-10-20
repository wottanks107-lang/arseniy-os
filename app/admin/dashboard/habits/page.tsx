"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Dumbbell,
  ArrowLeft,
  Loader2,
  Check,
  Flame,
  Calendar,
} from "lucide-react";
import Link from "next/link";

type Habit = {
  id: string;
  title: string;
  completed_dates: string[];
  created_at: string;
};

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setHabits(data);
    }
    setLoading(false);
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsAdding(true);
    const { error } = await supabase.from("habits").insert({
      title: newTitle,
      completed_dates: [],
    });

    if (!error) {
      setNewTitle("");
      fetchHabits();
    }
    setIsAdding(false);
  };

  const toggleToday = async (habit: Habit) => {
    const today = new Date().toISOString().split("T")[0];
    const dates = habit.completed_dates || [];
    const isCompletedToday = dates.includes(today);

    const newDates = isCompletedToday
      ? dates.filter((d) => d !== today)
      : [...dates, today];

    const { error } = await supabase
      .from("habits")
      .update({ completed_dates: newDates })
      .eq("id", habit.id);

    if (!error) {
      fetchHabits();
    }
  };

  const deleteHabit = async (id: string) => {
    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (!error) {
      setHabits((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const getStreak = (dates: string[]) => {
    if (!dates.length) return 0;
    const sorted = [...dates].sort();
    let streak = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      const prev = new Date(sorted[i]);
      const curr = new Date(sorted[i - 1]);
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-red-400" />
              Привычки
            </h1>
          </div>
          <span className="text-sm text-neutral-500">{habits.length} привычек</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#171717] border border-neutral-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-red-400" />
            Новая привычка
          </h2>
          <form onSubmit={handleAddHabit} className="flex gap-4">
            <input
              type="text"
              placeholder="Название (например, Спорт 3 раза в неделю)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-grow px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Добавить
            </button>
          </form>
        </motion.div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Загрузка...
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 bg-[#171717] border border-neutral-800 rounded-xl">
              <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Привычек пока нет. Добавь первую!</p>
            </div>
          ) : (
            <AnimatePresence>
              {habits.map((habit) => {
                const isCompletedToday = habit.completed_dates.includes(today);
                const streak = getStreak(habit.completed_dates);

                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`group flex items-center justify-between p-5 bg-[#171717] border rounded-xl transition-all ${
                      isCompletedToday
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-neutral-800 hover:border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-grow">
                      <button
                        onClick={() => toggleToday(habit)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompletedToday
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-neutral-700 hover:border-red-400 text-neutral-600"
                        }`}
                      >
                        {isCompletedToday && <Check className="w-5 h-5" />}
                      </button>
                      <div>
                        <h3
                          className={`text-base font-medium ${
                            isCompletedToday ? "text-emerald-400" : "text-white"
                          }`}
                        >
                          {habit.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Всего: {habit.completed_dates.length}
                          </span>
                          {streak > 0 && (
                            <span className="flex items-center gap-1 text-orange-400">
                              <Flame className="w-3 h-3" />
                              Серия: {streak} дн.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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