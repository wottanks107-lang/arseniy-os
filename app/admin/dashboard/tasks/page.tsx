"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  due_date: string | null;
  created_at: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  // Загрузка задач при открытии страницы
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTasks(data);
    }
    setLoading(false);
  };

  // Добавление новой задачи
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAdding(true);
    const { error } = await supabase.from("tasks").insert({
      title: newTaskTitle,
      description: newTaskDesc || null,
      priority: newTaskPriority,
      completed: false,
    });

    if (!error) {
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskPriority("medium");
      fetchTasks(); // Обновляем список
    }
    setIsAdding(false);
  };

  // Переключение статуса выполнения
  const toggleTask = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !currentStatus })
      .eq("id", id);

    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !currentStatus } : t))
      );
    }
  };

  // Удаление задачи
  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 border-red-500/30 bg-red-500/10";
      case "medium": return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      case "low": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      default: return "text-neutral-400 border-neutral-700 bg-neutral-800";
    }
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
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Задачи
            </h1>
          </div>
          <span className="text-sm text-neutral-500">{tasks.length} задач</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Форма добавления */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#171717] border border-neutral-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            Новая задача
          </h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <input
              type="text"
              placeholder="Что нужно сделать?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Описание (необязательно)"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                className="md:col-span-2 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="low">Низкий приоритет</option>
                <option value="medium">Средний приоритет</option>
                <option value="high">Высокий приоритет</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isAdding}
              className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Добавить задачу
            </button>
          </form>
        </motion.div>

        {/* Список задач */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Загрузка задач...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 bg-[#171717] border border-neutral-800 rounded-xl">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Задач пока нет. Самое время добавить первую!</p>
            </div>
          ) : (
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`group flex items-start gap-4 p-4 bg-[#171717] border rounded-xl transition-all ${
                    task.completed
                      ? "border-neutral-800 opacity-60"
                      : "border-neutral-800 hover:border-emerald-500/30"
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-neutral-600 group-hover:text-emerald-400 transition-colors" />
                    )}
                  </button>

                  <div className="flex-grow min-w-0">
                    <h3
                      className={`text-base font-medium truncate ${
                        task.completed ? "line-through text-neutral-500" : "text-white"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-neutral-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority === "high"
                          ? "Высокий"
                          : task.priority === "medium"
                          ? "Средний"
                          : "Низкий"}
                      </span>
                      <span className="text-xs text-neutral-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.created_at).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}