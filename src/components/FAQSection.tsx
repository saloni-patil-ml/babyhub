'use client';

import { useState } from 'react';
import { getFAQAnswer } from '@/utils/api';

// Define a new type for the state to handle both success and error cases
type AnswerState = {
  answer: string;
  confidence?: number;
} | {
  error: string;
} | null;

export default function FAQSection() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<AnswerState>(null); // Use the new type
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setLoading(true);
      const response = await getFAQAnswer(question, language);
      // Assuming getFAQAnswer returns an object like { answer: '...', confidence: 85 }
      setAnswer(response);
    } catch (err) {
      console.error(err);
      // This is now a valid state to set
      setAnswer({ error: 'Failed to get answer. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ask a Question</h2>
      
      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-900 mb-2">Language</span>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded ${
              language === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`px-4 py-2 rounded ${
              language === 'hi'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-900 mb-2">
            {language === 'en' ? 'Your Question' : 'आपका सवाल'}
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            placeholder={language === 'en' ? 'Type your question here...' : 'यहां अपना सवाल लिखें...'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading
            ? (language === 'en' ? 'Searching...' : 'खोज रहे हैं...')
            : (language === 'en' ? 'Get Answer' : 'जवाब पाएं')}
        </button>
      </form>

      {answer && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                {language === 'en' ? 'Question:' : 'सवाल:'}
              </h3>
              <p className="text-gray-900 mt-1">{question}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">
                {language === 'en' ? 'Answer:' : 'जवाब:'}
              </h3>
              {/* Type-safe check for the error property */}
              {'error' in answer ? (
                <p className="text-red-600 mt-1">{answer.error}</p>
              ) : (
                <div className="mt-1 space-y-2">
                  <p className="text-gray-900 whitespace-pre-wrap">{answer.answer}</p>
                  {answer.confidence && (
                    <p className="text-sm text-gray-600">
                      {language === 'en' ? 'Confidence: ' : 'विश्वास: '}
                      {answer.confidence}%
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}