// src/modules/agenda/routes/agenda.routes.js
import express from "express";
import { normalizarRolMiddleware } from "../../../middlewares/normalizar-rol.middleware.js";
import authMiddleware from "../../../middlewares/auth.middleware.js";

import { postCrearBloqueo } from "../controllers/crearBloqueo.controller.js";
import { deleteBloqueo } from "../controllers/eliminarBloqueo.controller.js";
import { getEventosAgenda } from "../controllers/listarEventosAgenda.controller.js";

const router = express.Router();

// todo agenda es protegido
router.use(authMiddleware);
router.use(normalizarRolMiddleware);

router.post("/bloqueos", postCrearBloqueo);

router.get("/eventos", getEventosAgenda);

router.delete("/bloqueos/:id", deleteBloqueo);

export default router;
