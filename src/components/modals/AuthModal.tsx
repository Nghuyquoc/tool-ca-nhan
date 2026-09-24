import React, { useState } from 'react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { X, User, Mail, Lock, LogIn, UserPlus, LogOut, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { user, authModalOpen, setAuthModalOpen, login, register, logout } = useWorkspaceStore();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (isRegisterMode) {
      if (!name.trim()) return;
      register(name.trim(), email.trim());
    } else {
      login(email.trim(), name.trim() || undefined);
    }
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={() => setAuthModalOpen(false)}
    >
      <div
        className="w-full max-w-md bg-card border-2 border-slate-700 dark:border-slate-600 rounded-3xl shadow-2xl overflow-hidden animate-scaleIn ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-500">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                {user ? 'Tài Khoản Của Bạn' : isRegisterMode ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập Workspace'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {user ? 'Dữ liệu được lưu trữ tự động' : 'Lưu trữ và đồng bộ dữ liệu của bạn'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {user ? (
            /* Logged In View */
            <div className="space-y-5 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-blue-500/25">
                {user.name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <h4 className="text-lg font-bold text-foreground flex items-center justify-center space-x-1.5">
                  <span>{user.name}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </h4>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{user.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/70 border border-border text-left space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Trạng thái đồng bộ:</span>
                  <span className="text-emerald-500 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đang hoạt động (Realtime)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ngày kích hoạt:</span>
                  <span className="font-medium text-foreground">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={() => setAuthModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-sm border border-border transition"
                >
                  Đóng
                </button>
                <button
                  onClick={logout}
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-sm border border-red-500/30 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login / Register Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Họ và tên của bạn</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-primary absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-secondary/80 hover:bg-secondary focus:bg-card pl-10 pr-4 py-2.5 rounded-2xl border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none transition"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-primary absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="email@cuaban.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary/80 hover:bg-secondary focus:bg-card pl-10 pr-4 py-2.5 rounded-2xl border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-primary absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-secondary/80 hover:bg-secondary focus:bg-card pl-10 pr-4 py-2.5 rounded-2xl border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition flex items-center justify-center space-x-2 mt-2"
              >
                {isRegisterMode ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{isRegisterMode ? 'Đăng Ký Tài Khoản Mới' : 'Đăng Nhập Vào Ứng Dụng'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  {isRegisterMode
                    ? 'Đã có tài khoản? Bấm để Đăng nhập'
                    : 'Chưa có tài khoản? Bấm để Đăng ký miễn phí'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
