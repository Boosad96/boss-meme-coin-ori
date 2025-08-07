import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Crown,
  Wallet,
  Upload,
  Rocket,
  CheckCircle,
  Loader2,
  ExternalLink,
  Share2,
  Plus,
  TrendingUp,
  DollarSign,
  Zap,
  Info,
  Image as ImageIcon,
  Trash2,
  Clock
} from "lucide-react";
import bossLogo from "@assets/IMG_20241228_171541_071_1754517945728.jpg";

interface UploadResponse {
  success: boolean;
  imageUrl: string;
  fileName: string;
  fileSize: number;
}

interface DeployResponse {
  success: boolean;
  memeCoin: {
    id: string;
    name: string;
    symbol: string;
    imageUrl: string;
    contractAddress: string;
    deploymentTxHash: string;
    farcasterPostUrl: string;
  };
  contractAddress: string;
  deploymentTxHash: string;
  basescanUrl: string;
  gasUsed: string;
  feeRecipient: string;
}

type Step = "connect" | "upload" | "deploy" | "share";

export default function Home() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [currentStep, setCurrentStep] = useState<Step>("connect");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    fileName: string;
    preview: string;
  } | null>(null);
  const [deploymentResult, setDeploymentResult] = useState<DeployResponse | null>(null);

  // Mutations
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await apiRequest("POST", "/api/upload", formData);
      return res.json() as Promise<UploadResponse>;
    },
    onSuccess: (data) => {
      setUploadedImage({
        url: data.imageUrl,
        fileName: data.fileName,
        preview: URL.createObjectURL(fileInputRef.current!.files![0]),
      });
      setCurrentStep("deploy");
      toast({
        title: "Image uploaded successfully!",
        description: `${data.fileName} is ready for deployment.`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
      });
    },
  });

  const deployMutation = useMutation({
    mutationFn: async () => {
      if (!uploadedImage || !walletAddress) {
        throw new Error("Missing required data");
      }
      
      const res = await apiRequest("POST", "/api/deploy", {
        name: tokenName,
        symbol: tokenSymbol,
        imageUrl: uploadedImage.url,
        creatorAddress: walletAddress,
      });
      
      return res.json() as Promise<DeployResponse>;
    },
    onSuccess: (data) => {
      setDeploymentResult(data);
      setCurrentStep("share");
      toast({
        title: "Meme coin deployed! 🚀",
        description: `${tokenName} ($${tokenSymbol}) is now live on Base!`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Deployment failed",
        description: error instanceof Error ? error.message : "Failed to deploy meme coin",
      });
    },
  });

  // Handlers
  const handleWalletConnect = () => {
    // Simulate wallet connection
    setTimeout(() => {
      setIsWalletConnected(true);
      setWalletAddress("0x742d35Cc6636C0532925a3b8D40a8731");
      setCurrentStep("upload");
      toast({
        title: "Wallet connected!",
        description: "Ready to create your Boss meme coin.",
      });
    }, 2000);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image smaller than 10MB",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, GIF)",
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDeploy = () => {
    if (!tokenName.trim()) {
      toast({
        variant: "destructive",
        title: "Token name required",
        description: "Please enter a name for your meme coin",
      });
      return;
    }

    if (!tokenSymbol.trim()) {
      toast({
        variant: "destructive",
        title: "Token symbol required",
        description: "Please enter a symbol for your meme coin",
      });
      return;
    }

    deployMutation.mutate();
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setCurrentStep("upload");
  };

  const handleCreateAnother = () => {
    setTokenName("");
    setTokenSymbol("");
    setUploadedImage(null);
    setDeploymentResult(null);
    setCurrentStep("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStepStatus = (step: Step) => {
    const steps: Step[] = ["connect", "upload", "deploy", "share"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  const stepIcons = {
    connect: Wallet,
    upload: ImageIcon,
    deploy: Rocket,
    share: Share2,
  };

  const stepLabels = {
    connect: "Connect",
    upload: "Upload",
    deploy: "Deploy",
    share: "Share",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img 
                  src={bossLogo} 
                  alt="Boss Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Boss Meme Coin Creator</h1>
                <p className="text-xs text-muted-foreground">by @debabhi</p>
              </div>
            </div>
            
            <Button
              onClick={handleWalletConnect}
              disabled={isWalletConnected}
              className={`${
                isWalletConnected
                  ? "bg-secondary hover:bg-secondary/80"
                  : "bg-primary hover:bg-primary/80"
              } text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg`}
            >
              {isWalletConnected ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  <span>Connect Wallet</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            <span>Deploy on Base Mainnet</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Create Your Boss Meme Coin
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deploy your own meme coin on Base with just 0.0001 BASE gas. Upload your image, deploy, and share to Farcaster automatically.
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            {(["connect", "upload", "deploy", "share"] as Step[]).map((step, index) => {
              const Icon = stepIcons[step];
              const status = getStepStatus(step);
              const isLast = index === 3;
              
              return (
                <div key={step} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === "completed" || status === "current"
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          status === "completed" || status === "current"
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        status === "completed" || status === "current"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {stepLabels[step]}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={`w-16 h-0.5 ml-4 ${
                        status === "completed" ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Creation Card */}
        <Card className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-2xl">
          <CardContent className="p-0">
            {/* Loading State */}
            {deployMutation.isPending && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Deploying Your Boss Meme Coin</h3>
                <div className="space-y-3 text-left max-w-md mx-auto">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-muted-foreground">Uploading image to IPFS...</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    <span className="text-muted-foreground">Deploying contract to Base...</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-muted" />
                    <span className="text-muted">Posting to Farcaster...</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-6">This usually takes 30-60 seconds</p>
              </div>
            )}

            {/* Success State */}
            {deploymentResult && currentStep === "share" && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/20 rounded-full mb-6">
                  <CheckCircle className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Boss Meme Coin Deployed! 🚀</h3>
                <p className="text-muted-foreground mb-8">
                  Your meme coin has been successfully deployed to Base mainnet and posted to your Farcaster feed.
                </p>
                
                {/* Contract Details */}
                <Card className="bg-card rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-foreground mb-4">Contract Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Contract Address:</span>
                      <code className="text-accent font-mono text-sm bg-muted px-2 py-1 rounded">
                        {deploymentResult.contractAddress.slice(0, 8)}...{deploymentResult.contractAddress.slice(-8)}
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Network:</span>
                      <span className="text-foreground">Base Mainnet</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Gas Used:</span>
                      <span className="text-secondary">{deploymentResult.gasUsed} BASE</span>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild
                    className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    <a href={deploymentResult.basescanUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Basescan
                    </a>
                  </Button>
                  <Button 
                    asChild
                    variant="secondary"
                    className="px-6 py-3 rounded-xl font-medium"
                  >
                    <a href={deploymentResult.memeCoin.farcasterPostUrl} target="_blank" rel="noopener noreferrer">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Update
                    </a>
                  </Button>
                  <Button 
                    onClick={handleCreateAnother}
                    className="bg-secondary hover:bg-secondary/80 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Another
                  </Button>
                </div>
              </div>
            )}

            {/* Form State */}
            {!deployMutation.isPending && !deploymentResult && (
              <>
                {/* Token Details Form */}
                <div className="space-y-6 mb-8">
                  <div>
                    <Label htmlFor="tokenName" className="text-sm font-medium text-muted-foreground mb-3 block">
                      Token Name
                    </Label>
                    <Input
                      id="tokenName"
                      type="text"
                      placeholder="Enter your meme coin name..."
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tokenSymbol" className="text-sm font-medium text-muted-foreground mb-3 block">
                      Token Symbol
                    </Label>
                    <Input
                      id="tokenSymbol"
                      type="text"
                      placeholder="e.g., BOSS, MEME, DOGE..."
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="mb-8">
                  <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Meme Image
                  </Label>
                  <div
                    onClick={() => !uploadMutation.isPending && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20"
                  >
                    {uploadedImage ? (
                      <div>
                        <img
                          src={uploadedImage.preview}
                          alt="Uploaded meme preview"
                          className="max-h-64 mx-auto rounded-lg shadow-lg mb-4"
                        />
                        <div className="flex items-center justify-center space-x-4">
                          <span className="text-sm text-muted-foreground">{uploadedImage.fileName}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage();
                            }}
                            className="text-accent hover:text-accent/80"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : uploadMutation.isPending ? (
                      <div>
                        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-lg font-medium text-muted-foreground mb-2">Uploading image...</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium text-muted-foreground mb-2">Drop your meme image here</p>
                        <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                        <Button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-medium">
                          Choose File
                        </Button>
                        <p className="text-xs text-muted mt-3">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Token Economics */}
                <div className="bg-muted/30 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-secondary mr-2" />
                    Token Economics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">1B</div>
                      <div className="text-sm text-muted-foreground">Total Supply</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">3%</div>
                      <div className="text-sm text-muted-foreground">Trading Fee</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">0.0001 Ξ</div>
                      <div className="text-sm text-muted-foreground">Deploy Cost</div>
                    </div>
                  </div>
                </div>

                {/* Fee Recipient Info */}
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Fee Information</h4>
                      <p className="text-sm text-muted-foreground mb-2">3% trading fees will be sent to @debabhi's wallet:</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded text-accent font-mono">
                        0x73cf2b2eb72a243602e9dcda9efec6473e5c1741
                      </code>
                    </div>
                  </div>
                </div>

                {/* Deploy Button */}
                <Button
                  onClick={handleDeploy}
                  disabled={!isWalletConnected || !uploadedImage || !tokenName.trim() || !tokenSymbol.trim()}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center space-x-3"
                >
                  <Rocket className="h-5 w-5" />
                  <span>Deploy Boss Meme Coin</span>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <span className="text-foreground font-semibold">Boss Meme Coin Creator</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Built by @debabhi for the Farcaster ecosystem</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted">
              <span>Powered by Base</span>
              <span>•</span>
              <span>Built with React</span>
              <span>•</span>
              <span>Wallet Integration Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
