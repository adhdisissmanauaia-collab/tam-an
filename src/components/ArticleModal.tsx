import React from "react";
import { Article } from "../types";
import { X, Clock, BookOpen, User, CheckCircle2 } from "lucide-react";

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Đóng bài viết"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
          <BookOpen className="w-4 h-4" />
          <span className="uppercase tracking-wider">
            {article.category === "mental_health" && "Sức khỏe tinh thần"}
            {article.category === "relationships" && "Giao tiếp & Bạn bè"}
            {article.category === "family" && "Gia đình & Cha mẹ"}
            {article.category === "study_skills" && "Kỹ năng học tập"}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-3 leading-snug">
          {article.title}
        </h1>

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>Biên soạn: {article.author}</span>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line mb-8">
          {article.content}
        </div>

        {/* Practical tips block */}
        {article.tips && article.tips.length > 0 && (
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 rounded-2xl p-5 mb-6">
            <h4 className="font-bold text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 mb-3 uppercase tracking-wide">
              Hành động thiết thực bạn có thể áp dụng ngay:
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-indigo-950 dark:text-indigo-300">
              {article.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
          >
            Đóng bài viết
          </button>
        </div>
      </div>
    </div>
  );
};
