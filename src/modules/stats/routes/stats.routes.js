// src/modules/stats/routes/stats.routes.js
import express from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import { normalizarRolMiddleware } from "../../../middlewares/normalizar-rol.middleware.js";

import { getKpis } from "../controllers/kpis.controller.js";
import { getTurnosPorPeriodo } from "../controllers/turnosPorPeriodo.controller.js";
import { getServiciosTop } from "../controllers/serviciosTop.controller.js";

// (Opcional) si implementaste el “dashboard” unificado en una sola RPC:
// import { getStatsDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

/**
 * Todas las rutas de /stats son privadas (empleado/admin)
 */
router.use(authMiddleware);
router.use(normalizarRolMiddleware);

/**
 * KPIs
 * GET /stats/kpis?sucursalId&desde&hasta
 */
router.get("/kpis", getKpis);

/**
 * Turnos por período (día/semana/mes)
 * GET /stats/turnos-por-periodo?sucursalId&desde&hasta&periodo=dia|semana|mes&empleadoId?&page?&pageSize?
 */
router.get("/turnos-por-periodo", getTurnosPorPeriodo);

/**
 * Servicios más solicitados (ranking)
 * GET /stats/servicios-top?sucursalId&desde&hasta&empleadoId?&page?&pageSize?
 */
router.get("/servicios-top", getServiciosTop);

/**
 * Dashboard unificado (si lo agregás después)
 * GET /stats/dashboard?sucursalId&desde&hasta&periodo=dia|semana|mes&empleadoId?&seriesPage?... etc
 */
// router.get("/dashboard", getStatsDashboard);

export default router;
