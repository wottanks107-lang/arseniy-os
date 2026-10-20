"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  CheckSquare,
  DollarSign,
  ShoppingBag,
  StickyNote,
  Bell,
  Image,
  Link2,
  Dumbbell,
  ArrowLeft,
  Download,
  Upload,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/admin");
        } else {
          setUser(user);
          // Запрос разрешения на уведомления
          if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
          }
        }
      } catch (error) {
        console.error("Ошибка получения пользователя:", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const handleExport = async () => {
    const tables = ["tasks", "finance", "wishlist", "notes", "reminders", "flashcards", "links", "habits"];
    const data: any = {};

    for (const table of tables) {
      const { data: rows } = await supabase.from(table).select("*");
      data[table] = rows || [];
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arseniy-os-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const text = await file.text();
      const data = JSON.parse(text);

      for (const [table, rows] of Object.entries(data)) {
        if (Array.isArray(rows)) {
          await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
          for (const row of rows as any[]) {
            const { id, created_at, ...rest } = row;
            await supabase.from(table).insert(rest);
          }
        }
      }

      alert("Данные импортированы!");
    };
    input.click();
  };

  const handleReset = async () => {
    if (!confirm("Ты уверен? Все данные будут удалены!")) return;

    const tables = ["tasks", "finance", "wishlist", "notes", "reminders", "flashcards", "links", "habits"];
    for (const table of tables) {
      await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    }

    alert("Все данные удалены!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-neutral-400">Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { icon: CheckSquare, label: "Задачи", href: "/admin/dashboard/tasks", color: "text-emerald-400", desc: "Управляй задачами и делами" },
    { icon: DollarSign, label: "Финансы", href: "/admin/dashboard/finance", color: "text-blue-400", desc: "Доходы и расходы" },
    { icon: ShoppingBag, label: "Хотелки", href: "/admin/dashboard/wishlist", color: "text-purple-400", desc: "Список желаний" },
    { icon: StickyNote, label: "Заметки", href: "/admin/dashboard/notes", color: "text-orange-400", desc: "Быстрые заметки" },
    { icon: Bell, label: "Напоминалки", href: "/admin/dashboard/reminders", color: "text-pink-400", desc: "Не забудь позвонить" },
    { icon: Image, label: "Фото-карточки", href: "/admin/dashboard/flashcards", color: "text-cyan-400", desc: "Повторение с фото" },
    { icon: Link2, label: "Ссылки", href: "/admin/dashboard/links", color: "text-green-400", desc: "Полезные ресурсы" },
    { icon: Dumbbell, label: "Привычки", href: "/admin/dashboard/habits", color: "text-red-400", desc: "Трекер привычек" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-emerald-400" />
              ARSENIY. ADMIN
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400 hidden md:block">{user.email}</span>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors text-sm"
              title="Экспорт JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Экспорт</span>
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors text-sm"
              title="Импорт JSON"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Импорт</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-colors text-sm"
              title="Сбросить всё"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Сброс</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Добро пожаловать!</h2>
          <p className="text-neutral-400">
            Выбери раздел для управления данными
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className="block p-6 bg-[#171717] border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors group"
              >
                <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">
                  {item.label}
                </h3>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}