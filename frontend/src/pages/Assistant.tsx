import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../api/client';
import { AIAnalysisRequest, AIAnalysisResult } from '../types/graph';
import { Loader2, Send, AlertCircle, Sparkles, Bot, Lightbulb } from 'lucide-react';

const Assistant = () => {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<Array<{question: string; answer: AIAnalysisResult}>>([]);

  const mutation = useMutation({
    mutationFn: (data: AIAnalysisRequest) => aiApi.analyze(data),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    mutation.mutate(
      { question },
      {
        onSuccess: (result) => {
          setHistory([...history, { question, answer: result }]);
          setQuestion('');
        },
      }
    );
  };

  const exampleQuestions = [
    "What services could be affected if Payment Service fails?",
    "How many incidents have we had recently?",
    "Which teams own the most services?",
    "What databases does the Order Service use?",
    "Show me all critical services",
    "Which services have the most dependencies?",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#171717] flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-[#8b5cf6]" />
          <span>AI Assistant</span>
        </h1>
        <p className="text-sm text-[#525252] mt-1">Ask questions about your engineering dependency graph</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 card flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 custom-scrollbar">
            {history.length === 0 && (
              <div className="empty-state">
                <Bot className="empty-state-icon text-[#8b5cf6]" />
                <h3 className="empty-state-title">Welcome to AI Assistant</h3>
                <p className="empty-state-description">Ask questions about your services, dependencies, incidents, and more</p>
              </div>
            )}

            {history.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-[#0ea5e9] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-sm">
                    <p className="text-sm">{item.question}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-[#fafafa] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] border border-[#e5e5e5]">
                    <p className="text-sm text-[#171717]">{item.answer.answer}</p>
                    {item.answer.evidence && item.answer.evidence.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#e5e5e5]">
                        <div className="flex items-center space-x-1 text-xs text-[#525252]">
                          <Lightbulb className="h-3 w-3" />
                          <span className="font-medium">Based on graph evidence</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {mutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-[#fafafa] rounded-2xl rounded-tl-sm px-4 py-3 border border-[#e5e5e5]">
                  <Loader2 className="h-4 w-4 loading-spinner" />
                </div>
              </div>
            )}

            {mutation.isError && (
              <div className="flex justify-start">
                <div className="bg-[#fef2f2] text-[#b91c1c] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] border border-[#fecaca] flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Failed to process your question. Please try again.</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-2 p-4 border-t border-[#e5e5e5]">
            <input
              type="text"
              placeholder="Ask a question about your engineering graph..."
              className="input flex-1"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={mutation.isPending}
            />
            <button
              type="submit"
              disabled={!question.trim() || mutation.isPending}
              className="btn btn-primary"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 loading-spinner" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>

        {/* Example Questions */}
        <div className="card space-y-6">
          <div>
            <h2 className="section-title mb-4">Suggested Questions</h2>
            <div className="space-y-2">
              {exampleQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(q)}
                  className="w-full text-left p-3 bg-[#fafafa] hover:bg-[#f5f5f5] rounded-lg transition-colors text-sm border border-[#e5e5e5] hover:border-[#d4d4d4]"
                >
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                    <span className="text-[#171717]">{q}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#e5e5e5]">
            <h3 className="text-sm font-medium text-[#171717] mb-2">About</h3>
            <div className="flex items-start space-x-2 text-xs text-[#525252]">
              <Sparkles className="h-4 w-4 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
              <p>
                The AI Assistant analyzes your engineering dependency graph using CognoDB. 
                It provides answers based on actual graph data and relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
