import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Upload, 
  Lock, 
  Database, 
  Loader2,
  X,
  Shield
} from "lucide-react";
import { SubmissionResult } from "@/pages/SubmitReport";

interface ReportFormProps {
  walletAddress: string;
  onSubmit: (result: SubmissionResult) => void;
}

const categories = [
  "Financial Fraud",
  "Corruption",
  "Environmental Violation",
  "Safety Hazard",
  "Human Rights Abuse",
  "Data Privacy Breach",
  "Workplace Misconduct",
  "Other",
];

const urgencyLevels = [
  { value: "low", label: "Low", description: "Non-urgent, can be reviewed in time" },
  { value: "medium", label: "Medium", description: "Should be addressed soon" },
  { value: "high", label: "High", description: "Requires immediate attention" },
  { value: "critical", label: "Critical", description: "Ongoing harm or danger" },
];

export function ReportForm({ walletAddress, onSubmit }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<"encrypting" | "uploading" | "blockchain" | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    location: "",
    dateTime: "",
    urgency: "",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate encryption
    setCurrentStep("encrypting");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate IPFS upload
    setCurrentStep("uploading");
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simulate blockchain transaction
    setCurrentStep("blockchain");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock result
    const result: SubmissionResult = {
      cid: "Qm" + Array.from({ length: 44 }, () => 
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[
          Math.floor(Math.random() * 62)
        ]
      ).join(""),
      txHash: "0x" + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join(""),
      timestamp: new Date(),
    };

    onSubmit(result);
    setIsSubmitting(false);
    setCurrentStep(null);
  };

  const truncateAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Submit Report</h1>
          <Badge variant="encrypted" className="font-mono text-xs">
            {truncateAddress(walletAddress)}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Fill in the details below. All information is encrypted client-side before submission.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, Country or Region"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </div>

        {/* Date & Urgency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateTime">When did this occur?</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency Level *</Label>
            <Select 
              value={formData.urgency} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <span className="font-medium">{level.label}</span>
                      <span className="text-muted-foreground text-xs ml-2">
                        — {level.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Provide a detailed description of the incident. Include relevant facts, names, dates, and any evidence you have."
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Be as specific as possible. Do not include information that could identify you.
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label>Supporting Evidence (Optional)</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="files"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
            <label htmlFor="files" className="cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Images, videos, audio, or documents
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2 mt-3">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Notice */}
        <Card variant="default" className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">End-to-End Encryption</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your report will be encrypted in your browser using AES-256-GCM before 
                  being uploaded. Only authorized authorities with the correct decryption 
                  keys can read your submission.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          type="submit" 
          variant="hero" 
          size="xl" 
          className="w-full"
          disabled={!formData.category || !formData.urgency || !formData.description || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              {currentStep === "encrypting" && "Encrypting Report..."}
              {currentStep === "uploading" && "Uploading to IPFS..."}
              {currentStep === "blockchain" && "Recording on Blockchain..."}
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Encrypt & Submit Report
            </>
          )}
        </Button>
      </form>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card variant="glass" className="max-w-sm w-full mx-4">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-2 border-primary/30 rounded-full" />
                <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                {currentStep === "encrypting" && <Lock className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                {currentStep === "uploading" && <Upload className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                {currentStep === "blockchain" && <Database className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {currentStep === "encrypting" && "Encrypting Your Report"}
                {currentStep === "uploading" && "Uploading to IPFS"}
                {currentStep === "blockchain" && "Recording on Blockchain"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentStep === "encrypting" && "Securing your data with AES-256-GCM encryption..."}
                {currentStep === "uploading" && "Storing encrypted content on decentralized storage..."}
                {currentStep === "blockchain" && "Creating immutable proof-of-existence..."}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
