/**
 * Tâm An AI - Local Knowledge & Response Engine
 * Đảm bảo chatbot luôn trả lời tất cả các câu hỏi của học sinh
 * ngay cả khi mạng chậm, ngoại tuyến hoặc trên môi trường Vercel tĩnh.
 */

// Các từ khóa phát hiện khủng hoảng
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

export function checkCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((regex) => regex.test(text));
}

export function getCrisisReply(): string {
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

export function generateAssistantReply(userMessage: string): { reply: string; isCrisis: boolean; isDemo: boolean } {
  const msg = userMessage.toLowerCase().trim();

  // 1. Kiểm tra an toàn khủng hoảng
  if (checkCrisis(msg)) {
    return {
      reply: getCrisisReply(),
      isCrisis: true,
      isDemo: false
    };
  }

  // 2. Toán học & Máy tính Casio
  if (msg.includes("toán") || msg.includes("đạo hàm") || msg.includes("tích phân") || msg.includes("hình học") || msg.includes("casio") || msg.includes("hàm số") || msg.includes("phương trình") || msg.includes("xác suất")) {
    return {
      reply: `Chào bạn! Về môn Toán, Tâm An gợi ý các phương pháp trọng tâm giúp tăng điểm nhanh:

1. **Bản chất công thức:** Đừng học vẹt công thức mà hãy nắm rõ điều kiện áp dụng (tập xác định, điều kiện dấu bằng xảy ra trong bất đẳng thức).
2. **Kỹ năng sử dụng Casio (fx-580VN X / 880BTG):**
   - Dùng tính năng *TABLE* (Menu 8) để quét nhanh giá trị lớn nhất/nhỏ nhất (GTLN/GTNN) và tìm khoảng nghiệm xấp xỉ.
   - Thử nghiệm nhanh bằng chức năng *CALC* hoặc kiểm tra đạo hàm tại điểm bằng phím *SHIFT + d/dx*.
3. **Sổ tay lỗi sai:** Sau mỗi đề luyện, hãy ghi lại lý do làm sai (do nhầm dấu, thiếu điều kiện hay sai công thức?) để không lặp lại lần 2.

Bạn có đề bài hoặc dạng toán cụ thể nào cần giải từng bước không? Hãy gửi đề bài cho Tâm An nhé!`,
      isCrisis: false,
      isDemo: true
    };
  }

  // 3. Tiếng Anh (English)
  if (msg.includes("tiếng anh") || msg.includes("english") || msg.includes("từ vựng") || msg.includes("ngữ pháp") || msg.includes("reading") || msg.includes("ielts") || msg.includes("thì") || msg.includes("nghe")) {
    return {
      reply: `Chào bạn! Đối với môn Tiếng Anh, đây là chiến lược học nhanh và nhớ lâu:

1. **Học từ vựng theo cụm (Collocations):**
   - Đừng học từ đơn lẻ theo danh sách. Hãy học theo ngữ cảnh (ví dụ: thay vì chỉ học từ "decision", hãy học cả cụm *"make an informed decision"*).
2. **Kỹ thuật làm bài Đọc hiểu (Reading):**
   - *Skimming:* Đọc lướt tiêu đề và 1-2 câu đầu/cuối của từng đoạn văn trong 1 phút để nắm bức tranh tổng thể.
   - *Scanning:* Gạch chân từ khóa trong câu hỏi (tên riêng, số liệu, mốc năm) rồi dò ngược lại bài đọc.
3. **Ngữ pháp trọng tâm:** Ôn chắc 5 thì hay thi nhất (Hiện tại đơn, Quá khứ đơn, Hiện tại hoàn thành, Tương lai đơn, Quá khứ tiếp diễn) kết hợp mệnh đề quan hệ và câu bị động.

Bạn đang cần giải thích cấu trúc ngữ pháp hay câu hỏi tiếng Anh nào cụ thể?`,
      isCrisis: false,
      isDemo: true
    };
  }

  // 4. Ngữ văn & Viết bài nghị luận
  if (msg.includes("văn") || msg.includes("nghị luận") || msg.includes("mở bài") || msg.includes("kết bài") || msg.includes("dẫn chứng") || msg.includes("phân tích") || msg.includes("thơ") || msg.includes("truyện")) {
    return {
      reply: `Chào bạn! Để bài thi Ngữ văn đạt điểm cao và giàu cảm xúc:

1. **Công thức Mở bài ấn tượng:**
   - *Đi từ đề tài:* Nêu nét đặc trưng của đề tài (ví dụ: tình yêu quê hương đất nước, lòng dũng cảm, tình mẫu tử) rồi dẫn dắt vào tác phẩm và tác giả.
   - *Đi từ câu danh ngôn/nhận định văn học ngắn gọn.*
2. **Nghị luận xã hội (khoảng 200 chữ):**
   - Cấu trúc 5 phần: Giải thích ngắn gọn (2 câu) -> Phân tích thực trạng & ý nghĩa (5 câu) -> Dẫn chứng thời sự tiêu biểu (2 câu) -> Phản đề/Mở rộng (2 câu) -> Bài học nhận thức và hành động của bản thân (2 câu).
3. **Dẫn chứng đắt giá:** Hãy chọn những nhân vật truyền cảm hứng thực tế và cập nhật có tính thời sự.

Bạn đang cần dàn ý tác phẩm nào hay muốn Tâm An gợi ý mở bài cho chủ đề gì?`,
      isCrisis: false,
      isDemo: true
    };
  }

  // 5. Vật lý, Hóa học & Sinh học (Tự nhiên)
  if (msg.includes("vật lý") || msg.includes("lý") || msg.includes("hóa") || msg.includes("hóa học") || msg.includes("sinh học") || msg.includes("dao động") || msg.includes("điện xoay chiều") || msg.includes("hữu cơ") || msg.includes("di truyền")) {
    return {
      reply: `Chào bạn! Với các môn Khoa học tự nhiên (Lý - Hóa - Sinh):

1. **Vật lý:** Vẽ hình minh họa hiện tượng và viết công thức gốc trước. Nắm vững bản chất đồ thị dao động, sóng cơ và sóng điện từ.
2. **Hóa học:** Nhớ dãy hoạt động hóa học, quy luật bảo toàn (bảo toàn khối lượng, bảo toàn electron, bảo toàn nguyên tố). Với Hóa hữu cơ, nắm chắc cấu tạo nhóm chức (-OH, -COOH, -CHO, -COO-).
3. **Sinh học:** Học theo sơ đồ tư duy (Mindmap) về cơ chế di truyền và biến dị, quy luật phân ly Men-đen và dòng năng lượng trong hệ sinh thái.

Bạn đang thắc mắc bài tập hay hiện tượng khoa học nào? Hãy chia sẻ với Tâm An nhé!`,
      isCrisis: false,
      isDemo: true
    };
  }

  // 6. Lịch sử, Địa lý & GDCD (Xã hội)
  if (msg.includes("lịch sử") || msg.includes("sử") || msg.includes("địa lý") || msg.includes("địa") || msg.includes("gdcd") || msg.includes("kinh tế") || msg.includes("pháp luật")) {
    return {
      reply: `Chào bạn! Phương pháp học các môn Khoa học xã hội hiệu quả:

1. **Lịch sử:** Dùng trục thời gian (Timeline) kết nối các sự kiện theo chuỗi nhân quả: *Nguyên nhân -> Diễn biến chính -> Kết quả -> Ý nghĩa lịch sử & Bài học kinh nghiệm*.
2. **Địa lý:** Khai thác tối đa Atlat Địa lý Việt Nam (cách đọc chú giải, xác định tọa độ, phân bố các vùng kinh tế trọng điểm).
3. **Giáo dục kinh tế & pháp luật:** Gắn liền lý thuyết với các tình huống đời sống thực tế xung quanh bạn.

Hãy đặt câu hỏi cụ thể nếu bạn cần tóm tắt giai đoạn lịch sử hay bài học nào nhé!`,
      isCrisis: false,
      isDemo: true
    };
  }

  // 7. Định hướng chọn khối thi & chọn ngành, chọn trường
  if (msg.includes("chọn khối") || msg.includes("chọn ngành") || msg.includes("chọn trường") || msg.includes("nghề nghiệp") || msg.includes("khối a") || msg.includes("khối b") || msg.includes("khối c") || msg.includes("khối d") || msg.includes("đại học")) {
    return {
      reply: `Chào bạn! Việc chọn khối thi và định hướng ngành nghề là bước đi rất quan trọng:

1. **Quy tắc 3 vòng tròn chọn nghề:**
   - **Vòng 1 (Sở thích):** Bạn thích làm việc với con người, máy móc, số liệu hay sáng tạo nghệ thuật?
   - **Vòng 2 (Năng lực thực tế):** Khối thi nào có các môn thế mạnh giúp bạn dễ đạt tổng điểm từ 24-27+ nhất?
   - **Vòng 3 (Xu hướng việc làm):** Các nhóm ngành tiềm năng cao: Công nghệ thông tin/AI, Kỹ thuật số, Kinh tế/Tài chính, Y dược, Sư phạm, Truyền thông đa phương tiện...
2. **Chiến lược chọn khối:** Hãy chọn tổ hợp có ít nhất 2 môn bạn thực sự yêu thích và học chắc.

Bạn đang phân vân giữa những ngành học hoặc khối thi nào? Hãy nói cho Tâm An biết nhé!`,
      isCrisis: false,
      isDemo: true
    };
  }

  // 8. Phương pháp học tập, chống buồn ngủ & tăng tập trung
  if (msg.includes("buồn ngủ") || msg.includes("tập trung") || msg.includes("lười") || msg.includes("quên") || msg.includes("trì hoãn") || msg.includes("pomodoro") || msg.includes("nhớ lâu")) {
    return {
      reply: `Chào bạn! Để khắc phục tình trạng mất tập trung, buồn ngủ và học nhanh quên:

1. **Quy tắc 2 phút để bắt đầu:** Đừng nghĩ đến việc phải học liên tục 3 tiếng. Hãy tự nhủ: *"Mình chỉ ngồi vào bàn mở sách và làm đúng 1 bài trong 2 phút thôi."* Khi đã bắt đầu, não bộ sẽ tự duy trì đà tập trung.
2. **Phương pháp Pomodoro 25/5:** Học tập trung cao độ 25 phút -> Nghỉ giải lao 5 phút (vận động nhẹ, uống nước, vươn vai) -> Lặp lại 4 chu kỳ rồi nghỉ dài 15-20 phút.
3. **Mẹo chống buồn ngủ hiệu quả:**
   - Đảm bảo phòng học đủ ánh sáng trắng và thoáng gió.
   - Rửa mặt bằng nước mát hoặc uống từng ngụm nước lạnh nhỏ.
   - Không nằm học trên giường ngủ.

Bạn muốn cùng Tâm An thử một phiên tập trung 25 phút ngay bây giờ không?`,
      isCrisis: false,
      isDemo: true
    };
  }

  // 9. Áp lực thi cử, căng thẳng, sợ trượt
  if (msg.includes("áp lực") || msg.includes("căng thẳng") || msg.includes("stress") || msg.includes("mệt") || msg.includes("sợ trượt") || msg.includes("điểm kém") || msg.includes("lo lắng") || msg.includes("sợ hãi")) {
    return {
      reply: `Tâm An rất hiểu cảm giác của bạn lúc này. Áp lực bài vở và thi cử nhiều khi khiến chúng ta cảm thấy như đang gánh một tảng đá vô hình trên vai vậy.

Trước tiên, bạn hãy cho phép bản thân được thở một chút nhé:
1. **Tạm dừng 5 phút:** Rời mắt khỏi sách vở, nhấp một ngụm nước ấm nhỏ.
2. **Hít thở sâu:** Bạn có thể chuyển sang tab **"Giải tỏa áp lực"** trên thanh menu để thử bài tập thở 4-7-8, chỉ mất 2 phút nhưng sẽ giúp nhịp tim chậm và tinh thần dịu lại rõ rệt.
3. **Tách biệt nỗi sợ:** Điểm số một bài kiểm tra không quyết định toàn bộ con người bạn. Nó chỉ là tấm bản đồ chỉ ra phần kiến thức nào cần ôn lại một chút thôi.

Tâm An luôn ở đây đồng hành cùng bạn, bạn cứ thoải mái chia sẻ thêm nhé!`,
      isCrisis: false,
      isDemo: true
    };
  }

  // 10. Bạn bè & Mối quan hệ học đường
  if (msg.includes("bạn bè") || msg.includes("cô lập") || msg.includes("tẩy chay") || msg.includes("nghỉ chơi") || msg.includes("mâu thuẫn") || msg.includes("người yêu") || msg.includes("crush") || msg.includes("nói xấu")) {
    return {
      reply: `Mối quan hệ bạn bè và cảm xúc tuổi học trò ảnh hưởng rất nhiều đến tâm trạng hàng ngày. Cảm giác bị hiểu lầm hay lạc lõng dễ khiến chúng ta trăn trở.

Vài góc nhìn nhẹ nhàng từ Tâm An:
- **Cảm xúc của bạn hoàn toàn chính đáng:** Buồn bã hay thất vọng là phản xạ tự nhiên khi một mối quan hệ gặp khúc mắc.
- **Khoảng lặng bình tĩnh:** Khi hai bên đang có cảm xúc mạnh, tranh luận ngay lúc đó thường khiến chuyện bé xé ra to. Hãy chờ 1-2 ngày để cả hai nguội bớt rồi hẹn nói chuyện thẳng thắn.
- **Tôn trọng bản thân:** Tình bạn lành mạnh là nơi bạn được là chính mình mà không cần phải gượng ép thay đổi theo số đông.

Bạn có muốn chia sẻ cụ thể chuyện gì đã xảy ra ở trường không?`,
      isCrisis: false,
      isDemo: true
    };
  }

  // 11. Gia đình & Bố mẹ
  if (msg.includes("bố mẹ") || msg.includes("ba mẹ") || msg.includes("gia đình") || msg.includes("so sánh") || msg.includes("kỳ vọng") || msg.includes("con nhà người ta") || msg.includes("mắng")) {
    return {
      reply: `Cảm giác bị so sánh với "con nhà người ta" hay gánh trên vai kỳ vọng quá lớn từ bố mẹ thực sự rất mệt mỏi và áp lực.

Tâm An chia sẻ với bạn vài cách ứng xử nhẹ nhàng:
1. **Thấu hiểu nguồn gốc kỳ vọng:** Thường thì bố mẹ lo lắng cho tương lai của con cái nhưng chưa biết cách thể hiện khéo léo, vô tình biến sự quan tâm thành áp lực.
2. **Chọn thời điểm mở lời:** Tránh tranh cãi lúc bố mẹ đang nóng giận. Hãy chọn lúc cả nhà thoải mái (như bữa tối cuối tuần) để tâm sự: *"Con cũng đang rất nỗ lực, nhưng việc so sánh làm con cảm thấy rất áp lực và mất tự tin..."*
3. **Tập trung vào sự tiến bộ của chính mình:** Mỗi người có một xuất phát điểm và thế mạnh riêng. Sự tiến bộ của bạn so với ngày hôm qua mới là điều quan trọng nhất.

Tâm An luôn lắng nghe bạn, bạn cứ trút nỗi niềm ở đây nhé!`,
      isCrisis: false,
      isDemo: true
    };
  }

  // 12. Sức khỏe, Giấc ngủ & Dinh dưỡng mùa thi
  if (msg.includes("ngủ") || msg.includes("thức khuya") || msg.includes("đau đầu") || msg.includes("mệt mỏi") || msg.includes("cà phê") || msg.includes("ăn uống") || msg.includes("sức khỏe")) {
    return {
      reply: `Chào bạn! Sức khỏe và giấc ngủ là yếu tố quyết định 50% phong độ làm bài trong phòng thi:

1. **Ngủ đủ ít nhất 6-7 tiếng/đêm:** Trí nhớ dài hạn chỉ được củng cố trong giấc ngủ sâu. Thức trắng đêm sẽ làm giảm 30-40% khả năng tư duy logic và phản xạ ngày hôm sau.
2. **Thời điểm vàng:** Đi ngủ trước 23h30 và dậy sớm lúc 5h30 sáng. Học bài buổi sáng sớm hiệu quả gấp đôi so với học lúc nửa đêm.
3. **Dinh dưỡng bổ não:** Uống đủ 1.5 - 2 lít nước/ngày. Bổ sung trứng, cá, các loại hạt, rau xanh và trái cây tươi. Tránh lạm dụng nước tăng lực hay cà phê đậm đặc sau 16h chiều.

Hôm nay bạn đã ngủ được mấy tiếng rồi?`,
      isCrisis: false,
      isDemo: true
    };
  }

  // 13. Phản hồi cho bất kỳ câu hỏi hoặc chủ đề nào khác
  return {
    reply: `Chào bạn! Tâm An đã lắng nghe câu hỏi của bạn:

"${userMessage}"

Để giải quyết vấn đề này hiệu quả và thuận lợi nhất, Tâm An gợi ý:
1. **Xác định mục tiêu chính:** Hãy làm rõ kết quả mong muốn đầu tiên của bạn trong hôm nay.
2. **Chia nhỏ từng bước:** Chia vấn đề thành 2-3 phần nhỏ và thực hiện từng bước tuần tự.
3. **Giữ tinh thần tích cực:** Luôn tin tưởng vào khả năng học hỏi và tiến bộ của bản thân mình.

Bạn hãy chia sẻ thêm chi tiết hoặc tài liệu liên quan để Tâm An giải thích cặn kẽ và hỗ trợ bạn chu đáo nhất nhé!`,
    isCrisis: false,
    isDemo: true
  };
}
