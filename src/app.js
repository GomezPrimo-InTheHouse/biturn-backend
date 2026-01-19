import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './modules/auth/routes/auth.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// rutas
app.use('/auth', authRoutes);

// healthcheck simple
app.get('/health', (_, res) => {
  res.json({ ok: true });
});

export default app;
