import React, { useState, useEffect } from 'react';
import { PresentationData } from '../types';
import { Slide } from './Slide';
import { ChevronLeft, ChevronRight, X, Download, Wand2 } from 'lucide-react';
import { generateSlideImage } from '../services/geminiService';
import { generatePptx } from '../services/pptxService';

interface PresentationViewProps {
  data: PresentationData;
  onClose: () => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ data, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const currentSlide = data.slides[currentIndex];
  
  const nextSlide = () => {
    if (currentIndex < data.slides.length - 1) setCurrentIndex(p => p + 1);
  };
  
  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(p => p - 1);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handleGenerateImage = async () => {
    if (generatedImages[currentSlide.id] || isGeneratingImage) return;
    
    setIsGeneratingImage(true);
    try {
        const imageUrl = await generateSlideImage(currentSlide.visualPrompt);
        if (imageUrl) {
            setGeneratedImages(prev => ({
                ...prev,
                [currentSlide.id]: imageUrl
            }));
        }
    } finally {
        setIsGeneratingImage(false);
    }
  };

  // Pre-generate title slide image on mount
  useEffect(() => {
    const titleSlide = data.slides[0];
    if (titleSlide && !generatedImages[titleSlide.id]) {
        // Automatically try generating the title image for wow factor
        const genTitle = async () => {
            const imageUrl = await generateSlideImage(titleSlide.visualPrompt);
            if (imageUrl) {
                setGeneratedImages(prev => ({ ...prev, [titleSlide.id]: imageUrl }));
            }
        };
        genTitle();
    }
  }, []);

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    
    try {
       // Pass generateSlideImage to ensure missing visuals are created on the fly
       await generatePptx(data, generatedImages, generateSlideImage);
    } catch (error) {
        console.error("Export failed:", error);
        alert("Sorry, failed to generate the PPTX. Please try again.");
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col text-white">
      {/* Top Toolbar */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-slate-950">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
                <span className="font-semibold text-sm font-sans">{data.projectName}</span>
                <span className="text-xs text-slate-400">Slide {currentIndex + 1} of {data.slides.length}</span>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !!generatedImages[currentSlide.id]}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    generatedImages[currentSlide.id] 
                    ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <Wand2 className={`w-4 h-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
                {generatedImages[currentSlide.id] ? 'Visual Ready' : isGeneratingImage ? 'Designing...' : 'Generate Visual'}
            </button>
            <div className="h-6 w-px bg-white/10 mx-2" />
            <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-slate-200 border border-transparent hover:border-white/10"
            >
                <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                <span>{isExporting ? 'Generating & Exporting...' : 'Download .pptx'}</span>
            </button>
        </div>
      </div>

      {/* Main Slide Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-12 bg-slate-900 overflow-hidden relative">
        {/* Background Ambient Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-[1280px] aspect-video bg-white shadow-2xl rounded-sm overflow-hidden slide-shadow relative border border-slate-800">
           <Slide 
                content={currentSlide} 
                isActive={true} 
                backgroundImage={generatedImages[currentSlide.id]}
           />
        </div>
        
        {/* Navigation Buttons */}
        <button 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all hover:scale-105 disabled:opacity-0 border border-white/5 text-slate-200"
        >
            <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
            onClick={nextSlide}
            disabled={currentIndex === data.slides.length - 1}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all hover:scale-105 disabled:opacity-0 border border-white/5 text-slate-200"
        >
            <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Speaker Notes / Bottom Bar */}
      <div className="h-32 border-t border-white/10 bg-slate-950 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto flex gap-6">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">Speaker Notes</span>
            <p className="text-slate-400 leading-relaxed text-sm font-light">
                {currentSlide.speakerNotes}
            </p>
        </div>
      </div>
    </div>
  );
};