export interface Product {
  id: number;
  name: string;
  origin: string;
  price: number;
  tags: string[];
  image: string;
}

export interface NavLink {
  id: ViewState;
  label: string;
}

export type ViewState = 'home' | 'shop' | 'subscription' | 'wholesale' | 'guides' | 'admin';

export interface QuizOption {
  label: string;
  value: string;
  desc: string;
}

export interface QuizStep {
  question: string;
  key: keyof QuizAnswers;
  options: QuizOption[];
}

export interface QuizAnswers {
  roast?: string;
  format?: string;
  method?: string;
}

export interface Guide {
  id: string;
  title: string;
  image: string;
  steps: string[];
  instructionalImage?: string; // New optional field for the guide image
}