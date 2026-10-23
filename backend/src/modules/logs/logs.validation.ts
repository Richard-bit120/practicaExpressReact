import * as yup from "yup";

export const listLogsSchema = yup.object({
  query: yup.object({
    level: yup.string().oneOf(["INFO", "WARN", "ERROR", "DEBUG"]).optional(),
    event: yup.string().optional(),
    dateFrom: yup.date().optional(),
    dateTo: yup.date().optional(),
    page: yup.number().integer().positive().optional(),
    limit: yup.number().integer().positive().max(200).optional(),
  }),
});

export const cleanupLogsSchema = yup.object({
  body: yup.object({
    days: yup.number().integer().positive().min(1).max(365).optional(),
  }),
});
