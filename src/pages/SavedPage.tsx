import React, { useState } from 'react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { Bookmark, FileText, Newspaper, Star, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Note, NewsArticle } from '../types';

export const SavedPage: React.FC = () => {
  const { notes, news, setActiveNoteId } = useWorkspaceStore();
  const [filter, setFilter] = useState<'all' | 'notes' | 'news'>('all');
  const navigate = useNavigate();

  const favoriteNotes = notes.filter((n: Note) => n.isFavorite && !n.isTrash);
  const savedNews = news.filter((n: NewsArticle) => n.isSaved);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Kho lưu trữ cá nhân</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Mục Đã Lưu & Yêu Thích (Saved)
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {favoriteNotes.length} ghi chú yêu thích • {savedNews.length} bài báo đã lưu
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-secondary/80 border border-border text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 ${
              filter === 'all'
                ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            Tất cả ({favoriteNotes.length + savedNews.length})
          </button>
          <button
            onClick={() => setFilter('notes')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 ${
              filter === 'notes'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            Ghi chú ({favoriteNotes.length})
          </button>
          <button
            onClick={() => setFilter('news')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 ${
              filter === 'news'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            Tin tức ({savedNews.length})
          </button>
        </div>
      </div>

      {/* Grid of Saved Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Notes Section */}
        {(filter === 'all' || filter === 'notes') &&
          favoriteNotes.map((note: Note) => (
            <div
              key={note.id}
              onClick={() => {
                setActiveNoteId(note.id);
                navigate('/notes');
              }}
              className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 shadow-sm transition-card cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-xs text-primary font-semibold">
                    <FileText className="w-4 h-4" />
                    <span>Ghi chú</span>
                  </div>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition line-clamp-1 mb-1">
                  {note.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {note.content.replace(/[#*`_]/g, '')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/40 text-[11px] text-muted-foreground">
                <span>{new Date(note.updatedAt).toLocaleDateString('vi-VN')}</span>
                <span className="text-primary flex items-center space-x-1 font-semibold group-hover:underline">
                  <span>Mở xem</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}

        {/* News Section */}
        {(filter === 'all' || filter === 'news') &&
          savedNews.map((article: NewsArticle) => (
            <div
              key={article.id}
              className="p-5 rounded-3xl bg-card border border-border hover:border-emerald-500/40 shadow-sm transition-card flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-xs text-emerald-500 font-semibold">
                    <Newspaper className="w-4 h-4" />
                    <span>Tin tức • {article.category}</span>
                  </div>
                  <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition line-clamp-2 mb-1">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/40 text-[11px] text-muted-foreground">
                <span>Nguồn: {article.source}</span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary flex items-center space-x-1 font-semibold hover:underline"
                >
                  <span>Xem gốc</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}

        {favoriteNotes.length === 0 && savedNews.length === 0 && (
          <div className="col-span-full p-12 text-center text-muted-foreground bg-card/40 border border-border rounded-3xl">
            <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <h3 className="font-semibold text-foreground text-sm">Chưa có mục nào được lưu</h3>
            <p className="text-xs mt-0.5">Nhấn biểu tượng dấu sao trên ghi chú hoặc bookmark trên bài báo để lưu lại.</p>
          </div>
        )}
      </div>
    </div>
  );
};
