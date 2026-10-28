import React from "react";
import { EMERGENCY_HOTLINES } from "../data/mockData";
import { Phone, ShieldAlert, X, AlertTriangle, Heart, UserCheck } from "lucide-react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-950/70 rounded-2xl">
            <ShieldAlert className="w-7 h-7 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Trợ Giúp Khẩn Cấp & An Toàn Học Đường
            </h2>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              Bạn không phải chịu đựng một mình • Luôn có sự trợ giúp sẵn sàng 24/7
            </p>
          </div>
        </div>

        <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-rose-700 dark:text-rose-300 font-semibold block mb-1">
                Lưu ý quan trọng từ Tâm An AI:
              </strong>
              Tâm An AI là trợ lý mô phỏng và <strong>không thể thay thế bác sĩ hay dịch vụ cấp cứu</strong>.
              Nếu bạn đang có suy nghĩ muốn tự làm đau bản thân, muốn kết thúc cuộc sống, hoặc đang bị bạo lực đe dọa, hãy gọi ngay cho đường dây nóng miễn cước bên dưới hoặc tìm người lớn gần nhất!
            </div>
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Đường dây nóng hỗ trợ khẩn cấp (Việt Nam)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {EMERGENCY_HOTLINES.map((hotline) => (
            <div
              key={hotline.phone}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {hotline.name}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {hotline.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                {hotline.desc}
              </p>
              <a
                href={`tel:${hotline.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-transform active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi ngay: {hotline.phone}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-4">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-purple-500" />
            4 Bước hành động bảo vệ bản thân khi hoảng loạn:
          </h4>
          <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
            <li><strong>Dừng lại:</strong> Rời khỏi không gian căng thẳng, ngồi xuống nơi an toàn và uống một ngụm nước mát.</li>
            <li><strong>Thở chậm:</strong> Đặt tay lên bụng, hít vào bằng mũi trong 4 giây và thở ra nhẹ qua môi trong 6 giây.</li>
            <li><strong>Tìm người lớn:</strong> Đến ngay bên bố mẹ, thầy cô chủ nhiệm hoặc anh chị em ruột, nói: <em>"Con đang rất bất an và cần được ở cạnh người lớn."</em></li>
            <li><strong>Kết nối chuyên gia:</strong> Gọi số <strong>111</strong> nếu bạn không thể chia sẻ được với người trong gia đình.</li>
          </ol>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
          >
            Tôi đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
