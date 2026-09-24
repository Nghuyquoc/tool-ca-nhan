import React, { useState } from 'react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import {
  Newspaper,
  Bookmark,
  ExternalLink,
  RefreshCw,
  Search,
  Flame,
} from 'lucide-react';
import { NewsArticle } from '../types';

export const NewsPage: React.FC = () => {
  const {
    news,
    newsCategory,
    setNewsCategory,
    newsSearchQuery,
    setNewsSearchQuery,
    toggleSaveArticle,
    markArticleAsRead,
    refreshNews,
  } = useWorkspaceStore();

  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    'For You',
    'Technology',
    'AI',
    'Programming',
    'Gaming',
    'Business',
    'Vietnam',
    'World',
    'Social Media',
  ];

  const trendingTags = ['#DeepLearning', '#DotNet10', '#AIAgents', '#Vite6', '#Semiconductors', '#PersonalWorkspace'];

  const filteredNews = news.filter((article: NewsArticle) => {
    // Category
    if (newsCategory !== 'For You' && article.category !== newsCategory) {
      return false;
    }

    // Search
    if (newsSearchQuery.trim()) {
      const q = newsSearchQuery.toLowerCase();
      const matchTitle = article.title.toLowerCase().includes(q);
      const matchDesc = article.description.toLowerCase().includes(q);
      const matchSource = article.source.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSource) return false;
    }

    return true;
  });

  const handleRefresh = () => {
    setRefreshing(true);
    refreshNews();
    setTimeout(() => setRefreshing(false), 800);
  };

  const formatRelativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / (1000 * 60 * 60));
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Hôm qua';
    return `${days} ngày trước`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Tổng hợp tin tức thông minh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Bản Tin & Xu Hướng Công Nghệ
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Cập nhật tức thời từ các nguồn tin uy tín (RSS, TechCrunch, HackerNews, VnExpress)
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground text-xs sm:text-sm font-semibold border border-border transition active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Làm mới tin tức</span>
        </button>
      </div>

      {/* Trending Topics Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center space-x-1 font-bold text-orange-500 shrink-0 px-2">
          <Flame className="w-4 h-4" />
          <span>Trending:</span>
        </div>
        {trendingTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setNewsSearchQuery(tag.replace('#', ''))}
            className="px-3 py-1 rounded-full bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0 transition"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setNewsCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all duration-150 ${
                newsCategory === cat
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/25 scale-[1.02]'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={newsSearchQuery}
            onChange={(e) => setNewsSearchQuery(e.target.value)}
            className="w-full bg-secondary/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none border border-border"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNews.length === 0 ? (
          <div className="col-span-full p-12 text-center text-muted-foreground bg-card/40 border border-border rounded-3xl">
            <Newspaper className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <h3 className="font-semibold text-foreground text-sm">Không tìm thấy bài viết nào</h3>
            <p className="text-xs mt-0.5">Thử chọn danh mục khác hoặc thay đổi từ khóa tìm kiếm.</p>
          </div>
        ) : (
          filteredNews.map((article: NewsArticle) => (
            <div
              key={article.id}
              className={`bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-card flex flex-col justify-between group ${
                article.isRead ? 'opacity-80' : ''
              }`}
            >
              {article.imageUrl && (
                <div className="relative h-44 overflow-hidden bg-secondary">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
                      {article.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                    <span className="font-semibold text-emerald-500">{article.source}</span>
                    <span>{formatRelativeTime(article.publishedAt)}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition line-clamp-2 mb-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground">
                    {article.readTime || '3 phút đọc'}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleSaveArticle(article.id)}
                      className={`p-2 rounded-xl hover:bg-secondary transition ${
                        article.isSaved ? 'text-amber-400' : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title={article.isSaved ? 'Bỏ lưu' : 'Lưu bài viết'}
                    >
                      <Bookmark className={`w-4 h-4 ${article.isSaved ? 'fill-amber-400' : ''}`} />
                    </button>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => markArticleAsRead(article.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-xs font-semibold transition"
                    >
                      <span>Đọc bài</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
