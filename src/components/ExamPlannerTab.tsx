import React, { useState, useEffect } from "react";
import { ExamSubject, ExamTask } from "../types";
import {
  INITIAL_EXAM_SUBJECTS,
  INITIAL_EXAM_TASKS,
  EXAM_ROOM_CHECKLIST
} from "../data/mockData";
import { playSuccessChime } from "../utils/audio";
import {
  CalendarCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  BookOpen,
  CheckSquare,
  AlertCircle,
  ListTodo,
  Calendar,
  Layers,
  Moon,
  ShieldCheck,
  PackageCheck
} from "lucide-react";

export const ExamPlannerTab: React.FC = () => {
  // Subjects
  const [subjects, setSubjects] = useState<ExamSubject[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("taman_exam_subjects");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_EXAM_SUBJECTS;
  });

  // Tasks
  const [tasks, setTasks] = useState<ExamTask[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("taman_exam_tasks");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_EXAM_TASKS;
  });

  // Exam Room Checklist (stored locally)
  const [checkedItems, setCheckedItems] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("taman_room_checklist");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return ["c1", "c3"];
  });

  // Filter
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");

  // Form states for adding subject
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubTarget, setNewSubTarget] = useState("8.0");
  const [newSubDate, setNewSubDate] = useState("2026-06-25");
  const [newSubHours, setNewSubHours] = useState(2);

  // Form states for adding task
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState(subjects[0]?.name || "Toán học");
  const [newTaskMinutes, setNewTaskMinutes] = useState(30);
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [planSuccessMsg, setPlanSuccessMsg] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("taman_exam_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("taman_exam_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("taman_room_checklist", JSON.stringify(checkedItems));
  }, [checkedItems]);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) playSuccessChime();
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const colors = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-teal-500 to-emerald-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-red-600"
    ];

    const newSub: ExamSubject = {
      id: "sub-" + Date.now(),
      name: newSubName.trim(),
      targetScore: newSubTarget,
      examDate: newSubDate,
      dailyHours: Number(newSubHours),
      color: colors[subjects.length % colors.length]
    };

    setSubjects([...subjects, newSub]);
    setNewSubName("");
    setShowAddSubject(false);
  };

  const handleDeleteSubject = (id: string) => {
    const subToDelete = subjects.find((s) => s.id === id);
    if (!subToDelete) return;
    const remaining = subjects.filter((s) => s.id !== id);
    setSubjects(remaining);
    // Also cleanup tasks
    setTasks(tasks.filter((t) => t.subject !== subToDelete.name));
    if (selectedSubjectFilter === subToDelete.name) {
      setSelectedSubjectFilter("all");
    }
    if (newTaskSubject === subToDelete.name) {
      setNewTaskSubject(remaining[0]?.name || "");
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: ExamTask = {
      id: "task-" + Date.now(),
      subject: newTaskSubject,
      title: newTaskTitle.trim(),
      date: new Date().toISOString().split("T")[0],
      estimatedMinutes: Number(newTaskMinutes),
      completed: false,
      priority: newTaskPriority
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setShowAddTask(false);
  };

  const handleAutoBreakdown = (subjectName: string) => {
    const microTasks = [
      `Ôn lại các công thức trọng tâm & khái niệm cốt lõi môn ${subjectName}`,
      `Giải 1 đề thi thử trắc nghiệm môn ${subjectName} và bấm giờ 45 phút`,
      `Chữa chi tiết các câu sai và ghi chú vào sổ tay kinh nghiệm`,
      `Tổng kết sơ đồ tư duy (Mindmap) các chương dễ mất điểm`
    ];

    const generated = microTasks.map((title, i) => ({
      id: "task-auto-" + Date.now() + "-" + i,
      subject: subjectName,
      title: title,
      date: new Date().toISOString().split("T")[0],
      estimatedMinutes: 30,
      completed: false,
      priority: (i === 0 ? "high" : "medium") as "high" | "medium"
    }));

    setTasks((prev) => [...prev, ...generated]);
    playSuccessChime();
    setPlanSuccessMsg(`Đã tự động chia nhỏ 4 nhiệm vụ ôn tập cho môn ${subjectName}!`);
    setTimeout(() => setPlanSuccessMsg(null), 4000);
  };

  const toggleChecklistItem = (id: string) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((i) => i !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
      playSuccessChime();
    }
  };

  const filteredTasks = selectedSubjectFilter === "all"
    ? tasks
    : tasks.filter((t) => t.subject === selectedSubjectFilter);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
          <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Kế hoạch khoa học • Giảm tải áp lực • Tránh học dồn</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Tư Vấn Mùa Thi & Kế Hoạch Ôn Tập
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Bí quyết để không bị ngợp trước kỳ thi là <strong>chia nhỏ các mục tiêu lớn</strong> thành những nhiệm vụ 30 - 45 phút có thể hoàn thành ngay hôm nay.
        </p>
      </div>

      {/* Overview Progress Card */}
      <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-100 font-semibold block mb-1">
              Tiến độ ôn tập tổng thể
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {completedCount} / {tasks.length} nhiệm vụ hoàn thành
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-3xl sm:text-4xl font-black">{progressPercent}%</span>
            <span className="text-xs text-indigo-200 block">Tiến độ lưu an toàn trên máy</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className="bg-white rounded-full h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Plan Success Toast */}
      {planSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{planSuccessMsg}</span>
          </div>
          <button
            onClick={() => setPlanSuccessMsg(null)}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline ml-2"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Section 1: Subjects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Các môn thi & Mục tiêu điểm ({subjects.length})
          </h2>
          <button
            onClick={() => setShowAddSubject(!showAddSubject)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm môn thi</span>
          </button>
        </div>

        {/* Add Subject Modal Form */}
        {showAddSubject && (
          <form
            onSubmit={handleAddSubject}
            className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 space-y-4 animate-in fade-in"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Thêm môn thi mới
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Tên môn thi
                </label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="Ví dụ: Lịch sử, Hóa học..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Mục tiêu điểm số
                </label>
                <input
                  type="text"
                  value={newSubTarget}
                  onChange={(e) => setNewSubTarget(e.target.value)}
                  placeholder="8.5"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Ngày thi dự kiến
                </label>
                <input
                  type="date"
                  value={newSubDate}
                  onChange={(e) => setNewSubDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Thời gian rảnh/ngày (giờ)
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  max="8"
                  value={newSubHours}
                  onChange={(e) => setNewSubHours(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddSubject(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                Lưu môn thi
              </button>
            </div>
          </form>
        )}

        {/* Subjects cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  {sub.name}
                </span>
                <button
                  onClick={() => handleDeleteSubject(sub.id)}
                  className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                  title="Xóa môn thi này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Mục tiêu</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {sub.targetScore} điểm
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Thời gian/ngày</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                    {sub.dailyHours} giờ
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {sub.examDate}
                </span>
                <button
                  onClick={() => handleAutoBreakdown(sub.name)}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                  title="Chia nhỏ nhiệm vụ cho môn này"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Chia nhỏ bài</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Tasks & Micro-Tasks Checklist */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-indigo-500" />
              Danh sách nhiệm vụ chia nhỏ ({filteredTasks.length})
            </h2>
            <p className="text-xs text-slate-500">
              Mỗi mục nên từ 25 - 45 phút, đánh dấu tick ngay sau khi hoàn thành.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter by subject */}
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <option value="all">Tất cả môn học</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  Môn: {s.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mục</span>
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddTask && (
          <form
            onSubmit={handleAddTask}
            className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 space-y-4 animate-in fade-in"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Thêm nhiệm vụ ôn tập mới
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Nội dung chi tiết nhiệm vụ (Micro-task)
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ví dụ: Giải 10 câu hình Oxyz chuyên đề mặt cầu..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Môn học
                </label>
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Thời lượng dự kiến (phút)
                </label>
                <input
                  type="number"
                  min="15"
                  step="5"
                  max="120"
                  value={newTaskMinutes}
                  onChange={(e) => setNewTaskMinutes(parseInt(e.target.value) || 30)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                Lưu nhiệm vụ
              </button>
            </div>
          </form>
        )}

        {/* Task list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs sm:text-sm">
              Không có nhiệm vụ nào cho danh mục này. Hãy bấm "Thêm mục" hoặc "Chia nhỏ bài" ở trên nhé!
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  task.completed
                    ? "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-60"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="shrink-0 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform"
                    title={task.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <span
                      className={`text-xs sm:text-sm font-semibold block truncate ${
                        task.completed
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {task.subject}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.estimatedMinutes} phút
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-slate-300 hover:text-rose-500 p-1.5 transition-colors shrink-0"
                  title="Xóa nhiệm vụ này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 3: Exam Room Prep Checklist */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-indigo-500" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Checklist chuẩn bị đồ dùng vào phòng thi
              </h2>
              <p className="text-xs text-slate-500">
                Theo quy chế thi tốt nghiệp THPT & tuyển sinh chuẩn Bộ GD&ĐT
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            {checkedItems.length} / {EXAM_ROOM_CHECKLIST.length} món
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {EXAM_ROOM_CHECKLIST.map((item) => {
            const isChecked = checkedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                    : "bg-slate-50/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div>
                  <span
                    className={`text-xs sm:text-sm font-semibold block leading-snug ${
                      isChecked
                        ? "line-through text-slate-500 dark:text-slate-400"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Study Strategy & Science Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
            01
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Active Recall (Truy xuất chủ động)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Thay vì đọc thụ động, hãy gấp sách lại và tự viết ra giấy nháp các ý chính. Bắt não bộ suy nghĩ giúp tăng khả năng ghi nhớ lên gấp 3 lần.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Spaced Repetition (Lặp lại ngắt quãng)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Ôn lại bài sau 1 ngày, 3 ngày và 7 ngày trước kỳ thi. Tránh học dồn vào đêm hôm trước để hạn chế hiện tượng quên do quá tải thông tin.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
            03
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Ngủ đủ 7 tiếng trước ngày thi
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Trong giấc ngủ REM, não bộ sẽ chuyển các kiến thức ngắn hạn thành ký ức dài hạn. Thiếu ngủ sẽ khiến bạn phản xạ chậm và dễ mắc bẫy đề thi.
          </p>
        </div>
      </div>
    </div>
  );
};
