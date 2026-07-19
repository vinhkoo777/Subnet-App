# SubnetStreak

> Tôi vibe code á :33 (Tôi đang ôn bài thì nãy ra ý tưởng này thôi)

Nền tảng luyện tập IPv4 Subnetting dành cho quá trình ôn tập CCNA 200-301.

SubnetStreak là một ứng dụng học tập trên trình duyệt giúp người dùng luyện tập subnetting thông qua câu hỏi ngẫu nhiên, lời giải từng bước, theo dõi tiến độ, hệ thống XP và streak.

## Screenshots

### Dashboard

<img width="1891" height="947" alt="image" src="https://github.com/user-attachments/assets/b049142f-ffec-4bd4-9ab7-0d377cf37a65" />

### Practice Mode

<img width="1902" height="928" alt="image" src="https://github.com/user-attachments/assets/0bed703b-8ff3-4548-a633-c153a597110d" />

### Challenge Mode

<img width="1897" height="923" alt="image" src="https://github.com/user-attachments/assets/0f18cfad-a241-4753-a3ef-631b8c00a475" />

### Settings

<img width="1918" height="937" alt="image" src="https://github.com/user-attachments/assets/400ee7ad-fdc4-4e8a-a90a-0057805754eb" />

## Tính năng

- Luyện tập IPv4 subnetting không giới hạn
- Sinh câu hỏi ngẫu nhiên
- Giải thích subnet từng bước
- Hỗ trợ các dạng:
  - Network Address
  - Broadcast Address
  - CIDR
  - Wildcard Mask
  - VLSM
  - Routing-related Subnetting
- Nhiều chế độ luyện tập:
  - Daily Challenge
  - Speed Run
  - Survival
  - Time Attack
  - Exam Mode
  - Boss Challenge
- Theo dõi XP, streak, thống kê và lịch sử học tập
- Lưu dữ liệu bằng LocalStorage trên trình duyệt

## Kiểm thử

Subnet engine được xác thực với:

- 10.000 phép tính subnet
- 10.000 câu hỏi được sinh tự động

Chạy kiểm thử:

```bash
npm test
```

Các kiểm tra khác:

```bash
npm run type-check
npm run lint
npm run build
```

## Công nghệ sử dụng

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

## Cài đặt

Clone repository:

```bash
git clone https://github.com/vinhkoo777/Subnet-App.git
```

Cài đặt dependencies:

```bash
npm install
```

Khởi chạy môi trường phát triển:

```bash
npm run dev
```

Truy cập:

```
http://localhost:3000
```

## Mục tiêu dự án

Dự án được xây dựng nhằm hỗ trợ cải thiện kỹ năng IPv4 subnetting trong quá trình ôn tập CCNA, đồng thời kết hợp kiến thức networking với phát triển frontend hiện đại.
