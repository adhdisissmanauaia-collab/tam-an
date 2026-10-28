# 🌿 TÂM AN AI – Trợ Lý Tâm Lý Học Đường & Đồng Hành Mùa Thi

> **Tâm An AI** là nền tảng trợ lý thông minh thân thiện, an toàn dành cho học sinh Việt Nam (đặc biệt là lứa tuổi THCS & THPT). Ứng dụng tập trung vào tư vấn tâm lý học đường, giải tỏa áp lực thi cử, kỹ năng tự điều hòa cảm xúc và lập kế hoạch ôn thi khoa học.

---

## 🌟 5 Tính Năng Chính

1. **Trang chủ (Home):**
   - Giới thiệu sứ mệnh và hướng dẫn sử dụng Tâm An AI.
   - Thước đo cảm xúc nhanh ("Check-in tâm trạng hôm nay") đưa ra đề xuất phù hợp.
   - Ba trụ cột: Tâm lý học đường, Giải tỏa áp lực thi cử, Kế hoạch ôn thi khoa học.
   - Tuyên bố miễn trừ trách nhiệm y tế & tâm lý minh bạch.

2. **Chatbot Tâm Lý Học Đường (Chat):**
   - Trò chuyện hai chiều thấu cảm, không phán xét, phản hồi bằng tiếng Việt ấm áp.
   - Câu hỏi gợi ý nhanh: áp lực bài vở, bất hòa bạn bè, không biết nói cùng ai, sợ trượt kỳ thi...
   - Tự động nhận diện khủng hoảng (Crisis Detection) và kích hoạt hướng dẫn an toàn + phím tắt gọi **Tổng đài 111**.
   - Hỗ trợ giọng đọc thư giãn (Text-to-Speech) và sao chép phản hồi.
   - Nút xóa cuộc trò chuyện và bắt đầu lại.
   - Trực tiếp gọi API qua backend Express an toàn, bảo vệ API key tuyệt đối.
   - Tự động hiển thị **Demo Mode** khi chưa có API key để người dùng không bị nhầm lẫn.

3. **Giải Tỏa Áp Lực Thi Cử (Stress Relief):**
   - **Bài tập thở nhịp nhàng:** Bộ đếm giờ trực quan với 3 chế độ (Thở 4-7-8, Thở hộp Box Breathing, Thở sâu 4-4) kèm chuông thiền Web Audio êm dịu.
   - **Kỹ thuật neo đậu giác quan 5-4-3-2-1:** Kéo tâm trí thoát khỏi cơn hoảng loạn và âu lo.
   - **Nhật ký cảm xúc an toàn:** Lưu trữ hoàn toàn trên trình duyệt cá nhân (localStorage) chỉ khi người dùng đồng ý, không gửi dữ liệu lên máy chủ.

4. **Tư Vấn Mùa Thi & Kế Hoạch Ôn Tập (Exam Planner):**
   - Quản lý các môn thi, mục tiêu điểm số và ngày thi.
   - Tính năng **Tự động chia nhỏ nhiệm vụ (Micro-tasks)** thành từng mục 30-45 phút khả thi.
   - Danh sách công việc có thể đánh dấu hoàn thành kèm thanh tiến độ trực quan.
   - **Checklist đồ dùng phòng thi** chuẩn quy chế Bộ GD&ĐT (CCCD, bút cùng màu, máy tính cầm tay, bút chì 2B, bình nước bóc nhãn...).
   - Phương pháp khoa học: Active Recall, Spaced Repetition và chu kỳ ngủ 90 phút.

5. **Tài Nguyên & Mạng Lưới Hỗ Trợ (Resources):**
   - Thư viện bài viết kỹ năng: burnout học đường, giao tiếp bạn bè, mở lời với cha mẹ, bí quyết thi cử.
   - Tìm kiếm và lọc bài viết theo danh mục.
   - Hướng dẫn kết nối hỗ trợ 3 tầng: Gia đình, Thầy cô/Phòng tham vấn học đường, Chuyên viên y tế.
   - Đường dây nóng khẩn cấp 24/7 (111, 096 306 1414, 115, 113).

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React, Motion.
- **Backend Proxy:** Express, tsx, Node.js.
- **AI Engine:** Google Gemini API (`gemini-3.8-flash`) thông qua SDK chính thức `@google/genai`.
- **Audio:** Web Audio API tự tổng hợp âm thanh chuông thiền (không tải tệp ngoài).
- **Lưu trữ cục bộ:** `localStorage` cho nhật ký và kế hoạch ôn tập.

---

## 🚀 Cài Đặt & Chạy Thử (Local Development)

### 1. Yêu cầu hệ thống
- Node.js >= 18
- npm hoặc yarn/pnpm

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc dự án:
```bash
cp .env.example .env
```
Mở file `.env` và điền khóa API của bạn:
```env
GEMINI_API_KEY="AIzaSy..."
PORT=3000
```
> **Lưu ý:** Nếu bạn chưa có API key ngay lúc này, ứng dụng vẫn hoạt động trơn tru ở **Chế độ mô phỏng thông minh (Demo Mode)** với nhãn thông báo rõ ràng cho người dùng.

### 4. Khởi chạy ứng dụng
```bash
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:3000`

---

## 🔑 Hướng Dẫn Lấy Google Gemini API Key

1. Truy cập [Google AI Studio](https://aistudio.google.com/).
2. Đăng nhập bằng tài khoản Google.
3. Bấm nút **Get API key** (Lấy khóa API).
4. Tạo khóa mới và dán vào biến `GEMINI_API_KEY` trong file `.env`.
5. Khởi động lại server để kích hoạt chế độ **AI Live**.

---

## ☁️ Hướng Dẫn Triển Khai (Deploy) Lên Vercel

### Cách 1: Triển khai qua Vercel CLI
```bash
# Cài đặt Vercel CLI (nếu chưa có)
npm i -g vercel

# Đăng nhập và deploy
vercel
```

### Cách 2: Triển khai qua giao diện GitHub & Vercel Dashboard
1. Đẩy mã nguồn dự án lên kho lưu trữ GitHub của bạn.
2. Đăng nhập vào [Vercel](https://vercel.com/) và bấm **Add New > Project**.
3. Chọn Repository vừa tạo.
4. Trong phần **Environment Variables**, thêm biến:
   - Key: `GEMINI_API_KEY`
   - Value: `<API Key Google của bạn>`
5. Bấm **Deploy**. Vercel sẽ tự động build với lệnh `npm run build` và phục vụ thư mục `dist`.

---

## 🛡️ Quy Tắc Đạo Đức & An Toàn Của Tâm An AI

- **Bảo mật danh tính:** Không yêu cầu họ tên, trường lớp, địa chỉ nhà hay thông tin cá nhân.
- **Giới hạn chuyên môn:** Không chẩn đoán bệnh lý tâm thần lâm sàng, không khuyên tự ý dùng thuốc.
- **Xử lý tình huống nguy hiểm:** Khi phát hiện từ khóa tự hại, lập tức hướng dẫn tìm người lớn tin cậy và liên hệ ngay **Tổng đài Quốc gia Bảo vệ Trẻ em 111** (miễn cước).
