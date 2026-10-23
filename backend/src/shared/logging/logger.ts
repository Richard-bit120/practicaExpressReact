import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { env } from "../../config/env";

// Formato base plano para archivos y consola (sin caracteres ANSI de color)
const baseLogFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    // Se elimina el guión '-' sintácticamente incorrecto en el template literal
    return stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}` // Corregido salto de línea y remoción de caracter inválido
      : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  }),
);

// Formato específico con colores únicamente para la consola
const consoleLogFormat = winston.format.combine(
  winston.format.colorize({ all: true }), // Aplica color solo en consola
  baseLogFormat,
);

const transportsList: winston.transport[] = [
  new winston.transports.Console({
    format: consoleLogFormat, // Formato coloreado para la salida de consola
  }),
];

// En producción o desarrollo, guardamos logs en archivos rotativos
if (env.NODE_ENV !== "test") {
  const fileRotateTransport = new DailyRotateFile({
    filename: path.join(__dirname, "../../../logs", "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d", // Retención de 14 días
    level: "info",
    format: baseLogFormat, // Formato plano sin caracteres de color ANSI para los archivos .log
  });

  transportsList.push(fileRotateTransport); // Se utiliza la lista de transportes corregida
}

export const logger = winston.createLogger({
  level: env.NODE_ENV === "development" ? "debug" : "info",
  format: baseLogFormat,
  transports: transportsList,
});
