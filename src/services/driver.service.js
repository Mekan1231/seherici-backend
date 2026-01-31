const { User } = require('../models');

const applyForDriver = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const err = new Error('USER_NOT_FOUND');
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  // Zaten driver ise — başvuru yapamaz
  if (user.role === 'driver') {
    const err = new Error('ALREADY_DRIVER');
    err.code = 'ALREADY_DRIVER';
    throw err;
  }

  // Zaten başvuru yapmışsa
  if (user.driver_status === 'pending') {
    const err = new Error('ALREADY_PENDING');
    err.code = 'ALREADY_PENDING';
    throw err;
  }

  // Reddedilmiş ise — tekrar başvurmasına izin verebilirsin veya engelleyebilirsin
  // Biz yeniden başvuruya izin veriyoruz
  if (user.driver_status === 'rejected') {
    // devam edeceğiz
  }

  // Başvuru kaydı
  user.driver_status = 'pending';
  await user.save();

  return user;
};

const uploadDriverDocument = async (userId, document_type, fileUrl) => {
  // Yeni belge kaydı
  return await DriverDocument.create({
    user_id: userId,
    document_type,
    document_url: fileUrl,
    status: 'pending',
  });
};

module.exports = {
  applyForDriver,
  uploadDriverDocument,
};
