import { Article, ExamSubject, ExamTask } from "../types";

export const SAMPLE_ARTICLES: Article[] = [
  {
    id: "burnout-hoc-duong",
    title: "Nhận diện hội chứng kiệt sức học đường (Academic Burnout) và cách phục hồi",
    summary: "Khi việc ngồi vào bàn học trở thành cực hình và bạn cảm thấy rỗng túi năng lượng, có thể bạn không hề lười biếng mà đang bị kiệt sức.",
    category: "mental_health",
    readTime: "4 phút đọc",
    author: "Ban Tư vấn Học đường Tâm An",
    content: `Nhiều bạn học sinh lầm tưởng rằng mình đang "lười biếng", mất động lực hoặc kém cỏi khi thấy bản thân không thể tập trung mở trang sách ra ôn thi. Trên thực tế, não bộ của con người có một cơ chế tự vệ: khi phải chịu đựng căng thẳng kéo dài mà không có quãng nghỉ, nó sẽ kích hoạt trạng thái "đóng băng" (shutdown).

Dấu hiệu của kiệt sức học đường:
1. Luôn cảm thấy mệt mỏi ngay cả khi vừa ngủ dậy.
2. Dễ cáu gắt với người thân, bạn bè hoặc mất kiên nhẫn với các bài tập trước đây từng làm tốt.
3. Cảm giác trống rỗng, nghi ngờ giá trị bản thân và tương lai.
4. Xuất hiện các triệu chứng cơ thể: đau dạ dày, đau nửa đầu, đau vai gáy trước mỗi kỳ thi.

Cách bước ra khỏi tình trạng này:
- Cho phép mình có ít nhất 1 ngày "xả stress trắng" (không đụng đến sách vở, không lướt tin tức tiêu cực).
- Chia nhỏ khối lượng bài học thành từng phần cực kỳ nhỏ (ví dụ: chỉ giải 1 bài toán hoặc đọc 3 trang sách thay vì cả chương).
- Nhớ rằng: Điểm số là đánh giá cho một bài kiểm tra tại một thời điểm nhất định, không định nghĩa giá trị cả con người bạn.`,
    tips: [
      "Đặt giới hạn giờ tắt đèn đi ngủ cố định (trước 23h).",
      "Vận động nhẹ 15 phút mỗi chiều để giải phóng hormone endorphin.",
      "Thực hành bài tập thở 4-7-8 mỗi khi cảm thấy nghẹt thở vì bài vở."
    ]
  },
  {
    id: "giao-tiep-ban-be",
    title: "Kỹ năng hóa giải bất hòa và áp lực 'phải hòa nhập' ở trường học",
    summary: "Làm thế nào để giữ được chính mình khi bạn bè có nhóm riêng, hoặc khi xảy ra hiểu lầm khó nói thành lời?",
    category: "relationships",
    readTime: "5 phút đọc",
    author: "Chuyên viên Tâm lý Trẻ em & Vị thành niên",
    content: `Môi trường học đường là nơi chúng ta dành hơn 8 tiếng mỗi ngày. Vì vậy, một ánh mắt lạnh nhạt, một lời thì thầm sau lưng hay việc bị loại khỏi nhóm chat lớp cũng đủ làm bạn trằn trọc cả đêm.

1. Phân biệt giữa "Hòa đồng" và "Đánh mất bản thân":
Bạn không cần phải có sở thích giống hệt số đông để được công nhận. Một tình bạn lành mạnh sẽ tôn trọng sự khác biệt của bạn, thay vì ép bạn phải gượng ép thay đổi.

2. Công thức giao tiếp "Tôi cảm thấy... khi..." khi có mâu thuẫn:
Thay vì chỉ trích: *"Tại sao bạn lại nói xấu mình sau lưng?"* (khiến đối phương lập tức phòng thủ và phản kích), hãy thử:
*"Hôm qua khi nghe các bạn nói về chuyện đó, mình cảm thấy rất buồn và bối rối. Mình muốn nói chuyện thẳng thắn để hai đứa không hiểu lầm nhau."*

3. Xử lý khi bị tẩy chay hoặc cô lập:
Nếu bạn nhận thấy mình đang là nạn nhân của bạo lực học đường (cả thể chất lẫn tinh thần online):
- Đừng tự trách mình hay giữ kín một mình.
- Chụp lại bằng chứng nếu bị đe dọa trên mạng xã hội.
- Báo ngay cho thầy cô chủ nhiệm, phòng tư vấn tâm lý trường hoặc người lớn mà bạn tin cậy nhất.`,
    tips: [
      "Không đôi co khi cả hai đang giận dữ; hãy hẹn một buổi nói chuyện khi đã bình tâm.",
      "Nếu một mối quan hệ khiến bạn luôn lo âu và kiệt quệ, hãy cho phép mình giữ khoảng cách an toàn.",
      "Tìm kiếm những người bạn chung sở thích qua các câu lạc bộ (sách, vẽ, thể thao)."
    ]
  },
  {
    id: "noi-chuyen-voi-bo-me",
    title: "Cách mở lời với cha mẹ về áp lực học tập và kỳ vọng điểm số",
    summary: "Khoảng cách thế hệ đôi khi khiến bố mẹ vô tình tạo ra gánh nặng lớn. Làm sao để chia sẻ mà không trở thành một cuộc tranh cãi?",
    category: "family",
    readTime: "6 phút đọc",
    author: "ThS. Tâm lý Giáo dục Gia đình",
    content: `Đa số cha mẹ đặt kỳ vọng cao vào con cái xuất phát từ tình yêu thương và nỗi lo sợ cho tương lai của con, nhưng họ thường dùng những câu nói dễ gây tổn thương như: *"Bố mẹ đi làm vất vả chỉ mong con học giỏi, có mỗi việc học cũng không xong."*

Làm sao để học sinh chia sẻ được nỗi lòng mình?
1. Chọn thời điểm "vàng":
Đừng nói chuyện khi bố mẹ vừa đi làm về mệt mỏi, hoặc ngay lúc bạn vừa nhận phiếu điểm kém bị mắng. Hãy chọn một buổi tối cuối tuần thong thả khi cả nhà đang uống nước hoặc đi dạo.

2. Mở lời bằng sự công nhận:
*"Con biết bố mẹ rất thương con và mong con có tương lai tốt..."* Câu nói này làm dịu bầu không khí và giúp bố mẹ cảm thấy bạn thấu hiểu họ.

3. Diễn đạt áp lực của bạn một cách cụ thể:
Thay vì nói: *"Bố mẹ ép con quá đáng!"*, hãy nói: *"Dạo này con cảm thấy rất áp lực và thường xuyên bị đau đầu, mất ngủ trước mỗi kỳ thi thử. Con đang rất cố gắng nhưng khối lượng kiến thức nhiều khiến con thấy quá tải. Con muốn xin bố mẹ cho con giảm bớt một lớp học thêm để con tự ôn tập hiệu quả hơn."*

4. Nhờ người trung gian nếu khoảng cách quá lớn:
Nếu bố mẹ quá khắt khe và không lắng nghe, hãy nhờ thầy cô chủ nhiệm hoặc chuyên viên tâm lý của trường nói chuyện khách quan cùng gia đình.`,
    tips: [
      "Viết một bức thư tay hoặc tin nhắn dài chân thành nếu nói trực tiếp quá khó khăn.",
      "Đưa ra các giải pháp thay thế cụ thể thay vì chỉ phàn nàn.",
      "Giữ thái độ bình tĩnh, tôn trọng để cuộc nói chuyện không chuyển thành cãi vã."
    ]
  },
  {
    id: "phuong-phap-on-thi-khoa-hoc",
    title: "Bí quyết ôn thi không thức trắng đêm: Kỹ thuật Não bộ & Trí nhớ",
    summary: "Học 10 tiếng liên tục không bằng học 4 tiếng đúng phương pháp. Cùng khám phá Active Recall và Spaced Repetition.",
    category: "study_skills",
    readTime: "4 phút đọc",
    author: "Đội ngũ Thủ khoa & Thủ lĩnh Học tập",
    content: `Nhiều bạn học sinh có thói quen đọc đi đọc lại sách giáo khoa và tô bút dạ quang khắp trang giấy. Nghiên cứu khoa học nhận thức chứng minh rằng đây là phương pháp ôn tập thụ động kém hiệu quả nhất, tạo cảm giác 'ảo tưởng về sự hiểu bài' (Illusion of Competence).

2 Phương pháp đã được kiểm chứng:
1. **Truy xuất chủ động (Active Recall):**
Sau khi đọc một đoạn kiến thức, hãy gấp sách lại và tự viết ra giấy nháp hoặc tự giảng lại cho chính mình nghe bằng ngôn từ của bạn. Khi não bộ phải vắt óc nhớ lại thông tin, các liên kết thần kinh mới thực sự được củng cố.

2. **Lặp lại ngắt quãng (Spaced Repetition):**
Đừng dồn toàn bộ đề thi vào 2 ngày cuối cùng. Hãy ôn tập lại kiến thức theo chu kỳ: Ngày 1 -> Ngày 3 -> Ngày 7 -> Ngày 14 trước khi thi.

3. **Ngủ đủ giấc - Vũ khí tối thượng của trí nhớ:**
Giấc ngủ sâu (REM sleep) là lúc não bộ sàng lọc và chuyển ký ức từ vùng ngắn hạn (Hippocampus) sang vùng vỏ não dài hạn. Thức trắng đêm trước ngày thi sẽ khiến bạn dễ bị 'trắng não' (blank mind) khi nhận đề thi.`,
    tips: [
      "Áp dụng Pomodoro: 25 phút tập trung cao độ, 5 phút vận động uống nước.",
      "Tập vẽ sơ đồ tư duy (Mindmap) tóm tắt các nhánh kiến thức chính.",
      "Luyện giải đề thi dưới áp lực thời gian thực tế để làm quen tâm lý phòng thi."
    ]
  }
];

export const INITIAL_EXAM_SUBJECTS: ExamSubject[] = [
  {
    id: "math",
    name: "Toán học",
    targetScore: "8.5",
    examDate: "2026-06-25",
    dailyHours: 2,
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "literature",
    name: "Ngữ văn",
    targetScore: "8.0",
    examDate: "2026-06-26",
    dailyHours: 1.5,
    color: "from-purple-500 to-pink-600"
  },
  {
    id: "english",
    name: "Tiếng Anh",
    targetScore: "9.0",
    examDate: "2026-06-27",
    dailyHours: 1.5,
    color: "from-teal-500 to-emerald-600"
  }
];

export const INITIAL_EXAM_TASKS: ExamTask[] = [
  {
    id: "task-1",
    subject: "Toán học",
    title: "Ôn tập chuyên đề Khảo sát hàm số & giải 15 bài toán thực tế",
    date: "2026-06-10",
    estimatedMinutes: 45,
    completed: true,
    priority: "high"
  },
  {
    id: "task-2",
    subject: "Ngữ văn",
    title: "Lập dàn ý phân tích nhân vật Người lái đò sông Đà & ghi nhớ các chi tiết đắt giá",
    date: "2026-06-11",
    estimatedMinutes: 40,
    completed: false,
    priority: "high"
  },
  {
    id: "task-3",
    subject: "Tiếng Anh",
    title: "Luyện 1 đề phần Đọc hiểu (Reading Comprehension) và tra từ mới theo ngữ cảnh",
    date: "2026-06-12",
    estimatedMinutes: 35,
    completed: false,
    priority: "medium"
  },
  {
    id: "task-4",
    subject: "Toán học",
    title: "Tổng hợp lại các công thức tính nhanh Hình học không gian Oxyz",
    date: "2026-06-13",
    estimatedMinutes: 30,
    completed: false,
    priority: "medium"
  }
];

export const EXAM_ROOM_CHECKLIST = [
  { id: "c1", label: "Căn cước công dân (CCCD) hoặc giấy tờ tùy thân hợp lệ", category: "Giấy tờ bắt buộc" },
  { id: "c2", label: "Thẻ dự thi / Giấy báo dự thi", category: "Giấy tờ bắt buộc" },
  { id: "c3", label: "Ít nhất 3 bút bi cùng màu mực (xanh hoặc đen, không dùng mực đỏ/bút dạ)", category: "Dụng cụ làm bài" },
  { id: "c4", label: "Bút chì 2B (2-3 cây gọt sẵn) và tẩy chì mềm chuyên dụng cho phiếu trắc nghiệm", category: "Dụng cụ làm bài" },
  { id: "c5", label: "Máy tính bỏ túi nằm trong danh mục Bộ GD&ĐT cho phép (không có chức năng soạn thảo, thẻ nhớ)", category: "Dụng cụ làm bài" },
  { id: "c6", label: "Thước kẻ thẳng, êke, compa (cho các môn tự nhiên)", category: "Dụng cụ làm bài" },
  { id: "c7", label: "Atlat Địa lý Việt Nam (còn nguyên vẹn, không viết/vẽ thêm tài liệu)", category: "Dụng cụ môn học" },
  { id: "c8", label: "Chai nước lọc trong suốt đã bóc sạch hoàn toàn nhãn mác", category: "Vật dụng cá nhân" },
  { id: "c9", label: "Đồng hồ cơ đeo tay đơn giản để canh giờ (không dùng smartwatch/vòng đeo thông minh)", category: "Vật dụng cá nhân" }
];

export const EMERGENCY_HOTLINES = [
  {
    name: "Tổng đài Quốc gia Bảo vệ Trẻ em",
    phone: "111",
    desc: "Tư vấn tâm lý, can thiệp khẩn cấp bạo lực học đường & xâm hại. Hoàn toàn miễn phí cước 24/7.",
    badge: "Miễn cước 24/7",
    color: "bg-emerald-500"
  },
  {
    name: "Đường dây nóng sơ cứu tâm lý Ngày Mai",
    phone: "096 306 1414",
    desc: "Đồng hành lắng nghe người trẻ gặp khủng hoảng tâm lý, trầm cảm và suy nghĩ tiêu cực.",
    badge: "Khủng hoảng tâm lý",
    color: "bg-purple-500"
  },
  {
    name: "Cấp cứu y tế toàn quốc",
    phone: "115",
    desc: "Gọi khẩn cấp khi có nguy cơ ngộ độc, tự hại hoặc tổn thương thể chất nghiêm trọng.",
    badge: "Khẩn cấp y tế",
    color: "bg-rose-500"
  },
  {
    name: "Tổng đài Quốc gia 113",
    phone: "113",
    desc: "Trợ giúp an ninh khi bị đe dọa an toàn tính mạng hoặc bạo lực nghiêm trọng tại cổng trường.",
    badge: "An ninh trật tự",
    color: "bg-blue-500"
  }
];
