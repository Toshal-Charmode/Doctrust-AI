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
  HelpCircle,
  ExternalLink,
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
  const [groundedDocs, setGroundedDocs] = useState([]);
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
    // If a document was passed via ?doc=123, pre-fill query
    const params = new URLSearchParams(location.search);
    const docId = params.get('doc');
    if (docId) {
      setInput(`Summarize document #${docId} and check if it has any discrepancies.`);
    }
  }, [location.search]);

  const handleSendMessage = async (textToSend = null) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatApi.sendMessage(query);
      if (res.success) {
        setMessages((prev) => [...prev, res.data.message]);
        if (res.data.groundedDocs?.length > 0) {
          setGroundedDocs(res.data.groundedDocs);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to process AI chat query', 'error');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error retrieving answers from your documents. Please verify your connection or try again.',
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
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-cyan-400" />
            <span>AI Knowledge Discovery Chat</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Grounded procurement conversational search across all uploaded documents and audits.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-cyan-400 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Strictly Grounded RAG</span>
        </div>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="py-3 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap pl-1">
          Suggestions:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors cursor-pointer"
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
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-md ${
                  isUser
                    ? 'bg-gradient-to-tr from-blue-600 to-cyan-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-cyan-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-900/70 border border-slate-800/80 text-slate-200 rounded-tl-none shadow-sm'
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
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Searching repository & formulating grounded answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="pt-3 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-2 focus-within:border-cyan-500 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about purchase orders, invoices, discrepancies, or vendors..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-sm transition-all disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-500 text-center mt-2">
          Responses are strictly grounded in your active documents. DocuTrust AI does not hallucinate facts.
        </p>
      </div>
    </div>
  );
}

export default ChatPage;
