import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../server/storage";

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
    
    const summary = await storage.getPortfolioSummary();
    return res.status(200).json(summary);
  } catch (e: any) {
    console.error('Portfolio error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
