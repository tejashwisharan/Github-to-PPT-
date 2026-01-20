import React from 'react';
import { SlideContent, SlideType } from '../types';
import { 
  CheckCircle2, TrendingUp, Users, Target, Rocket, 
  ShieldCheck, DollarSign, AlertTriangle, Layers, Zap
} from 'lucide-react';

interface SlideProps {
  content: SlideContent;
  isActive: boolean;
  backgroundImage?: string | null;
}

export const Slide: React.FC<SlideProps> = ({ content, isActive, backgroundImage }) => {
  const isTitle = content.type === SlideType.TITLE;

  // Icon mapping with modern styling
  const getIcon = () => {
    const cls = "w-6 h-6 text-indigo-600";
    switch (content.type) {
      case SlideType.PROBLEM: return <AlertTriangle className={cls} />;
      case SlideType.SOLUTION: return <CheckCircle2 className={cls} />;
      case SlideType.MARKET: return <TrendingUp className={cls} />;
      case SlideType.TEAM: return <Users className={cls} />;
      case SlideType.COMPETITION: return <Target className={cls} />;
      case SlideType.VISION: return <Rocket className={cls} />;
      case SlideType.BUSINESS_MODEL: return <DollarSign className={cls} />;
      case SlideType.PRODUCT: return <Layers className={cls} />;
      default: return <Zap className={cls} />;
    }
  };

  // --- Layout 1: Title Slide (High Impact) ---
  if (isTitle) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-slate-900 text-white flex items-center">
         {backgroundImage ? (
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear scale-110" 
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />
         ) : (
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-slate-950"></div>
         )}
         
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
         
         <div className="relative z-20 px-20 max-w-5xl">
            <div className="inline-block px-3 py-1 mb-8 border border-indigo-500/30 rounded-full bg-indigo-500/10 backdrop-blur-md">
                <span className="text-indigo-300 text-sm font-medium tracking-widest uppercase">Investor Presentation</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1] serif">
                {content.title}
            </h1>
            <p className="text-2xl text-slate-300 font-light leading-relaxed max-w-2xl border-l-4 border-indigo-500 pl-6">
                {content.tagline || content.bullets[0]}
            </p>
         </div>

         {/* Decorative Element */}
         <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-indigo-600/20 blur-[100px] z-10"></div>
      </div>
    );
  }

  // --- Layout 2: Emphasis (Problem, Market, Vision) ---
  // Split layout: Left text, Right full-bleed image
  const isEmphasis = [SlideType.PROBLEM, SlideType.MARKET, SlideType.VISION].includes(content.type);
  
  if (isEmphasis) {
      return (
        <div className="w-full h-full bg-white relative flex overflow-hidden">
            <div className="w-1/2 p-16 flex flex-col justify-center relative z-10 bg-white">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        {getIcon()}
                    </div>
                    <span className="text-xs font-bold text-indigo-600 tracking-[0.2em] uppercase">{content.type}</span>
                </div>
                
                <h2 className="text-5xl font-bold text-slate-900 leading-tight mb-8 serif">
                    {content.title}
                </h2>

                <div className="space-y-6">
                    {content.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex gap-4 group">
                             <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-600 transition-colors flex-shrink-0" />
                             <p className="text-lg text-slate-600 leading-relaxed font-light">{bullet}</p>
                        </div>
                    ))}
                </div>

                {content.highlight && (
                    <div className="mt-12 p-6 bg-slate-50 border-l-4 border-indigo-600 rounded-r-xl">
                        <p className="text-2xl font-medium text-indigo-900 serif italic">"{content.highlight}"</p>
                    </div>
                )}
            </div>

            <div className="w-1/2 relative bg-slate-100 h-full">
                {backgroundImage ? (
                     <img 
                        src={backgroundImage} 
                        alt="Visual" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-12 bg-slate-50">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-sm font-mono text-slate-400 max-w-xs mx-auto italic">
                                Prompt: {content.visualPrompt}
                            </p>
                        </div>
                    </div>
                )}
                {/* Overlay gradient for readability if we ever put text here */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/5 mix-blend-multiply pointer-events-none"></div>
            </div>
            
            {/* Page Number */}
            <div className="absolute bottom-8 left-16 text-xs text-slate-300 font-mono">
                 PITCH DECK &bull; 2024
            </div>
        </div>
      );
  }

  // --- Layout 3: Standard Content (Solution, Product, Team, etc) ---
  // Card-like layout with grey background
  return (
    <div className="w-full h-full bg-slate-50 relative flex flex-col p-12 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-end mb-12 border-b border-slate-200 pb-6">
            <div>
                <div className="flex items-center gap-2 mb-3">
                     <div className="h-px w-8 bg-indigo-600"></div>
                     <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase">{content.type.replace('_', ' ')}</span>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 serif">{content.title}</h2>
            </div>
            <div className="opacity-20">
                {getIcon()}
            </div>
        </div>

        {/* Content Body */}
        <div className="flex gap-12 flex-1 h-full">
             {/* Text Content */}
            <div className="w-5/12 space-y-8 py-4">
                <ul className="space-y-6">
                    {content.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200 text-xs font-semibold text-indigo-600 shadow-sm flex-shrink-0 mt-0.5">
                                {idx + 1}
                            </span>
                            <span className="text-lg text-slate-700 leading-relaxed font-light">{bullet}</span>
                        </li>
                    ))}
                </ul>

                {content.highlight && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Key Takeaway</span>
                        <p className="text-xl font-medium text-slate-900">{content.highlight}</p>
                    </div>
                )}
            </div>

            {/* Visual Content */}
            <div className="w-7/12 h-full">
                <div className="h-full w-full bg-white rounded-2xl shadow-xl overflow-hidden relative border border-slate-100 ring-1 ring-slate-900/5">
                     {backgroundImage ? (
                        <img 
                            src={backgroundImage} 
                            alt="Visual" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-50 to-indigo-50/50 p-12">
                             <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl max-w-sm text-center">
                                 <p className="text-xs font-bold text-slate-400 uppercase mb-3">AI Visual Concept</p>
                                 <p className="text-slate-500 font-serif italic text-lg leading-relaxed">
                                    "{content.visualPrompt}"
                                 </p>
                             </div>
                         </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-6 right-12 text-xs font-medium text-slate-300">
            CONFIDENTIAL
        </div>
    </div>
  );
};