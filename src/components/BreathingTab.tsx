import React, { useState, useEffect, useRef } from "react";
import { playCalmBell, playSuccessChime } from "../utils/audio";
import { JournalEntry, MoodType } from "../types";
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  PenLine,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  Layers,
  Eye,
  Hand,
  Ear,
  Coffee,
  AlertCircle
} from "lucide-react";

type BreathingPattern = "478" | "box" | "deep";

export const BreathingTab: React.FC = () => {
  // Breathing state
  const [pattern, setPattern] = useState<BreathingPattern>("478");
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "holdPost">("inhale");
  const [timeLeft, setTimeLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Journal state
  const [journalConsent, setJournalConsent] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("taman_journal_consent") === "true";
    }
    return false;
  });
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("taman_journal_entries");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return [
      {
        id: "sample-entry-1",
        date: new Date(Date.now() - 86400000).toLocaleDateString("vi-VN"),
        mood: "stressed",
        tags: ["#thi_thử", "#toán_học"],
        content: "Hôm nay làm bài thi thử điểm chưa như kỳ vọng. Lúc đầu thấy nản, nhưng sau khi hít thở 5 phút và nghỉ ngơi, mình thấy bình tâm hơn để tìm ra các lỗi sai."
      }
    ];
  });
  const [newEntryText, setNewEntryText] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodType>("calm");
  const [selectedTags, setSelectedTags] = useState<string[]>(["#học_tập"]);
  const [journalSuccessMsg, setJournalSuccessMsg] = useState<string | null>(null);

  // Active tool sub-tab
  const [activeTool, setActiveTool] = useState<"breathing" | "grounding" | "journal">("breathing");

  // Grounding 5-4-3-2-1 state
  const [groundingStep, setGroundingStep] = useState(0);

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Pattern configs
  const patternsConfig = {
    "478": {
      name: "Thở 4-7-8 (Giảm lo âu & Dễ ngủ)",
      desc: "Hít sâu 4 giây • Giữ hơi 7 giây • Thở ra nhẹ nhàng 8 giây",
      phases: [
        { type: "inhale" as const, duration: 4, label: "Hít vào từ từ bằng mũi" },
        { type: "hold" as const, duration: 7, label: "Nín thở và giữ bình tĩnh" },
        { type: "exhale" as const, duration: 8, label: "Thở ra chậm rãi qua miệng" }
      ]
    },
    box: {
      name: "Thở hộp - Box Breathing",
      desc: "Hít 4s • Giữ 4s • Thở 4s • Nghỉ 4s (Kỹ thuật cân bằng nhịp tim)",
      phases: [
        { type: "inhale" as const, duration: 4, label: "Hít vào đều đặn" },
        { type: "hold" as const, duration: 4, label: "Giữ hơi thở lại" },
        { type: "exhale" as const, duration: 4, label: "Thở ra từ từ" },
        { type: "holdPost" as const, duration: 4, label: "Tạm dừng và thả lỏng" }
      ]
    },
    deep: {
      name: "Thở sâu 4-4 (Đơn giản)",
      desc: "Hít 4 giây • Thở 4 giây (Thích hợp giải lao nhanh 1 phút)",
      phases: [
        { type: "inhale" as const, duration: 4, label: "Hít vào chậm rãi" },
        { type: "exhale" as const, duration: 4, label: "Thở ra nhẹ nhàng" }
      ]
    }
  };

  // Breathing Engine
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const currentConfig = patternsConfig[pattern];
    const phases = currentConfig.phases;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Phase finished, move to next phase
        const currentIdx = phases.findIndex((p) => p.type === phase);
        const nextIdx = (currentIdx + 1) % phases.length;
        const nextPhase = phases[nextIdx];

        if (nextIdx === 0) {
          setCompletedCycles((c) => c + 1);
          if (soundEnabled) playSuccessChime();
        } else if (soundEnabled) {
          playCalmBell(nextPhase.type === "inhale" ? 432 : nextPhase.type === "exhale" ? 340 : 380);
        }

        setPhase(nextPhase.type);
        return nextPhase.duration;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, pattern, soundEnabled]);

  const handleStartBreathing = () => {
    if (!isActive) {
      const currentConfig = patternsConfig[pattern];
      setPhase(currentConfig.phases[0].type);
      setTimeLeft(currentConfig.phases[0].duration);
      if (soundEnabled) playCalmBell(432);
    }
    setIsActive(!isActive);
  };

  const handleResetBreathing = () => {
    setIsActive(false);
    const currentConfig = patternsConfig[pattern];
    setPhase(currentConfig.phases[0].type);
    setTimeLeft(currentConfig.phases[0].duration);
    setCompletedCycles(0);
  };

  const handlePatternChange = (newPattern: BreathingPattern) => {
    setPattern(newPattern);
    setIsActive(false);
    const currentConfig = patternsConfig[newPattern];
    setPhase(currentConfig.phases[0].type);
    setTimeLeft(currentConfig.phases[0].duration);
    setCompletedCycles(0);
  };

  // Save Journal Entries & Consent
  useEffect(() => {
    localStorage.setItem("taman_journal_consent", String(journalConsent));
  }, [journalConsent]);

  useEffect(() => {
    if (journalConsent) {
      localStorage.setItem("taman_journal_entries", JSON.stringify(journalEntries));
    }
  }, [journalEntries, journalConsent]);

  const handleAddJournalEntry = () => {
    if (!journalConsent) {
      alert("Vui lòng đánh dấu đồng ý lưu nhật ký trên thiết bị của bạn trước.");
      return;
    }
    if (!newEntryText.trim()) return;

    const newEntry: JournalEntry = {
      id: "entry-" + Date.now(),
      date: new Date().toLocaleDateString("vi-VN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      mood: selectedMood,
      tags: selectedTags,
      content: newEntryText.trim()
    };

    setJournalEntries([newEntry, ...journalEntries]);
    setNewEntryText("");
    setJournalSuccessMsg("Đã lưu nhật ký vào bộ nhớ trình duyệt an toàn của máy bạn.");
    setTimeout(() => setJournalSuccessMsg(null), 3000);
  };

  const handleDeleteEntry = (id: string) => {
    setJournalEntries(journalEntries.filter((e) => e.id !== id));
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      if (selectedTags.length > 1) {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
      }
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const groundingSteps = [
    {
      title: "5 điều bạn NHÌN thấy xung quanh",
      desc: "Quan sát căn phòng: chiếc bút chì màu xanh, vệt nắng trên bàn, bức tranh trên tường, cuốn vở mở sẵn, bình nước.",
      icon: <Eye className="w-5 h-5 text-sky-500" />
    },
    {
      title: "4 điều bạn có thể CHẠM vào",
      desc: "Cảm nhận bề mặt: chiếc áo đang mặc, mặt bàn gỗ mát lạnh, chiếc nhẫn trên ngón tay, bàn chân chạm trên mặt sàn.",
      icon: <Hand className="w-5 h-5 text-indigo-500" />
    },
    {
      title: "3 âm thanh bạn NGHE thấy",
      desc: "Lắng nghe thật kỹ: tiếng quạt gió quay rì rào, tiếng xe cộ xa xăm, tiếng tích tắc của đồng hồ hoặc tiếng lá cây.",
      icon: <Ear className="w-5 h-5 text-purple-500" />
    },
    {
      title: "2 mùi hương bạn CẢM NHẬN",
      desc: "Mùi trang giấy mới mở, hương nước giặt áo quần, mùi trà thảo mộc hay không khí trong lành sau cơn mưa.",
      icon: <Wind className="w-5 h-5 text-emerald-500" />
    },
    {
      title: "1 điều TỐT ĐẸP về chính bạn",
      desc: "Nhắc nhở bản thân: Bạn đang nỗ lực hết mình mỗi ngày. Bạn xứng đáng được nghỉ ngơi và trân trọng.",
      icon: <Heart className="w-5 h-5 text-rose-500" />
    }
  ];

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-3">
          <Wind className="w-3.5 h-3.5 text-purple-500" />
          <span>Tự điều hòa cảm xúc & Giải tỏa căng thẳng học tập</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Không Gian Thư Giãn & Cân Bằng Cảm Xúc
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Khi cảm thấy áp lực hay tim đập nhanh, hãy dành ra 3 - 5 phút để đưa cơ thể và tâm trí trở về trạng thái an tĩnh.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTool("breathing")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTool === "breathing"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Bài tập thở nhịp nhàng</span>
        </button>

        <button
          onClick={() => setActiveTool("grounding")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTool === "grounding"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Neo đậu giác quan 5-4-3-2-1</span>
        </button>

        <button
          onClick={() => setActiveTool("journal")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTool === "journal"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <PenLine className="w-4 h-4" />
          <span>Nhật ký cảm xúc an toàn</span>
        </button>
      </div>

      {/* Tool 1: Interactive Breathing Exercise */}
      {activeTool === "breathing" && (
        <div className="space-y-6">
          {/* Pattern selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["478", "box", "deep"] as BreathingPattern[]).map((p) => {
              const isSelected = pattern === p;
              return (
                <button
                  key={p}
                  onClick={() => handlePatternChange(p)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/10"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">
                    {patternsConfig[p].name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {patternsConfig[p].desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Visual Circle */}
          <div className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            {/* Sound toggle button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="absolute top-4 right-4 p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Bật/Tắt chuông thiền"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? "Chuông: Bật" : "Chuông: Tắt"}</span>
            </button>

            {/* Cycles counter */}
            <div className="mb-6 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              Đã hoàn thành: <span className="font-bold">{completedCycles}</span> chu kỳ
            </div>

            {/* Animated Circle Container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-8">
              {/* Outer pulsing ring */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  phase === "inhale"
                    ? "scale-105 bg-sky-200/40 dark:bg-sky-500/20"
                    : phase === "hold" || phase === "holdPost"
                    ? "scale-100 bg-purple-200/40 dark:bg-purple-500/20"
                    : "scale-90 bg-teal-200/40 dark:bg-teal-500/20"
                }`}
              />

              {/* Main Animated Circle */}
              <div
                className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center text-center shadow-xl transition-all duration-1000 ${
                  phase === "inhale"
                    ? "scale-105 bg-gradient-to-tr from-sky-400 to-indigo-500 text-white shadow-sky-500/30"
                    : phase === "hold" || phase === "holdPost"
                    ? "scale-100 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-purple-500/30"
                    : "scale-90 bg-gradient-to-tr from-teal-400 to-emerald-500 text-white shadow-emerald-500/30"
                }`}
              >
                <span className="text-4xl sm:text-5xl font-black mb-1">
                  {timeLeft}s
                </span>
                <span className="text-xs sm:text-sm font-bold tracking-wide uppercase px-4">
                  {phase === "inhale"
                    ? "Hít vào"
                    : phase === "hold" || phase === "holdPost"
                    ? "Nín thở"
                    : "Thở ra"}
                </span>
              </div>
            </div>

            {/* Instruction description */}
            <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 text-center mb-6 max-w-sm h-6">
              {patternsConfig[pattern].phases.find((p) => p.type === phase)?.label}
            </p>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleStartBreathing}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 ${
                  isActive
                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25"
                }`}
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isActive ? "Tạm dừng" : "Bắt đầu bài thở"}</span>
              </button>

              <button
                onClick={handleResetBreathing}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                title="Đặt lại"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tool 2: Grounding 5-4-3-2-1 */}
      {activeTool === "grounding" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Kỹ Thuật Neo Đậu Giác Quan 5-4-3-2-1
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Khi tâm trí bị cuốn vào nỗi lo sợ về tương lai hay điểm thi, bài tập này giúp kéo suy nghĩ của bạn quay trở về khoảnh khắc hiện tại bằng các giác quan thực tế.
            </p>
          </div>

          <div className="space-y-4">
            {groundingSteps.map((step, idx) => {
              const isCurrent = groundingStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setGroundingStep(idx)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-sm"
                      : "bg-slate-50/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {step.title}
                        </h4>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          Bước {idx + 1}/5
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setGroundingStep((prev) => Math.max(0, prev - 1))}
              disabled={groundingStep === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              Bước trước
            </button>
            <button
              onClick={() => {
                if (groundingStep < groundingSteps.length - 1) {
                  setGroundingStep((prev) => prev + 1);
                } else {
                  playSuccessChime();
                  alert("Chúc mừng em đã hoàn thành bài tập neo đậu giác quan! Cảm xúc của em đã dần ổn định lại rồi đấy.");
                }
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            >
              {groundingStep === groundingSteps.length - 1 ? "Hoàn tất bài tập" : "Bước tiếp theo →"}
            </button>
          </div>
        </div>
      )}

      {/* Tool 3: Mood & Emotion Journal */}
      {activeTool === "journal" && (
        <div className="space-y-6">
          {/* Explicit Consent Notice */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
                  Chính sách bảo mật nhật ký cảm xúc
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Nhật ký này hoàn toàn thuộc về bạn và được lưu trữ an toàn trong <strong>bộ nhớ trình duyệt (localStorage) trên thiết bị cá nhân của bạn</strong>. Dữ liệu này không gửi lên máy chủ hay chia sẻ với bất kỳ ai.
                </p>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={journalConsent}
                    onChange={(e) => setJournalConsent(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                    Tôi đồng ý lưu trữ nhật ký cảm xúc trên thiết bị này.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* New Journal Entry Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PenLine className="w-5 h-5 text-indigo-500" />
              Viết xả cảm xúc hôm nay
            </h3>

            {/* Mood selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                Tâm trạng chính:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(
                  [
                    { id: "calm", label: "Bình an", icon: "🌱" },
                    { id: "happy", label: "Vui vẻ", icon: "☀️" },
                    { id: "anxious", label: "Lo âu", icon: "🌪️" },
                    { id: "stressed", label: "Căng thẳng", icon: "🔥" },
                    { id: "sad", label: "Buồn bã", icon: "🌧️" },
                    { id: "exhausted", label: "Kiệt sức", icon: "🔋" }
                  ] as Array<{ id: MoodType; label: string; icon: string }>
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedMood === m.id
                        ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xl block mb-0.5">{m.icon}</span>
                    <span className="text-xs">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                Chủ đề liên quan:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["#học_tập", "#thi_thử", "#bạn_bè", "#gia_đình", "#giấc_ngủ", "#bài_tập"].map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        isChecked
                          ? "bg-purple-100 dark:bg-purple-950/70 border-purple-400 text-purple-700 dark:text-purple-300"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note text area */}
            <div>
              <textarea
                rows={4}
                value={newEntryText}
                onChange={(e) => setNewEntryText(e.target.value)}
                placeholder="Hôm nay điều gì làm bạn suy nghĩ nhiều nhất? Bạn cảm thấy thế nào trong cơ thể? Cứ viết tự do ra trang giấy này nhé..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {journalSuccessMsg && (
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{journalSuccessMsg}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleAddJournalEntry}
                disabled={!newEntryText.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-40"
              >
                Lưu vào nhật ký
              </button>
            </div>
          </div>

          {/* Past Journal Entries Timeline */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nhật ký đã ghi ({journalEntries.length})
            </h3>

            {journalEntries.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500 text-xs">
                Chưa có nhật ký nào được lưu. Hãy viết trang đầu tiên của bạn nhé!
              </div>
            ) : (
              journalEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2 relative group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                      <span>{entry.date}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {entry.mood === "calm" && "🌱 Bình an"}
                        {entry.mood === "happy" && "☀️ Vui vẻ"}
                        {entry.mood === "anxious" && "🌪️ Lo âu"}
                        {entry.mood === "stressed" && "🔥 Căng thẳng"}
                        {entry.mood === "sad" && "🌧️ Buồn bã"}
                        {entry.mood === "exhausted" && "🔋 Kiệt sức"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="Xóa mục nhật ký này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Wellness & Time Management Tips */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <Coffee className="w-5 h-5 text-amber-500" />
          Gợi ý nghỉ ngơi và bảo vệ năng lượng mùa thi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
              Quy tắc mắt 20-20-20
            </h4>
            <p className="leading-relaxed">
              Cứ sau 20 phút nhìn sách hoặc máy tính, hãy nhìn xa 20 feet (khoảng 6 mét) trong 20 giây để cơ mắt được thư giãn hoàn toàn.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
              Chu kỳ giấc ngủ 90 phút
            </h4>
            <p className="leading-relaxed">
              Ngủ đủ chu kỳ (ví dụ 6 tiếng hoặc 7.5 tiếng) để thức dậy ở giai đoạn giấc ngủ nhẹ, giúp bạn tỉnh táo và không bị váng đầu khi thi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
              Nước ấm & Giãn cơ
            </h4>
            <p className="leading-relaxed">
              Khi lo lắng, dạ dày dễ bị co thắt. Uống từng ngụm nước ấm nhỏ và xoay nhẹ khớp cổ, vai gáy để giải tỏa ức chế thần kinh.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-amber-800 dark:text-amber-300/80 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>Lưu ý:</strong> Các bài tập trên là công cụ hỗ trợ tự điều hòa cảm xúc học đường và không mang tính chẩn đoán bệnh lý tâm thần y khoa.
          </span>
        </div>
      </div>
    </div>
  );
};
