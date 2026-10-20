"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, Calendar, Shield, Sparkles, User, Route, Target, Folder } from "lucide-react";
import Link from "next/link";

const commands = [
  { id: "home", label: "Главная", icon: Home, href: "/" },
  { id: "about", label: "Обо мне", icon: User, href: "/#about" },
  { id: "path", label: "Мой путь", icon: Route, href: "/#path" },
  { id: "now", label: "Что сейчас (Now)", icon: Calendar, href: "/now" },
  { id: "goals", label: "Цели", icon: Target, href: "/#goals" },
  { id: "projects", label: "Проекты", icon: Folder, href: "/#projects" },
  { id: "admin", label: "Админ-панель (Дашборд)", icon: Shield, href: "/admin" },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const filtered = commands.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg bg-[#171717] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-neutral-800 px-4">
              <Search className="w-5 h-5 text-neutral-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Куда идём? (например, Админка)..."
                className="w-full bg-transparent py-4 px-3 text-white placeholder-neutral-500 outline-none"
              />
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-1.5 font-mono text-[10px] font-medium text-neutral-400">
                ESC
              </kbd>
            </div>

            <div className="p-2 max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-sm text-neutral-500">Ничего не найдено.</p>
              ) : (
                filtered.map((cmd) => (
                  <Link
                    key={cmd.id}
                    href={cmd.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                  >
                    <cmd.icon className="w-4 h-4 text-neutral-500" />
                    {cmd.label}
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}