"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  StickyNote,
  ArrowLeft,
  Loader2,
  Edit3,
  X,
} from "lucide-react";
import Link from "next/link";

type Note = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setNotes(data);
    }
    setLoading(false);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsAdding(true);
    const { error } = await supabase.from("notes").insert({
      title: newTitle,
      content: newContent || null,
    });

    if (!error) {
      setNewTitle("");
      setNewContent("");
      fetchNotes();
    }
    setIsAdding(false);
  };

  const handleEditNote = async (id: string) => {
    const { error } = await supabase
      .from("notes")
      .update({ title: editTitle, content: editContent, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      fetchNotes();
    }
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (!error) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
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
              <StickyNote className="w-5 h-5 text-orange-400" />
              Заметки
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#171717] border border-neutral-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-400" />
            Новая заметка
          </h2>
          <form onSubmit={handleAddNote} className="space-y-4">
            <input
              type="text"
              placeholder="Заголовок"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
              required
            />
            <textarea
              placeholder="Содержание (необязательно)"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Добавить заметку
            </button>
          </form>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-12 text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Загрузка...
            </div>
          ) : notes.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-neutral-500 bg-[#171717] border border-neutral-800 rounded-xl">
              <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Заметок пока нет.</p>
            </div>
          ) : (
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-[#171717] border border-neutral-800 rounded-xl p-6 hover:border-orange-500/30 transition-all"
                >
                  {editingId === note.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      />
                      <textarea
                        value={editContent || ""}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-orange-500 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditNote(note.id)}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm"
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
                        <h3 className="text-lg font-bold text-white">{note.title}</h3>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(note.id);
                              setEditTitle(note.title);
                              setEditContent(note.content || "");
                            }}
                            className="p-2 text-neutral-600 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {note.content && (
                        <p className="text-neutral-400 text-sm whitespace-pre-wrap mb-3">{note.content}</p>
                      )}
                      <p className="text-xs text-neutral-600">
                        {new Date(note.created_at).toLocaleDateString("ru-RU")}
                      </p>
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