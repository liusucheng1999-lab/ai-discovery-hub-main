import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import SiteVisitTracker from "@/components/SiteVisitTracker";
import Home from "./pages/Home";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ToolDetailPage from "./pages/ToolDetailPage";
import SubmitTool from "./pages/SubmitTool";
import Login from "./pages/Login";
import SetupAdmin from "./pages/SetupAdmin";
import CreateAdmin from "./pages/CreateAdmin";
import Admin from "./pages/Admin";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Knowledge from "./pages/Knowledge";
import Resources from "./pages/Resources";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import { PublishApp } from "./pages/PublishApp";
import { AppPreview } from "./pages/AppPreview";
import { PublishedApps } from "./pages/PublishedApps";
import { AppManagement } from "./pages/AppManagement";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <SiteVisitTracker />
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <div className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/tools" element={<Index />} />
                      <Route path="/ai-writing" element={<CategoryPage />} />
                      <Route path="/ai-drawing" element={<CategoryPage />} />
                      <Route path="/ai-office" element={<CategoryPage />} />
                      <Route path="/ai-video" element={<CategoryPage />} />
                      <Route path="/ai-code" element={<CategoryPage />} />
                      <Route path="/tool/:toolId" element={<ToolDetailPage />} />
                      <Route path="/tools/submit" element={<SubmitTool />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/setup-admin" element={<SetupAdmin />} />
                      <Route path="/create-admin" element={<CreateAdmin />} />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <Admin />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/analytics"
                        element={
                          <ProtectedRoute>
                            <Analytics />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/knowledge" element={<Knowledge />} />
                      <Route path="/knowledge/course/:courseId" element={<CourseDetailPage />} />
                      <Route path="/knowledge/course/:courseId/lesson/:lessonId" element={<CourseDetailPage />} />
                      <Route path="/resources" element={<Resources />} />
                      <Route path="/resources/:resourceId" element={<ResourceDetailPage />} />
                      <Route path="/publish" element={<ProtectedRoute><PublishApp /></ProtectedRoute>} />
                      <Route path="/run/:id" element={<AppPreview />} />
                      <Route path="/published-apps" element={<PublishedApps />} />
                      <Route path="/my-apps" element={<ProtectedRoute><AppManagement /></ProtectedRoute>} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <Footer />
                </div>
              </BrowserRouter>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
