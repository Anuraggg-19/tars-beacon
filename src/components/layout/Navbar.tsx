import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Project <span className="text-gradient">TARS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Features
            </Link>
            <Link to="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              How It Works
            </Link>
            <Link to="/#security" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Security
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="hero-outline" size="sm" asChild>
              <Link to="/authority/login">Authority Login</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/submit">Submit Report</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link 
                to="/#features" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/#how-it-works" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                to="/#security" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Security
              </Link>
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="hero-outline" asChild>
                  <Link to="/authority/login" onClick={() => setIsOpen(false)}>Authority Login</Link>
                </Button>
                <Button variant="hero" asChild>
                  <Link to="/submit" onClick={() => setIsOpen(false)}>Submit Report</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
