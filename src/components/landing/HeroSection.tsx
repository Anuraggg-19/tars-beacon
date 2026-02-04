import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowRight, Fingerprint, Database } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-info/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      
      {/* Floating Icons */}
      <div className="absolute top-1/3 left-[10%] opacity-20 animate-float" style={{ animationDelay: '-1s' }}>
        <Shield className="w-12 h-12 text-primary" />
      </div>
      <div className="absolute top-1/2 right-[15%] opacity-20 animate-float" style={{ animationDelay: '-2s' }}>
        <Lock className="w-10 h-10 text-info" />
      </div>
      <div className="absolute bottom-1/3 left-[20%] opacity-20 animate-float" style={{ animationDelay: '-4s' }}>
        <Database className="w-8 h-8 text-primary" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 animate-fade-in">
            <Fingerprint className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Zero-Knowledge Privacy</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Speak Truth.
            <br />
            <span className="text-gradient">Stay Protected.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A decentralized whistleblowing platform that ensures your anonymity through 
            blockchain immutability, end-to-end encryption, and zero-knowledge proofs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/submit" className="group">
                Submit Report
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/authority/login">
                Authority Login
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-sm">Blockchain Verified</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Fingerprint className="w-4 h-4 text-primary" />
              <span className="text-sm">Zero-Knowledge Auth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
