import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { chatApi } from '../services/dashboardApi';
import { useToast } from '../context/ToastContext';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  FileText,
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Which invoices have discrepancies?',
  'Why was Invoice INV-9042 flagged?',
  'What is the total value of processed invoices?',
  'Find all documents related to PO-1024',
  'Which vendors have pending reviews?',
  'Summarize the issues found in my recent documents',
];

export function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am DocuTrust AI Knowledge Discovery Assistant. I have indexed all your uploaded procurement documents and 3-way match validation results.\n\nAsk me anything about your invoices, purchase orders, quantities, discrepancies, or vendor compliance!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const { showToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const docId = params.get('doc');
    if (docId) {
      setInput(`Summarize document #${docId} and check if it has any discrepancies.`);
    }
  }, [location.search]);

  const handleSendMessage = async (textToSend = null) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatApi.sendMessage(query);
      if (res.success && res.data?.answer) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: res.data.answer,
            groundedCount: res.data.groundedDocuments?.length || 0,
          },
        ]);
      } else {
        throw new Error('No answer received from AI service');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I could not find matching documents or connect to the AI engine. Please verify the backend status or try another query.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="pb-4 border-b border-[#EAE5DC] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-[#c25050]" />
            <span>AI Knowledge Discovery Chat</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Grounded procurement conversational search across all uploaded documents and audits.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF8CD] border border-[#d8e8a8] text-[11px] text-emerald-900 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Strictly Grounded RAG</span>
        </div>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="py-3 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap pl-1">
          Suggestions:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-2xl bg-white hover:bg-[#EEF8CD] border border-[#EAE5DC] hover:border-[#d8e8a8] text-[11px] font-semibold text-slate-700 whitespace-nowrap transition-all shadow-2xs cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-2xl shrink-0 flex items-center justify-center shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-tr from-[#FF9D9D] to-[#FFC5AA] text-slate-900 font-bold text-xs'
                    : 'bg-white border border-[#EAE5DC] text-[#c25050]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] text-slate-900 font-bold rounded-tr-none shadow-xs'
                    : 'bg-white border border-[#EAE5DC] text-slate-800 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-2xl bg-white border border-[#EAE5DC] text-[#c25050] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-[#EAE5DC] rounded-3xl rounded-tl-none p-4 text-xs text-slate-500 font-medium flex items-center gap-2 shadow-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c25050]" />
              <span>Searching repository & formulating grounded answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-3 border-t border-[#EAE5DC] shrink-0">
        <div className="flex items-center gap-2 bg-white border border-[#EAE5DC] rounded-3xl p-2 shadow-xs focus-within:border-[#FFC5AA] focus-within:ring-2 focus-within:ring-[#FFC5AA]/20 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about invoices, purchase orders, or vendors..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] hover:opacity-95 text-slate-900 shadow-2xs transition-all cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
