// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './modules/auth/routes/auth.routes.js';
import turnosRoutes from './modules/turnos/routes/turnos.routes.js';
import agendaRoutes from "./modules/agenda/routes/agenda.routes.js";
import clientesRoutes from "./modules/clientes/routes/clientes.routes.js";


import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// rutas
app.use('/auth', authRoutes);
app.use("/turnos", turnosRoutes);
app.use("/agenda", agendaRoutes);
app.use("/clientes", clientesRoutes);

// healthcheck simple
app.get('/health', (_, res) => {
  res.json({ ok: true });
});

// middleware de manejo de errores
app.use(errorMiddleware);

export default app;
