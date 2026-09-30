import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Old platform pages (kept for reference, not active routes)
import LandingPage from "./pages/LandingPage";
import StudentLogin from "./pages/StudentLogin";
import TeacherLogin from "./pages/TeacherLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import StudentDoubts from "./pages/StudentDoubts";
import CourseDetails from "./pages/CourseDetails";
import CourseDetail from "./pages/CourseDetail";
import StudentQuizzes from "./pages/StudentQuizzes";
import StudentCertificate from "./pages/StudentCertificate";
import StudentRewards from "./pages/StudentRewards";
import AIRoadmap from "./pages/AIRoadmap";
import StudentFeedback from "./pages/StudentFeedback";
import PodcastPage from "./pages/PodcastPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherUpload from "./pages/TeacherUpload";
import TeacherCourses from "./pages/TeacherCourses";
import CreateCourse from "./pages/CreateCourse";
import CourseManagement from "./pages/CourseManagement";
import TeacherQuizzes from "./pages/TeacherQuizzes";
import TeacherDoubts from "./pages/TeacherDoubts";
import TeacherAnalytics from "./pages/TeacherAnalytics";
import AdminDashboard from "./pages/AdminDashboard";
import TutorsList from "./pages/TutorsList";
import StudentsList from "./pages/StudentsList";
import AdminCourses from "./pages/AdminCourses";
import BrowseCourses from "./pages/BrowseCourses";
import MyCourses from "./pages/MyCourses";
import CoursePlayer from "./pages/CoursePlayer";
import NotFound from "./pages/NotFound";
import { Settings } from "./pages/Settings";
import CommunitiesPage from "./features/community/pages/CommunitiesPage";
import CommunityDetailPage from "./features/community/pages/CommunityDetailPage";
import CompetitionDetailPage from "./features/community/pages/CompetitionDetailPage";
import CompetitionCreatePage from "./features/community/pages/CompetitionCreatePage";
import CompetitionPlayPage from "./features/community/pages/CompetitionPlayPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

// ─── PM-AJAY GIA Voice Assistant (SIH 2026 — Problem Statement 26097) ───
import { PMAJAYLanding } from "./pages/pmajay/PMAJAYLanding";
import { PMAJAYLanguageSelect } from "./pages/pmajay/PMAJAYLanguageSelect";
import { PMAJAYVoiceInterview } from "./pages/pmajay/PMAJAYVoiceInterview";
import { PMAJAYProfileSummary } from "./pages/pmajay/PMAJAYProfileSummary";
import { PMAJAYRecommendations } from "./pages/pmajay/PMAJAYRecommendations";
import { PMAJAYOpportunities } from "./pages/pmajay/PMAJAYOpportunities";
import { PMAJAYAdminDashboard } from "./pages/pmajay/PMAJAYAdminDashboard";
import { VoiceGuideWidget } from "./components/pmajay/VoiceGuideWidget";

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

                {/* ── PM-AJAY GIA Voice Assistant Routes ── */}
                <Route path="/pmajay" element={<PMAJAYLanding />} />
                <Route path="/pmajay/language" element={<PMAJAYLanguageSelect />} />
                <Route path="/pmajay/interview" element={<PMAJAYVoiceInterview />} />
                <Route path="/pmajay/profile" element={<PMAJAYProfileSummary />} />
                <Route path="/pmajay/recommendations" element={<PMAJAYRecommendations />} />
                <Route path="/pmajay/opportunities" element={<PMAJAYOpportunities />} />
                <Route path="/pmajay/admin" element={<PMAJAYAdminDashboard />} />

                {/* ── Old platform routes (kept for reference) ── */}
                <Route path="/landingpage" element={<LandingPage />} />
                <Route path="/login" element={<StudentLogin />} />
                <Route path="/teacherlogin" element={<TeacherLogin />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/tutors" element={<TutorsList />} />
                <Route path="/admin/students" element={<StudentsList />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/homepage" element={<StudentDashboard />} />
                <Route path="/enrolled" element={<MyCourses />} />
                <Route path="/doubts" element={<StudentDoubts />} />
                <Route path="/course/:courseId" element={<CourseDetails />} />
                <Route path="/content/:videoId" element={<CourseDetail />} />
                <Route path="/quiz/:courseId" element={<StudentQuizzes />} />
                <Route path="/certificate/:courseId" element={<StudentCertificate />} />
                <Route path="/rewards" element={<StudentRewards />} />
                <Route path="/roadmap" element={<AIRoadmap />} />
                <Route path="/feedback" element={<StudentFeedback />} />
                <Route path="/podcast" element={<PodcastPage />} />
                <Route path="/browse-courses" element={<BrowseCourses />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/course-player/:courseId" element={<CoursePlayer />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/community/:communityId" element={<CommunityDetailPage />} />
                <Route path="/community/:communityId/create-competition" element={<CompetitionCreatePage />} />
                <Route path="/community/competition/:competitionId" element={<CompetitionDetailPage />} />
                <Route path="/community/competition/:competitionId/play" element={<CompetitionPlayPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings-page" element={<SettingsPage />} />
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/upload" element={<TeacherUpload />} />
                <Route path="/teacher/courses" element={<TeacherCourses />} />
                <Route path="/teacher/create-course" element={<CreateCourse />} />
                <Route path="/teacher/course/:courseId" element={<CourseManagement />} />
                <Route path="/teacher/quizzes" element={<TeacherQuizzes />} />
                <Route path="/teacher/doubts" element={<TeacherDoubts />} />
                <Route path="/teacher/analytics" element={<TeacherAnalytics />} />

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
