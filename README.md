# Wearable Device Server

Backend server cho hệ thống thiết bị đeo theo dõi sức khỏe (nhịp tim, SpO2, nhiệt độ, chuyển động...). Server nhận dữ liệu từ thiết bị qua MQTT, xử lý/lưu trữ, cung cấp REST API cho ứng dụng client (bác sĩ/bệnh nhân) và gửi cảnh báo qua email/SMS khi phát hiện bất thường.

## Tech stack

- **Runtime**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Giao tiếp thiết bị**: MQTT
- **Auth**: JWT (jsonwebtoken), bcrypt
- **Thông báo**: Nodemailer (email), Twilio (SMS)
- **Khác**: helmet, cors, compression, morgan, express-fileupload

## Cấu trúc thư mục

```
disc/
├── app.js                 # Khởi tạo Express app, middleware, kết nối DB/MQTT
├── configs/                # Cấu hình biến môi trường, template mail
├── controllers/             # Xử lý request cho từng resource
├── core/                    # Response/error chuẩn, middleware dùng chung, phân quyền
├── dbs/                     # Kết nối MongoDB
├── models/                   # Schema Mongoose (account, device, patient, reading, appointment...)
├── mqtt/                     # Kết nối MQTT, xử lý dữ liệu từ thiết bị, gửi SMS
├── routers/                   # Định nghĩa route, versioning API (v1)
├── services/                   # Business logic
└── utils/                      # Hàm tiện ích (jwt, bcrypt, mailer...)
index.js                        # Entry point
```

## Cài đặt

```bash
npm install
```

## Chạy server

```bash
node index.js
# hoặc dùng nodemon khi phát triển
npx nodemon index.js
```

Server mặc định chạy tại `http://<host>:<port>` được cấu hình trong `disc/configs/variable.configs.js`. API có prefix `/api/v1`.

## API chính

| Route | Mô tả |
|---|---|
| `/api/v1/account` | Đăng ký, đăng nhập, quản lý tài khoản |
| `/api/v1/patients` | Quản lý bệnh nhân |
| `/api/v1/devices` | Quản lý thiết bị đeo |
| `/api/v1/readings` | Dữ liệu đo (nhịp tim, SpO2, nhiệt độ...) |
| `/api/v1/appointment` | Lịch hẹn |

## MQTT Topics

Server subscribe các topic dữ liệu từ ESP (thiết bị) như `data_from_esp`, `battery_from_esp`, `heart_from_esp`, `temp_from_esp`, `motion_from_esp`, kết quả dự đoán AI (`receive_prediction_health`, `receive_prediction_motion`, `receive_prediction_sound`) và topic đăng ký thiết bị mới (`register_device`). Chi tiết xem `disc/configs/variable.configs.js` (`TOPIC_MQTT`).

## Lưu ý

- Các thông tin nhạy cảm (mật khẩu DB, secret key JWT, mật khẩu email, thông tin MQTT broker) hiện đang được hard-code trong `disc/configs/variable.configs.js` và `disc/mqtt/index.mqtt.js`. Nên chuyển sang biến môi trường (`.env` + `dotenv`) trước khi để repo public trên GitHub.
