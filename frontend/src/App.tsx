import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BeneficiaryProvider } from "@/contexts/BeneficiaryContext";

// ─── PM-AJAY GIA Voice Assistant (Problem Statement 26097) ───
import { PMAJAYLanding } from "./pages/pmajay/PMAJAYLanding";
import { PMAJAYLanguageSelect } from "./pages/pmajay/PMAJAYLanguageSelect";
import { PMAJAYVoiceInterview } from "./pages/pmajay/PMAJAYVoiceInterview";
import { PMAJAYProfileSummary } from "./pages/pmajay/PMAJAYProfileSummary";
import { PMAJAYRecommendations } from "./pages/pmajay/PMAJAYRecommendations";
import { PMAJAYOpportunities } from "./pages/pmajay/PMAJAYOpportunities";
import { PMAJAYAdminDashboard } from "./pages/pmajay/PMAJAYAdminDashboard";
import { VoiceGuideWidget } from "./components/pmajay/VoiceGuideWidget";
import { ElevenLabsIVREmbed } from "./components/pmajay/ElevenLabsIVREmbed";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <BeneficiaryProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Default route: PM-AJAY GIA Portal */}
                <Route path="/" element={<Navigate to="/pmajay" replace />} />

                {/* PM-AJAY GIA Active Routes */}
                <Route path="/pmajay" element={<PMAJAYLanding />} />
                <Route path="/pmajay/language" element={<PMAJAYLanguageSelect />} />
                <Route path="/pmajay/interview" element={<PMAJAYVoiceInterview />} />
                <Route path="/pmajay/profile" element={<PMAJAYProfileSummary />} />
                <Route path="/pmajay/recommendations" element={<PMAJAYRecommendations />} />
                <Route path="/pmajay/opportunities" element={<PMAJAYOpportunities />} />
                <Route path="/pmajay/admin" element={<PMAJAYAdminDashboard />} />

                {/* Legacy LMS, quiz, teacher, and podcast routes hidden from public build; redirect to /pmajay */}
                <Route path="*" element={<Navigate to="/pmajay" replace />} />
              </Routes>
              {/* Interactive Voice Guide Widget */}
              <VoiceGuideWidget />
              {/* Official IVR Helpline Telephony Assistant Embed */}
              <ElevenLabsIVREmbed />
            </BrowserRouter>
          </TooltipProvider>
        </BeneficiaryProvider>
      </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
