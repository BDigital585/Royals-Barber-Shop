import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, lazy, Suspense } from "react";

// Lazy load components for better performance
const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Home"));
const Contact = lazy(() => import("@/pages/Contact"));
const BrowseHaircuts = lazy(() => import("@/pages/BrowseHaircuts"));
const HaircutShare = lazy(() => import("@/pages/HaircutShare"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const SeoAudit = lazy(() => import("@/pages/SeoAudit"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));

// Loading component for lazy-loaded routes
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

// ScrollToTop component to handle scroll behavior on route changes
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // When location changes, scroll to top of page immediately with no smooth behavior
    // This forces an immediate jump to the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    // For some browsers, we need an extra push to ensure scroll position is reset
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/contact" component={Contact} />
          <Route path="/browse-haircuts" component={BrowseHaircuts} />
          <Route path="/haircut/:category/:image" component={HaircutShare} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/admin/seo-audit" component={SeoAudit} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
