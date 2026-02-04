import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  Brain,
  User,
  ChevronRight,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchJsonFromIpfs } from "@/lib/ipfs";
import { decryptReportEnvelope, EncryptedReportEnvelope } from "@/lib/crypto";
import { getReportsFromContract, OnChainReportRef } from "@/lib/contract";

interface DecryptedReport {
  id: string;
  cid: string;
  category: string;
  timestamp: Date;
  aiScore: number;
  reputationScore: number;
  status: "pending" | "verified" | "flagged";
  urgency: "low" | "medium" | "high" | "critical";
}

const AuthorityDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [reports, setReports] = useState<DecryptedReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const onChainReports: OnChainReportRef[] = await getReportsFromContract();

        const decrypted: DecryptedReport[] = await Promise.all(
          onChainReports.map(async (ref, index) => {
            try {
              const envelope = await fetchJsonFromIpfs<EncryptedReportEnvelope>(ref.cid);
              const report = await decryptReportEnvelope(envelope);

              // Placeholder scores for now – you can plug real AI / reputation later.
              const aiScore = 80;
              const reputationScore = 80;

              return {
                id: `RPT-${String(index + 1).padStart(3, "0")}`,
                cid: ref.cid,
                category: report.category || "Unknown",
                timestamp: new Date(ref.timestamp * 1000),
                aiScore,
                reputationScore,
                status: ref.status || "pending",
                urgency: report.urgency || "medium",
              };
            } catch (innerErr) {
              console.error("Failed to load/decrypt report", ref, innerErr);
              // Skip reports that fail decryption for now
              return null as unknown as DecryptedReport;
            }
          })
        );

        setReports(decrypted.filter(Boolean));
      } catch (err: any) {
        console.error("Failed to load reports:", err);
        setError(
          err?.message ||
            "Unable to load reports from the blockchain. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "text-destructive";
      case "high": return "text-warning";
      case "medium": return "text-info";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="verified">Verified</Badge>;
      case "flagged":
        return <Badge variant="flagged">Flagged</Badge>;
      default:
        return <Badge variant="pending">Pending</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <Badge variant="encrypted">Authority Access</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">Report Dashboard</h1>
            <p className="text-muted-foreground">
              Review and manage submitted whistleblowing reports
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reports</p>
                    <p className="text-2xl font-bold">{reports.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold">{reports.filter(r => r.status === "pending").length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-warning opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Verified</p>
                    <p className="text-2xl font-bold">{reports.filter(r => r.status === "verified").length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-success opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Flagged</p>
                    <p className="text-2xl font-bold">{reports.filter(r => r.status === "flagged").length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-destructive opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card variant="glass" className="mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Financial Fraud">Financial Fraud</SelectItem>
                      <SelectItem value="Corruption">Corruption</SelectItem>
                      <SelectItem value="Environmental Violation">Environmental</SelectItem>
                      <SelectItem value="Data Privacy Breach">Data Privacy</SelectItem>
                      <SelectItem value="Workplace Misconduct">Workplace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {isLoading && (
              <Card variant="glass">
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  Loading reports from blockchain and IPFS...
                </CardContent>
              </Card>
            )}

            {error && (
              <Card variant="glass">
                <CardContent className="p-6 text-center text-sm text-destructive">
                  {error}
                </CardContent>
              </Card>
            )}

            {!isLoading && !error && filteredReports.map((report) => (
              <Link 
                key={report.id} 
                to={`/authority/report/${encodeURIComponent(report.cid)}`}
                className="block"
              >
                <Card 
                  variant="interactive"
                  className="hover:border-primary/40 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Main Info */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{report.id}</span>
                            {getStatusBadge(report.status)}
                            <span className={`text-xs font-medium ${getUrgencyColor(report.urgency)}`}>
                              {report.urgency.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{report.category}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(report.timestamp)}
                          </div>
                        </div>
                      </div>

                      {/* Right: Scores */}
                      <div className="flex items-center gap-6 md:gap-8">
                        <div className="text-center">
                          <div className="flex items-center gap-1 mb-1">
                            <Brain className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">AI Score</span>
                          </div>
                          <span className={`text-lg font-bold ${getScoreColor(report.aiScore)}`}>
                            {report.aiScore}%
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 mb-1">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Reputation</span>
                          </div>
                          <span className={`text-lg font-bold ${getScoreColor(report.reputationScore)}`}>
                            {report.reputationScore}%
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground hidden md:block" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {!isLoading && !error && filteredReports.length === 0 && (
              <Card variant="glass">
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your filters or search query
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthorityDashboard;
