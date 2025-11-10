import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import type { ScreenAdvertisingOrder } from '@shared/schema';

const OrderConfirmation = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const sessionId = searchParams.get('session_id');

  const { data: order, isLoading } = useQuery<ScreenAdvertisingOrder>({
    queryKey: [`/api/screen-advertising/order?session_id=${sessionId}`],
    enabled: !!sessionId,
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your order...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find your order. Please check your email for confirmation details.</p>
            <Link href="/">
              <a className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </a>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const packageNames = {
    'bring-your-own': 'Bring Your Own Image',
    'image-package': 'Professional Image Package',
    'video-package': 'Professional Video Package',
  };

  return (
    <>
      <MetaTags
        title="Order Confirmation | Royals Barber Shop"
        description="Your screen advertising order has been confirmed!"
        type="website"
      />
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center text-white">
                <CheckCircle className="w-20 h-20 mx-auto mb-4" strokeWidth={2} />
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
                <p className="text-lg opacity-90">Thank you for your purchase</p>
              </div>
              
              <div className="p-8">
                {order.status === 'pending' && (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Your payment was successful! Your order is being processed. 
                      {order.packageType !== 'bring-your-own' && ' You should receive a confirmation email shortly with next steps.'}
                    </p>
                  </div>
                )}
                
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Order ID</span>
                      <span className="font-semibold text-gray-900">#{order.id}</span>
                    </div>
                    
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Package</span>
                      <span className="font-semibold text-gray-900">
                        {packageNames[order.packageType as keyof typeof packageNames]}
                      </span>
                    </div>
                    
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Business Name</span>
                      <span className="font-semibold text-gray-900">{order.businessName}</span>
                    </div>
                    
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Customer</span>
                      <span className="font-semibold text-gray-900">{order.customerName}</span>
                    </div>
                    
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Email</span>
                      <span className="font-semibold text-gray-900">{order.customerEmail}</span>
                    </div>
                    
                    <div className="flex justify-between py-3">
                      <span className="text-gray-600 text-lg">Total Paid</span>
                      <span className="font-bold text-2xl text-green-600">${(order.amount / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
                  <div className="flex gap-3">
                    <Mail className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">What's Next?</h3>
                      <ul className="text-gray-700 space-y-2 text-sm">
                        <li>✓ A confirmation email has been sent to {order.customerEmail}</li>
                        <li>✓ Our team has been notified of your order</li>
                        {order.packageType === 'bring-your-own' && (
                          <li>✓ Your uploaded image will be displayed on our screens</li>
                        )}
                        {(order.packageType === 'image-package' || order.packageType === 'video-package') && (
                          <li>✓ We'll contact you within 2 business days to create your content</li>
                        )}
                        <li>✓ Your advertisement will run for one full year</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Link href="/">
                    <a className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl">
                      <ArrowLeft className="w-5 h-5" />
                      Back to Home
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default OrderConfirmation;
