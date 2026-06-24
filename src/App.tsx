import { lazy, Suspense } from "react";
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
// 首页保持同步加载（落地页要尽快出现），其余页面按需懒加载，拆分主包
import Home from "./pages/Home";

const Index = lazy(() => import("./pages/Index"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const ToolDetailPage = lazy(() => import("./pages/ToolDetailPage"));
const SubmitTool = lazy(() => import("./pages/SubmitTool"));
const Login = lazy(() => import("./pages/Login"));
const SetupAdmin = lazy(() => import("./pages/SetupAdmin"));
const CreateAdmin = lazy(() => import("./pages/CreateAdmin"));
const Admin = lazy(() => import("./pages/Admin"));
const Analytics = lazy(() => import("./pages/Analytics"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Knowledge = lazy(() => import("./pages/Knowledge"));
const Resources = lazy(() => import("./pages/Resources"));
const ResourceDetailPage = lazy(() => import("./pages/ResourceDetailPage"));
const PublishApp = lazy(() => import("./pages/PublishApp").then((m) => ({ default: m.PublishApp })));
const AppPreview = lazy(() => import("./pages/AppPreview").then((m) => ({ default: m.AppPreview })));
const PublishedApps = lazy(() => import("./pages/PublishedApps").then((m) => ({ default: m.PublishedApps })));
const AppManagement = lazy(() => import("./pages/AppManagement").then((m) => ({ default: m.AppManagement })));
const AppReview = lazy(() => import("./pages/AppReview").then((m) => ({ default: m.AppReview })));

const queryClient = new QueryClient();

// 懒加载页面切换时的占位
const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

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
                    <Suspense fallback={<PageFallback />}>
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
                      <Route path="/setup-admin" element={<ProtectedRoute requireAdmin><SetupAdmin /></ProtectedRoute>} />
                      <Route path="/create-admin" element={<ProtectedRoute requireAdmin><CreateAdmin /></ProtectedRoute>} />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute requireAdmin>
                            <Admin />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/app-review"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AppReview />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/analytics"
                        element={
                          <ProtectedRoute requireAdmin>
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
                    </Suspense>
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
