import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../server/storage";
import { api } from "../../shared/routes";

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
  if (/iPhone/.test(userAgent)) {
    if (/iPhone OS 17/.test(userAgent)) return 'iPhone 15 Pro';
    if (/iPhone OS 16/.test(userAgent)) return 'iPhone 14 Pro';
    return 'iPhone';
  }
  if (/Android/.test(userAgent)) return 'Android Device';
  if (/Windows/.test(userAgent)) return 'Windows • Chrome';
  if (/Mac OS X/.test(userAgent)) return 'macOS • Chrome';
  return 'Desktop Browser';
}

let storageInitialized = false;
async function initializeStorage() {
  if (!storageInitialized) {
    await storage.seedData();
    storageInitialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initializeStorage();
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { password } = api.auth.login.input.parse(req.body);
    if (password === "Ashu2008@") {
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
