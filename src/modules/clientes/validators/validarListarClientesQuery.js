import { HttpError } from "../../../lib/httpErrors.js";

function isUUID(v) {
  return typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export function validarListarClientesQuery(query, actorRol) {
  if (!["empleado", "admin"].includes(actorRol)) {
    throw new HttpError(403, "Solo empleado o admin pueden listar clientes.", "FORBIDDEN");
  }

  const sucursalId = query?.sucursalId ?? null;
  const q = (query?.q ?? "").toString().trim();

  const page = Number(query?.page ?? 1);
  const pageSize = Number(query?.pageSize ?? 20);

  const sortBy = (query?.sortBy ?? "ultimo_turno").toString();
  const sortDir = (query?.sortDir ?? "desc").toString().toLowerCase();

  if (sucursalId !== null && !isUUID(sucursalId)) {
    throw new HttpError(400, "sucursalId inválido", "VALIDATION_ERROR");
  }

  if (!Number.isFinite(page) || page < 1) throw new HttpError(400, "page inválido", "VALIDATION_ERROR");
  if (!Number.isFinite(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new HttpError(400, "pageSize inválido (1..100)", "VALIDATION_ERROR");
  }

  const allowedSortBy = ["nombre", "creado_en", "ultimo_turno", "turnos_total"];
  if (!allowedSortBy.includes(sortBy)) {
    throw new HttpError(400, `sortBy debe ser: ${allowedSortBy.join(", ")}`, "VALIDATION_ERROR");
  }
  if (!["asc", "desc"].includes(sortDir)) {
    throw new HttpError(400, "sortDir debe ser asc o desc", "VALIDATION_ERROR");
  }

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return { sucursalId, q, page, pageSize, offset, limit, sortBy, sortDir };
}
