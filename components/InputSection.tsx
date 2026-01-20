import React, { useState } from 'react';
import { Sparkles, Github, ArrowRight, AlertCircle } from 'lucide-react';
import { GenerationStatus } from '../types';

interface InputSectionProps {
  onAnalyze: (url: string) => void;
  status: GenerationStatus;
  errorMessage: string | null;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, status, errorMessage }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  const isLoading = status !== 'IDLE' && status !== 'ERROR' && status !== 'COMPLETED';

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-4xl mx-auto">
      <div className="mb-8 inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full">
        <Sparkles className="w-8 h-8 text-indigo-600" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
        Turn Code into <span className="text-indigo-600">Capital</span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl">
        Enter your GitHub repository URL below. Our AI analyzes your codebase and README to generate a professional, investor-ready pitch deck in seconds.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xl relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Github className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="url"
          required
          placeholder="https://github.com/username/project"
          className="w-full pl-12 pr-32 py-4 text-lg bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all shadow-sm group-hover:shadow-md"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !url}
          className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium rounded-lg px-6 transition-colors flex items-center gap-2"
        >
          {isLoading ? 'Processing...' : 'Generate'}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {errorMessage && (
        <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading && (
        <div className="mt-8 flex flex-col items-center gap-3 animate-pulse">
            <div className="flex gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          <span className="text-slate-500 font-medium">
            {status === 'FETCHING_REPO' && 'Fetching repository details...'}
            {status === 'ANALYZING' && 'Reading documentation...'}
            {status === 'GENERATING_DECK' && 'Crafting your business story...'}
          </span>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-sm text-slate-500">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="font-semibold text-slate-900 mb-2">1. Analyze Repo</div>
          We fetch your README and structure to understand the technical value proposition.
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="font-semibold text-slate-900 mb-2">2. Structure Deck</div>
          AI organizes content into standard VC slides: Problem, Solution, Market, etc.
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="font-semibold text-slate-900 mb-2">3. Visualize</div>
          Get a beautiful, shareable presentation ready for export or live presenting.
        </div>
      </div>
    </div>
  );
};