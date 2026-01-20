export enum SlideType {
  TITLE = 'TITLE',
  PROBLEM = 'PROBLEM',
  SOLUTION = 'SOLUTION',
  MARKET = 'MARKET',
  PRODUCT = 'PRODUCT',
  BUSINESS_MODEL = 'BUSINESS_MODEL',
  COMPETITION = 'COMPETITION',
  TEAM = 'TEAM',
  TRACTION = 'TRACTION',
  VISION = 'VISION'
}

export interface SlideContent {
  id: string;
  type: SlideType;
  title: string;
  bullets: string[];
  speakerNotes: string;
  visualPrompt: string; // Prompt for generating an image later if needed
  highlight?: string;
}

export interface PresentationData {
  projectName: string;
  tagline: string;
  slides: SlideContent[];
}

export type GenerationStatus = 'IDLE' | 'FETCHING_REPO' | 'ANALYZING' | 'GENERATING_DECK' | 'COMPLETED' | 'ERROR';