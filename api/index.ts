import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../server/storage";
import { api } from "../shared/routes";
import { z } from "zod";

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0].trim();
  }
  return req.headers['x-real-ip'] as string || 'Unknown';
}

function detectDevice(userAgent: string | undefined): string {
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

// Initialize storage on first import
let storageInitialized = false;
async function initializeStorage() {
  if (!storageInitialized) {
    await storage.seedData();
    storageInitialized = true;
  }
}

// Export as Vercel serverless function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize storage
  await initializeStorage();
  
  // Get the path - Vercel passes the path in the query string when using rewrites
  let path = req.url || '';
  // Remove query string
  path = path.split('?')[0];
  // If path doesn't start with /api, it might be in the query
  if (!path.startsWith('/api') && req.query.path) {
    path = req.query.path as string;
  }
  // Ensure path starts with /api
  if (!path.startsWith('/api')) {
    path = `/api${path}`;
  }
  
  // Handle login
  if (path === api.auth.login.path && req.method === 'POST') {
    try {
      const { password } = api.auth.login.input.parse(req.body);
      if (password === "Ashu2008@") {
        // Log the login with device info
        const ip = getClientIp(req);
        const userAgent = req.headers['user-agent'] || '';
        const device = detectDevice(userAgent);
        await storage.addSecurityLog('Successful Login', device, ip);
        
        return res.json({ success: true });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } catch (e) {
      return res.status(400).json({ message: "Invalid request" });
    }
  }
  
  // Handle portfolio
  if (path === api.portfolio.get.path && req.method === 'GET') {
    const summary = await storage.getPortfolioSummary();
    return res.json(summary);
  }
  
  // Handle trades
  if (path === api.trades.list.path && req.method === 'GET') {
    const trades = await storage.getTrades();
    return res.json(trades);
  }
  
  // Handle security logs
  if (path === api.security.logs.path && req.method === 'GET') {
    const logs = await storage.getSecurityLogs();
    return res.json(logs.map(log => ({
      id: log.id,
      date: log.date.toISOString(),
      action: log.action,
      device: log.device,
      ip: log.ip
    })));
  }
  
  // 404 for unknown routes
  return res.status(404).json({ message: 'Not found' });
}
