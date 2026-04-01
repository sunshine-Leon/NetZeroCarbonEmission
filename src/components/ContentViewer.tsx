import { useState } from 'react';
import { presentationData } from '../data/presentationData';
import Markdown from 'react-markdown';

export default function ContentViewer() {
  const [activeSection, setActiveSection] = useState(presentationData[0].id);

  const currentSection = presentationData.find(s => s.id === activeSection);

  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-teal-800">簡報章節</h2>
        </div>
        <nav className="p-2 space-y-1">
          {presentationData.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeSection === section.id
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-start">
                <span className="mr-2 text-teal-600/60 font-mono">{index + 1}.</span>
                <span className="leading-tight">{section.title}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-full">
          {currentSection && (
            <div className="prose prose-teal max-w-none">
              <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                {currentSection.title}
              </h1>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <Markdown
                  components={{
                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-teal-800 mt-8 mb-4" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                  }}
                >
                  {currentSection.content}
                </Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
