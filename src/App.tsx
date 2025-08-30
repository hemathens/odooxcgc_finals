import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { TestsProvider } from "@/context/TestsContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TPODashboard from "./pages/TPODashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import ApplicationTracker from "./pages/ApplicationTracker";
import TestScheduler from "./pages/TestScheduler";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TestsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Student Routes */}
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/application-tracker" element={<ApplicationTracker />} />
              <Route path="/test-scheduler" element={<TestScheduler />} />
              <Route path="/tests/new" element={<CreateTest />} />
              
              {/* Profile & Settings Routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              
              {/* TPO Routes */}
              <Route path="/tpo-dashboard" element={<TPODashboard />} />
              <Route path="/student-management" element={<StudentManagement />} />
              <Route path="/company-management" element={<CompanyManagement />} />
              <Route path="/placement-reports" element={<PlacementReports />} />
              <Route path="/placement-events" element={<PlacementEvents />} />
              
              {/* Company Routes */}
              <Route path="/company-dashboard" element={<CompanyDashboard />} />
              <Route path="/job-management" element={<JobManagement />} />
              <Route path="/candidate-review" element={<CandidateReview />} />
              <Route path="/interview-management" element={<InterviewManagement />} />
              <Route path="/recruitment-analytics" element={<RecruitmentAnalytics />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
            </TooltipProvider>
          </TestsProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
);

export default App;
