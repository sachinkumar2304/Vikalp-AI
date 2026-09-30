import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// ─── PM-AJAY GIA Voice Assistant (SIH 2026 — PS ID: 26097) ─────────────────
// Vikalp AI | Team: BinaryDNF | Ministry: MoSJE, GoI
import { PMAJAYLanding } from "./pages/pmajay/PMAJAYLanding";
import { PMAJAYLanguageSelect } from "./pages/pmajay/PMAJAYLanguageSelect";
import { PMAJAYVoiceInterview } from "./pages/pmajay/PMAJAYVoiceInterview";
import { PMAJAYProfileSummary } from "./pages/pmajay/PMAJAYProfileSummary";
import { PMAJAYRecommendations } from "./pages/pmajay/PMAJAYRecommendations";
import { PMAJAYOpportunities } from "./pages/pmajay/PMAJAYOpportunities";
import { PMAJAYAdminDashboard } from "./pages/pmajay/PMAJAYAdminDashboard";
import { VoiceGuideWidget } from "./components/pmajay/VoiceGuideWidget";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* ── Default: redirect to PM-AJAY portal ── */}
                <Route path="/" element={<Navigate to="/pmajay" replace />} />

                {/* ── PM-AJAY GIA Voice Assistant ── */}
                <Route path="/pmajay" element={<PMAJAYLanding />} />
                <Route path="/pmajay/language" element={<PMAJAYLanguageSelect />} />
                <Route path="/pmajay/interview" element={<PMAJAYVoiceInterview />} />
                <Route path="/pmajay/profile" element={<PMAJAYProfileSummary />} />
                <Route path="/pmajay/recommendations" element={<PMAJAYRecommendations />} />
                <Route path="/pmajay/opportunities" element={<PMAJAYOpportunities />} />
                <Route path="/pmajay/admin" element={<PMAJAYAdminDashboard />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* Sticky interactive Voice Saathi / Guide Widget */}
              <VoiceGuideWidget />
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
