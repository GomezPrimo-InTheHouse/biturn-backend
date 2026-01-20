import express from "express";
import  authMiddleware  from "../../../middlewares/auth.middleware.js";
import { normalizarRolMiddleware } from "../../../middlewares/normalizar-rol.middleware.js";
import { getClientes } from "../controllers/listarClientes.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(normalizarRolMiddleware);

router.get("/", getClientes);

export default router;
