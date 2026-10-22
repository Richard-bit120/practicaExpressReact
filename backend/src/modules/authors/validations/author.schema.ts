import { z } from "zod";

export const createAuthorSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(150, "El nombre no puede exceder los 150 caracteres"),
    biography: z.string().max(2000).optional(),
    birthDate: z.string().datetime().optional(),
  }),
});

export const updateAuthorSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(150).optional(),
    biography: z.string().max(2000).optional(),
    birthDate: z.string().datetime().optional(),
  }),
});
