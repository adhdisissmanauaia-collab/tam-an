import React from "react";
import { TabType } from "../types";
import { HeartHandshake, ShieldCheck, Heart, Sparkles, PhoneCall, ExternalLink } from "lucide-react";

interface FooterProps {
  setActiveTab: (tab: TabType) => void;
  onOpenEmergency: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenEmergency }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-24 lg:pb-12 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                TÂM AN AI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-md leading-relaxed">
              Trợ lý đồng hành cùng học sinh Việt Nam. Lắng nghe không phán xét, giải tỏa căng thẳng thi cử, hướng dẫn phương pháp học tập khoa học và kết nối hỗ trợ tâm lý học đường.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 px-3 py-2 rounded-xl inline-flex">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Bảo vệ quyền riêng tư: Không yêu cầu danh tính thực, dữ liệu lưu cục bộ trên máy bạn.</span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Tính năng chính
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => setActiveTab("chat")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  💬 Chatbot Tâm lý học đường
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("breathing")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  🍃 Bài tập thở & Giải tỏa stress
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("exam")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  📅 Lập kế hoạch ôn thi khoa học
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("resources")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  📚 Kỹ năng & Mạng lưới hỗ trợ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hotlines */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Hỗ trợ khẩn cấp 24/7
            </h4>
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">Tổng đài BV Trẻ em:</span>
                <a href="tel:111" className="font-bold text-rose-600 dark:text-rose-400 text-sm flex items-center gap-1.5 hover:underline">
                  <PhoneCall className="w-3.5 h-3.5" /> 111 (Miễn cước)
                </a>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">Đường dây nóng Ngày Mai:</span>
                <a href="tel:0963061414" className="font-bold text-indigo-600 dark:text-indigo-400 text-sm flex items-center gap-1.5 hover:underline">
                  <PhoneCall className="w-3.5 h-3.5" /> 096 306 1414
                </a>
              </div>
              <button
                onClick={onOpenEmergency}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1 mt-1"
              >
                Xem đầy đủ số liên lạc SOS <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs leading-relaxed mb-6">
            <strong>Tuyên bố miễn trừ trách nhiệm y tế & tâm lý:</strong> TÂM AN AI là hệ thống trợ lý học đường tự động nhằm cung cấp không gian lắng nghe, các bài tập tự điều hòa cảm xúc và gợi ý phương pháp học tập. AI <strong>không phải là bác sĩ tâm thần hay nhà tâm lý học lâm sàng</strong>, không đưa ra chẩn đoán bệnh lý hay phác đồ điều trị. Khi gặp các vấn đề sức khỏe nghiêm trọng, bạn hãy luôn trao đổi với phụ huynh, giáo viên hoặc chuyên gia y tế có chuyên môn.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
            <p>© {new Date().getFullYear()} Tâm An AI – Trợ lý đồng hành cùng học sinh.</p>
            <p className="flex items-center gap-1">
              Được thiết kế với sự thấu hiểu và <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> dành cho học sinh Việt Nam.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
