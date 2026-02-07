# Seherici Backend – Mimari Özeti

## 1. Teknoloji Stack

- **Node.js + Express** → HTTP API
- **PostgreSQL (Supabase)** → Veri tabanı
- **Sequelize** → ORM (model tanımı ve DB erişimi)
- **JWT (jsonwebtoken)** → Authentication
- **bcrypt** → Şifre hashleme
- **PostGIS (GEOGRAPHY/POINT)** → Konum tutma altyapısı (ileride kullanılacak)

---

## 2. Klasör Yapısı

```text
src/
 ├─ config/
 │   └─ db.js              # Sequelize ve Postgres bağlantı ayarları
 ├─ models/
 │   ├─ User.js
 │   ├─ Car.js
 │   ├─ Trip.js
 │   ├─ DriverDocument.js
 │   └─ index.js           # Modeller ve ilişkiler (associations)
 ├─ controllers/
 │   ├─ user.controller.js
 │   ├─ auth.controller.js
 │   ├─ driver.controller.js
 │   ├─ driverDocument.controller.js
 │   └─ admin.controller.js
 ├─ services/
 │   ├─ user.service.js
 │   ├─ auth.service.js
 │   └─ admin.service.js   # Şu an basit, ileride genişleyebilir
 ├─ routes/
 │   ├─ user.routes.js
 │   ├─ auth.routes.js
 │   ├─ driver.routes.js
 │   └─ admin.routes.js
 ├─ middlewares/
 │   ├─ auth.middleware.js   # JWT doğrulama (requireAuth)
 │   ├─ role.middleware.js   # Rol kontrolü (requireRole)
 │   └─ error.middleware.js  # Global error handler
 ├─ utils/
 │   └─ AppError.js          # Uygulama içi custom hata sınıfı
 └─ app.js                   # Express app (router ve middleware kayıtları)

root/
 ├─ server.js                # Uygulama giriş noktası (DB connect + listen)
 └─ .env                     # Ortam değişkenleri
