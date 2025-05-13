import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const subscribeNewsletter = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('/api/newsletter/subscribe', {
        method: 'POST',
        data: { email }
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Thanks for subscribing! Check your email for confirmation.',
        variant: 'default',
      });
      setEmail('');
      queryClient.invalidateQueries({ queryKey: ['/api/newsletter/subscribers'] });
    },
    onError: (error) => {
      toast({
        title: 'Subscription failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      subscribeNewsletter.mutate(email);
    }
  };

  return (
    <section id="newsletter" className="py-16 px-4 bg-primary text-white">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-heading text-white mb-6">JOIN OUR NEWSLETTER</h2>
        <p className="mb-8">Subscribe to get exclusive deals, style tips, and be the first to know about special events.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-grow py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="button-inverse"
            disabled={subscribeNewsletter.isPending}
          >
            {subscribeNewsletter.isPending ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
