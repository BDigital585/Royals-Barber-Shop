import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotProps {
  isInWelcomeSection?: boolean;
}

const ChatBot: React.FC<ChatBotProps> = ({ isInWelcomeSection = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus on input when chat is opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Send message to OpenAI API
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: message
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Send to our API endpoint
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();

      // Add assistant response to chat
      if (data && data.response && data.response.content) {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: data.response.content
          }
        ]);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I ran into an issue. Please try again later.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // If in Welcome section, only render the chat content without the button and container
  if (isInWelcomeSection) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden bg-white rounded-xl shadow-xl border border-gray-100">
        {/* Welcome Section Chat Header */}
        <div className="bg-gradient-to-r from-black to-primary text-white p-3 flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare size={18} className="mr-2 text-secondary" />
            <h3 className="font-bold">Royals Assistant</h3>
          </div>
          <span className="text-xs bg-red-600/80 px-2 py-1 rounded-full animate-pulse shadow-[0_0_5px_#ff0000] font-medium">Live Chat</span>
        </div>
        
        {/* Messages container */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center my-4 bg-black/5 p-4 rounded-xl">
              <div className="bg-black text-secondary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <MessageSquare size={20} />
              </div>
              <p className="text-gray-600 text-sm">Ask me about haircuts, pricing, or any other questions!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block p-3 rounded-xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-black text-white rounded-tr-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                  } max-w-[85%] text-sm`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="text-left mb-4">
              <div className="inline-block p-3 rounded-xl shadow-sm bg-white border border-gray-200 text-gray-800 rounded-tl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="p-2 border-t border-gray-100 bg-white shadow-inner flex">
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about haircuts, services..."
            className="flex-1 p-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-gray-900 text-sm"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className={`p-2 bg-black text-white rounded-r-lg transition-all ${
              isTyping || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/90'
            }`}
          >
            <Send size={18} className="text-secondary" />
          </button>
        </form>
      </div>
    );
  }

  // Default floating chat UI
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button - modernized with pulse animation */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black hover:bg-black/90 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 relative"
          aria-label="Open chat"
        >
          {/* Pulsing circle effect */}
          <span className="absolute w-full h-full rounded-full bg-secondary/50 animate-ping opacity-75"></span>
          <span className="relative flex items-center justify-center">
            <MessageSquare size={24} className="text-secondary" />
          </span>
          {/* Chat label */}
          <span className="absolute -top-10 right-0 bg-black text-secondary text-sm px-3 py-1 rounded-lg shadow-md whitespace-nowrap font-medium">
            Chat with us
          </span>
        </button>
      )}

      {/* Chat window - modernized with gradient headers and better shadows */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-80 sm:w-96 h-[30rem] border border-gray-100 overflow-hidden">
          {/* Chat header with gradient */}
          <div className="bg-gradient-to-r from-black to-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare size={20} className="mr-2 text-secondary" />
              <h3 className="font-bold">Royals Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="bg-black/20 hover:bg-black/30 text-white p-1.5 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages container with updated styling */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center my-8 bg-black/5 p-6 rounded-xl">
                <div className="bg-black text-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <MessageSquare size={28} />
                </div>
                <h4 className="font-semibold text-lg mb-2">Welcome to Royals Barbershop</h4>
                <p className="text-gray-600">Ask about our services, haircuts, or book an appointment!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block p-3 rounded-xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-black text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                    } max-w-[85%]`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-xl shadow-sm bg-white border border-gray-200 text-gray-800 rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form with modernized styling */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 bg-white shadow-inner flex">
            <input
              type="text"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-gray-900"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className={`p-3 bg-black text-white rounded-r-lg transition-all ${
                isTyping || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/90'
              }`}
            >
              <Send size={20} className="text-secondary" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;