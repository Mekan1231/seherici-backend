const adminService = require('../services/admin.service');

const test = (req, res) => {
  return res.json({
    success: true,
    message: 'ADMIN_ENDPOINT_OK',
    user: req.user
  });
};

module.exports = {
  test,
};
