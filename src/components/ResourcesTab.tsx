import React, { useState } from "react";
import { Article } from "../types";
import { SAMPLE_ARTICLES, EMERGENCY_HOTLINES } from "../data/mockData";
import { ArticleModal } from "./ArticleModal";
import {
  BookOpen,
  Search,
  Filter,
  Users,
  GraduationCap,
  HeartHandshake,
  ShieldAlert,
  PhoneCall,
  Clock,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  ExternalLink
} from "lucide-react";

interface ResourcesTabProps {
  onOpenEmergency: () => void;
}

export const ResourcesTab: React.FC<ResourcesTabProps> = ({ onOpenEmergency }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  const categories = [
    { id: "all", label: "Tất cả chủ đề" },
    { id: "mental_health", label: "Sức khỏe tinh thần" },
    { id: "relationships", label: "Giao tiếp & Bạn bè" },
    { id: "family", label: "Gia đình & Cha mẹ" },
    { id: "study_skills", label: "Kỹ năng học tập" }
  ];

  const filteredArticles = SAMPLE_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === "all" || art.category === selectedCategory;
    const matchesQuery =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-sky-500" />
          <span>Thư viện kiến thức & Mạng lưới đồng hành</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Tài Nguyên Tâm Lý & Hỗ Trợ Học Đường
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Trang bị kiến thức khoa học về cảm xúc, kỹ năng giao tiếp hòa giải và hướng dẫn từng bước kết nối với người lớn đáng tin cậy.
        </p>
      </div>

      {/* Emergency Quick Action Banner */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-rose-100">
            <ShieldAlert className="w-4 h-4" />
            <span>Hỗ trợ khẩn cấp khi cảm thấy không an toàn</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Cần người giúp đỡ ngay lập tức?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
            Nếu bạn đang gặp nguy hiểm, bị bạo lực học đường hoặc có ý định tự làm đau mình, hãy gọi ngay đường dây nóng miễn cước 24/7.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="tel:111"
            className="px-5 py-2.5 rounded-2xl bg-white text-rose-600 font-extrabold text-sm shadow-md hover:bg-rose-50 transition-all flex items-center gap-2 active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-rose-500" />
            <span>Gọi 111 (Miễn phí)</span>
          </a>
          <button
            onClick={onOpenEmergency}
            className="px-4 py-2.5 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs sm:text-sm transition-colors"
          >
            Xem danh bạ cứu trợ
          </button>
        </div>
      </div>

      {/* Section 1: Support Network Guide (Phụ huynh, Giáo viên, Chuyên viên) */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Tìm kiếm sự hỗ trợ từ mạng lưới xung quanh
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Bạn không cần phải tự mình gánh vác tất cả. Dưới đây là cách mở lời phù hợp với từng đối tượng:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Cha Mẹ / Người Nuôi Dưỡng */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                Gia đình & Cha mẹ
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Khi cần chia sẻ về áp lực học tập, định hướng ngành nghề hoặc vấn đề sức khỏe.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <strong className="text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                Gợi ý câu mở lời:
              </strong>
              <p className="italic">
                "Bố/mẹ ơi, tối nay con có thể xin 15 phút nói chuyện chân thành không ạ? Dạo này con cảm thấy áp lực bài vở rất lớn và con muốn được bố mẹ lắng nghe."
              </p>
            </div>
          </div>

          {/* Card: Thầy Cô / Phòng Tâm Lý Trường */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                Thầy cô & Tham vấn học đường
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Khi gặp khó khăn bài học, bất hòa với bạn cùng lớp hoặc cảm thấy bị cô lập.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <strong className="text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                Gợi ý câu mở lời:
              </strong>
              <p className="italic">
                "Thưa thầy/cô, em đang gặp chút trục trặc trong việc theo kịp tiến độ học trên lớp và giao tiếp với nhóm bạn. Em có thể xin thầy/cô một buổi tư vấn ngắn sau giờ học được không ạ?"
              </p>
            </div>
          </div>

          {/* Card: Chuyên viên Tâm lý & Y tế */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                Chuyên viên Tâm lý & Y tế
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Khi tình trạng mất ngủ kéo dài trên 2 tuần, chán ăn, hoảng loạn hoặc kiệt sức trầm trọng.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <strong className="text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                Đơn vị tư vấn uy tín:
              </strong>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Viện Sức khỏe Tâm thần – BV Bạch Mai</li>
                <li>Khoa Tâm lý – BV Nhi Trung ương / BV Nhi Đồng</li>
                <li>Đường dây nóng Ngày Mai: 096 306 1414</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Articles Library */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
              Bài viết kỹ năng & Sức khỏe tinh thần
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Kiến thức được biên soạn dễ hiểu, phù hợp với tâm lý lứa tuổi học sinh
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết, chủ đề..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredArticles.length === 0 ? (
            <div className="col-span-2 p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-xs sm:text-sm">
              Không tìm thấy bài viết nào phù hợp với từ khóa "{searchQuery}".
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setReadingArticle(article)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {article.category === "mental_health" && "Sức khỏe tinh thần"}
                      {article.category === "relationships" && "Giao tiếp & Bạn bè"}
                      {article.category === "family" && "Gia đình & Cha mẹ"}
                      {article.category === "study_skills" && "Kỹ năng học tập"}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Đọc toàn bộ bài viết</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Article Detail Reader Modal */}
      <ArticleModal
        article={readingArticle}
        onClose={() => setReadingArticle(null)}
      />
    </div>
  );
};
