import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed data on startup
  await storage.seedData();

  app.post(api.auth.login.path, (req, res) => {
    try {
      const { password } = api.auth.login.input.parse(req.body);
      if (password === "Ashu2008@") {
        res.json({ success: true });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } catch (e) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get(api.portfolio.get.path, async (_req, res) => {
    const summary = await storage.getPortfolioSummary();
    res.json(summary);
  });

  app.get(api.trades.list.path, async (_req, res) => {
    const trades = await storage.getTrades();
    res.json(trades);
  });

  return httpServer;
}
