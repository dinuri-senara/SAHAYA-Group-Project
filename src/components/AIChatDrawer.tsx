import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isFallback?: boolean;
  timestamp: string;
}

interface AIChatDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen: controlledIsOpen,
  onClose,
  onOpen,
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const handleOpen = () => {
    if (isControlled && onOpen) {
      onOpen();
    } else {
      setUncontrolledIsOpen(true);
    }
  };

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setUncontrolledIsOpen(false);
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am SAHAYA AI Crisis Assistant. How can I assist you with emergency aid, shelter locations, food rations, or volunteer assignments?',
      isFallback: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([
    'Where is the nearest shelter?',
    'How do I request emergency food rations?',
    'Emergency hotline contacts',
    'Register as a volunteer',
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.sendAIChat(textToSend, language);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.reply,
        isFallback: response.isFromFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      if (response.quickSuggestions?.length) {
        setQuickSuggestions(response.quickSuggestions);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Unable to reach the assistant at this moment. For life-threatening emergencies, call national emergency hotlines (119 / 1990).',
          isFallback: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white font-bold shadow-xl shadow-[var(--theme-glow)] border border-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md"
          aria-label="Open AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 ring-2 ring-white/70" />
            </span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold tracking-wide text-white">AI Assistance</span>
        </button>
      )}

      {/* Slide-over Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-white/10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-white border border-white/15">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">SAHAYA AI Assistant</h3>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Triage
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Emergency & Aid Navigation</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="bg-slate-800 text-xs text-slate-300 rounded-lg px-2 py-1 border border-slate-700 outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="si">Sinhala</option>
                  <option value="ta">Tamil</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-4 py-2.5 bg-amber-500/10 dark:bg-amber-950/30 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>AI recommendations provide guidance. High-stakes triage decisions are validated by authorized coordinators.</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-[var(--theme-primary)] text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-white/10'
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 px-1">
                    <span>{m.timestamp}</span>
                    {m.sender === 'ai' && (
                      <span className={`font-semibold ${m.isFallback ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {m.isFallback ? '• Local Emergency Rules' : '• Gemini 3.5 AI (Live)'}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                  <Sparkles className="w-4 h-4 animate-spin text-[var(--theme-primary)]" />
                  <span>AI assistant is analyzing disaster guidelines...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {quickSuggestions.length > 0 && (
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {quickSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] transition cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask for assistance, shelters, food rations..."
                  className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-[var(--theme-primary)] text-white hover:bg-[var(--theme-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer shadow-md shadow-[var(--theme-glow)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
