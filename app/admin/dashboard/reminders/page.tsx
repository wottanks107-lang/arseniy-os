"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Bell,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { requestNotificationPermission, sendNotification } from "@/lib/notifications";

type Reminder = {
  id: string;
  title: string;
  description: string | null;
  remind_at: string;
  completed: boolean;
  created_at: string;
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDateTime, setNewDateTime] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchReminders();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const dueReminders = reminders.filter((r) => {
        if (r.completed) return false;
        const remindTime = new Date(r.remind_at);
        const diff = now.getTime() - remindTime.getTime();
        return diff >= 0 && diff < 60 * 1000; // В течение последней минуты
      });

      if (dueReminders.length > 0 && Notification.permission === "granted") {
        dueReminders.forEach((reminder) => {
          sendNotification("⏰ Напоминание", reminder.title);
        });
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60 * 1000);
    return () => clearInterval(interval);
  }, [reminders]);

  const fetchReminders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .order("remind_at", { ascending: true });

    if (!error && data) {
      setReminders(data);
    }
    setLoading(false);
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDateTime) return;

    setIsAdding(true);
    const { error } = await supabase.from("reminders").insert({
      title: newTitle,
      description: newDescription || null,
      remind_at: new Date(newDateTime).toISOString(),
      completed: false,
    });

    if (!error) {
      setNewTitle("");
      setNewDescription("");
      setNewDateTime("");
      fetchReminders();
    }
    setIsAdding(false);
  };

  const toggleReminder = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("reminders")
      .update({ completed: !currentStatus })
      .eq("id", id);

    if (!error) {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, completed: !currentStatus } : r))
      );
    }
  };

  const deleteReminder = async (id: string) => {
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (!error) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
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
              <Bell className="w-5 h-5 text-pink-400" />
              Напоминалки
            </h1>
          </div>
          <span className="text-sm text-neutral-500">
            {reminders.filter((r) => !r.completed).length} активных
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#171717] border border-neutral-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-pink-400" />
            Новое напоминание
          </h2>
          <form onSubmit={handleAddReminder} className="space-y-4">
            <input
              type="text"
              placeholder="Что напомнить? (например, Позвонить бабушке)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition-colors"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Описание (необязательно)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              <input
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Добавить напоминание
            </button>
          </form>
        </motion.div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white mb-4">Список напоминаний</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Загрузка...
            </div>
          ) : reminders.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 bg-[#171717] border border-neutral-800 rounded-xl">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Напоминаний пока нет.</p>
            </div>
          ) : (
            <AnimatePresence>
              {reminders.map((reminder) => {
                const overdue = !reminder.completed && isOverdue(reminder.remind_at);

                return (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`group flex items-start gap-4 p-4 bg-[#171717] border rounded-xl transition-all ${
                      reminder.completed
                        ? "border-neutral-800 opacity-60"
                        : overdue
                        ? "border-red-500/30 bg-red-500/5"
                        : "border-neutral-800 hover:border-pink-500/30"
                    }`}
                  >
                    <button
                      onClick={() => toggleReminder(reminder.id, reminder.completed)}
                      className="mt-1 flex-shrink-0"
                    >
                      {reminder.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-neutral-600 group-hover:text-pink-400 transition-colors" />
                      )}
                    </button>

                    <div className="flex-grow min-w-0">
                      <h3
                        className={`text-base font-medium ${
                          reminder.completed ? "line-through text-neutral-500" : "text-white"
                        }`}
                      >
                        {reminder.title}
                      </h3>
                      {reminder.description && (
                        <p className="text-sm text-neutral-400 mt-1">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className={`w-3 h-3 ${overdue ? "text-red-400" : "text-neutral-600"}`} />
                        <span className={`text-xs ${overdue ? "text-red-400 font-medium" : "text-neutral-600"}`}>
                          {formatDateTime(reminder.remind_at)}
                          {overdue && " (просрочено)"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="flex-shrink-0 p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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