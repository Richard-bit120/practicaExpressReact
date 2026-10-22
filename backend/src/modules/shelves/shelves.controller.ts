import { Request, Response } from "express";
import { ShelvesService } from "./shelves.service";

const shelvesService = new ShelvesService();

export const getShelves = async (req: Request, res: Response) => {
  try {
    const shelves = await shelvesService.getAll();
    res.json(shelves);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estantes" });
  }
};

export const getShelfById = async (req: Request, res: Response) => {
  try {
    const shelf = await shelvesService.getById(Number(req.params.id));
    if (!shelf) return res.status(404).json({ error: "Estante no encontrado" });
    res.json(shelf);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el estante" });
  }
};

export const createShelf = async (req: Request, res: Response) => {
  try {
    const shelf = await shelvesService.create(req.body);
    res.status(201).json(shelf);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el estante" });
  }
};

export const updateShelf = async (req: Request, res: Response) => {
  try {
    const shelf = await shelvesService.update(Number(req.params.id), req.body);
    if (!shelf) return res.status(404).json({ error: "Estante no encontrado" });
    res.json(shelf);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el estante" });
  }
};

export const deleteShelf = async (req: Request, res: Response) => {
  try {
    const deleted = await shelvesService.delete(Number(req.params.id));
    if (!deleted)
      return res.status(404).json({ error: "Estante no encontrado" });
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
