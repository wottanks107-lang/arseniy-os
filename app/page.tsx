"use client";

import { motion, Variants, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Send, Code, BookOpen, Dumbbell, Briefcase } from "lucide-react";

export default function Home() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const pathData = [
    { year: "2024", title: "Начало пути", desc: "Первые строки кода, изучение основ Python и HTML.", icon: Code },
    { year: "2025", title: "Погружение в бизнес", desc: "Изучение финансов, первые идеи для стартапов, чтение бизнес-литературы.", icon: Briefcase },
    { year: "2026", title: "Создание Personal OS", desc: "Разработка этого сайта, изучение Next.js, TypeScript и баз данных.", icon: Code },
    { year: "2027+", title: "Масштабирование", desc: "Запуск первых проектов, выход на доход, поступление.", icon: BookOpen },
  ];

  const goalsData = [
    { title: "Выучить Next.js и TypeScript", progress: 65, color: "bg-emerald-500" },
    { title: "Запустить первый проект", progress: 30, color: "bg-blue-500" },
    { title: "Накопить первый капитал", progress: 15, color: "bg-purple-500" },
    { title: "Прочитать 50 книг по бизнесу", progress: 40, color: "bg-orange-500" },
  ];

  const projectsData = [
    {
      title: "Personal OS",
      desc: "Этот сайт — моя личная операционная система. Портфолио + дашборд для управления жизнью.",
      tags: ["Next.js", "TypeScript", "Supabase"],
      status: "В разработке",
    },
    {
      title: "AI Ассистент",
      desc: "Умный помощник для автоматизации рутинных задач и анализа данных.",
      tags: ["Python", "OpenAI", "API"],
      status: "Идея",
    },
    {
      title: "Финансовый трекер",
      desc: "Приложение для учёта расходов и накоплений с визуализацией прогресса.",
      tags: ["React", "Charts", "PWA"],
      status: "Планируется",
    },
    {
      title: "Блог о саморазвитии",
      desc: "Платформа для публикации мыслей о бизнесе, коде и личной эффективности.",
      tags: ["Content", "SEO", "Marketing"],
      status: "Идея",
    },
  ];

  return (
    <main className="bg-[#0a0a0a] text-[#ededed]">
      {/* ================= HERO SECTION ================= */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          className="max-w-3xl w-full text-center z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Севастополь · 2026 · Открыт для идей
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-b from-white to-neutral-400 bg-clip-text text-transparent"
          >
            АРСЕНИЙ.
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-neutral-400 mb-8 font-light">
            Мне 16. И всё только начинается.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-3 mb-10 text-sm md:text-base text-neutral-500 font-medium tracking-wide"
          >
            {["AI", "CODE", "BUSINESS", "SPORT", "LIFE"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border border-neutral-800 rounded-md hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#about"
              className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-all"
            >
              Узнать больше
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

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-600"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="py-24 px-4 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-emerald-500 font-mono text-lg">01</span>
              <h2 className="text-3xl md:text-4xl font-bold">Немного обо мне</h2>
              <div className="h-px bg-neutral-800 grow ml-4"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-neutral-400 text-lg leading-relaxed">
              <p>
                Привет! Меня зовут Арсений, мне 16 лет, и я живу в Севастополе. Я верю, что дисциплина и постоянное
                обучение — ключ к финансовой свободе.
              </p>
              <p>
                Сейчас я активно изучаю программирование (Next.js, AI), читаю книги по бизнесу и работаю над своим
                телом. Этот сайт — моя личная операционная система и портфолио.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { icon: Code, label: "Код" },
                { icon: Briefcase, label: "Бизнес" },
                { icon: Dumbbell, label: "Спорт" },
                { icon: BookOpen, label: "Книги" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-emerald-500/30 transition-colors"
                >
                  <item.icon className="w-8 h-8 text-emerald-400" />
                  <span className="font-medium text-white">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= PATH SECTION ================= */}
      <section id="path" className="py-24 px-4 border-t border-neutral-900 bg-neutral-950/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-emerald-500 font-mono text-lg">02</span>
              <h2 className="text-3xl md:text-4xl font-bold">Мой путь</h2>
              <div className="h-px bg-neutral-800 grow ml-4"></div>
            </div>
            <p className="text-neutral-500 text-lg">Хроника. Пока короткая — но она будет расти.</p>
          </motion.div>

          <div className="relative border-l-2 border-neutral-800 ml-4 md:ml-0 md:pl-0 space-y-12">
            {pathData.map((item, index) => (
              <TimelineItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= GOALS SECTION ================= */}
      <section id="goals" className="py-24 px-4 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-emerald-500 font-mono text-lg">04</span>
              <h2 className="text-3xl md:text-4xl font-bold">Куда я хочу прийти</h2>
              <div className="h-px bg-neutral-800 grow ml-4"></div>
            </div>
            <p className="text-neutral-500 text-lg">Цели. Не мечты — планы.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="mb-12 bg-linear-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8"
          >
            <h3 className="text-sm font-medium text-emerald-400 mb-3">🎯 Главная цель</h3>
            <p className="text-3xl md:text-4xl font-bold text-white mb-4">Финансовая свобода</p>
            <p className="text-neutral-400">Создать пассивный доход, который покроет все расходы к 25 годам.</p>
          </motion.div>

          <div className="space-y-6">
            {goalsData.map((goal, index) => (
              <GoalItem key={index} goal={goal} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROJECTS SECTION ================= */}
      <section id="projects" className="py-24 px-4 border-t border-neutral-900 bg-neutral-950/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-emerald-500 font-mono text-lg">06</span>
              <h2 className="text-3xl md:text-4xl font-bold">То, что я создаю</h2>
              <div className="h-px bg-neutral-800 grow ml-4"></div>
            </div>
            <p className="text-neutral-500 text-lg">
              Пока это только начало. Некоторые идеи существуют только на бумаге.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {projectsData.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= TIMELINE ITEM ================= */
function TimelineItem({ item, index }: { item: { year: string; title: string; desc: string; icon: any }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="relative pl-8 md:pl-0"
    >
      <div className="absolute -left-2.25 top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#0a0a0a] md:left-1/2 md:-translate-x-1/2"></div>

      <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
        <div className={`md:text-right mb-2 md:mb-0 ${index % 2 === 0 ? "" : "md:order-2"}`}>
          <span className="text-emerald-400 font-mono text-xl font-bold">{item.year}</span>
        </div>

        <div className={`${index % 2 === 0 ? "md:order-2" : ""}`}>
          <div className="flex items-center gap-3 mb-2">
            <item.icon className="w-5 h-5 text-neutral-400" />
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
          </div>
          <p className="text-neutral-400">{item.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= GOAL ITEM ================= */
function GoalItem({ goal, index }: { goal: { title: string; progress: number; color: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
        <span className="text-emerald-400 font-mono font-bold">{goal.progress}%</span>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${goal.progress}%` } : { width: 0 }}
          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          className={`h-full ${goal.color} rounded-full`}
        />
      </div>
    </motion.div>
  );
}

/* ================= PROJECT CARD ================= */
function ProjectCard({
  project,
  index,
}: {
  project: { title: string; desc: string; tags: string[]; status: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{project.title}</h3>
        <span className="text-xs px-2 py-1 bg-neutral-800 text-neutral-400 rounded-md">{project.status}</span>
      </div>
      <p className="text-neutral-400 mb-4 text-sm leading-relaxed">{project.desc}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag, i) => (
          <span key={i} className="text-xs px-2 py-1 bg-neutral-800/50 text-neutral-500 rounded-md">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}