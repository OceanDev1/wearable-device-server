# Wearable Device Server

[🇻🇳 Tiếng Việt](#tiếng-việt) | [🇬🇧 English](#english)

---

## Tiếng Việt

Backend server cho hệ thống thiết bị đeo theo dõi sức khỏe (nhịp tim, SpO2, nhiệt độ, chuyển động...). Server nhận dữ liệu từ thiết bị qua MQTT, xử lý/lưu trữ, cung cấp REST API cho ứng dụng client (bác sĩ/bệnh nhân) và gửi cảnh báo qua email/SMS khi phát hiện bất thường.

### Tech stack

- **Runtime**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Giao tiếp thiết bị**: MQTT
- **Auth**: JWT (jsonwebtoken), bcrypt
- **Thông báo**: Nodemailer (email), Twilio (SMS)
- **Khác**: helmet, cors, compression, morgan, express-fileupload

### Cấu trúc thư mục

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

### Cài đặt

```bash
npm install
```

### Chạy server

```bash
node index.js
# hoặc dùng nodemon khi phát triển
npx nodemon index.js
```

Server mặc định chạy tại `http://<host>:<port>` được cấu hình trong `disc/configs/variable.configs.js`. API có prefix `/api/v1`.

### API chính

| Route | Mô tả |
|---|---|
| `/api/v1/account` | Đăng ký, đăng nhập, quản lý tài khoản |
| `/api/v1/patients` | Quản lý bệnh nhân |
| `/api/v1/devices` | Quản lý thiết bị đeo |
| `/api/v1/readings` | Dữ liệu đo (nhịp tim, SpO2, nhiệt độ...) |
| `/api/v1/appointment` | Lịch hẹn |

### MQTT Topics

Server subscribe các topic dữ liệu từ ESP (thiết bị) như `data_from_esp`, `battery_from_esp`, `heart_from_esp`, `temp_from_esp`, `motion_from_esp`, kết quả dự đoán AI (`receive_prediction_health`, `receive_prediction_motion`, `receive_prediction_sound`) và topic đăng ký thiết bị mới (`register_device`). Chi tiết xem `disc/configs/variable.configs.js` (`TOPIC_MQTT`).

### Lưu ý

- Các thông tin nhạy cảm (mật khẩu DB, secret key JWT, mật khẩu email, thông tin MQTT broker) hiện đang được hard-code trong `disc/configs/variable.configs.js` và `disc/mqtt/index.mqtt.js`. Nên chuyển sang biến môi trường (`.env` + `dotenv`) trước khi để repo public trên GitHub.

---

## English

Backend server for a wearable health-monitoring device system (heart rate, SpO2, temperature, motion...). The server receives data from devices over MQTT, processes/stores it, exposes a REST API for client apps (doctors/patients), and sends email/SMS alerts when anomalies are detected.

### Tech stack

- **Runtime**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Device communication**: MQTT
- **Auth**: JWT (jsonwebtoken), bcrypt
- **Notifications**: Nodemailer (email), Twilio (SMS)
- **Other**: helmet, cors, compression, morgan, express-fileupload

### Project structure

```
disc/
├── app.js                 # Express app setup, middleware, DB/MQTT connections
├── configs/                # Environment-style config, mail templates
├── controllers/             # Request handlers per resource
├── core/                    # Standard response/error objects, shared middleware, permissions
├── dbs/                     # MongoDB connection
├── models/                   # Mongoose schemas (account, device, patient, reading, appointment...)
├── mqtt/                     # MQTT connection, device data handling, SMS sending
├── routers/                   # Route definitions, API versioning (v1)
├── services/                   # Business logic
└── utils/                      # Utility functions (jwt, bcrypt, mailer...)
index.js                        # Entry point
```

### Installation

```bash
npm install
```

### Running the server

```bash
node index.js
# or with nodemon during development
npx nodemon index.js
```

The server runs by default at `http://<host>:<port>` as configured in `disc/configs/variable.configs.js`. The API is prefixed with `/api/v1`.

### Main API

| Route | Description |
|---|---|
| `/api/v1/account` | Register, login, account management |
| `/api/v1/patients` | Patient management |
| `/api/v1/devices` | Wearable device management |
| `/api/v1/readings` | Measurement data (heart rate, SpO2, temperature...) |
| `/api/v1/appointment` | Appointments |

### MQTT Topics

The server subscribes to device (ESP) data topics such as `data_from_esp`, `battery_from_esp`, `heart_from_esp`, `temp_from_esp`, `motion_from_esp`, AI prediction results (`receive_prediction_health`, `receive_prediction_motion`, `receive_prediction_sound`), and the new-device registration topic (`register_device`). See `TOPIC_MQTT` in `disc/configs/variable.configs.js` for details.

### Note

- Sensitive values (DB password, JWT secret keys, email password, MQTT broker credentials) are currently hard-coded in `disc/configs/variable.configs.js` and `disc/mqtt/index.mqtt.js`. These should be moved to environment variables (`.env` + `dotenv`) before making the repo public on GitHub.
