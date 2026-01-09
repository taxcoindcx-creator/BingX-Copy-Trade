import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../server/storage";

let storageInitialized = false;
async function initializeStorage() {
  if (!storageInitialized) {
    await storage.seedData();
    storageInitialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    await initializeStorage();
    
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const logs = await storage.getSecurityLogs();
    return res.status(200).json(logs.map(log => ({
      id: log.id,
      date: log.date.toISOString(),
      action: log.action,
      device: log.device,
      ip: log.ip
    })));
  } catch (e: any) {
    console.error('Security logs error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
