import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';

export function AIChatWidget({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hi there! 👋 I'm your DocTrust AI assistant. How can I help you verify, extract, or audit documents today?",
      time: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulated realistic DocTrust AI response
    setTimeout(() => {
      let replyText = "DocTrust AI automatically inspects documents for tampering, checks MRZ/barcode cryptography, and extracts structured data in under 400ms. You can test by clicking 'Upload a Document'!";
      const lower = userMessage.text.toLowerCase();

      if (lower.includes('security') || lower.includes('safe') || lower.includes('privacy')) {
        replyText = "DocTrust AI is ISO 27001 certified and SOC-2 Type II compliant with a strict zero-retention policy. Documents are processed in isolated in-memory sandboxes and immediately purged.";
      } else if (lower.includes('api') || lower.includes('integrate') || lower.includes('webhook')) {
        replyText = "Our verification REST API and webhooks support HMAC SHA-256 signatures, Node.js/Python SDKs, and take fewer than 15 lines of code to integrate with your ERP or database!";
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('free')) {
        replyText = "We offer a generous Free Developer Sandbox with 500 documents/month, and Growth Pro at $79/mo for scaling teams!";
      } else if (lower.includes('format') || lower.includes('pdf') || lower.includes('id')) {
        replyText = "We support PDF, PNG, JPG, TIFF, and DOCX across 180+ countries for IDs, passports, invoices, contracts, and financial statements.";
      }

      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: replyText,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-84 sm:w-92 h-[420px] mb-4 flex flex-col overflow-hidden ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/50 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-100" />
                </div>
                <div>
                  <span className="font-bold text-sm block leading-none">DocTrust AI Assistant</span>
                  <span className="text-[10px] text-blue-200">Online • 99.8% Accuracy</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 p-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 bg-gray-50 overflow-y-auto flex flex-col gap-3 text-xs leading-relaxed">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl max-w-[85%] ${
                    msg.sender === 'ai'
                      ? 'bg-blue-50 text-blue-950 border border-blue-100 rounded-tl-xs self-start'
                      : 'bg-blue-600 text-white rounded-tr-xs self-end shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {isTyping && (
                <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl rounded-tl-xs self-start border border-blue-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about verification or APIs..."
                className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800"
              />
              <button
                onClick={handleSend}
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shrink-0 shadow-xs cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5 ml-[-1px]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-gray-900/20 hover:bg-black transition-all cursor-pointer"
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}

export default AIChatWidget;
