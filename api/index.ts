import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes once
let routesInitialized = false;

async function initializeRoutes() {
  if (!routesInitialized) {
    await registerRoutes(null as any, app);
    routesInitialized = true;
  }
}

// Export as Vercel serverless function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure routes are initialized
  await initializeRoutes();
  
  // Convert Vercel request/response to Express format
  return new Promise<void>((resolve) => {
    const expressReq = req as any;
    const expressRes = res as any;
    
    // Handle response end
    const originalEnd = expressRes.end;
    expressRes.end = function(...args: any[]) {
      originalEnd.apply(this, args);
      resolve();
    };
    
    app(expressReq, expressRes, () => {
      if (!expressRes.headersSent) {
        expressRes.status(404).json({ message: 'Not found' });
        resolve();
      }
    });
  });
}
