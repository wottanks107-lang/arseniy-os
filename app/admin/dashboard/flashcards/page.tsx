"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Image,
  ArrowLeft,
  Loader2,
  Eye,
  Calendar,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

type Flashcard = {
  id: string;
  title: string;
  image_url: string;
  last_reviewed: string | null;
  next_review: string | null;
  review_count: number;
  created_at: string;
};

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setFlashcards(data);
    }
    setLoading(false);
  };

  const handleAddFlashcard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    setIsAdding(true);
    const { error } = await supabase.from("flashcards").insert({
      title: newTitle,
      image_url: newImageUrl,
      review_count: 0,
    });

    if (!error) {
      setNewTitle("");
      setNewImageUrl("");
      setPreviewUrl("");
      fetchFlashcards();
    }
    setIsAdding(false);
  };

  const markAsReviewed = async (id: string) => {
    const now = new Date().toISOString();
    const nextReview = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Через 7 дней

    const { error } = await supabase
      .from("flashcards")
      .update({
        last_reviewed: now,
        next_review: nextReview,
        review_count: (flashcards.find((f) => f.id === id)?.review_count || 0) + 1,
      })
      .eq("id", id);

    if (!error) {
      fetchFlashcards();
    }
  };

  const deleteFlashcard = async (id: string) => {
    const { error } = await supabase.from("flashcards").delete().eq("id", id);
    if (!error) {
      setFlashcards((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Никогда";
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
              <Image className="w-5 h-5 text-cyan-400" />
              Фото-карточки
            </h1>
          </div>
          <span className="text-sm text-neutral-500">{flashcards.length} карточек</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#171717] border border-neutral-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" />
            Новая карточка
          </h2>
          <form onSubmit={handleAddFlashcard} className="space-y-4">
            <input
              type="text"
              placeholder="Название (например, Схема по истории)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
              required
            />
            <input
              type="url"
              placeholder="URL изображения (вставь ссылку на картинку)"
              value={newImageUrl}
              onChange={(e) => {
                setNewImageUrl(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
              required
            />
            {previewUrl && (
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={() => setPreviewUrl("")}
                />
              </div>
            )}
            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Добавить карточку
            </button>
          </form>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-12 text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Загрузка...
            </div>
          ) : flashcards.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-neutral-500 bg-[#171717] border border-neutral-800 rounded-xl">
              <Image className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Карточек пока нет. Добавь первую!</p>
            </div>
          ) : (
            <AnimatePresence>
              {flashcards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-[#171717] border border-neutral-800 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all"
                >
                  <div className="relative h-48 overflow-hidden bg-neutral-900">
                    <img
                      src={card.image_url}
                      alt={card.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23333' width='400' height='200'/%3E%3Ctext fill='%23666' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => deleteFlashcard(card.id)}
                        className="p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                    
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>Просмотров: {card.review_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Последний: {formatDate(card.last_reviewed)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => markAsReviewed(card.id)}
                        className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Просмотрено
                      </button>
                      <a
                        href={card.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center justify-center"
                        title="Открыть в полном размере"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
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