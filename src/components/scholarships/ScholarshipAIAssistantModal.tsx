import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Scholarship, UserProfile } from '../../types';
import { X, Send, Sparkles, Bot, User as UserIcon, RefreshCw, AlertCircle, Building2 } from 'lucide-react';
import i18n from '../../i18n/i18n';

interface ScholarshipAIAssistantModalProps {
  scholarship: Scholarship | null;
  allScholarships: Scholarship[];
  studentProfile: Partial<UserProfile> | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const ScholarshipAIAssistantModal: React.FC<ScholarshipAIAssistantModalProps> = ({
  scholarship,
  allScholarships,
  studentProfile,
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Initial greeting when opened
    const initialGreeting = scholarship
      ? `Hello! I am your DIRPA Scholarship Guidance Assistant. I have loaded the official record for **${scholarship.scholarshipName}** (${scholarship.provider}). Ask me about your eligibility, required documents, or application procedure!`
      : `Hello! I am your DIRPA Scholarship Guidance Assistant. I can help you discover verified government and private scholarships from our database based on your educational profile. How can I assist you today?`;

    setMessages([
      {
        sender: 'ai',
        text: initialGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [scholarship, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsLoading(true);

    try {
      const activeLang = i18n.language || 'en';
      const res = await fetch('/api/scholarships/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: textToSend,
          scholarship,
          allScholarships,
          studentProfile,
          lang: activeLang
        })
      });

      const data = await res.json();
      const aiReply = data.reply || 'I am happy to help you with scholarship guidance based on our official database.';

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Scholarship AI Advisor error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'I apologize, but I am unable to connect to the server right now. Please inspect the scholarship requirements directly on the card or portal link.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = scholarship ? [
    "Am I eligible for this scholarship based on my profile?",
    "What exact documents do I need to prepare?",
    "Explain the selection process and payment schedule.",
    "How do I apply on the official government portal?"
  ] : [
    "Which scholarships match my education level and state?",
    "Show me government scholarships with full tuition coverage.",
    "Are there scholarships available for my category?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border-4 border-black text-stone-900 w-full max-w-2xl h-[85vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative text-left">
        {/* Top Header */}
        <div className="p-4 bg-purple-900 text-white border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-purple-200 border-2 border-black rounded-full flex items-center justify-center text-purple-900 font-bold shrink-0">
              <Sparkles className="w-5 h-5 text-purple-900" />
            </div>
            <div>
              <h3 className="text-base font-display font-black uppercase tracking-wider flex items-center gap-1.5">
                {t('scholarships.aiAssistantTitle', 'DIRPA Scholarship AI Advisor')}
              </h3>
              <p className="text-[11px] text-purple-200 font-mono">
                {scholarship ? `Discussing: ${scholarship.scholarshipName}` : t('scholarships.aiAssistantSubtitle', 'Ask questions about eligibility, document checklists, renewal terms, or portal registration.')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-purple-800 hover:bg-purple-700 border-2 border-black transition-colors cursor-pointer"
            title={t('common.close', 'Close')}
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Selected Scholarship Mini Bar */}
        {scholarship && (
          <div className="bg-purple-50 border-b-2 border-black p-2.5 px-4 flex items-center justify-between text-xs font-medium text-purple-900">
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-4 h-4 text-purple-700 shrink-0" />
              <span className="font-bold truncate">{scholarship.scholarshipName}</span>
            </div>
            <span className="font-mono font-bold bg-amber-200 border border-black px-2 py-0.5 shrink-0 text-[10px]">
              {scholarship.scholarshipAmount}
            </span>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-purple-900 text-white border-2 border-black flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                msg.sender === 'user'
                  ? 'bg-amber-200 text-stone-900 font-medium'
                  : 'bg-white text-stone-800'
              }`}>
                <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>
                <div className="text-[9px] font-mono text-stone-500 text-right mt-1.5">
                  {msg.time}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-amber-400 text-black border-2 border-black flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-start animate-pulse">
              <div className="w-8 h-8 rounded-full bg-purple-900 text-white border-2 border-black flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 bg-white border-2 border-black space-y-2.5 max-w-[80%] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2">
                  <div className="w-32 h-3.5 bg-purple-200 rounded-sm" />
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                </div>
                <div className="w-48 h-2.5 bg-stone-200 rounded-sm" />
                <div className="w-40 h-2.5 bg-stone-200 rounded-sm" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-white border-t-2 border-stone-200 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-mono font-bold uppercase text-stone-500 shrink-0">
            {t('scholarships.suggestedPrompts', 'Suggested Prompts')}:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-[10px] font-semibold bg-stone-100 hover:bg-purple-100 hover:text-purple-900 border border-stone-300 px-2.5 py-1 whitespace-nowrap transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-stone-100 border-t-4 border-black flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={t('scholarships.aiInputPlaceholder', 'Ask AI about eligibility, documents, or application guidance...')}
            className="flex-1 p-2.5 text-xs font-semibold border-2 border-black focus:outline-none focus:bg-amber-50"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-bold uppercase transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            title={t('common.submit', 'Send Message')}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
