import React, { useState } from "react";
import { TabType } from "../types";
import {
  HeartHandshake,
  MessageCircle,
  Wind,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Clock
} from "lucide-react";

interface HomeTabProps {
  setActiveTab: (tab: TabType) => void;
  onStartChatWithPrompt?: (prompt: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab, onStartChatWithPrompt }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moodOptions = [
    { id: "calm", label: "Ổn & Bình an", icon: "🌱", prompt: "Chào Tâm An, hôm nay tâm trạng em khá ổn và muốn học cách giữ vững tinh thần này." },
    { id: "stressed", label: "Đang áp lực bài vở", icon: "📚", prompt: "Em đang cảm thấy rất áp lực với khối lượng bài vở và kỳ thi sắp tới." },
    { id: "anxious", label: "Lo lắng & Bất an", icon: "🌪️", prompt: "Em cảm thấy bồn chồn, lo lắng và tim đập nhanh mỗi khi nghĩ đến việc kiểm tra." },
    { id: "tired", label: "Mệt mỏi & Thiếu ngủ", icon: "😴", prompt: "Dạo này em cảm thấy kiệt sức, ngủ không ngon và không có động lực mở sách ra học." },
    { id: "lonely", label: "Không biết nói cùng ai", icon: "🌧️", prompt: "Em không biết chia sẻ với ai trong lớp hay ở nhà, em thấy cô đơn quá." }
  ];

  const handleSelectMood = (mood: typeof moodOptions[0]) => {
    setSelectedMood(mood.id);
    if (onStartChatWithPrompt) {
      onStartChatWithPrompt(mood.prompt);
    } else {
      setActiveTab("chat");
    }
  };

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-indigo-50/70 to-purple-50/80 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-100/80 dark:border-indigo-950 p-6 sm:p-10 lg:p-12 shadow-sm">
        {/* Soft background decor circle */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-600/10 dark:to-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-gradient-to-tr from-sky-200/40 to-teal-200/40 dark:from-sky-600/10 dark:to-teal-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Đồng hành cùng học sinh Việt Nam trong mọi mùa thi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-tight mb-4">
            Chào bạn, mình là{" "}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-sky-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
              Tâm An AI
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-normal">
            Một không gian lắng nghe ấm áp, không phán xét. Nơi bạn có thể trút bỏ áp lực điểm số, gỡ rối bất hòa bạn bè, học cách hít thở thư giãn và cùng nhau lập kế hoạch ôn thi khoa học.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveTab("chat")}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Trò chuyện ngay cùng Tâm An</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => setActiveTab("breathing")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base border border-slate-200 dark:border-slate-700 shadow-sm transition-all active:scale-95"
            >
              <Wind className="w-5 h-5 text-sky-500" />
              <span>Bài tập thở giảm stress</span>
            </button>
          </div>
        </div>
      </section>

      {/* Mood Quick Check-in */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Smile className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Hôm nay cảm xúc của bạn thế nào?
            </h2>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
            Chọn để trò chuyện đúng cảm xúc
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
          Đôi khi gọi tên được cảm xúc của chính mình là bước đầu tiên để lòng nhẹ nhõm hơn.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {moodOptions.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleSelectMood(mood)}
              className="flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-all hover:scale-[1.02] active:scale-95 group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {mood.icon}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {mood.label}
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Tâm sự ngay →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3 Main Focus Areas */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Ba trụ cột đồng hành cùng bạn
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Được xây dựng dựa trên nhu cầu tâm lý học đường thực tế của học sinh Việt Nam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 transition-all shadow-sm flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                1. Tâm lý học đường
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Lắng nghe các vướng mắc về tình bạn, hiểu lầm trong lớp, áp lực kỳ vọng từ cha mẹ hay cảm giác lạc lõng không ai thấu hiểu.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Đối thoại ân cần, bảo mật trên máy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Không phán xét, không trách móc</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab("chat")}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Vào phòng trò chuyện</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all shadow-sm flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                2. Giải tỏa áp lực thi cử
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Bộ công cụ thực hành nhanh giúp hạ nhiệt căng thẳng, lấy lại bình tĩnh trước giờ kiểm tra hoặc khi cảm thấy quá tải.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Đồng hồ thở trực quan 4-7-8 & chuông thiền</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Nhật ký cảm xúc an toàn (chỉ lưu trên máy bạn)</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab("breathing")}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Thực hành thư giãn ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all shadow-sm flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                3. Tư vấn mùa thi khoa học
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Chia nhỏ nhiệm vụ lớn thành từng mục tiêu 30-45 phút, phương pháp Spaced Repetition, chu kỳ ngủ 90 phút và checklist phòng thi.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Tự động chia nhỏ khối lượng ôn tập</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Danh sách đồ dùng đi thi chuẩn Bộ GD&ĐT</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab("exam")}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Xem lịch ôn thi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* How to use Tâm An AI */}
      <section className="bg-gradient-to-r from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Hướng dẫn sử dụng Chatbot Tâm An AI hiệu quả
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs mb-3">
              1
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              Mở lòng & chọn chủ đề
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Nhập những băn khoăn của bạn hoặc bấm vào các câu hỏi gợi ý nhanh. Bạn không cần phải viết tròn câu hay sợ viết sai.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs mb-3">
              2
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              Nhận phản hồi & bước đi nhỏ
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tâm An sẽ lắng nghe cảm xúc trước, sau đó gợi ý từng hành động nhỏ nhất mà bạn có thể làm ngay lúc này.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs mb-3">
              3
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              Kết hợp công cụ thực hành
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Chuyển sang bài tập thở khi tim đập nhanh, hoặc dùng nhật ký cảm xúc để giải tỏa tâm trí trước khi ngủ.
            </p>
          </div>
        </div>
      </section>

      {/* Medical & Psychological Disclaimer banner */}
      <section className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start gap-4">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-700 dark:text-amber-300 shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm sm:text-base">
            Thông báo quan trọng về phạm vi hỗ trợ:
          </h4>
          <p>
            Tâm An AI là hệ thống trợ lý đồng hành nhằm mục đích <strong>giáo dục, tư vấn phương pháp và tự điều hòa cảm xúc học sinh</strong>.
            AI <strong>không thay thế cho bác sĩ tâm thần, nhà tâm lý học trị liệu hoặc việc chẩn đoán y khoa</strong>.
          </p>
          <p className="text-amber-800 dark:text-amber-300 font-medium">
            Nếu bạn đang gặp khủng hoảng nghiêm trọng hoặc cảm thấy không an toàn, hãy lập tức gọi <strong>Tổng đài Quốc gia 111 (miễn phí 24/7)</strong> hoặc tìm sự hỗ trợ trực tiếp từ phụ huynh, thầy cô giáo.
          </p>
        </div>
      </section>
    </div>
  );
};
