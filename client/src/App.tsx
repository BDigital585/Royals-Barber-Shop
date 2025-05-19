import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import BrowseHaircuts from "@/pages/BrowseHaircuts";
import HaircutShare from "@/pages/HaircutShare";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import SeoAudit from "@/pages/SeoAudit";
import { useEffect } from "react";

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
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/contact" component={Contact} />
        <Route path="/browse-haircuts" component={BrowseHaircuts} />
        <Route path="/haircut/:category/:image" component={HaircutShare} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/admin/seo-audit" component={SeoAudit} />
        <Route component={NotFound} />
      </Switch>
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
