import type { Request, Response, NextFunction } from "express";

const requestCounts = new Map<string, { count: number; startTime: number }>();

/**
 * Factory para crear un Rate Limiter configurable.
 * @param maxRequests Número máximo de peticiones permitidas por ventana.
 * @param windowMs Tiempo en milisegundos de la ventana (ej: 60000ms = 1 minuto).
 */
export const rateLimiterMiddleware = (maxRequests: number = 5, windowMs: number = 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = req.ip || req.socket.remoteAddress || "unknown_ip";
    const currentTime = Date.now();

    const record = requestCounts.get(clientIp);

    if (!record) {
      requestCounts.set(clientIp, { count: 1, startTime: currentTime });
      return next();
    }

    if (currentTime - record.startTime > windowMs) {
      requestCounts.set(clientIp, { count: 1, startTime: currentTime });
      return next();
    }

    record.count++;

    if (record.count > maxRequests) {
      res.status(429).json({
        message: `Demasiadas peticiones desde esta IP. Por favor, intenta de nuevo en unos minutos.`,
      });
      return;
    }

    next();
  };
};