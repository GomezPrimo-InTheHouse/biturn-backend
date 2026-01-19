import { Router } from 'express';

import basicAuth from '../../../middlewares/basic-auth.middleware.js'; // el tuyo ya existe
import authMiddleware from '../../../middlewares/auth.middleware.js';

import { login } from '../controllers/login.controller.js';
import { refresh } from '../controllers/refresh.controller.js';
import { logout } from '../controllers/logout.controller.js';
import { me } from '../controllers/me.controller.js';
import { register } from '../controllers/register.controller.js';

const router = Router();

router.post('/login', basicAuth, login);
router.post('/refresh', refresh);
router.post('/register', register)
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, me);

export default router;
