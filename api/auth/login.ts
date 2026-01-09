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
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Initialize storage first
    try {
      await initializeStorage();
    } catch (storageError: any) {
      console.error('Storage initialization error:', storageError);
      return res.status(500).json({ 
        message: "Storage initialization failed",
        error: storageError?.message 
      });
    }
    
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed', received: req.method });
    }
    
    // Log request for debugging
    console.log('Login request received:', {
      method: req.method,
      url: req.url,
      hasBody: !!req.body,
      bodyType: typeof req.body
    });
    
    // Parse body - Vercel automatically parses JSON, but handle both cases
    let body = req.body;
    
    // If body is a string, parse it
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('Failed to parse body as JSON:', body);
        return res.status(400).json({ message: "Invalid JSON in request body" });
      }
    }
    
    // If body is undefined or null, return error
    if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
      console.error('Request body is empty or invalid');
      return res.status(400).json({ message: "Request body is required", received: body });
    }
    
    // Validate input
    let parsed;
    try {
      parsed = api.auth.login.input.safeParse(body);
    } catch (parseError: any) {
      console.error('Parse error:', parseError);
      return res.status(400).json({ 
        message: "Failed to parse request",
        error: parseError?.message 
      });
    }
    
    if (!parsed.success) {
      console.error('Validation error:', parsed.error);
      return res.status(400).json({ 
        message: "Invalid request format",
        errors: parsed.error.errors
      });
    }
    
    const { password } = parsed.data;
    console.log('Password received, length:', password?.length || 0);
    
    // Check password - be explicit about comparison
    const correctPassword = "Ashu2008@";
    if (password === correctPassword) {
      try {
        const ip = getClientIp(req);
        const userAgent = req.headers['user-agent'] || '';
        const device = detectDevice(userAgent);
        await storage.addSecurityLog('Successful Login', device, ip);
        console.log('Login successful');
        return res.status(200).json({ success: true });
      } catch (logError: any) {
        console.error('Error logging security event:', logError);
        // Still return success even if logging fails
        return res.status(200).json({ success: true });
      }
    } else {
      console.error('Invalid password attempt. Expected length:', correctPassword.length, 'Got length:', password?.length);
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (e: any) {
    console.error('Login error:', e);
    console.error('Error stack:', e?.stack);
    return res.status(500).json({ 
      message: "Internal server error",
      error: e?.message || String(e)
    });
  }
}
