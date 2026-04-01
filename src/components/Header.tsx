import { Key, Save } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export default function Header({ apiKey, setApiKey }: HeaderProps) {
  const [inputValue, setInputValue] = useState(apiKey);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setApiKey(inputValue);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <header className="bg-teal-700 text-white shadow-md z-10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-white p-2 rounded-lg">
          <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-wide">產品碳足跡管理與盤查 (CFP)</h1>
      </div>
      
      <div className="flex items-center space-x-2 bg-teal-800/50 p-2 rounded-lg border border-teal-600/50">
        <Key className="w-4 h-4 text-teal-200" />
        <input
          type="password"
          placeholder="請輸入 Gemini API Key 啟動 AI..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-white placeholder-teal-200/70 w-64 focus:ring-0"
        />
        <button
          onClick={handleSave}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            isSaved ? 'bg-green-500 text-white' : 'bg-teal-600 hover:bg-teal-500 text-white'
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaved ? '已儲存' : '儲存'}</span>
        </button>
      </div>
    </header>
  );
}
