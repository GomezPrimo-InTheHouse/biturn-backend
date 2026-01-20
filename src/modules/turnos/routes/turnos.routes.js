import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import { normalizarRolMiddleware } from "../../../middlewares/normalizar-rol.middleware.js";
import { postCancelarTurno } from "../controllers/cancelarTurno.controller.js";
import { postFinalizarTurno } from "../controllers/finalizarTurno.controller.js";
import { postNoAsistioTurno } from "../controllers/noAsistioTurno.controller.js";
import { postCrearTurnoAdmin } from "../controllers/crearTurnoAdmin.controller.js"
import { getTurnosOperativo } from "../controllers/listarTurnosOperativo.controller.js";

import {
  postCrearTurnoCliente,
  getDisponibilidad,
  getMisTurnos,
  postReprogramarTurno,
} from "../controllers/turnos.controller.js";

const router = Router();

/**
 * GET /turnos/disponibilidad
 * Público: devuelve horarios disponibles para reservar.
 */
router.get("/disponibilidad", getDisponibilidad);

// 🔒 Todo lo demás requiere sesión


router.use(authMiddleware);
router.use(normalizarRolMiddleware);

router.get("/_debug/whoami", (req, res) => {
  res.json({ ok: true, user: req.user });
});

// ...
router.post("/admin", postCrearTurnoAdmin);

/**
 * POST /turnos
 * Solo clientes: crea turno (confirmación automática) vía RPC.
 */
router.post("/", (req, res, next) => {
  if (req.user.rol_normalizado !== "cliente") {
    return res.status(403).json({
      ok: false,
      error: {
        code: "PROHIBIDO",
        message: "Solo un cliente puede crear turnos desde este endpoint.",
      },
    });
  }
  return postCrearTurnoCliente(req, res, next);
});

/**
 * GET /turnos/mis-turnos
 * Solo clientes: devuelve turnos del cliente autenticado en un rango.
 */
router.get("/mis-turnos", (req, res, next) => {
  if (req.user.rol_normalizado !== "cliente") {
    return res.status(403).json({
      ok: false,
      error: {
        code: "PROHIBIDO",
        message: "Solo un cliente puede consultar sus turnos.",
      },
    });
  }
  return getMisTurnos(req, res, next);
});


// ...
router.get("/", getTurnosOperativo);

// ...
router.post("/:id/no-asistio", postNoAsistioTurno);

// dentro del bloque protegido
router.post("/:id/finalizar", postFinalizarTurno);

/**
 * POST /turnos/:id/reprogramar
 * Cliente/empleado/admin. La RPC aplica regla de 2 horas si actor es cliente.
 */
router.post("/:id/reprogramar", postReprogramarTurno);

router.post("/:id/cancelar", postCancelarTurno);

export default router;
