"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Link2,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Edit3,
  X,
  Globe,
} from "lucide-react";
import Link from "next/link";

type LinkItem = {
  id: string;
  title: string;
  url: string;
  category: string | null;
  description: string | null;
  created_at: string;
};

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLinks(data);
    }
    setLoading(false);
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    setIsAdding(true);
    const { error } = await supabase.from("links").insert({
      title: newTitle,
      url: newUrl,
      category: newCategory || null,
      description: newDescription || null,
    });

    if (!error) {
      setNewTitle("");
      setNewUrl("");
      setNewCategory("");
      setNewDescription("");
      fetchLinks();
    }
    setIsAdding(false);
  };

  const handleEditLink = async (id: string) => {
    const { error } = await supabase
      .from("links")
      .update({
        title: editTitle,
        url: editUrl,
        category: editCategory || null,
        description: editDescription || null,
      })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      fetchLinks();
    }
  };

  const deleteLink = async (id: string) => {
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (!error) {
      setLinks((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const categories = [...new Set(links.map((l) => l.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-green-400" />
              Полезные ссылки
            </h1>
          </div>
          <span className="text-sm text-neutral-500">{links.length} ссылок</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#171717] border border-neutral-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-400" />
            Новая ссылка
          </h2>
          <form onSubmit={handleAddLink} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Название (например, Документация Next.js)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 transition-colors"
                required
              />
              <input
                type="url"
                placeholder="URL (https://...)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Категория (например, Для кода)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Описание (необязательно)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Добавить ссылку
            </button>
          </form>
        </motion.div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-neutral-400 mr-2">Категории:</span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-xs text-neutral-300"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-12 text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Загрузка...
            </div>
          ) : links.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-neutral-500 bg-[#171717] border border-neutral-800 rounded-xl">
              <Link2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Ссылок пока нет. Добавь первую!</p>
            </div>
          ) : (
            <AnimatePresence>
              {links.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-[#171717] border border-neutral-800 rounded-xl p-5 hover:border-green-500/30 transition-all"
                >
                  {editingId === link.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Название"
                      />
                      <input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="URL"
                      />
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Категория"
                      />
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Описание"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditLink(link.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm flex items-center gap-1"
                        >
                          <X className="w-4 h-4" /> Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <h3 className="text-base font-bold text-white truncate">{link.title}</h3>
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-neutral-500 hover:text-green-400 transition-colors truncate block"
                          >
                            {link.url}
                          </a>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button
                            onClick={() => {
                              setEditingId(link.id);
                              setEditTitle(link.title);
                              setEditUrl(link.url);
                              setEditCategory(link.category || "");
                              setEditDescription(link.description || "");
                            }}
                            className="p-2 text-neutral-600 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteLink(link.id)}
                            className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {link.category && (
                        <span className="inline-block px-2 py-0.5 bg-neutral-800 text-neutral-400 text-xs rounded-md mb-2">
                          {link.category}
                        </span>
                      )}
                      {link.description && (
                        <p className="text-sm text-neutral-400">{link.description}</p>
                      )}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-xs text-green-400 hover:text-green-300 transition-colors"
                      >
                        Открыть <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}