import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { TestsProvider } from "@/context/TestsContext";
import { ApplicationsProvider } from "@/context/ApplicationsContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import TPODashboard from "./pages/TPODashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import ApplicationTracker from "./pages/ApplicationTracker";
import TestScheduler from "./pages/TestScheduler";
import AIChatBot from "./components/AIChatBot";
import StudentManagement from "./pages/StudentManagement";
import CompanyManagement from "./pages/CompanyManagement";
import PlacementReports from "./pages/PlacementReports";
import JobManagement from "./pages/JobManagement";
import PlacementEvents from "./pages/PlacementEvents";
import CandidateReview from "./pages/CandidateReview";
import InterviewManagement from "./pages/InterviewManagement";
import RecruitmentAnalytics from "./pages/RecruitmentAnalytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import CreateTest from "./pages/CreateTest";
import NotFound from "./pages/NotFound";
import { ResumeProvider } from "@/context/ResumeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TestsProvider>
          <ApplicationsProvider>
            <ResumeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Student Routes */}
              <Route path="/student-dashboard" element={<ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/resume-builder" element={<ProtectedRoute roles={["student"]}><ResumeBuilder /></ProtectedRoute>} />
              <Route path="/application-tracker" element={<ProtectedRoute roles={["student"]}><ApplicationTracker /></ProtectedRoute>} />
              <Route path="/test-scheduler" element={<ProtectedRoute roles={["student"]}><TestScheduler /></ProtectedRoute>} />
              <Route path="/ai-chatbot" element={<ProtectedRoute roles={["student"]}><AIChatBot /></ProtectedRoute>} />
              <Route path="/tests/new" element={<ProtectedRoute roles={["student"]}><CreateTest /></ProtectedRoute>} />
              
              {/* Profile & Settings Routes */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              
              {/* TPO Routes */}
              <Route path="/tpo-dashboard" element={<ProtectedRoute roles={["tpo"]}><TPODashboard /></ProtectedRoute>} />
              <Route path="/student-management" element={<ProtectedRoute roles={["tpo"]}><StudentManagement /></ProtectedRoute>} />
              <Route path="/company-management" element={<ProtectedRoute roles={["tpo"]}><CompanyManagement /></ProtectedRoute>} />
              <Route path="/placement-reports" element={<ProtectedRoute roles={["tpo"]}><PlacementReports /></ProtectedRoute>} />
              <Route path="/placement-events" element={<ProtectedRoute roles={["tpo"]}><PlacementEvents /></ProtectedRoute>} />
              
              {/* Company Routes */}
              <Route path="/company-dashboard" element={<ProtectedRoute roles={["company"]}><CompanyDashboard /></ProtectedRoute>} />
              <Route path="/job-management" element={<ProtectedRoute roles={["company"]}><JobManagement /></ProtectedRoute>} />
              <Route path="/candidate-review" element={<ProtectedRoute roles={["company"]}><CandidateReview /></ProtectedRoute>} />
              <Route path="/interview-management" element={<ProtectedRoute roles={["company"]}><InterviewManagement /></ProtectedRoute>} />
              <Route path="/recruitment-analytics" element={<ProtectedRoute roles={["company"]}><RecruitmentAnalytics /></ProtectedRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
                </TooltipProvider>
              </ResumeProvider>
            </ApplicationsProvider>
          </TestsProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
);

export default App;
