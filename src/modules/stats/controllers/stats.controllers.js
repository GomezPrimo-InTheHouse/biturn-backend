// src/modules/stats/stats.controllers.js
import { validarStatsDashboardQuery } from "./stats.validators.js";
import { obtenerStatsDashboardRPC } from "./stats.services.js";
import { parsearErrorRPC } from "../../lib/rpcErrorMapper.js";

export async function getStatsDashboard(req, res, next) {
  try {
    const actorRol = req.user.rol_normalizado;

    const v = validarStatsDashboardQuery(req.query, actorRol);

    // payload a RPC (flat + offsets por bloque)
    const payload = {
      p_sucursal_id: v.sucursalId,
      p_empleado_id: v.empleadoId,
      p_desde: v.desde,
      p_hasta: v.hasta,
      p_periodo: v.periodo,

      // paginación por bloque
      p_series_limit: v.series.limit,
      p_series_offset: v.series.offset,

      p_servicios_limit: v.rankings.servicios.limit,
      p_servicios_offset: v.rankings.servicios.offset,

      p_empleados_limit: v.rankings.empleados.limit,
      p_empleados_offset: v.rankings.empleados.offset,

      p_clientes_limit: v.rankings.clientes.limit,
      p_clientes_offset: v.rankings.clientes.offset,
    };

    const data = await obtenerStatsDashboardRPC(payload);

    // devolvemos también eco de paginación para UI
    return res.status(200).json({
      ok: true,
      data,
      paging: {
        series: v.series,
        servicios: v.rankings.servicios,
        empleados: v.rankings.empleados,
        clientes: v.rankings.clientes,
      },
    });
  } catch (err) {
    if (err?.message || err?.details || err?.hint) {
      return next(parsearErrorRPC(err));
    }
    return next(err);
  }
}
