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
  await initializeStorage();
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const logs = await storage.getSecurityLogs();
  return res.json(logs.map(log => ({
    id: log.id,
    date: log.date.toISOString(),
    action: log.action,
    device: log.device,
    ip: log.ip
  })));
}
