// src/utils/rpc/rpcErrorParser.js
const DEFAULT_MESSAGE = "Error en operación";

export function parsearErrorRPC(rpcError) {
  const raw =
    rpcError?.message ||
    rpcError?.details ||
    rpcError?.hint ||
    String(rpcError || "");

  // Formato: "CODIGO:ERROR|Mensaje"
  const pipeIdx = raw.indexOf("|");
  const head = pipeIdx >= 0 ? raw.slice(0, pipeIdx) : raw;
  const message = pipeIdx >= 0 ? raw.slice(pipeIdx + 1).trim() : DEFAULT_MESSAGE;

  const colonIdx = head.indexOf(":");
  const code = colonIdx >= 0 ? head.slice(0, colonIdx).trim() : "RPC_ERROR";

  return { code, message, raw };
}
