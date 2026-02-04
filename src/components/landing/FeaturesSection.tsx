import { Card, CardContent } from "@/components/ui/card";
import { 
  Eye, 
  Database, 
  Fingerprint, 
  Brain,
  ShieldCheck,
  FileKey
} from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Anonymous Reporting",
    description: "Submit reports without revealing your identity. No email, no accounts, no traces left behind.",
  },
  {
    icon: Database,
    title: "Blockchain Proof-of-Existence",
    description: "Every report is cryptographically timestamped on the blockchain, creating immutable proof.",
  },
  {
    icon: Fingerprint,
    title: "Zero-Knowledge Access",
    description: "Authorities verify credentials without exposing identity through zero-knowledge proofs.",
  },
  {
    icon: Brain,
    title: "AI Credibility Filtering",
    description: "Advanced AI analyzes reports for credibility, helping prioritize genuine concerns.",
  },
  {
    icon: FileKey,
    title: "Client-Side Encryption",
    description: "Reports are encrypted in your browser before upload. Only authorized parties can decrypt.",
  },
  {
    icon: ShieldCheck,
    title: "IPFS Storage",
    description: "Decentralized storage ensures reports cannot be deleted or tampered with by any single entity.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for <span className="text-gradient">Privacy & Trust</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every aspect of Project TARS is designed to protect whistleblowers 
            while ensuring the integrity and verifiability of reports.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="feature"
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
