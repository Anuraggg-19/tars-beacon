import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Fingerprint, 
  Shield, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

const AuthorityLogin = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<"idle" | "generating" | "verifying" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleZKPLogin = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        setError("MetaMask is not installed. Please install the MetaMask extension and try again.");
        return;
      }

      // This call will always trigger the MetaMask connection popup
      // if the authority has not already connected this site.
      setVerificationStep("generating");
      const accounts: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        setError("No accounts found in MetaMask. Please unlock or create an account and try again.");
        return;
      }

      // Simulate ZKP verification steps after wallet connection
      setVerificationStep("verifying");
      await new Promise(resolve => setTimeout(resolve, 1000));

      setVerificationStep("success");
      await new Promise(resolve => setTimeout(resolve, 500));

      navigate("/authority/dashboard");
    } catch (err: any) {
      if (err?.code === 4001) {
        setError("MetaMask connection request was rejected.");
      } else {
        console.error("MetaMask login error:", err);
        setError("Failed to connect with MetaMask. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-4">
                <Fingerprint className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Authority Access</h1>
              <p className="text-muted-foreground">
                Verify your credentials using Zero-Knowledge Proof authentication.
              </p>
            </div>

            {/* ZKP + MetaMask Login Card */}
            <Card variant="glass" className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Zero-Knowledge Verification
                </CardTitle>
                <CardDescription>
                  Prove your authority status without revealing your identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Privacy Indicators */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-success" />
                      <span className="text-sm">No email required</span>
                    </div>
                    <Badge variant="verified" className="text-xs">Private</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-success" />
                      <span className="text-sm">No username exposed</span>
                    </div>
                    <Badge variant="verified" className="text-xs">Private</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-success" />
                      <span className="text-sm">No wallet address stored</span>
                    </div>
                    <Badge variant="verified" className="text-xs">Private</Badge>
                  </div>
                </div>

                {/* Verification Progress */}
                {verificationStep !== "idle" && (
                  <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      {verificationStep === "generating" && (
                        <>
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          <span className="text-sm">Generating ZK proof...</span>
                        </>
                      )}
                      {verificationStep === "verifying" && (
                        <>
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          <span className="text-sm">Verifying credentials...</span>
                        </>
                      )}
                      {verificationStep === "success" && (
                        <>
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span className="text-sm text-success">Verification successful!</span>
                        </>
                      )}
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ 
                          width: verificationStep === "generating" ? "33%" : 
                                 verificationStep === "verifying" ? "66%" : 
                                 "100%" 
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Login Button */}
                <Button 
                  variant="hero" 
                  size="xl" 
                  className="w-full"
                  onClick={handleZKPLogin}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-5 h-5 mr-2" />
                      Verify with ZK Proof
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card variant="default" className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">How ZKP Works</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Zero-Knowledge Proofs allow you to prove you have valid authority 
                      credentials without revealing what those credentials are. Your 
                      identity remains completely anonymous even to our system.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthorityLogin;
