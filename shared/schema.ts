import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  amount: numeric("amount").notNull(), // Positive for profit, negative for loss
  type: text("type").notNull(), // 'profit', 'loss', 'deposit'
  status: text("status").notNull(), // 'closed', 'open'
  description: text("description"),
});

export const insertTradeSchema = createInsertSchema(trades).omit({ id: true });

export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;

export interface PortfolioSummary {
  totalValue: number;
  initialDeposit: number;
  netPnL: number;
  allTimeProfit: number;
  totalClosedTrades: number;
  ongoingPositions: number;
  successRate: number;
  totalTrades: number;
}
