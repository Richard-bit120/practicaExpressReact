import { z } from "zod";

export const createGenreSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder los 50 caracteres")
      .transform((val) => val.trim()), // Trim para evitar duplicados por espacios
    description: z.string().max(500).optional(),
  }),
});

export const updateGenreSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2)
      .max(50)
      .transform((val) => val.trim())
      .optional(),
    description: z.string().max(500).optional(),
  }),
});
