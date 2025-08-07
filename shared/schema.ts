import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const memeCoins = pgTable("meme_coins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  imageUrl: text("image_url").notNull(),
  contractAddress: text("contract_address"),
  creatorAddress: text("creator_address").notNull(),
  deploymentTxHash: text("deployment_tx_hash"),
  farcasterPostUrl: text("farcaster_post_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMemeCoinSchema = createInsertSchema(memeCoins).pick({
  name: true,
  symbol: true,
  imageUrl: true,
  creatorAddress: true,
});

export const deployMemeCoinSchema = insertMemeCoinSchema.extend({
  name: z.string().min(1, "Token name is required").max(50, "Token name too long"),
  symbol: z.string().min(1, "Token symbol is required").max(10, "Symbol too long").regex(/^[A-Z0-9]+$/, "Symbol must be uppercase letters and numbers only"),
  imageUrl: z.string().url("Valid image URL is required"),
  creatorAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Valid Ethereum address required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMemeCoin = z.infer<typeof insertMemeCoinSchema>;
export type MemeCoin = typeof memeCoins.$inferSelect;
export type DeployMemeCoin = z.infer<typeof deployMemeCoinSchema>;
