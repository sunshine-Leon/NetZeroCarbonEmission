import { useState } from 'react';
import Header from './components/Header';
import ContentViewer from './components/ContentViewer';
import Chatbot from './components/Chatbot';

function App() {
  const [apiKey, setApiKey] = useState<string>('');

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
      <Header apiKey={apiKey} setApiKey={setApiKey} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <ContentViewer />
        </div>
        
        <div className="w-96 border-l border-gray-200 bg-white flex flex-col">
          <Chatbot apiKey={apiKey} />
        </div>
      </div>
    </div>
  );
}

export default App;
