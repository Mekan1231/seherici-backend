// server.js

// 1) ENV (en üstte)
require('dotenv').config({ path: './.env' });

// 2) Fail-fast: JWT_SECRET yoksa uygulama hiç başlamasın
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is missing in .env');
  process.exit(1);
}

// 3) DB
const { connectDB, sequelize } = require('./src/config/db');

// 4) Models + associations
require('./src/models');

// 5) Express app
const app = require('./src/app');

// 6) DB connection
connectDB();

// 7) Sync (dev için; production'da migration önerilir)
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Veritabanı tabloları senkronize edildi.');
  })
  .catch((err) => {
    console.error('Sync hatası:', err);
  });

// 8) Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});


