import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WalletConnect } from "@/components/submit/WalletConnect";
import { ReportForm } from "@/components/submit/ReportForm";
import { SubmissionConfirmation } from "@/components/submit/SubmissionConfirmation";

export type SubmissionStep = "connect" | "form" | "confirmation";

export interface ReportData {
  category: string;
  location: string;
  dateTime: string;
  urgency: string;
  description: string;
  mediaFiles: File[];
}

export interface SubmissionResult {
  cid: string;
  txHash: string;
  timestamp: Date;
}

const SubmitReport = () => {
  const [step, setStep] = useState<SubmissionStep>("connect");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setStep("form");
  };

  const handleSubmitReport = (result: SubmissionResult) => {
    setSubmissionResult(result);
    setStep("confirmation");
  };

  const handleNewReport = () => {
    setStep("form");
    setSubmissionResult(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {step === "connect" && (
            <WalletConnect onConnect={handleWalletConnect} />
          )}
          {step === "form" && (
            <ReportForm 
              walletAddress={walletAddress} 
              onSubmit={handleSubmitReport}
            />
          )}
          {step === "confirmation" && submissionResult && (
            <SubmissionConfirmation 
              result={submissionResult}
              onNewReport={handleNewReport}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitReport;
