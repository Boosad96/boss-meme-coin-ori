import { type User, type InsertUser, type MemeCoin, type InsertMemeCoin } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createMemeCoin(memeCoin: InsertMemeCoin): Promise<MemeCoin>;
  getMemeCoin(id: string): Promise<MemeCoin | undefined>;
  updateMemeCoin(id: string, updates: Partial<MemeCoin>): Promise<MemeCoin | undefined>;
  getMemeCoinsByCreator(creatorAddress: string): Promise<MemeCoin[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private memeCoins: Map<string, MemeCoin>;

  constructor() {
    this.users = new Map();
    this.memeCoins = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMemeCoin(insertMemeCoin: InsertMemeCoin): Promise<MemeCoin> {
    const id = randomUUID();
    const memeCoin: MemeCoin = {
      ...insertMemeCoin,
      id,
      contractAddress: null,
      deploymentTxHash: null,
      farcasterPostUrl: null,
      createdAt: new Date(),
    };
    this.memeCoins.set(id, memeCoin);
    return memeCoin;
  }

  async getMemeCoin(id: string): Promise<MemeCoin | undefined> {
    return this.memeCoins.get(id);
  }

  async updateMemeCoin(id: string, updates: Partial<MemeCoin>): Promise<MemeCoin | undefined> {
    const memeCoin = this.memeCoins.get(id);
    if (!memeCoin) return undefined;
    
    const updated = { ...memeCoin, ...updates };
    this.memeCoins.set(id, updated);
    return updated;
  }

  async getMemeCoinsByCreator(creatorAddress: string): Promise<MemeCoin[]> {
    return Array.from(this.memeCoins.values()).filter(
      (coin) => coin.creatorAddress === creatorAddress
    );
  }
}

export const storage = new MemStorage();
