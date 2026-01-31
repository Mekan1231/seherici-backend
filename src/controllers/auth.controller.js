const authService = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const result = await authService.login(phone, password);

    return res.status(200).json({
      success: true,
      message: "LOGIN_SUCCESS",
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        phone: result.user.phone,
        role: result.user.role,
        is_available: result.user.is_available
      }
    });

  } catch (err) {
    next(err); // ⬅ Hata global error handler’a gider
  }
};

module.exports = { login };





