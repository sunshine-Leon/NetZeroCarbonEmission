import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, Flame } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { presentationData } from '../data/presentationData';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatbotProps {
  apiKey: string;
}

export default function Chatbot({ apiKey }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '您好！我是您的碳足跡管理小幫手。請在上方輸入您的 Gemini API Key，然後就可以問我關於簡報內容的問題喔！' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'normal' | 'hells'>('normal');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Store the chat instance to maintain history
  const chatRef = useRef<any>(null);
  const isFirstRender = useRef(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat when API key changes
  useEffect(() => {
    chatRef.current = null;
  }, [apiKey]);

  // Handle mode change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    chatRef.current = null;
    if (mode === 'hells') {
      setMessages(prev => [...prev, { role: 'model', text: '聽好了！我現在是 Gordon Ramsay！如果你問的問題像沒煮熟的生肉一樣蠢，我會把你夾成 Idiot Sandwich！快點問你的碳足跡問題！' }]);
    } else {
      setMessages(prev => [...prev, { role: 'model', text: '已切換回一般模式。請問有什麼我可以協助您的碳足跡問題嗎？' }]);
    }
  }, [mode]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setError('請先在上方輸入您的 Gemini API Key');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey });
        
        // Prepare context from presentation data
        const contextText = presentationData.map(s => `# ${s.title}\n${s.content}`).join('\n\n');
        
        const normalInstruction = `你是一個專業的產品碳足跡管理與盤查專家。
請根據以下提供的簡報資料內容，回答使用者的問題。
如果使用者的問題超出簡報範圍，請禮貌地告知你只能根據提供的資料回答。
請用繁體中文回答，並保持專業、友善的語氣。`;

        const hellsInstruction = `你是一個專業的產品碳足跡管理與盤查專家，但你現在的說話風格必須完全模仿地獄廚房的主持人 Gordon Ramsay（戈登·拉姆齊）。
你極度嚴格、暴躁、充滿熱情，經常使用誇張的比喻、廚房用語和強烈的語氣詞（請保持繁體中文，可以夾雜一點經典台詞如 'Idiot sandwich', 'It's RAW!', 'Wake up!' 等）。
請根據以下提供的簡報資料內容，回答使用者的問題。
如果使用者的問題超出簡報範圍，請狠狠地斥責他們問了蠢問題，並告訴他們這不在菜單（簡報）上！
請用繁體中文回答，語氣要極度嚴厲、挑剔，但最終還是會給出正確的專業解答。`;

        const systemInstruction = `${mode === 'hells' ? hellsInstruction : normalInstruction}\n\n簡報資料內容：\n${contextText}`;

        chatRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction,
            temperature: mode === 'hells' ? 0.7 : 0.2,
          }
        });
      }

      const response = await chatRef.current.sendMessage({ message: userMessage });
      
      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text as string }]);
      } else {
        throw new Error('No response from AI');
      }
    } catch (err: any) {
      console.error('AI Error:', err);
      setError(err.message || '發生錯誤，請檢查您的 API Key 或稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 bg-teal-50 border-b border-teal-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-teal-600" />
          <h2 className="font-semibold text-teal-800">AI 小幫手</h2>
        </div>
        
        <div className="flex items-center space-x-1 bg-white rounded-lg p-1 border border-teal-200">
          <button
            onClick={() => setMode('normal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'normal' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            一般模式
          </button>
          <button
            onClick={() => setMode('hells')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1 ${mode === 'hells' ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Flame className="w-3 h-3" />
            <span>地獄廚房</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}
            >
              {msg.role === 'model' ? (
                <div className="prose prose-sm prose-teal max-w-none">
                  <Markdown>{msg.text}</Markdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">思考中...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center mt-2">
            <div className="bg-red-50 text-red-600 rounded-lg px-4 py-2 flex items-center space-x-2 text-sm border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={apiKey ? "輸入您的問題..." : "請先在上方輸入 API Key"}
            disabled={isLoading}
            className="flex-1 max-h-32 min-h-[44px] resize-none border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-500"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2 text-center">
          AI 可能會產生不準確的資訊，請以簡報原文為準。
        </div>
      </div>
    </div>
  );
}
