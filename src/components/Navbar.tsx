import React from "react";
import { TabType } from "../types";
import { useTheme } from "../context/ThemeContext";
import {
  HeartHandshake,
  MessageCircle,
  Wind,
  CalendarCheck,
  BookOpen,
  Home,
  Sun,
  Moon,
  PhoneCall,
  Sparkles
} from "lucide-react";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenEmergency: () => void;
  apiStatus: { configured: boolean; mode: string } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  apiStatus
}) => {
  const { theme, toggleTheme } = useTheme();

  const navItems: Array<{ id: TabType; label: string; icon: React.ReactNode; shortLabel: string }> = [
    { id: "home", label: "Trang chủ", icon: <Home className="w-4 h-4" />, shortLabel: "Trang chủ" },
    { id: "chat", label: "Chatbot Tâm An", icon: <MessageCircle className="w-4 h-4" />, shortLabel: "Trò chuyện" },
    { id: "breathing", label: "Giải tỏa áp lực", icon: <Wind className="w-4 h-4" />, shortLabel: "Giải tỏa" },
    { id: "exam", label: "Tư vấn mùa thi", icon: <CalendarCheck className="w-4 h-4" />, shortLabel: "Mùa thi" },
    { id: "resources", label: "Tài nguyên & Hỗ trợ", icon: <BookOpen className="w-4 h-4" />, shortLabel: "Tài nguyên" }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-purple-100/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 group text-left transition-transform active:scale-95"
            title="Về Trang chủ Tâm An AI"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-400 to-purple-500 p-0.5 shadow-md shadow-purple-500/15 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-sky-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                  TÂM AN AI
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {apiStatus?.mode === "live" ? "AI Live" : "Sẵn sàng"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Trợ lý tâm lý học đường & mùa thi
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-slate-300/40 dark:shadow-none"
                      : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <span className={isActive ? "text-indigo-500" : "text-slate-400 dark:text-slate-500"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all shadow-sm active:scale-95"
              title="Đường dây nóng hỗ trợ khẩn cấp"
            >
              <PhoneCall className="w-4 h-4 text-rose-500 animate-bounce" />
              <span>SOS 111</span>
            </button>

            {/* Dark/Light toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 active:scale-95"
              aria-label="Chuyển chế độ sáng tối"
              title={theme === "light" ? "Bật chế độ tối" : "Bật chế độ sáng"}
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-semibold transition-all ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/60"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`}>
                  {item.icon}
                </div>
                <span className="truncate max-w-[58px]">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
