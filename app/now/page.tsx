"use client";

import { motion, Variants } from "framer-motion";
import { ArrowDown, Send } from "lucide-react";

export default function Home() {
  // Типизированные переменные анимации (исправление ошибок TypeScript)
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Фоновый декоративный элемент (свечение) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        className="max-w-3xl w-full text-center z-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Статус и локация */}
        <motion.div variants={fadeInUp} className="mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Севастополь · 2026 · Открыт для идей
          </span>
        </motion.div>

        {/* Главный заголовок */}
        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-b from-white to-neutral-400 bg-clip-text text-transparent">
          АРСЕНИЙ.
        </motion.h1>

        {/* Подзаголовок */}
        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-neutral-400 mb-8 font-light">
          Мне 16. И всё только начинается.
        </motion.p>

        {/* Теги интересов */}
        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 mb-10 text-sm md:text-base text-neutral-500 font-medium tracking-wide">
          {["AI", "CODE", "BUSINESS", "SPORT", "LIFE"].map((tag) => (
            <span key={tag} className="px-3 py-1 border border-neutral-800 rounded-md hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default">
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Кнопки действий */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#path" 
            className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-all"
          >
            Смотреть мой путь
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </a>
          <a 
            href="https://t.me/твой_юзернейм"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-neutral-900 border border-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-800 hover:border-neutral-700 transition-all"
          >
            <Send className="w-4 h-4" />
            Написать в Telegram
          </a>
        </motion.div>
      </motion.div>

      {/* Индикатор скролла внизу */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-600"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ArrowDown className="w-6 h-6" />
      </motion.div>
    </main>
  );
}