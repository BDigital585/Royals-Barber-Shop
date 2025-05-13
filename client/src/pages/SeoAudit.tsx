import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { AlertCircle, CheckCircle, Clock, ChevronRight, RefreshCw } from 'lucide-react';
import { queryClient, apiRequest } from '../lib/queryClient';
import Layout from '../components/Layout';

interface Report {
  name: string;
  path: string;
  size: number;
  createdAt: string;
}

interface ReportContent {
  name: string;
  content: string;
}

export default function SeoAudit() {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  
  // Query to fetch all reports
  const {
    data: reportsData,
    isLoading: isLoadingReports,
    isError: isReportsError,
    error: reportsError
  } = useQuery({
    queryKey: ['/api/seo/reports'],
    queryFn: async () => {
      const response = await apiRequest('/api/seo/reports');
      return response as { reports: Report[] };
    },
  });
  
  // Query to fetch a specific report
  const {
    data: reportContent,
    isLoading: isLoadingReport,
    isError: isReportError,
    error: reportError
  } = useQuery({
    queryKey: ['/api/seo/reports', activeReport],
    queryFn: async () => {
      if (!activeReport) throw new Error('No report selected');
      const response = await apiRequest(`/api/seo/reports/${activeReport}`);
      return response as ReportContent;
    },
    enabled: !!activeReport
  });
  
  // Mutation to run a new audit
  const runAuditMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/seo/audit', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seo/reports'] });
    }
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  // Extract report name for display (remove timestamp and extension)
  const getReportDisplayName = (filename: string) => {
    const match = filename.match(/seo-audit-(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})\.log/);
    if (match) {
      const [, date, time] = match;
      return `Audit Report - ${date.replace(/-/g, '/')} at ${time.replace('-', ':')}`;
    }
    return filename;
  };
  
  // Automatically select the most recent report when reports are loaded
  useEffect(() => {
    if (reportsData?.reports?.length > 0 && !activeReport) {
      setActiveReport(reportsData.reports[0].name);
    }
  }, [reportsData, activeReport]);
  
  // Parse and render report content
  const renderReportContent = (content: string) => {
    // Split the content into sections for better display
    const lines = content.split('\n');
    
    return (
      <div className="font-mono text-sm whitespace-pre-wrap">
        {lines.map((line, index) => {
          // Style based on content
          let className = "py-1";
          
          if (line.includes('✅')) className += " text-green-600";
          else if (line.includes('⚠️')) className += " text-yellow-600";
          else if (line.includes('❌')) className += " text-red-600";
          else if (line.includes('Starting SEO Audit') || line.includes('SEO Audit Results') || line.includes('Summary')) 
            className += " font-bold text-base mt-4";
          
          return <div key={index} className={className}>{line}</div>;
        })}
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SEO Audit Tool</h1>
          <p className="text-gray-600">
            Monitor and improve the SEO health of your Royals Barbershop blog posts.
          </p>
        </div>
        
        <div className="flex flex-col-reverse md:flex-row gap-6">
          {/* Reports panel */}
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex justify-between items-center">
                  <span>Audit Reports</span>
                  <Button 
                    onClick={() => runAuditMutation.mutate()}
                    disabled={runAuditMutation.isPending}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {runAuditMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Run Audit
                  </Button>
                </CardTitle>
                <CardDescription>
                  {runAuditMutation.isPending 
                    ? 'Running audit, please wait...' 
                    : 'Select a report to view details'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoadingReports ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : isReportsError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to load reports. Please try again.
                    </AlertDescription>
                  </Alert>
                ) : reportsData?.reports?.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>No audit reports found.</p>
                    <p className="mt-2">Run your first audit to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {reportsData?.reports.map((report) => (
                      <div 
                        key={report.name}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          activeReport === report.name 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveReport(report.name)}
                      >
                        <div className="font-medium">
                          {getReportDisplayName(report.name)}
                        </div>
                        <div className="text-sm flex justify-between mt-1">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(report.createdAt)}
                          </span>
                          <span>{formatFileSize(report.size)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Report content panel */}
          <div className="w-full md:w-2/3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  {activeReport 
                    ? getReportDisplayName(activeReport)
                    : 'SEO Audit Results'
                  }
                </CardTitle>
                <CardDescription>
                  {activeReport 
                    ? `Detailed results from ${formatDate(reportsData?.reports.find(r => r.name === activeReport)?.createdAt || '')}`
                    : 'Select a report from the left panel'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {!activeReport ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Please select a report to view details.</p>
                  </div>
                ) : isLoadingReport ? (
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-6 w-1/2 mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : isReportError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to load report content. Please try again.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto">
                    {renderReportContent(reportContent?.content || '')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}