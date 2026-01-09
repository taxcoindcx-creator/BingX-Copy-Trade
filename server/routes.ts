import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

function getClientIp(req: Express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0].trim();
  }
  return req.socket.remoteAddress || req.ip || 'Unknown';
}

function detectDevice(userAgent: string): string {
  if (!userAgent) return 'Unknown Device';
  
  // Mobile devices
  if (/iPhone/.test(userAgent)) {
    if (/iPhone OS 17/.test(userAgent)) return 'iPhone 15 Pro';
    if (/iPhone OS 16/.test(userAgent)) return 'iPhone 14 Pro';
    if (/iPhone OS 15/.test(userAgent)) return 'iPhone 13 Pro';
    return 'iPhone';
  }
  if (/iPad/.test(userAgent)) return 'iPad';
  if (/Android/.test(userAgent)) {
    if (/SM-S/.test(userAgent)) return 'Samsung Galaxy S24';
    if (/Pixel/.test(userAgent)) return 'Google Pixel';
    return 'Android Device';
  }
  
  // Desktop
  if (/Windows/.test(userAgent)) {
    if (/Chrome/.test(userAgent)) return 'Windows • Chrome';
    if (/Firefox/.test(userAgent)) return 'Windows • Firefox';
    if (/Edge/.test(userAgent)) return 'Windows • Edge';
    return 'Windows';
  }
  if (/Mac OS X/.test(userAgent)) {
    if (/Chrome/.test(userAgent)) return 'macOS • Chrome';
    if (/Safari/.test(userAgent)) return 'macOS • Safari';
    return 'macOS';
  }
  if (/Linux/.test(userAgent)) {
    if (/Chrome/.test(userAgent)) return 'Linux • Chrome';
    if (/Firefox/.test(userAgent)) return 'Linux • Firefox';
    return 'Linux';
  }
  
  return 'Desktop Browser';
}

export async function registerRoutes(
  httpServer: Server | null,
  app: Express
): Promise<Server | void> {
  // Seed data on startup
  await storage.seedData();

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { password } = api.auth.login.input.parse(req.body);
      if (password === "Ashu2008@") {
        // Log the login with device info
        const ip = getClientIp(req);
        const userAgent = req.headers['user-agent'] || '';
        const device = detectDevice(userAgent);
        await storage.addSecurityLog('Successful Login', device, ip);
        
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

  app.get(api.security.logs.path, async (_req, res) => {
    const logs = await storage.getSecurityLogs();
    res.json(logs.map(log => ({
      id: log.id,
      date: log.date.toISOString(),
      action: log.action,
      device: log.device,
      ip: log.ip
    })));
  });

  return httpServer || undefined;
}
