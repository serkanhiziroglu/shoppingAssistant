"use client"

import { useState, useRef, useEffect } from 'react';
import { ChatWindow } from './components/chat-window';
import { searchProducts } from './utils/product-serach';
import { processProductsWithLlama } from './utils/llama-ai';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your shopping assistant powered by Llama. I can help you find items based on your preferences. What are you looking for today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => {
        setIsVisible(true);
        chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isChatOpen]);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      setIsLoading(true);

      // Add user message
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputValue
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');

      try {
        // Add typing indicator
        const typingMessage = {
          id: messages.length + 2,
          type: 'bot',
          content: '...',
          isTyping: true
        };
        setMessages(prev => [...prev, typingMessage]);

        // Search for products
        const products = await searchProducts(userMessage.content);

        // Process products with Llama
        const aiResponse = await processProductsWithLlama(userMessage.content, products);

        // Remove typing indicator
        setMessages(prev => prev.filter(msg => !msg.isTyping));

        // Add bot response with products
        if (aiResponse.products && aiResponse.products.length > 0) {
          setMessages(prev => [...prev, {
            id: messages.length + 2,
            type: 'products',
            textContent: aiResponse.message,
            products: aiResponse.products
          }]);
        } else {
          // Add regular bot response if no products
          setMessages(prev => [...prev, {
            id: messages.length + 2,
            type: 'bot',
            content: "I couldn't find any products matching your search. Could you try describing what you're looking for differently?"
          }]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev.filter(msg => !msg.isTyping), {
          id: messages.length + 2,
          type: 'bot',
          content: "Sorry, I encountered an error while searching for products. Please try again."
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32">
      <div className="container mx-auto px-4 pb-12">
        {/* Welcome Section - Fixed at top */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Shopping Assistant
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Let Llama AI help you find the perfect items for your shopping needs.
            Start a conversation to tell us what you're looking for!
          </p>
          {!isChatOpen && (
            <button 
              className="px-6 py-3 text-lg bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              onClick={() => setIsChatOpen(true)}
            >
              Start a conversation
            </button>
          )}
        </div>

        {/* Chat Window */}
        {isChatOpen && (
          <ChatWindow
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
            isLoading={isLoading}
            chatRef={chatRef}
            isVisible={isVisible}
          />
        )}
      </div>
    </div>
  );
}
