import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Shield, 
  FileText, 
  Clock, 
  MapPin,
  Calendar,
  AlertTriangle,
  Brain,
  User,
  CheckCircle,
  Flag,
  MessageSquare,
  Lock,
  Database,
  Image,
  Copy,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock report data
const mockReportDetail = {
  id: "RPT-001",
  category: "Financial Fraud",
  location: "New York, USA",
  dateTime: "2024-01-15T14:30:00",
  urgency: "high",
  status: "pending" as const,
  description: `I have witnessed a significant financial irregularity within the accounting department. Over the past three months, I've observed systematic manipulation of quarterly reports to inflate revenue figures by approximately 15-20%.

The manipulation involves:
1. Pre-dating of sales contracts to earlier quarters
2. Recognizing revenue from incomplete deliverables
3. Hiding returns and chargebacks in subsequent periods

I have documented several instances with specific dates and transaction IDs. This appears to involve at least two senior managers who have been coordinating these activities.

The estimated impact on shareholder value is significant, potentially affecting stock prices and investor trust.`,
  mediaFiles: [
    { name: "financial_records.pdf", type: "pdf", size: "2.4 MB" },
    { name: "email_screenshot.png", type: "image", size: "456 KB" },
  ],
  cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
  txHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f8a1b2e3d4f5a6b7c8d9e0f1a2b3c4",
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  aiAnalysis: {
    credibilityScore: 87,
    sentiment: "neutral",
    keyEntities: ["accounting department", "quarterly reports", "senior managers"],
    riskLevel: "high",
    recommendation: "High credibility indicators detected. Report contains specific details, dates, and verifiable claims. Recommend prioritized investigation.",
  },
  reporterReputation: 92,
  notes: [] as { text: string; timestamp: Date }[],
};

const ReportDetail = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState<{ text: string; timestamp: Date }[]>([]);
  const [newNote, setNewNote] = useState("");

  const report = mockReportDetail;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { text: newNote, timestamp: new Date() }]);
      setNewNote("");
      toast({
        title: "Note Added",
        description: "Your internal note has been saved",
      });
    }
  };

  const handleMarkGenuine = () => {
    toast({
      title: "Report Verified",
      description: "This report has been marked as genuine",
    });
  };

  const handleFlagSpam = () => {
    toast({
      title: "Report Flagged",
      description: "This report has been flagged for review",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "text-destructive bg-destructive/10";
      case "high": return "text-warning bg-warning/10";
      case "medium": return "text-info bg-info/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link 
            to="/authority/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{report.id}</h1>
                <Badge variant="pending">{report.status}</Badge>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getUrgencyColor(report.urgency)}`}>
                  {report.urgency.toUpperCase()}
                </span>
              </div>
              <p className="text-muted-foreground">{report.category}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="success" onClick={handleMarkGenuine}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Genuine
              </Button>
              <Button variant="destructive" onClick={handleFlagSpam}>
                <Flag className="w-4 h-4 mr-2" />
                Flag Spam
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Report Content */}
              <Card variant="glass" className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Decrypted Report Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="encrypted">
                      <Lock className="w-3 h-3 mr-1" />
                      Decrypted
                    </Badge>
                    <Badge variant="blockchain">
                      <Database className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Media Preview */}
              {report.mediaFiles.length > 0 && (
                <Card variant="glass" className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="w-5 h-5 text-primary" />
                      Attached Evidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {report.mediaFiles.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
                        >
                          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                            {file.type === "image" ? (
                              <Image className="w-5 h-5 text-primary" />
                            ) : (
                              <FileText className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Analysis */}
              <Card variant="glass" className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Credibility Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Score Visualization */}
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-secondary"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${report.aiAnalysis.credibilityScore * 2.51} 251`}
                          className="text-success transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(report.aiAnalysis.credibilityScore)}`}>
                          {report.aiAnalysis.credibilityScore}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Credibility Score</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on language analysis, specificity, and pattern matching
                      </p>
                    </div>
                  </div>

                  {/* Key Entities */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Entities Detected</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.aiAnalysis.keyEntities.map((entity, index) => (
                        <Badge key={index} variant="secondary">{entity}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                    <h4 className="text-sm font-medium text-success mb-1">AI Recommendation</h4>
                    <p className="text-sm text-muted-foreground">
                      {report.aiAnalysis.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Internal Notes */}
              <Card variant="glass" className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Internal Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notes.length > 0 && (
                    <div className="space-y-3">
                      {notes.map((note, index) => (
                        <div key={index} className="p-3 bg-secondary rounded-lg">
                          <p className="text-sm mb-2">{note.text}</p>
                          <p className="text-xs text-muted-foreground">
                            {note.timestamp.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add an internal note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Metadata */}
              <Card variant="glass" className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-base">Report Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm">{report.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Incident Date</p>
                      <p className="text-sm">{new Date(report.dateTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                      <p className="text-sm">{report.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Reporter Reputation</p>
                      <p className={`text-sm font-medium ${getScoreColor(report.reporterReputation)}`}>
                        {report.reporterReputation}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain Proof */}
              <Card variant="glass" className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    Blockchain Record
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">IPFS CID</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-secondary p-2 rounded flex-1 truncate">
                        {report.cid}
                      </code>
                      <button
                        onClick={() => copyToClipboard(report.cid, "CID")}
                        className="p-1.5 hover:bg-secondary rounded"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-secondary p-2 rounded flex-1 truncate">
                        {report.txHash}
                      </code>
                      <a
                        href={`https://etherscan.io/tx/${report.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-secondary rounded"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card variant="default" className="bg-warning/5 border-warning/30 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">High Risk Level</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This report indicates potential ongoing financial misconduct. 
                        Immediate investigation is recommended.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportDetail;
