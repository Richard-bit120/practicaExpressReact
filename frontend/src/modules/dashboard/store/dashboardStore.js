import { create } from "zustand";
import api from "../../../shared/services/api"; // Tu instancia de Axios

export const useDashboardStore = create((set, get) => ({
  counts: {},
  loading: false,
  error: null,
  hasLoaded: false, // Bandera para saber si ya tenemos datos

  fetchCounts: async () => {
    // Si ya cargamos los datos antes, no volvemos a golpear el backend
    if (get().hasLoaded) return;

    set({ loading: true, error: null });
    try {
      const response = await api.get("/dashboard/stats");
      set({ counts: response.data, hasLoaded: true });
    } catch (error) {
      set({ error: "Error al cargar las estadísticas del dashboard." });
    } finally {
      set({ loading: false });
    }
  },
}));