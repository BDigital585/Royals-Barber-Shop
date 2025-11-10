import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { Check, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

type PackageType = 'bring-your-own' | 'image-package' | 'video-package';

interface Package {
  id: PackageType;
  name: string;
  price: number;
  description: string;
  features: string[];
  requiresUpload: boolean;
}

const packages: Package[] = [
  {
    id: 'bring-your-own',
    name: 'Bring Your Own Image',
    price: 50,
    description: 'Upload your promotional image',
    features: [
      'Display your image on our screens',
      'Images only (JPG, PNG, GIF)',
      'Max file size: 5MB',
      'Annual display'
    ],
    requiresUpload: true,
  },
  {
    id: 'image-package',
    name: 'Image Package',
    price: 70,
    description: 'We create a professional image for you',
    features: [
      'Professional promotional image',
      'You keep it for social media',
      'Custom design for your business',
      'Annual display'
    ],
    requiresUpload: false,
  },
  {
    id: 'video-package',
    name: 'Video Package',
    price: 100,
    description: 'We create a 15-second video for you',
    features: [
      '15-second promotional video',
      'You keep it for social media',
      'Professional production',
      'Annual display'
    ],
    requiresUpload: false,
  },
];

const ScreenAdvertising = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('bring-your-own');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image file (JPG, PNG, or GIF)',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: 'File Too Large',
        description: 'Image must be smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadedFile(file);
    toast({
      title: 'File Selected',
      description: `${file.name} is ready to upload`,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleCheckout = async () => {
    const pkg = packages.find(p => p.id === selectedPackage);
    if (!pkg) return;

    if (pkg.requiresUpload && !uploadedFile) {
      toast({
        title: 'Image Required',
        description: 'Please upload your image to continue',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('packageType', selectedPackage);
      
      if (uploadedFile) {
        formData.append('image', uploadedFile);
      }

      const response = await fetch('/api/screen-advertising/create-checkout-session', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: 'Checkout Error',
        description: 'Failed to start checkout. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  const selectedPkg = packages.find(p => p.id === selectedPackage);
  const canCheckout = !selectedPkg?.requiresUpload || uploadedFile !== null;

  return (
    <>
      <MetaTags
        title="Screen Advertising | Royals Barber Shop"
        description="Advertise your business on our in-shop digital screens. Choose from three packages starting at $50/year."
        type="website"
      />
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Screen Advertising Packages
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get your business in front of customers while they wait. Choose the package that works best for you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
                    selectedPackage === pkg.id
                      ? 'border-amber-500 bg-amber-50 shadow-lg scale-105 ring-4 ring-amber-200'
                      : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  {selectedPackage === pkg.id && (
                    <div className="absolute -top-3 -right-3 bg-amber-500 text-white rounded-full p-2 shadow-lg">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="text-4xl font-bold text-amber-600 mb-2">
                      ${pkg.price}<span className="text-xl text-gray-600">/year</span>
                    </div>
                    <p className="text-gray-600">{pkg.description}</p>
                  </div>
                  
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {selectedPkg?.requiresUpload && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-amber-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Image</h3>
                
                {!uploadedFile ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-3 border-dashed rounded-xl p-12 text-center transition-all ${
                      isDragging
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'
                    }`}
                  >
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      Drag and drop your image here
                    </p>
                    <p className="text-gray-500 mb-4">or</p>
                    <label className="inline-block">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <span className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer inline-block transition-colors">
                        Browse Files
                      </span>
                    </label>
                    <p className="text-sm text-gray-500 mt-4">
                      Accepts JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500 text-white rounded-full p-3">
                        <Check className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h3>
                  <p className="text-gray-600">
                    {selectedPkg?.name} - ${selectedPkg?.price}/year
                  </p>
                  {!canCheckout && (
                    <p className="text-amber-600 font-medium mt-2 flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Please upload your image to continue
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={!canCheckout || isProcessing}
                  className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                    canCheckout && !isProcessing
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ScreenAdvertising;
