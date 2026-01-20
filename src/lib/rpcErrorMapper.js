// src/modules/turnos/utils/rpcErrors.js
const DEFAULT_MESSAGE = "Error en operación";

export function parsearErrorRPC(rpcError) {
  // Supabase suele devolver { message }, o { details }, etc.
  const raw =
    rpcError?.message ||
    rpcError?.details ||
    rpcError?.hint ||
    String(rpcError || "");

  // Formato esperado: "CODIGO:ERROR|Mensaje"
  const idxPipe = raw.indexOf("|");
  const head = idxPipe >= 0 ? raw.slice(0, idxPipe) : raw;
  const message = idxPipe >= 0 ? raw.slice(idxPipe + 1).trim() : DEFAULT_MESSAGE;

  const idxColon = head.indexOf(":");
  const code = idxColon >= 0 ? head.slice(0, idxColon).trim() : "RPC_ERROR";

  return { code, message, raw };
}

export function mapearErrorRPC(code) {
  // map común para CORE
  const map = {
    TURNO_NO_ENCONTRADO: { status: 404, code: "TURNO_NO_ENCONTRADO" },
    TURNO_NO_CANCELABLE: { status: 409, code: "TURNO_NO_CANCELABLE" },
    TURNO_NO_REPROGRAMABLE: { status: 409, code: "TURNO_NO_REPROGRAMABLE" },
    TURNO_YA_FINALIZADO: { status: 409, code: "TURNO_YA_FINALIZADO" },
    REGLA_2_HORAS: { status: 409, code: "REGLA_2_HORAS" },
    SLOTS_NO_DISPONIBLES: { status: 409, code: "SLOTS_NO_DISPONIBLES" },
    DURACION_INVALIDA: { status: 400, code: "DURACION_INVALIDA" },
    CLIENTE_PENALIZADO: { status: 409, code: "CLIENTE_PENALIZADO" },
  };

  return map[code] || { status: 400, code: "RPC_ERROR" };
}
