import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Project TARS</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              A decentralized whistleblowing platform ensuring anonymous, 
              tamper-proof reporting through blockchain technology and 
              zero-knowledge cryptography.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/submit" className="hover:text-primary transition-colors">
                  Submit Report
                </Link>
              </li>
              <li>
                <Link to="/authority/login" className="hover:text-primary transition-colors">
                  Authority Access
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Security</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Security Audit
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Documentation
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Project TARS. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
