# Boss Meme Coin Creator

A Farcaster Mini App for creating and deploying meme coins with @debabhi branding. Built with React, this application allows users to upload images, configure token parameters, and simulate meme coin deployment on Base mainnet.

## Features

- **Wallet Connection**: Simulated wallet integration (ready for WalletConnect/RainbowKit)
- **Image Upload**: Support for meme coin images with validation (10MB limit)
- **Token Deployment**: Simulated Base mainnet deployment with contract generation
- **Farcaster Integration**: Automatic posting to user's Farcaster feed
- **Boss Branding**: Features @debabhi branding and custom logo
- **Modern UI**: Dark theme with responsive design using Tailwind CSS and Shadcn/ui

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side navigation
- **Backend**: Express.js with TypeScript
- **File Upload**: Multer for multipart form handling
- **Storage**: In-memory storage (development) / PostgreSQL (production)

## Development

This project is configured for Replit development:

```bash
npm run dev
```

The application runs on port 5000 with both frontend and backend served together.

## Deployment to Vercel

To deploy this application to Vercel with Next.js:

### 1. Convert to Next.js Structure

```bash
# Create new Next.js project
npx create-next-app@latest boss-meme-coin --typescript --tailwind --eslint --app

# Copy components and pages
cp -r client/src/components boss-meme-coin/components/ui
cp -r client/src/pages boss-meme-coin/app
cp -r client/src/lib boss-meme-coin/lib

# Copy server logic to API routes
cp -r server boss-meme-coin/api
```

### 2. Install Dependencies

```bash
cd boss-meme-coin
npm install @tanstack/react-query @hookform/resolvers wouter
npm install @radix-ui/react-* lucide-react
npm install drizzle-orm drizzle-kit @neondatabase/serverless
npm install multer @types/multer
```

### 3. Configure Environment Variables

Create `.env.local`:

```env
DATABASE_URL=your_neon_database_url
NEXTAUTH_SECRET=your_secret_key
```

### 4. Update API Routes

Convert Express routes to Next.js API routes in `app/api/`:

- `server/routes.ts` → `app/api/upload/route.ts` and `app/api/deploy/route.ts`
- Use Next.js Request/Response instead of Express req/res

### 5. Add Real Blockchain Integration

For production deployment, integrate:

```bash
# Install blockchain libraries
npm install wagmi viem @rainbow-me/rainbowkit
```

Update deployment logic in API routes to use real Base network deployment with Viem.

### 6. Deploy to Vercel

```bash
# Connect to Vercel
npx vercel

# Follow prompts to deploy
```

## Configuration

### Wallet Integration
- Fee recipient: `0x73cf2b2eb72a243602e9dcda9efec6473e5c1741`
- Network: Base Mainnet
- Gas limit: 0.0001 BASE
- Trading fee: 3% (hardcoded)

### Token Parameters
- Total supply: 1,000,000,000 (1 billion tokens)
- Decimals: 18
- Brand: "Boss" prefix for all tokens

## API Endpoints

- `POST /api/upload` - Upload meme coin image
- `POST /api/deploy` - Deploy meme coin contract
- `GET /api/coins/:address` - Get meme coins by creator address

## License

MIT License - Created by @debabhi