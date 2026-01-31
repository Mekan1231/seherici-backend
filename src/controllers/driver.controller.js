const { User, DriverDocument } = require('../models');

// 1 DRIVER APPLY
const apply = async (req, res) => {
  try {
    const user = req.user; // JWT’den gelir

    if (user.role === 'driver') {
      return res.status(400).json({ message: 'ALREADY_DRIVER' });
    }

    if (user.driver_status === 'pending') {
      return res.status(400).json({ message: 'APPLICATION_ALREADY_PENDING' });
    }

    // DB üzerinde user modelini gerçek veriden çekiyoruz:
    const dbUser = await User.findByPk(user.id);

    dbUser.driver_status = 'pending';
    await dbUser.save();

    return res.json({
      message: 'DRIVER_APPLICATION_RECEIVED',
      driver_status: dbUser.driver_status,
    });
  } catch (err) {
    console.error('DRIVER_APPLY_ERROR:', err);
    return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
  }
};


// 2 DRIVER DOCUMENT UPLOAD (yeni fonksiyon)
const uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { document_type } = req.body;

    if (!document_type) {
      return res.status(400).json({ message: 'DOCUMENT_TYPE_REQUIRED' });
    }

    // Test için sahte URL
    const fakeUploadedUrl = "https://storage.supabase.fake/testfile.jpg";

    const doc = await DriverDocument.create({
      user_id: userId,
      document_type,
      document_url: fakeUploadedUrl,
      status: 'pending',
    });

    return res.json({
      message: 'DOCUMENT_UPLOADED',
      document: doc,
    });

  } catch (err) {
    console.error('UPLOAD_DOCUMENT_ERROR:', err);
    return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
  }
};


module.exports = {
  apply,
  uploadDocument, // Yeni endpoint buraya EKLENİYOR (apply silinmiyor)
};

