import { z } from 'zod';
import { trades } from './schema';

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({
        password: z.string()
      }),
      responses: {
        200: z.object({ success: z.boolean() }),
        401: z.object({ message: z.string() })
      }
    }
  },
  portfolio: {
    get: {
      method: 'GET' as const,
      path: '/api/portfolio',
      responses: {
        200: z.object({
          totalValue: z.number(),
          initialDeposit: z.number(),
          netPnL: z.number(),
          allTimeProfit: z.number(),
          totalClosedTrades: z.number(),
          ongoingPositions: z.number(),
          successRate: z.number(),
          totalTrades: z.number()
        })
      }
    }
  },
  trades: {
    list: {
      method: 'GET' as const,
      path: '/api/trades',
      responses: {
        200: z.array(z.custom<typeof trades.$inferSelect>())
      }
    }
  },
  security: {
    logs: {
      method: 'GET' as const,
      path: '/api/security/logs',
      responses: {
        200: z.array(z.object({
          id: z.number(),
          date: z.string(),
          action: z.string(),
          device: z.string(),
          ip: z.string()
        }))
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
