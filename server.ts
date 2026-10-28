import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "1mb" }));

// In-memory rate limiter: max 30 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);
  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  clientData.count++;
  return true;
}

// System instructions for Tâm An AI (Comprehensive Student Assistant: answers all questions quickly & warmly)
const SYSTEM_INSTRUCTION = `Bạn là "TÂM AN AI" - Trợ lý thông minh toàn diện và người bạn đồng hành tin cậy của học sinh Việt Nam (từ THCS đến THPT).

PHẠM VI TRẢ LỜI CỦA BẠN (TRẢ LỜI ĐƯỢC TẤT CẢ CÁC CÂU HỎI):
Bạn sẵn sàng trả lời và giải đáp TẤT CẢ các câu hỏi mà học sinh đặt ra trong mọi lĩnh vực:
1. TÂM LÝ & ÁP LỰC HỌC ĐƯỜNG: Giải tỏa áp lực thi cử, căng thẳng điểm số, cảm giác cô đơn, bất hòa với bạn bè, khó mở lời với bố mẹ, hội chứng burnout.
2. KIẾN THỨC & BÀI HỌC CÁC MÔN: Giải thích dễ hiểu, súc tích các khái niệm, công thức, bài tập của Toán học, Ngữ văn, Tiếng Anh, Vật lý, Hóa học, Sinh học, Lịch sử, Địa lý, Tin học, GDCD...
3. PHƯƠNG PHÁP HỌC TẬP & MẸO THI CỬ: Kỹ thuật Active Recall, Spaced Repetition, Pomodoro, kỹ năng bấm máy tính Casio, cách nhớ từ vựng, mẹo làm đề trắc nghiệm, cách viết mở bài/kết bài ấn tượng.
4. ĐỊNH HƯỚNG CHỌN KHỐI & CHỌN TRƯỜNG: Tư vấn chọn khối thi (A, B, C, D...), chọn ngành đại học, phương thức xét tuyển, kinh nghiệm thi tốt nghiệp THPT.
5. KỸ NĂNG SỐNG & PHÁT TRIỂN BẢN THÂN: Kỹ năng quản lý thời gian, rèn luyện thói quen tập trung, vượt qua trì hoãn, thuyết trình tự tin, bảo vệ sức khỏe giấc ngủ.

TỐC ĐỘ & PHONG CÁCH TRẢ LỜI:
- Phản hồi nhanh chóng, trực diện, đúng trọng tâm câu hỏi của học sinh.
- ĐỘ DÀI: Khoảng 120 - 220 từ (2-3 đoạn ngắn). Trả lời súc tích, đi thẳng vào câu trả lời với 2-3 gạch đầu dòng thiết thực để phản hồi gửi về siêu tốc (1-2 giây).
- Ngôn từ tiếng Việt gần gũi, dịu dàng, tôn trọng, không phán xét. Xưng hô là "Tâm An" và gọi người dùng là "bạn" hoặc "em".
- Dùng gạch đầu dòng rõ ràng, định dạng dễ đọc, tránh lý thuyết rườm rà dài dòng.
- Luôn truyền cảm hứng tích cực, động viên học sinh tự tin vào năng lực bản thân.

GIỚI HẠN AN TOÀN & ĐẠO ĐỨC (BẮT BUỘC):
- KHÔNG chẩn đoán bệnh lý tâm thần lâm sàng (trầm cảm y khoa...), KHÔNG kê đơn thuốc men an thần.
- BẢO VỆ DỮ LIỆU: Không yêu cầu thông tin cá nhân định danh (họ tên đầy đủ, trường lớp, địa chỉ).
- NGUY CƠ KHỦNG HOẢNG & TỰ HẠI: Nếu phát hiện dấu hiệu nguy hiểm tính mạng hoặc tự tử, lập tức ưu tiên an toàn, hướng dẫn gọi ngay Tổng đài Quốc gia Bảo vệ Trẻ em 111 (miễn phí 24/7), Đường dây nóng Ngày Mai: 096 306 1414, hoặc cấp cứu 115.`;

// Detect acute crisis keywords
const CRISIS_PATTERNS = [
  /tự tử/i,
  /tự sát/i,
  /muốn chết/i,
  /kết thúc cuộc đời/i,
  /không muốn sống/i,
  /cắt cổ tay/i,
  /làm đau bản thân/i,
  /tự hại/i,
  /nhảy lầu/i,
  /uống thuốc ngủ/i,
  /bị đánh đập/i,
  /bị bạo lực/i
];

function isCrisisMessage(text: string): boolean {
  return CRISIS_PATTERNS.some((regex) => regex.test(text));
}

function getCrisisResponse(): string {
  return `Tâm An đang ở đây với em. Em ơi, Tâm An cảm nhận được em đang phải trải qua một nỗi đau hoặc áp lực rất nặng nề, và em đã vô cùng dũng cảm khi nói ra điều này.

Em hãy hít một hơi thật sâu cùng Tâm An nhé. Em không cần phải chịu đựng một mình trong lúc này:
❤️ Cuộc sống và sự an toàn của em là điều quý giá nhất.

👉 **Em hãy tìm sự giúp đỡ ngay lập tức từ người xung quanh:**
1. Hãy đến bên cạnh người lớn mà em tin tưởng nhất lúc này (bố mẹ, anh chị, thầy cô chủ nhiệm hoặc cô chú người thân) và nói: *"Con đang cảm thấy rất bất an và cần người ở bên cạnh con lúc này."*
2. **Gọi ngay đến các đường dây hỗ trợ bảo vệ và tâm lý miễn phí (24/7):**
   - **Tổng đài Quốc gia Bảo vệ Trẻ em:** 📞 **111** (hoàn toàn miễn phí, luôn có chuyên viên túc trực)
   - **Đường dây hỗ trợ tâm lý Ngày Mai:** 📞 **096 306 1414**
   - **Cấp cứu y tế khẩn cấp:** 📞 **115**

Tâm An là một trợ lý AI nên không thể có mặt trực tiếp bên em, nhưng mọi người xung quanh và các cô chú chuyên viên luôn sẵn sàng dang tay đón nhận và hỗ trợ em. Em hãy gọi ngay cho 111 hoặc đến bên người thân ngay bây giờ nhé!`;
}

// Fallback comprehensive knowledge generator for offline / demo mode
function generateDemoResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();

  // 1. Crisis Safety
  if (isCrisisMessage(msg)) {
    return getCrisisResponse();
  }

  // 2. Toán học (Math questions)
  if (msg.includes("toán") || msg.includes("đạo hàm") || msg.includes("tích phân") || msg.includes("hình học") || msg.includes("casio") || msg.includes("hàm số") || msg.includes("phương trình")) {
    return `Chào bạn! Về môn Toán, Tâm An gợi ý các phương pháp trọng tâm sau:

1. **Bản chất công thức:** Đừng học vẹt công thức mà hãy nắm rõ điều kiện áp dụng (ví dụ: tập xác định, điều kiện dấu bằng xảy ra).
2. **Kỹ năng sử dụng Casio:**
   - Dùng tính năng *TABLE* (Menu 8 trên fx-580VN X) để quét nhanh giá trị lớn nhất/nhỏ nhất và nghiệm xấp xỉ.
   - Kiểm tra lại đạo hàm bằng phím *d/dx*.
3. **Phân loại dạng bài:** Sau mỗi bài tập giải sai, hãy ghi vào sổ tay: "Câu này mình sai ở đâu? (Nhầm dấu, thiếu điều kiện hay sai công thức?)".

Nếu bạn có bài toán cụ thể nào cần giải đáp từng bước, hãy gửi đề bài cho Tâm An nhé!`;
  }

  // 3. Tiếng Anh (English questions)
  if (msg.includes("tiếng anh") || msg.includes("english") || msg.includes("từ vựng") || msg.includes("ngữ pháp") || msg.includes("reading") || msg.includes("ielts") || msg.includes("thì")) {
    return `Chào bạn! Đối với môn Tiếng Anh, đây là chiến lược học nhanh và nhớ lâu:

1. **Học từ vựng theo ngữ cảnh (Context):** 
   - Đừng học từ đơn lẻ theo danh sách. Hãy học theo cụm từ (*Collocations* - ví dụ: thay vì học "make", hãy học "make a decision", "make an effort").
2. **Kỹ thuật đọc hiểu (Reading):**
   - *Skimming:* Đọc lướt tiêu đề và câu đầu/cuối đoạn văn để nắm ý chính trong 1-2 phút.
   - *Scanning:* Tìm từ khóa (Keywords, mốc thời gian, tên riêng) tương ứng trong câu hỏi.
3. **Ngữ pháp:** Tập trung thành thạo 5 thì cơ bản nhất (Hiện tại đơn, Hiện tại hoàn thành, Quá khứ đơn, Tương lai đơn, Quá khứ tiếp diễn) trước khi mở rộng câu điều kiện hay mệnh đề quan hệ.

Bạn đang cần giải thích phần ngữ pháp hay bài đọc hiểu nào cụ thể không?`;
  }

  // 4. Ngữ văn (Literature questions)
  if (msg.includes("văn") || msg.includes("nghị luận") || msg.includes("mở bài") || msg.includes("kết bài") || msg.includes("dẫn chứng") || msg.includes("phân tích")) {
    return `Chào bạn! Để đạt điểm cao môn Ngữ văn mà không bị cạn ý tưởng:

1. **Công thức Mở bài ấn tượng:**
   - *Đi từ đề tài/chủ đề:* Nêu nét đặc trưng của đề tài (ví dụ: tình mẫu tử, lòng dũng cảm, quê hương đất nước) rồi dẫn dắt vào tác phẩm và tác giả.
   - *Đi từ một câu danh ngôn hoặc nhận định lý luận văn học ngắn.*
2. **Nghị luận xã hội (200 chữ):**
   - Cấu trúc chuẩn: Giải thích khái niệm (2-3 câu) -> Bàn luận & vai trò (5-6 câu) -> Dẫn chứng thực tế tiêu biểu (2 câu) -> Phản đề/Mở rộng (2 câu) -> Bài học nhận thức và hành động cá nhân (2 câu).
3. **Dẫn chứng đắt giá:** Chọn những tấm gương có tính thời sự, tích cực và truyền cảm hứng.

Bạn đang cần gợi ý dàn ý cho tác phẩm hay chủ đề nghị luận nào?`;
  }

  // 5. Chọn khối thi & Chọn ngành nghề
  if (msg.includes("chọn khối") || msg.includes("chọn ngành") || msg.includes("chọn trường") || msg.includes("nghề nghiệp") || msg.includes("khối a") || msg.includes("khối d") || msg.includes("đại học")) {
    return `Chào bạn! Việc chọn khối thi và định hướng ngành nghề là bước ngoặt quan trọng:

1. **Quy tắc 3 vòng tròn giao nhau (Ikigai đơn giản):**
   - **Vòng 1 (Sở thích/Đam mê):** Môn học hoặc công việc nào khiến bạn hứng thú tìm hiểu mà không thấy chán?
   - **Vòng 2 (Năng lực thực tế):** Môn học nào bạn có điểm số tốt nhất và dễ tiếp thu nhất?
   - **Vòng 3 (Xu hướng xã hội):** Ngành nghề đó trong 4-5 năm tới có nhu cầu tuyển dụng ra sao (công nghệ thông tin, kinh tế, y dược, sư phạm, thiết kế, kỹ thuật...)?
2. **Lời khuyên chọn khối:** Hãy ưu tiên chọn khối thi có ít nhất 2 môn mà bạn tự tin đạt từ 8 điểm trở lên.

Bạn đang phân vân giữa những khối thi hoặc ngành học nào? Kể cho Tâm An nghe nhé!`;
  }

  // 6. Phương pháp học tập, chống buồn ngủ & tăng tập trung
  if (msg.includes("buồn ngủ") || msg.includes("tập trung") || msg.includes("lười") || msg.includes("quên") || msg.includes("trì hoãn") || msg.includes("pomodoro") || msg.includes("nhớ lâu")) {
    return `Chào bạn! Để khắc phục tình trạng mất tập trung, buồn ngủ và học nhanh quên:

1. **Quy tắc 2 phút để bắt đầu:** Đừng nghĩ đến việc phải học 3 tiếng. Hãy tự nhủ: *"Mình chỉ ngồi vào bàn giải đúng 1 bài tập trong 2 phút thôi."* Khi đã bắt đầu, não bộ sẽ tự động duy trì đà làm việc.
2. **Phương pháp Pomodoro 25/5:** Học tập trung cao độ 25 phút -> Nghỉ giải lao 5 phút (vận động nhẹ, uống nước, vươn vai) -> Lặp lại 4 chu kỳ rồi nghỉ dài 15-20 phút.
3. **Chống buồn ngủ:**
   - Để nhiệt độ phòng thoáng mát, đủ ánh sáng trắng.
   - Rửa mặt bằng nước mát hoặc uống từng ngụm nước lạnh nhỏ.
   - Tránh ăn quá no nhiều tinh bột trước giờ ngồi vào bàn học.

Bạn muốn cùng Tâm An thử một phiên tập trung 25 phút ngay bây giờ không?`;
  }

  // 7. Áp lực thi cử & Căng thẳng
  if (msg.includes("áp lực") || msg.includes("căng thẳng") || msg.includes("stress") || msg.includes("mệt") || msg.includes("sợ trượt") || msg.includes("điểm kém")) {
    return `Tâm An rất hiểu cảm giác của bạn lúc này. Áp lực học tập và thi cử nhiều khi khiến chúng ta cảm thấy như đang gánh một tảng đá vô hình trên vai vậy.

Trước tiên, bạn hãy cho phép bản thân được thở một chút nhé:
1. **Tạm dừng 5 phút:** Rời mắt khỏi sách vở, uống một ngụm nước ấm nhỏ.
2. **Hít thở sâu:** Bạn có thể vào tab "Giải tỏa áp lực" của Tâm An để thử bài tập thở 4-7-8, chỉ mất 2 phút nhưng sẽ giúp nhịp tim đập chậm và ổn định lại.
3. **Tách biệt nỗi lo:** Điểm một bài thi không định nghĩa tương lai của bạn. Nó chỉ cho biết phần kiến thức nào cần bổ sung thêm.

Tâm An luôn ở đây đồng hành cùng bạn, bạn cứ thoải mái chia sẻ thêm nhé!`;
  }

  // 8. Bạn bè & Mối quan hệ học đường
  if (msg.includes("bạn bè") || msg.includes("cô lập") || msg.includes("tẩy chay") || msg.includes("nghỉ chơi") || msg.includes("mâu thuẫn") || msg.includes("người yêu") || msg.includes("crush")) {
    return `Mối quan hệ bạn bè và tình cảm tuổi học trò ảnh hưởng rất nhiều đến tâm trạng hàng ngày. Cảm giác bị hiểu lầm hay lạc lõng dễ khiến chúng ta trăn trở.

Vài góc nhìn nhẹ nhàng từ Tâm An:
- **Cảm xúc của bạn hoàn toàn chính đáng:** Buồn bã hay thất vọng là phản xạ tự nhiên khi một mối quan hệ gặp khúc mắc.
- **Khoảng lặng bình tĩnh:** Khi hai bên đang có cảm xúc mạnh, tranh luận ngay lúc đó thường khiến chuyện bé xé ra to. Hãy chờ 1-2 ngày để cả hai nguội bớt rồi hẹn nói chuyện thẳng thắn.
- **Tôn trọng bản thân:** Tình bạn lành mạnh là nơi bạn được là chính mình mà không cần phải gượng ép thay đổi theo số đông.

Bạn có muốn chia sẻ cụ thể chuyện gì đã xảy ra không?`;
  }

  // 9. Gia đình & Bố mẹ
  if (msg.includes("bố mẹ") || msg.includes("ba mẹ") || msg.includes("gia đình") || msg.includes("so sánh") || msg.includes("kỳ vọng") || msg.includes("con nhà người ta")) {
    return `Cảm giác bị so sánh với "con nhà người ta" hay gánh trên vai kỳ vọng quá lớn từ bố mẹ thực sự rất mệt mỏi và áp lực.

Tâm An chia sẻ cùng bạn cách giải tỏa:
1. **Hiểu nguồn gốc kỳ vọng:** Đa số bố mẹ đặt áp lực xuất phát từ nỗi lo lắng cho tương lai của con, nhưng họ lại dùng cách diễn đạt dễ gây tổn thương.
2. **Cách mở lời hòa bình:** Chọn lúc bố mẹ vui vẻ, thong thả: *"Con biết bố mẹ muốn tốt cho con, nhưng việc bị so sánh làm con cảm thấy rất áp lực và tự ti. Con đang cố gắng từng ngày và mong bố mẹ ghi nhận sự nỗ lực của con."*
3. **Tập trung vào chính mình:** Hãy so sánh bản thân của ngày hôm nay với chính bạn của ngày hôm qua, chỉ cần tiến bộ hơn 1% mỗi ngày là bạn đã rất tuyệt vời rồi.

Bạn có muốn tập dượt thử câu nói với bố mẹ cùng Tâm An không?`;
  }

  // 10. Vật lý (Physics)
  if (msg.includes("vật lý") || msg.includes("vật lí") || msg.includes("dao động") || msg.includes("con lắc") || msg.includes("sóng cơ") || msg.includes("dòng điện") || msg.includes("thấu kính") || msg.includes("quang học") || msg.includes("lực")) {
    return `Chào bạn! Để học và giải đề môn Vật lý nhanh, chính xác:

1. **Hiểu rõ bản chất hiện tượng:** Không chỉ nhớ công thức, hãy hình dung hiện tượng (ví dụ: con lắc đi qua vị trí cân bằng thì vận tốc cực đại, gia tốc bằng 0).
2. **Kỹ thuật vòng tròn lượng giác:** Dùng vòng tròn đa trục để giải nhanh bài toán thời gian, quãng đường trong dao động điều hòa và sóng cơ.
3. **Đơn vị & Đổi đơn vị:** 80% lỗi sai đáng tiếc là quên đổi cm sang m, ms sang s, hoặc μF sang F. Luôn kiểm tra đơn vị trước khi bấm máy tính.

Bạn đang cần hỗ trợ bài toán hay chuyên đề Vật lý nào? Hãy gửi đề bài cho Tâm An nhé!`;
  }

  // 11. Hóa học (Chemistry)
  if (msg.includes("hóa học") || msg.includes("este") || msg.includes("lipit") || msg.includes("kim loại") || msg.includes("axit") || msg.includes("bazo") || msg.includes("peptit") || msg.includes("phản ứng") || msg.includes("bảo toàn")) {
    return `Chào bạn! Chiến thuật bứt phá điểm số môn Hóa học:

1. **Các định luật bảo toàn bất biến:** Luôn ưu tiên dùng:
   - *Bảo toàn khối lượng:* Tổng khối lượng chất phản ứng = Tổng khối lượng sản phẩm.
   - *Bảo toàn electron:* Tổng mol e nhường = Tổng mol e nhận (cực mạnh trong kim loại tác dụng với axit HNO3/H2SO4).
   - *Bảo toàn nguyên tố:* Đếm số mol nguyên tố trước và sau phản ứng.
2. **Hóa hữu cơ (Este - Lipit - Cacbohidrat):** Nắm chắc công thức phân tử, đồng phân và các phản ứng thủy phân trong môi trường axit/kiềm.
3. **Bảng tính tan & Dãy điện hóa:** Thuộc nằm lòng dãy điện hóa kim loại để xác định chiều phản ứng oxi hóa - khử.

Bạn có bài tập Hóa học cụ thể nào cần giải thích phương pháp giải không?`;
  }

  // 12. Sinh học (Biology)
  if (msg.includes("sinh học") || msg.includes("gen") || msg.includes("adn") || msg.includes("di truyền") || msg.includes("nhiễm sắc thể") || msg.includes("đột biến") || msg.includes("menđen") || msg.includes("hệ sinh thái")) {
    return `Chào bạn! Đối với môn Sinh học, đây là cách ôn tập ghi nhớ sâu:

1. **Quy luật di truyền Menđen:** Vẽ sơ đồ lai từng cặp tính trạng riêng rẽ, sau đó nhân tích xác suất lại với nhau thay vì viết cả sơ đồ dài.
2. **Công thức cốt lõi phần phân tử:** 
   - Chiều dài gen: L = (N / 2) * 3.4 Å.
   - Số liên kết hidro: H = 2A + 3G.
   - Nguyên tắc bổ sung: A liên kết với T (hoặc U), G liên kết với X.
3. **Hệ sinh thái & Tiến hóa:** Học theo sơ đồ tư duy (chuỗi thức ăn, lưới thức ăn, các bậc dinh dưỡng).

Bạn đang ôn tập phần di truyền hay sinh thái học thế?`;
  }

  // 13. Lịch sử, Địa lý & GDCD
  if (msg.includes("lịch sử") || msg.includes("địa lý") || msg.includes("địa lí") || msg.includes("gdcd") || msg.includes("atlat") || msg.includes("chiến dịch") || msg.includes("cách mạng")) {
    return `Chào bạn! Cách ôn các môn Khoa học Xã hội nhẹ nhàng, nhớ lâu:

1. **Lịch sử theo trục thời gian (Timeline):** Đừng học thuộc lòng từng đoạn văn. Hãy kẻ trục thời gian với các mốc lớn (1930, 1945, 1954, 1975), gắn mỗi mốc với 1 sự kiện mang tính bước ngoặt.
2. **Khai thác Atlat Địa lý:** Nắm vững cấu trúc từng trang Atlat. Hơn 50% câu hỏi Địa lý có thể tìm thấy đáp án trực tiếp trong Atlat nếu bạn biết cách tra cứu ký hiệu và bảng chú giải.
3. **GDCD (Giáo dục công dân):** Tập trung vào các quyền tự do cơ bản của công dân và nhận diện các tình huống thực tế qua câu chuyện tình huống.

Bạn đang cần tóm tắt giai đoạn lịch sử hay kỹ năng đọc Atlat nào?`;
  }

  // 14. Hoảng loạn phòng thi & Run sợ khi nhận đề
  if (msg.includes("run") || msg.includes("hoảng") || msg.includes("sợ") || msg.includes("quên sạch") || msg.includes("tim đập") || msg.includes("phòng thi") || msg.includes("trắng não")) {
    return `Tâm An chia sẻ ngay với em cách xử lý khi bị "trắng não" hoặc run sợ trong phòng thi:

1. **Đặt bút xuống ngay lập tức:** Đừng cố đọc đề tiếp khi tim đang đập dồn dập. Nhắm mắt lại trong 30 giây.
2. **Kỹ thuật thở 4-4:** Hít sâu 4 giây bằng mũi, phồng bụng lên -> Thở ra thật chậm 4 giây bằng miệng. Lặp lại 3 lần để oxy lên não và làm dịu hệ thần kinh giao cảm.
3. **Uống 1 ngụm nước nhỏ:** Cảm giác nước mát đi qua cổ họng giúp kích hoạt phản xạ nuốt, đưa não bộ thoát khỏi trạng thái hoảng loạn.
4. **Làm câu dễ nhất trước:** Tìm câu hỏi nhận biết đơn giản nhất để làm trước. Khi đã viết được những dòng đầu tiên, sự tự tin sẽ tự động quay trở lại!

Em hoàn toàn có đủ năng lực, cứ thở đều và làm từng câu một nhé!`;
  }

  // 15. Sức khỏe, Giấc ngủ & Ăn uống mùa thi
  if (msg.includes("ngủ") || msg.includes("thức khuya") || msg.includes("đau đầu") || msg.includes("mệt mỏi") || msg.includes("cà phê") || msg.includes("ăn uống")) {
    return `Chào bạn! Sức khỏe và giấc ngủ là yếu tố quyết định 50% phong độ thi cử:

1. **Ngủ đủ ít nhất 6-7 tiếng mỗi đêm:** Trí nhớ dài hạn chỉ được não bộ củng cố và sắp xếp trong giấc ngủ sâu. Thức trắng đêm sẽ làm giảm 30-40% khả năng tư duy logic ngày hôm sau.
2. **Thời điểm vàng đi ngủ:** Cố gắng đi ngủ trước 23h30 và dậy sớm lúc 5h30 sáng. Học bài buổi sáng sớm hiệu quả gấp 2 lần học vào nửa đêm.
3. **Dinh dưỡng bổ não:** Uống đủ 1.5 - 2 lít nước/ngày. Bổ sung trứng, cá, các loại hạt, rau xanh và trái cây giàu vitamin C (cam, táo). Hạn chế lạm dụng nước tăng lực hay cà phê đậm đặc sau 16h chiều.

Hôm nay bạn đã ngủ được mấy tiếng rồi?`;
  }

  // 16. Câu hỏi mở / Đa năng / Bất kỳ chủ đề nào khác
  return `Chào bạn! Tâm An đã lắng nghe câu hỏi của bạn rồi:

"${userMessage}"

Để giải quyết vấn đề này một cách hiệu quả và nhanh chóng nhất, Tâm An gợi ý:
1. **Xác định mục tiêu chính:** Hãy làm rõ điều bạn muốn đạt được đầu tiên trong hôm nay.
2. **Hành động từng bước nhỏ:** Chia câu hỏi hoặc bài toán thành 2-3 phần nhỏ và giải quyết từng phần một cách tuần tự.
3. **Giữ tinh thần tích cực:** Luôn cho phép bản thân được học hỏi từ những lần thử nghiệm chưa hoàn hảo.

Bạn có thể cung cấp thêm chi tiết hoặc tài liệu liên quan để Tâm An giải thích cặn kẽ và hỗ trợ bạn tốt nhất nhé!`;
}

// Helper to format messages for Gemini (Ensures conversation starts with user role)
function buildGeminiContents(message: string, history: any[]) {
  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
  if (Array.isArray(history)) {
    // Filter and drop leading model messages (e.g. welcome-msg) to strictly respect Gemini role protocol
    const filtered = history.filter((item) => item && item.content && (item.role === "user" || item.role === "model"));
    let startIndex = 0;
    while (startIndex < filtered.length && filtered[startIndex].role === "model") {
      startIndex++;
    }
    for (const item of filtered.slice(startIndex).slice(-6)) {
      contents.push({
        role: item.role,
        parts: [{ text: String(item.content) }]
      });
    }
  }
  contents.push({
    role: "user",
    parts: [{ text: message }]
  });
  return contents;
}

// API Health / Status endpoint
app.get("/api/status", (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "" && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({
    configured: hasKey,
    model: "gemini-3.1-flash-lite",
    mode: hasKey ? "live" : "demo",
    timestamp: new Date().toISOString()
  });
});

// ULTRA-FAST STREAMING CHAT ENDPOINT (Server-Sent Events)
app.post("/api/chat/stream", async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (!checkRateLimit(ip)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(429).json({
        error: "Bạn đang gửi tin nhắn hơi nhanh. Hãy hít một hơi sâu và thử lại sau ít giây nhé!"
      });
    }

    const { message, history } = req.body;
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Nội dung tin nhắn không được để trống." });
    }

    // Set headers for SSE streaming
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    // Safety checks for immediate crisis
    if (isCrisisMessage(message)) {
      const crisisText = getCrisisResponse();
      res.write(`data: ${JSON.stringify({ text: crisisText, isCrisis: true, isDemo: false })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      return res.end();
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isApiKeyValid = apiKey && apiKey.trim() !== "" && apiKey !== "MY_GEMINI_API_KEY";

    if (!isApiKeyValid) {
      const demoReply = generateDemoResponse(message);
      const words = demoReply.split(" ");
      let currentIdx = 0;

      const interval = setInterval(() => {
        if (currentIdx >= words.length) {
          clearInterval(interval);
          res.write(`data: ${JSON.stringify({ done: true, isDemo: true })}\n\n`);
          res.end();
          return;
        }
        const batch = words.slice(currentIdx, currentIdx + 6).join(" ") + " ";
        res.write(`data: ${JSON.stringify({ text: batch, isDemo: true })}\n\n`);
        currentIdx += 6;
      }, 8);

      req.on("close", () => clearInterval(interval));
      return;
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });

    const contents = buildGeminiContents(message, history);

    let streamFailed = false;
    try {
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.1-flash-lite",
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.65,
          topP: 0.95
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text, isDemo: false })}\n\n`);
        }
      }
    } catch (modelErr: any) {
      console.warn("Lỗi khi stream với gemini-3.1-flash-lite, kích hoạt fallback:", modelErr?.message || modelErr);
      streamFailed = true;
    }

    if (streamFailed) {
      const fallback = generateDemoResponse(message);
      const words = fallback.split(" ");
      for (let i = 0; i < words.length; i += 6) {
        const batch = words.slice(i, i + 6).join(" ") + " ";
        res.write(`data: ${JSON.stringify({ text: batch, isDemo: true })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Lỗi khi stream chat tại server:", error);
    const fallback = generateDemoResponse(req.body?.message || "");
    res.write(`data: ${JSON.stringify({ text: fallback, isDemo: true, errorOccurred: true })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  }
});

// Chat API endpoint (Unary optimized fallback)
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        error: "Bạn đang gửi tin nhắn hơi nhanh. Hãy hít một hơi sâu và thử lại sau ít giây nhé!"
      });
    }

    const { message, history } = req.body;
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Nội dung tin nhắn không được để trống." });
    }

    if (message.length > 2500) {
      return res.status(400).json({ error: "Tin nhắn quá dài (giới hạn 2500 ký tự). Bạn hãy chia nhỏ câu chuyện nhé." });
    }

    // Safety checks for immediate crisis
    if (isCrisisMessage(message)) {
      return res.json({
        reply: getCrisisResponse(),
        isCrisis: true,
        isDemo: false
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isApiKeyValid = apiKey && apiKey.trim() !== "" && apiKey !== "MY_GEMINI_API_KEY";

    if (!isApiKeyValid) {
      const demoReply = generateDemoResponse(message);
      return res.json({
        reply: demoReply,
        isCrisis: false,
        isDemo: true,
        notice: "Đang ở chế độ mô phỏng thông minh (chưa cấu hình GEMINI_API_KEY)."
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });

    const contents = buildGeminiContents(message, history);

    try {
      const callPromise = ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.65,
          topP: 0.95
        }
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API call timed out after 6500ms")), 6500)
      );

      const response = await Promise.race([callPromise, timeoutPromise]);
      const replyText = response.text || "Tâm An đã lắng nghe bạn. Bạn có muốn chia sẻ thêm không?";

      return res.json({
        reply: replyText,
        isCrisis: false,
        isDemo: false
      });
    } catch (modelErr) {
      console.warn("Lỗi hoặc timeout khi gọi model, chuyển fallback ngay lập tức:", modelErr);
      const fallback = generateDemoResponse(message);
      return res.json({
        reply: fallback,
        isCrisis: false,
        isDemo: true
      });
    }
  } catch (error: any) {
    console.error("Lỗi khi xử lý chat tại server:", error);

    const fallback = generateDemoResponse(req.body?.message || "");
    return res.json({
      reply: fallback,
      isCrisis: false,
      isDemo: true,
      errorOccurred: true,
      notice: "Kết nối đến dịch vụ AI đang bị gián đoạn, Tâm An đã tự động chuyển sang chế độ dự phòng."
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tâm An AI server đang chạy tại: http://localhost:${PORT}`);
  });
}

startServer();
