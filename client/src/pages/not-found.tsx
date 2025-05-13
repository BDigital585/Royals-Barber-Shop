import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetaTags from "@/components/MetaTags";
import SchemaMarkup from "@/components/SchemaMarkup";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <>
      {/* SEO meta tags for 404 page */}
      <MetaTags
        title="Page Not Found | Royals Barbershop"
        description="The page you're looking for couldn't be found. Return to Royals Barbershop homepage."
        type="website"
      />
      
      {/* Base schema markup */}
      <SchemaMarkup type="website" />
      
      <Header />
      <main className="pt-[80px] pb-16">
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center">
          <Card className="w-full max-w-md mx-4 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center text-center mb-6">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-3xl font-heading text-gray-900 mb-2">404 Page Not Found</h1>
                <div className="w-16 h-1 bg-primary mx-auto my-4"></div>
                <p className="text-gray-600">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>
              
              <div className="flex justify-center mt-6">
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
