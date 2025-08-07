import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { deployMemeCoinSchema } from "@shared/schema";
import { randomUUID } from "crypto";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Image upload endpoint
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // In a real implementation, upload to IPFS or cloud storage
      // For now, simulate with a mock URL
      const imageUrl = `https://ipfs.io/ipfs/${randomUUID()}`;
      
      res.json({
        success: true,
        imageUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ 
        message: "Failed to upload image",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Deploy meme coin endpoint
  app.post("/api/deploy", async (req, res) => {
    try {
      const validatedData = deployMemeCoinSchema.parse(req.body);
      
      // Create meme coin record
      const memeCoin = await storage.createMemeCoin({
        name: validatedData.name,
        symbol: validatedData.symbol,
        imageUrl: validatedData.imageUrl,
        creatorAddress: validatedData.creatorAddress,
      });

      // Simulate contract deployment
      // In real implementation, use Viem to deploy to Base
      const contractAddress = `0x${randomUUID().replace(/-/g, '').substring(0, 40)}`;
      const deploymentTxHash = `0x${randomUUID().replace(/-/g, '')}`;
      
      // Simulate deployment delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update with deployment details
      const updatedCoin = await storage.updateMemeCoin(memeCoin.id, {
        contractAddress,
        deploymentTxHash,
      });

      // Simulate Farcaster posting
      // In real implementation, use Farcaster API
      const farcasterPostUrl = `https://warpcast.com/~/compose?text=Just deployed my Boss Meme Coin: ${validatedData.name} ($${validatedData.symbol}) on Base! 🚀`;
      
      await storage.updateMemeCoin(memeCoin.id, {
        farcasterPostUrl,
      });

      res.json({
        success: true,
        memeCoin: {
          ...updatedCoin,
          farcasterPostUrl,
        },
        contractAddress,
        deploymentTxHash,
        basescanUrl: `https://basescan.org/address/${contractAddress}`,
        gasUsed: "0.0001",
        feeRecipient: "0x73cf2b2eb72a243602e9dcda9efec6473e5c1741",
      });
    } catch (error) {
      console.error("Deploy error:", error);
      
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.message,
        });
      }
      
      res.status(500).json({
        message: "Failed to deploy meme coin",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get meme coins by creator
  app.get("/api/coins/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const coins = await storage.getMemeCoinsByCreator(address);
      res.json({ coins });
    } catch (error) {
      console.error("Get coins error:", error);
      res.status(500).json({
        message: "Failed to fetch meme coins",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
