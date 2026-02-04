import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Shield, 
  Database,
  Lock,
  FileText,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { SubmissionResult } from "@/pages/SubmitReport";
import { toast } from "@/hooks/use-toast";

interface SubmissionConfirmationProps {
  result: SubmissionResult;
  onNewReport: () => void;
}

export function SubmissionConfirmation({ result, onNewReport }: SubmissionConfirmationProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 border border-success/30 mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Report Submitted Successfully</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your report has been encrypted, stored on IPFS, and recorded on the blockchain.
          Save the information below for your records.
        </p>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card variant="glass">
          <CardContent className="p-4 text-center">
            <Lock className="w-6 h-6 text-success mx-auto mb-2" />
            <h4 className="font-medium text-sm">Encrypted</h4>
            <p className="text-xs text-muted-foreground">AES-256-GCM</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4 text-center">
            <Database className="w-6 h-6 text-success mx-auto mb-2" />
            <h4 className="font-medium text-sm">IPFS Stored</h4>
            <p className="text-xs text-muted-foreground">Decentralized</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 text-success mx-auto mb-2" />
            <h4 className="font-medium text-sm">Blockchain Verified</h4>
            <p className="text-xs text-muted-foreground">Immutable</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Details */}
      <Card variant="default" className="mb-6">
        <CardContent className="p-6 space-y-6">
          {/* IPFS CID */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">IPFS Content ID (CID)</span>
              </div>
              <Badge variant="encrypted">IPFS</Badge>
            </div>
            <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
              <code className="text-xs font-mono text-foreground flex-1 break-all">
                {result.cid}
              </code>
              <button
                onClick={() => copyToClipboard(result.cid, "CID")}
                className="p-2 hover:bg-muted rounded-md transition-colors flex-shrink-0"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This is the unique identifier for your encrypted report on IPFS.
            </p>
          </div>

          {/* Transaction Hash */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Transaction Hash</span>
              </div>
              <Badge variant="blockchain">Blockchain</Badge>
            </div>
            <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
              <code className="text-xs font-mono text-foreground flex-1 break-all">
                {result.txHash}
              </code>
              <button
                onClick={() => copyToClipboard(result.txHash, "Transaction hash")}
                className="p-2 hover:bg-muted rounded-md transition-colors flex-shrink-0"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
              <a
                href={`https://etherscan.io/tx/${result.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-md transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Proof of existence recorded on the blockchain at {result.timestamp.toLocaleString()}.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card variant="default" className="bg-primary/5 border-primary/20 mb-8">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Save This Information</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Store your CID and transaction hash securely. These are the only ways to 
                verify your report was submitted and can be used as proof if needed.
                We do not store any link between you and this report.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="hero" size="lg" onClick={onNewReport} className="flex-1">
          Submit Another Report
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="hero-outline" size="lg" asChild className="flex-1">
          <Link to="/">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
