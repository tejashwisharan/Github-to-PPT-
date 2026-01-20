import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { PresentationView } from './components/PresentationView';
import { fetchRepoReadme } from './services/githubService';
import { generatePitchDeck } from './services/geminiService';
import { GenerationStatus, PresentationData } from './types';

function App() {
  const [status, setStatus] = useState<GenerationStatus>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [presentation, setPresentation] = useState<PresentationData | null>(null);

  const handleAnalyze = async (url: string) => {
    setStatus('FETCHING_REPO');
    setError(null);
    
    try {
      // 1. Fetch from GitHub
      const repoData = await fetchRepoReadme(url);
      
      if (!repoData) {
        setStatus('ERROR');
        setError("Couldn't find a README at that URL. Ensure the repository is public and the URL is correct.");
        return;
      }

      // 2. Analyze with Gemini
      setStatus('ANALYZING');
      
      // Artificial delay for better UX (so user sees the state change)
      await new Promise(r => setTimeout(r, 800)); 
      setStatus('GENERATING_DECK');

      const deck = await generatePitchDeck(repoData.name, repoData.content);
      
      // Add IDs to slides if not present (Gemini might miss them)
      deck.slides = deck.slides.map((s, i) => ({ ...s, id: `slide-${i}` }));

      setPresentation(deck);
      setStatus('COMPLETED');
    } catch (err: any) {
        console.error(err);
        setStatus('ERROR');
        setError(err.message || "Something went wrong during generation. Please try again.");
    }
  };

  const resetApp = () => {
    setPresentation(null);
    setStatus('IDLE');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {status === 'COMPLETED' && presentation ? (
        <PresentationView 
          data={presentation} 
          onClose={resetApp} 
        />
      ) : (
        <InputSection 
          onAnalyze={handleAnalyze} 
          status={status}
          errorMessage={error}
        />
      )}
    </div>
  );
}

export default App;