const express = require('express');

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const driverRoutes = require('./routes/driver.routes');
const adminRoutes = require('./routes/admin.routes');

const globalErrorHandler = require('./middlewares/error.middleware');

const app = express();
app.use(express.json());

// ROUTES
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);

// TEST ROOT
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API OK' });
});

// GLOBAL ERROR HANDLER (en sonda!)
app.use(globalErrorHandler);

module.exports = app;




