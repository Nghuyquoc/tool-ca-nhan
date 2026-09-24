import React, { useState, useRef } from 'react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import {
  FileText,
  Star,
  Folder,
  Tag,
  Trash2,
  Pin,
  Search,
  Plus,
  Copy,
  FolderPlus,
  CornerDownRight,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Link,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Note, NoteFolder } from '../types';

export const NotesPage: React.FC = () => {
  const {
    notes,
    folders,
    activeNoteId,
    setActiveNoteId,
    noteSearchQuery,
    setNoteSearchQuery,
    selectedFolderId,
    setSelectedFolderId,
    selectedTag,
    setSelectedTag,
    noteFilter,
    setNoteFilter,
    noteSortBy,
    setNoteSortBy,
    noteSaveStatus,
    createNote,
    updateNote,
    deleteNote,
    restoreNote,
    toggleFavoriteNote,
    togglePinNote,
    duplicateNote,
    createFolder,
  } = useWorkspaceStore();

  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [mobilePane, setMobilePane] = useState<'list' | 'editor'>('list');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const activeNote = notes.find((n: Note) => n.id === activeNoteId);

  // Filter notes
  let filteredNotes = notes.filter((n: Note) => {
    // Trash check
    if (noteFilter === 'trash') {
      return n.isTrash;
    }
    if (n.isTrash) return false;

    // Filter by view
    if (noteFilter === 'favorites' && !n.isFavorite) return false;
    if (selectedFolderId && n.folderId !== selectedFolderId) return false;
    if (selectedTag && !n.tags.includes(selectedTag)) return false;

    // Search query
    if (noteSearchQuery.trim()) {
      const q = noteSearchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchTags = n.tags.some((t: string) => t.toLowerCase().includes(q));
      return matchTitle || matchContent || matchTags;
    }

    return true;
  });

  // Sort notes: pinned first, then sort criteria
  filteredNotes.sort((a: Note, b: Note) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (noteSortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (noteSortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap((n: Note) => (n.isTrash ? [] : n.tags))));

  // Editor toolbar actions
  const insertFormatting = (before: string, after: string = '') => {
    if (!editorRef.current || !activeNote) return;
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = activeNote.content;
    const selectedText = text.substring(start, end);

    const replacement = `${before}${selectedText}${after}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    updateNote(activeNote.id, { content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 10);
  };

  const handleCreateNewFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim());
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* 1. NOTES INNER SIDEBAR */}
      <div className="hidden lg:flex flex-col w-56 border-r border-border bg-card/30 p-3 space-y-4 select-none shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Ghi chú
          </span>
          <button
            onClick={() => createNote()}
            className="p-1 rounded-lg hover:bg-secondary text-primary transition"
            title="Ghi chú mới"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Views */}
        <div className="space-y-1 text-xs font-medium">
          <button
            onClick={() => setNoteFilter('all')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition ${
              noteFilter === 'all' && !selectedFolderId && !selectedTag
                ? 'bg-secondary text-foreground font-semibold'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>Tất cả ghi chú</span>
            </div>
            <span className="text-[10px] opacity-70">
              {notes.filter((n: Note) => !n.isTrash).length}
            </span>
          </button>

          <button
            onClick={() => setNoteFilter('favorites')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition ${
              noteFilter === 'favorites'
                ? 'bg-secondary text-foreground font-semibold'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Yêu thích</span>
            </div>
            <span className="text-[10px] opacity-70">
              {notes.filter((n: Note) => n.isFavorite && !n.isTrash).length}
            </span>
          </button>

          <button
            onClick={() => setNoteFilter('trash')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition ${
              noteFilter === 'trash'
                ? 'bg-secondary text-foreground font-semibold'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Thùng rác</span>
            </div>
            <span className="text-[10px] opacity-70">
              {notes.filter((n: Note) => n.isTrash).length}
            </span>
          </button>
        </div>

        {/* Folders */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Thư mục
            </span>
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
              title="Tạo thư mục"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-0.5">
            {folders.map((f: NoteFolder) => (
              <button
                key={f.id}
                onClick={() => setSelectedFolderId(f.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition ${
                  selectedFolderId === f.id
                    ? 'bg-secondary text-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Folder
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: f.color || '#3b82f6' }}
                  />
                  <span className="truncate">{f.name}</span>
                </div>
                <span className="text-[10px] opacity-60">
                  {notes.filter((n: Note) => n.folderId === f.id && !n.isTrash).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase px-2 block mb-1.5">
              Thẻ Tags
            </span>
            <div className="flex flex-wrap gap-1 px-1">
              {allTags.map((tag: string) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] transition ${
                    selectedTag === tag
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. NOTES LIST PANE */}
      <div
        className={`w-full md:w-80 border-r border-border bg-card/20 flex flex-col shrink-0 ${
          mobilePane === 'editor' ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Search & Sort Header */}
        <div className="p-3 border-b border-border/60 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-foreground">
              {noteFilter === 'trash'
                ? 'Thùng rác'
                : noteFilter === 'favorites'
                ? 'Ghi chú Yêu thích'
                : selectedFolderId
                ? folders.find((f: NoteFolder) => f.id === selectedFolderId)?.name
                : 'Tất cả Ghi chú'}
            </h2>
            <button
              onClick={() => {
                const newNote = createNote();
                setActiveNoteId(newNote.id);
                setMobilePane('editor');
              }}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Viết mới</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung ghi chú..."
              value={noteSearchQuery}
              onChange={(e) => setNoteSearchQuery(e.target.value)}
              className="w-full bg-secondary/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary border border-border"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <span>{filteredNotes.length} ghi chú</span>
            <select
              value={noteSortBy}
              onChange={(e) => setNoteSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none text-foreground font-medium cursor-pointer"
            >
              <option value="updatedAt" className="bg-card">Cập nhật gần nhất</option>
              <option value="createdAt" className="bg-card">Mới tạo nhất</option>
              <option value="title" className="bg-card">Theo tiêu đề (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Note Cards List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Chưa có ghi chú nào</p>
            </div>
          ) : (
            filteredNotes.map((note: Note) => (
              <div
                key={note.id}
                onClick={() => {
                  setActiveNoteId(note.id);
                  setMobilePane('editor');
                }}
                className={`p-3 rounded-2xl cursor-pointer transition relative group border ${
                  activeNoteId === note.id
                    ? 'bg-secondary border-primary/40 shadow-sm'
                    : 'bg-card/60 border-transparent hover:bg-secondary/40'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h3 className="font-semibold text-xs text-foreground truncate flex-1">
                    {note.title || 'Ghi chú không tên'}
                  </h3>
                  <div className="flex items-center space-x-1 shrink-0">
                    {note.isPinned && <Pin className="w-3 h-3 text-primary fill-primary" />}
                    {note.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {note.content.replace(/[#*`_]/g, '') || 'Chưa có nội dung...'}
                </p>

                <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-muted-foreground">
                  <span>{new Date(note.updatedAt).toLocaleDateString('vi-VN')}</span>
                  {note.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {note.tags.slice(0, 2).map((t: string) => (
                        <span key={t} className="px-1.5 py-0.2 rounded bg-secondary text-primary font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. RICH TEXT & MARKDOWN EDITOR */}
      <div
        className={`flex-1 flex flex-col h-full bg-background overflow-hidden ${
          mobilePane === 'list' ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeNote ? (
          <>
            {/* Editor Action Header */}
            <div className="h-14 border-b border-border/60 px-4 flex items-center justify-between bg-card/20 shrink-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMobilePane('list')}
                  className="md:hidden p-1.5 rounded-lg hover:bg-secondary text-muted-foreground mr-1"
                >
                  <CornerDownRight className="w-4 h-4 rotate-180" />
                </button>

                {/* Auto Save indicator */}
                <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                  {noteSaveStatus === 'saving' ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Đã lưu</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1">
                {activeNote.isTrash ? (
                  <>
                    <button
                      onClick={() => restoreNote(activeNote.id)}
                      className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Khôi phục</span>
                    </button>
                    <button
                      onClick={() => deleteNote(activeNote.id, true)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 text-xs"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => togglePinNote(activeNote.id)}
                      className={`p-2 rounded-xl hover:bg-secondary transition ${
                        activeNote.isPinned ? 'text-primary' : 'text-muted-foreground'
                      }`}
                      title={activeNote.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFavoriteNote(activeNote.id)}
                      className={`p-2 rounded-xl hover:bg-secondary transition ${
                        activeNote.isFavorite ? 'text-amber-400' : 'text-muted-foreground'
                      }`}
                      title={activeNote.isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => duplicateNote(activeNote.id)}
                      className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                      title="Nhân bản ghi chú"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(activeNote.id)}
                      className="p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition"
                      title="Chuyển vào thùng rác"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Formatting Toolbar */}
            {!activeNote.isTrash && (
              <div className="px-4 py-2 border-b border-border/40 bg-secondary/30 flex items-center space-x-1 overflow-x-auto text-muted-foreground">
                <button
                  onClick={() => insertFormatting('# ', '')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground"
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('## ', '')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('### ', '')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-border mx-1" />
                <button
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground font-bold"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground italic"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('~~', '~~')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground"
                  title="Strike"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-border mx-1" />
                <button
                  onClick={() => insertFormatting('- ', '')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('1. ', '')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('- [ ] ', '')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground"
                  title="Checklist"
                >
                  <CheckSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('> ', '')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground"
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('```\n', '\n```')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground font-mono"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('[', '](https://)')}
                  className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground"
                  title="Link"
                >
                  <Link className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Note Title & Content Body */}
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto space-y-4">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                disabled={activeNote.isTrash}
                placeholder="Tiêu đề ghi chú..."
                className="w-full text-2xl sm:text-3xl font-extrabold bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
              />

              {/* Folder & Tags Bar */}
              <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-border/40 text-xs">
                <div className="flex items-center space-x-1.5 bg-secondary/50 px-2.5 py-1 rounded-xl">
                  <Folder className="w-3.5 h-3.5 text-muted-foreground" />
                  <select
                    value={activeNote.folderId || ''}
                    onChange={(e) => updateNote(activeNote.id, { folderId: e.target.value || undefined })}
                    disabled={activeNote.isTrash}
                    className="bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="" className="bg-card">Chưa phân thư mục</option>
                    {folders.map((f: NoteFolder) => (
                      <option key={f.id} value={f.id} className="bg-card">
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5 bg-secondary/50 px-2.5 py-1 rounded-xl">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={activeNote.tags.join(', ')}
                    onChange={(e) =>
                      updateNote(activeNote.id, {
                        tags: e.target.value
                          .split(',')
                          .map((t: string) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    disabled={activeNote.isTrash}
                    placeholder="Tags cách nhau bằng phẩy..."
                    className="bg-transparent focus:outline-none placeholder:text-muted-foreground text-xs"
                  />
                </div>
              </div>

              {/* Textarea Editor */}
              <textarea
                ref={editorRef}
                value={activeNote.content}
                onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                disabled={activeNote.isTrash}
                placeholder="Bắt đầu viết ghi chú của bạn ở đây (hỗ trợ Markdown, code block, checklist)..."
                className="w-full h-[calc(100vh-280px)] bg-transparent border-none focus:outline-none resize-none font-sans text-sm sm:text-base leading-relaxed text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <FileText className="w-12 h-12 mb-3 opacity-30" />
            <h3 className="font-semibold text-base text-foreground mb-1">Chưa chọn ghi chú nào</h3>
            <p className="text-xs max-w-sm mb-4">
              Chọn một ghi chú từ danh sách bên trái hoặc tạo ghi chú mới để bắt đầu.
            </p>
            <button
              onClick={() => createNote()}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition"
            >
              Tạo ghi chú mới
            </button>
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowNewFolderModal(false)}
        >
          <div
            className="w-full max-w-sm bg-card border border-border rounded-3xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-sm mb-3">Tạo Thư Mục Mới</h3>
            <form onSubmit={handleCreateNewFolder} className="space-y-3">
              <input
                type="text"
                placeholder="Tên thư mục..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full bg-secondary/50 p-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs hover:bg-secondary text-muted-foreground"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground disabled:opacity-50"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
