// src/modules/stats/stats.validators.js
import { HttpError } from "../../lib/httpErrors.js";

function isUUID(v) {
  return (
    typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
  );
}

function isISO(v) {
  return typeof v === "string" && !Number.isNaN(Date.parse(v));
}

function toInt(v, def) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

const PERIODOS = ["dia", "semana", "mes"];

export function validarStatsDashboardQuery(query, actorRol) {
  if (!["empleado", "admin"].includes(actorRol)) {
    throw new HttpError(
      403,
      "Solo empleado o admin pueden ver estadísticas.",
      "FORBIDDEN"
    );
  }

  const sucursalId = query?.sucursalId;
  const empleadoId = query?.empleadoId ?? null;
  const desde = query?.desde;
  const hasta = query?.hasta;
  const periodo = (query?.periodo ?? "dia").toString().toLowerCase();

  if (!isUUID(sucursalId)) throw new HttpError(400, "sucursalId inválido", "VALIDATION_ERROR");
  if (empleadoId !== null && !isUUID(empleadoId)) throw new HttpError(400, "empleadoId inválido", "VALIDATION_ERROR");
  if (!isISO(desde)) throw new HttpError(400, "desde debe ser ISO válido", "VALIDATION_ERROR");
  if (!isISO(hasta)) throw new HttpError(400, "hasta debe ser ISO válido", "VALIDATION_ERROR");
  if (!PERIODOS.includes(periodo)) {
    throw new HttpError(400, "periodo debe ser: dia | semana | mes", "VALIDATION_ERROR");
  }

  const d = Date.parse(desde);
  const h = Date.parse(hasta);
  if (h <= d) throw new HttpError(400, "hasta debe ser mayor a desde", "VALIDATION_ERROR");

  // rango máximo (stats)
  const maxDays = 366;
  const diffDays = (h - d) / (1000 * 60 * 60 * 24);
  if (diffDays > maxDays) {
    throw new HttpError(400, `Rango máximo: ${maxDays} días`, "VALIDATION_ERROR");
  }

  // Paginación "por bloque" (para UI excelente)
  // series (turnos por periodo)
  const seriesPage = clamp(toInt(query?.seriesPage, 1), 1, 100000);
  const seriesPageSize = clamp(toInt(query?.seriesPageSize, 60), 1, 400);

  // rankings
  const serviciosPage = clamp(toInt(query?.serviciosPage, 1), 1, 100000);
  const serviciosPageSize = clamp(toInt(query?.serviciosPageSize, 20), 1, 100);

  const empleadosPage = clamp(toInt(query?.empleadosPage, 1), 1, 100000);
  const empleadosPageSize = clamp(toInt(query?.empleadosPageSize, 20), 1, 100);

  const clientesPage = clamp(toInt(query?.clientesPage, 1), 1, 100000);
  const clientesPageSize = clamp(toInt(query?.clientesPageSize, 20), 1, 100);

  return {
    sucursalId,
    empleadoId,
    desde,
    hasta,
    periodo,

    series: {
      page: seriesPage,
      pageSize: seriesPageSize,
      offset: (seriesPage - 1) * seriesPageSize,
      limit: seriesPageSize,
    },

    rankings: {
      servicios: {
        page: serviciosPage,
        pageSize: serviciosPageSize,
        offset: (serviciosPage - 1) * serviciosPageSize,
        limit: serviciosPageSize,
      },
      empleados: {
        page: empleadosPage,
        pageSize: empleadosPageSize,
        offset: (empleadosPage - 1) * empleadosPageSize,
        limit: empleadosPageSize,
      },
      clientes: {
        page: clientesPage,
        pageSize: clientesPageSize,
        offset: (clientesPage - 1) * clientesPageSize,
        limit: clientesPageSize,
      },
    },
  };
}
