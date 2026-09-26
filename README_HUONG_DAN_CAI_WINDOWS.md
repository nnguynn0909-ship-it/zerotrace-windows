# HƯỚNG DẪN CÀI ĐẶT ỨNG DỤNG WINDOWS (.EXE) CHO ZEROTRACE

Thư mục **`zeroclip windows`** chứa toàn bộ dự án máy tính **Windows Desktop App** hoàn chỉnh dành cho hệ điều hành Windows (Windows 10, 11 64-bit).

---

## 🌟 ĐẶC ĐIỂM BẢN WINDOWS (.EXE):
1. **Chạy độc lập mượt mà:** Khởi chạy trực tiếp từ màn hình máy tính (Desktop) hoặc thanh Taskbar.
2. **2 Định dạng tiện lợi:**
   - **Bản Portable (`ZeroTrace-Portable.exe`):** Không cần cài đặt, tải về bấm đúp chuột là chạy ngay lập tức. Cực kỳ tiện khi copy vào USB mang đi dùng bất kỳ máy tính nào.
   - **Bản Cài đặt (`ZeroTrace Setup 1.0.0.exe`):** Trình cài đặt chuẩn Windows (NSIS) có tạo shortcut màn hình và Start Menu, hỗ trợ gỡ cài đặt sạch sẽ.
3. **Mã hóa đầu cuối Zero-Trace:** Giữ nguyên vẹn tính năng mã hóa phân đoạn AES-GCM 256-bit, đồng bộ thời gian thực siêu nhanh.
4. **Tự động build trên đám mây:** Tích hợp sẵn **GitHub Actions**. Mỗi khi cập nhật code, hệ thống tự động build ra file `.exe` mới nhất.

---

## 📲 CÁCH TẢI VÀ CHẠY TRÊN WINDOWS:
1. Vào trang **Releases** trên GitHub: [nnguynn0909-ship-it/zerotrace-windows/releases](https://github.com/nnguynn0909-ship-it/zerotrace-windows/releases).
2. Tải trực tiếp phiên bản bạn muốn:
   - **`ZeroTrace-Portable.exe`**: Tải về mở dùng ngay, không cần cài đặt.
   - **`ZeroTrace Setup 1.0.0.exe`**: File cài đặt hoàn chỉnh cho Windows.
3. Khi chạy lần đầu, nếu Windows SmartScreen hiện thông báo *"Windows protected your PC"*, bạn chỉ cần bấm:
   - **"More info" (Thêm thông tin)** -> Bấm **"Run anyway" (Vẫn chạy)**.

