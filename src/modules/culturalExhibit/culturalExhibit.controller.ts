import { Request, Response } from "express";
import * as culturalExhibitService from "./culturalExhibit.service";

export const createCulturalExhibit = async (req: Request, res: Response) => {
  try {
    const exhibit = await culturalExhibitService.createCulturalExhibit(
      req.body,
    );
    res.status(201).json(exhibit);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getCulturalExhibits = async (_req: Request, res: Response) => {
  try {
    const exhibits = await culturalExhibitService.getCulturalExhibits();
    res.json(exhibits);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCulturalExhibitById = async (req: Request, res: Response) => {
  try {
    const exhibit = await culturalExhibitService.getCulturalExhibitById(
      req.params.id,
    );
    if (!exhibit) {
      res.status(404).json({ error: "Not found" });
    }
    res.json(exhibit);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateCulturalExhibit = async (req: Request, res: Response) => {
  try {
    const exhibit = await culturalExhibitService.updateCulturalExhibit(
      req.params.id,
      req.body,
    );
    res.json(exhibit);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteCulturalExhibit = async (req: Request, res: Response) => {
  try {
    await culturalExhibitService.deleteCulturalExhibit(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
