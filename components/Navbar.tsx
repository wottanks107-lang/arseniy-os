"use client";

import Link from "next/link";
import { Command } from "lucide-react";

export default function Navbar() {
  // Функция для открытия Command Palette по клику на кнопку
  const openPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-neutral-900 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="font-bold text-lg tracking-tight text-white hover:text-emerald-400 transition-colors">
          ARSEN<span className="text-emerald-500">.</span>
        </Link>
        
        {/* Кнопка вызова поиска */}
        <div className="flex items-center gap-2">
          <button 
            onClick={openPalette}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-md hover:border-neutral-700 hover:text-white transition-colors"
          >
            <Command className="w-3 h-3" />
            <span>Поиск</span>
            <kbd className="hidden sm:inline text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>
        </div>
      </div>
    </nav>
  );
}