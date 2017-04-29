import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import ivrConfirmRoutes from './ivr.confirm.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount ivr confirm routes at /ivr-confirm
router.use('/call', ivrConfirmRoutes);

export default router;
