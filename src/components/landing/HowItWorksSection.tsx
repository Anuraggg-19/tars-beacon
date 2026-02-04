import { Wallet, FileText, Lock, Database, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    step: "01",
    title: "Connect Wallet",
    description: "Connect your crypto wallet (MetaMask, WalletConnect) for pseudonymous authentication.",
  },
  {
    icon: FileText,
    step: "02",
    title: "Submit Report",
    description: "Fill in the report details including category, location, urgency, and optional media.",
  },
  {
    icon: Lock,
    step: "03",
    title: "Client Encryption",
    description: "Your report is encrypted directly in your browser before any data leaves your device.",
  },
  {
    icon: Database,
    step: "04",
    title: "IPFS Upload",
    description: "The encrypted report is uploaded to IPFS, ensuring decentralized and permanent storage.",
  },
  {
    icon: CheckCircle,
    step: "05",
    title: "Blockchain Record",
    description: "Only the IPFS CID is recorded on the blockchain, creating an immutable timestamp.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A simple, secure process that protects your identity at every step
            while creating verifiable, tamper-proof evidence.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div 
                key={step.title}
                className={`relative flex items-start gap-6 md:gap-12 animate-fade-in ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-primary/30 flex items-center justify-center shadow-lg">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 pt-3 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
