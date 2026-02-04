import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ExternalLink, Shield, AlertCircle } from "lucide-react";

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectMetaMask = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check for MetaMask / injected provider
      const { ethereum } = window as any;

      if (!ethereum) {
        setError("MetaMask is not installed. Please install the MetaMask extension and try again.");
        return;
      }

      // Request account access – this will trigger the MetaMask popup
      const accounts: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        setError("No accounts found in MetaMask. Please create or unlock an account and try again.");
        return;
      }

      const address = accounts[0];
      onConnect(address);
    } catch (err: any) {
      // EIP-1193 user rejected request error
      if (err?.code === 4001) {
        setError("Connection request was rejected in MetaMask.");
      } else {
        console.error("MetaMask connection error:", err);
        setError("Failed to connect to MetaMask. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWalletConnect = async () => {
    setIsConnecting(true);
    setError(null);

    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockAddress = "0x" + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    
    onConnect(mockAddress);
    setIsConnecting(false);
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Connect Your Wallet</h1>
        <p className="text-muted-foreground">
          Connect a crypto wallet for pseudonymous authentication.
          Your wallet address is used only for verification.
        </p>
      </div>

      {/* Wallet Options */}
      <Card variant="glass" className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Choose a Wallet</CardTitle>
          <CardDescription>
            Select your preferred wallet to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="glass"
            size="lg"
            className="w-full justify-between"
            onClick={connectMetaMask}
            disabled={isConnecting}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-orange-400" />
              </div>
              <span>MetaMask</span>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </Button>

          <Button
            variant="glass"
            size="lg"
            className="w-full justify-between"
            onClick={connectWalletConnect}
            disabled={isConnecting}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-blue-400" />
              </div>
              <span>WalletConnect</span>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </Button>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm mb-6">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Privacy Notice */}
      <Card variant="default" className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Privacy Guaranteed</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your wallet address is used only for authentication and is never 
                linked to your submitted reports. All connection data is processed 
                client-side and not stored on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isConnecting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Connecting to wallet...</p>
          </div>
        </div>
      )}
    </div>
  );
}
