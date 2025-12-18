import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Bot, Loader2, X, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { useLanguage } from '../App';

export const IWI: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize greeting on language change
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'model',
        text: t.iwi.greeting,
        timestamp: new Date()
      }
    ]);
  }, [t.iwi.greeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(messages, userMsg.text, language);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const toggleListening = () => {
    // Mocking voice interaction
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setInput(language === 'fr' ? "Est-ce remboursé par la mutuelle ?" : "Is this covered by my mutuelle?");
        setIsListening(false);
      }, 1500);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-clinic-dark-bg relative transition-colors duration-300 md:rounded-2xl md:shadow-sm md:border md:border-gray-200 md:dark:border-gray-700 md:overflow-hidden md:h-[calc(100vh-4rem)]">
      
      {/* Header */}
      <div className="bg-white dark:bg-clinic-dark-surface p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 sticky top-0 z-10 shadow-sm transition-colors">
        <div className="relative">
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                <Bot className="text-white" size={24} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
        </div>
        <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{t.iwi.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
               <Sparkles size={12} className="text-clinic-accent" />
               {t.iwi.online}
            </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 md:pb-28 bg-gray-50 dark:bg-clinic-dark-bg transition-colors">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Avatar/Label for PC accessibility, visual cue */}
                <span className="text-[10px] text-gray-400 mb-1 px-1">
                    {msg.role === 'user' ? t.iwi.userLabel : 'IWI'} • {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>

                <div
                className={`px-5 py-3.5 shadow-sm text-sm md:text-base leading-relaxed break-words ${
                    msg.role === 'user'
                    ? 'bg-clinic-blue text-white rounded-2xl rounded-tr-none'
                    : 'bg-white dark:bg-clinic-dark-surface text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700'
                }`}
                >
                {msg.text}
                </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
            <div className="flex justify-start w-full">
                 <div className="bg-white dark:bg-clinic-dark-surface rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 w-full bg-white/90 dark:bg-clinic-dark-surface/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-700 p-4 pb-6 md:pb-4 transition-colors">
        <div className="max-w-4xl mx-auto flex gap-3 items-center">
            
            {/* Mic Button */}
            <button 
                onClick={toggleListening}
                aria-label="Toggle voice input"
                className={`p-3 md:p-4 rounded-full transition-all duration-300 ${
                    isListening 
                    ? 'bg-red-50 dark:bg-red-900/30 text-red-500 border border-red-200 dark:border-red-800 animate-pulse' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
                {isListening ? <X size={20} /> : <Mic size={20} />}
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t.iwi.placeholder}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full pl-5 pr-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-clinic-blue/50 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm md:text-base border border-transparent focus:border-clinic-blue/30 placeholder-gray-400"
                />
            </div>

            {/* Send Button */}
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="bg-clinic-blue hover:bg-blue-700 text-white p-3 md:p-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 transform active:scale-95"
            >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
        </div>
      </div>
    </div>
  );
};