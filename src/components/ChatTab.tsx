import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import {
  Send,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Bot,
  User,
  Volume2,
  VolumeX,
  Copy,
  Check,
  PhoneCall,
  Info,
  Shield,
  HelpCircle,
  RefreshCw
} from "lucide-react";

interface ChatTabProps {
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
  onOpenEmergency: () => void;
  apiStatus: { configured: boolean; mode: string } | null;
}

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: "welcome-msg",
  role: "model",
  content: `Chào bạn! Mình là Tâm An AI – Trợ lý học đường toàn diện đồng hành cùng bạn.

Tâm An sẵn sàng giải đáp TẤT CẢ các câu hỏi của bạn:
✨ Lắng nghe tâm sự, giải tỏa căng thẳng & áp lực thi cử
📚 Giải thích bài học các môn (Toán, Văn, Anh, Lý, Hóa, Sinh, Sử, Địa, GDCD...)
🎯 Mẹo làm bài thi, kỹ thuật nhớ lâu, phương pháp bấm máy tính Casio
🧭 Định hướng chọn khối thi (A, B, C, D...), chọn ngành học và trường đại học

Bạn đang có câu hỏi hay bài tập nào cần Tâm An giải đáp ngay lúc này?`,
  timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
};

export const ChatTab: React.FC<ChatTabProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  onOpenEmergency,
  apiStatus
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("taman_chat_history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    "Em đang cảm thấy áp lực bài vở.",
    "Mẹo học từ vựng tiếng Anh nhớ lâu?",
    "Cách viết mở bài môn Văn ấn tượng?",
    "Mẹo bấm máy tính Casio giải Toán?",
    "Làm sao chống buồn ngủ khi ôn thi?",
    "Nên chọn khối thi nào nếu thích công nghệ?",
    "Làm sao khi bị bố mẹ so sánh?"
  ];

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("taman_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle incoming initial prompt from Home tab
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== "") {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    };

    const aiMessageId = "msg-" + (Date.now() + 1) + "-ai";
    const initialAiMessage: ChatMessage = {
      id: aiMessageId,
      role: "model",
      content: "",
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      isCrisis: false,
      isDemo: false
    };

    setMessages((prev) => [...prev, userMessage, initialAiMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);
    setStreamingMessageId(aiMessageId);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      // Try ultra-fast streaming SSE endpoint first
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload
        })
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Bạn đang gửi tin nhắn hơi nhanh. Hãy đợi một chút nhé!");
        }
        throw new Error("Không thể kết nối đến máy chủ. Đang thử lại...");
      }

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedText = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data:")) {
              const dataStr = trimmed.replace("data:", "").trim();
              if (dataStr) {
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text) {
                    accumulatedText += parsed.text;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === aiMessageId
                          ? {
                              ...m,
                              content: accumulatedText,
                              isCrisis: parsed.isCrisis ?? m.isCrisis,
                              isDemo: parsed.isDemo ?? m.isDemo
                            }
                          : m
                      )
                    );
                  }
                  if (parsed.done) {
                    setIsLoading(false);
                    setStreamingMessageId(null);
                  }
                } catch {
                  // ignore JSON parse chunk errors
                }
              }
            }
          }
        }
      } else {
        // Fallback for non-streaming response
        const fallbackRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history: historyPayload })
        });
        const data = await fallbackRes.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId
              ? {
                  ...m,
                  content: data.reply || "Tâm An đã lắng nghe bạn.",
                  isCrisis: data.isCrisis,
                  isDemo: data.isDemo
                }
              : m
          )
        );
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorMessage(err.message || "Đã xảy ra lỗi khi gửi tin nhắn.");
      // Clean up empty placeholder if failed
      setMessages((prev) => prev.filter((m) => m.id !== aiMessageId || m.content.length > 0));
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    localStorage.removeItem("taman_chat_history");
    setShowClearConfirm(false);
    setErrorMessage(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text: string, id: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Trình duyệt của bạn không hỗ trợ đọc giọng nói.");
      return;
    }

    if (isSpeaking === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.9; // gentle pace for students
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 h-[calc(100vh-140px)] min-h-[560px] flex flex-col">
      {/* Top Chat Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Bot className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Tâm An AI
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Lắng nghe & Thấu cảm
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span>⚡ Phản hồi siêu tốc</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Không gian an toàn • Lắng nghe không phán xét • Bảo mật trên thiết bị
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Xóa cuộc trò chuyện & bắt đầu lại"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bắt đầu lại</span>
          </button>
        </div>
      </div>

      {/* Demo Mode Notice Banner if not configured */}
      {apiStatus && !apiStatus.configured && (
        <div className="mb-3 px-4 py-2.5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex items-center justify-between text-xs text-sky-800 dark:text-sky-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400" />
            <span>
              <strong>Chế độ mô phỏng thông minh (Demo Mode):</strong> Hệ thống đang sử dụng phản hồi mô phỏng mẫu. Khi cấu hình <code>GEMINI_API_KEY</code> ở server, chatbot sẽ kết nối trực tiếp với Google Gemini AI.
            </span>
          </div>
        </div>
      )}

      {/* Main Messages Container */}
      <div className="flex-1 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 overflow-y-auto space-y-4 backdrop-blur-sm shadow-inner">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs shadow-sm ${
                  isUser
                    ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
                    : "bg-gradient-to-tr from-sky-400 to-indigo-500 text-white"
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-3xl px-4 sm:px-5 py-3.5 shadow-sm text-sm sm:text-[15px] leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : message.isCrisis
                    ? "bg-rose-50 dark:bg-rose-950/60 text-slate-800 dark:text-slate-100 border-2 border-rose-300 dark:border-rose-800 rounded-tl-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-sm"
                }`}
              >
                {/* Crisis Header Alert */}
                {message.isCrisis && (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold mb-2 pb-2 border-b border-rose-200 dark:border-rose-900">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span className="text-xs uppercase tracking-wide">
                      Cảnh báo an toàn tâm lý
                    </span>
                  </div>
                )}

                {/* Content formatted with clean line breaks & streaming cursor */}
                {message.id === streamingMessageId && message.content === "" ? (
                  <div className="flex items-center gap-2 py-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Tâm An đang phản hồi ngay...
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></span>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                    {message.id === streamingMessageId && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 animate-pulse align-middle" />
                    )}
                  </div>
                )}

                {/* Crisis SOS Quick Hotline Button */}
                {message.isCrisis && (
                  <div className="mt-4 pt-3 border-t border-rose-200 dark:border-rose-900 flex flex-wrap gap-2">
                    <button
                      onClick={onOpenEmergency}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Xem số điện thoại khẩn cấp 111</span>
                    </button>
                    <a
                      href="tel:111"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-rose-600 border border-rose-300 dark:border-rose-800 text-xs font-bold hover:bg-rose-50 transition-colors"
                    >
                      <span>Bấm gọi 111 (Miễn phí)</span>
                    </a>
                  </div>
                )}

                {/* Bubble Footer info & buttons */}
                <div
                  className={`mt-2 flex items-center justify-between text-[11px] gap-2 pt-1 border-t ${
                    isUser
                      ? "border-indigo-500/40 text-indigo-200"
                      : "border-slate-200/40 dark:border-slate-700/40 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <span>{message.timestamp}</span>

                  {!isUser && message.content && (
                    <div className="flex items-center gap-1.5">
                      {/* Speak button */}
                      <button
                        onClick={() => speakText(message.content, message.id)}
                        className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded"
                        title={isSpeaking === message.id ? "Dừng đọc" : "Nghe đọc nhẹ nhàng"}
                      >
                        {isSpeaking === message.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Copy button */}
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded"
                        title="Sao chép nội dung"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => handleSendMessage()}
              className="font-bold underline ml-2 flex items-center gap-1 hover:text-rose-900"
            >
              <RefreshCw className="w-3 h-3" /> Thử lại
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Gợi ý:
          </span>
          {suggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sug)}
              disabled={isLoading}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-2.5 sm:p-3 shadow-md focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi Tâm An bất cứ câu hỏi nào về bài tập, môn học, tâm lý hay kỳ thi... (Nhấn Enter để gửi)"
            className="flex-1 bg-transparent border-0 resize-none focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm sm:text-base px-2 py-1 max-h-32"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 active:scale-95 shrink-0"
            aria-label="Gửi tin nhắn"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="px-2 pt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80 mt-1.5">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            Không lưu dữ liệu định danh cá nhân
          </span>
          <span>
            {input.length}/2500 ký tự
          </span>
        </div>
      </div>

      {/* Confirm Clear Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Xóa cuộc trò chuyện?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              Hành động này sẽ xóa toàn bộ lịch sử trò chuyện hiện tại trên trình duyệt của bạn. Bạn sẽ bắt đầu một cuộc trò chuyện mới tinh.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleClearChat}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
