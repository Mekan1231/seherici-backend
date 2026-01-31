// config/db.js

const { Sequelize } = require('sequelize');

// Supabase (PostgreSQL) bağlantı bilgileri
const sequelize = new Sequelize(
    process.env.PG_DATABASE, // veritabanı adı
    process.env.PG_USER,     // kullanıcı adı
    process.env.PG_PASS,     // şifre
    {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        dialect: 'postgres',
        logging: false, // SQL sorgularını konsola yazdırmayı kapatır
        dialectOptions: {
            // Supabase'de SSL kullanmak GEREKİR.
            ssl: {
                require: true,
                rejectUnauthorized: false // Geliştirme ortamında SSL sertifikasını kontrol etmemek için
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL (Supabase) Bağlantısı Başarılı.');
    } catch (error) {
        // Hata mesajı yerine, hatanın tamamını yazdırıyoruz.
        console.error('PostgreSQL (Supabase) Bağlantı Hatası: Hata Detayı Aşağıdadır.');
        console.error(error); // <-- Hatanın tam objesi (Şifre/Host hatası burada gözükecek)
        // Hata durumunda uygulama çökebilir, bu yüzden .env ayarlarını kontrol edin.
    }
};

module.exports = {
    sequelize,
    connectDB
};