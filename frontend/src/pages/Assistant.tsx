import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../api/client';
import { AIAnalysisRequest, AIAnalysisResult } from '../types/graph';
import { Loader2, MessageSquare, Send, AlertCircle, Sparkles } from 'lucide-react';

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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <span>AI Assistant</span>
        </h1>
        <p className="text-gray-600 mt-1">Ask questions about your engineering dependency graph</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 card flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4">
            {history.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Ask a question about your engineering graph</p>
              </div>
            )}

            {history.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[80%]">
                    <p>{item.question}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-[80%]">
                    <p className="text-gray-900">{item.answer.answer}</p>
                    {item.answer.evidence && item.answer.evidence.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600 font-medium">Based on graph evidence</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {mutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                </div>
              </div>
            )}

            {mutation.isError && (
              <div className="flex justify-start">
                <div className="bg-red-50 text-red-700 rounded-lg px-4 py-3 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Failed to process your question. Please try again.</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-2 p-4 border-t border-gray-200">
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
              className="btn btn-primary flex items-center space-x-2"
            >
              {mutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>

        {/* Example Questions */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Example Questions</h2>
          <div className="space-y-2">
            {exampleQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => setQuestion(q)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
            <p className="text-xs text-gray-600">
              The AI Assistant analyzes your engineering dependency graph using CognoDB. 
              It provides answers based on actual graph data and relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
