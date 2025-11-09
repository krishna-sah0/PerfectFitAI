export interface Measurements {
  height: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  inseam: string;
  shoulderWidth: string;
  armLength: string;
}

export interface RecommendedSizes {
  shirt: string;
  pants: string;
  shoe: string;
}

export interface OutfitSuggestion {
  name: string;
  description: string;
}

export interface AccessorySuggestion {
    name: string;
    description: string;
}

export interface AnalysisResult {
  measurements: Measurements;
  bodyType: string;
  recommendedSizes: RecommendedSizes;
  outfitSuggestions: OutfitSuggestion[];
  emotion: string;
  ethnicity: string;
  currentStyle: string;
  accessorySuggestions: AccessorySuggestion[];
}

export interface ClothingColor {
    name: string;
    hex: string;
}

export interface ClothingItem {
  id: number;
  name: string;
  category: 'Outerwear' | 'Tops' | 'Bottoms' | 'Dresses' | 'Formal' | 'Modern';
  description: string;
  gender: 'male' | 'female';
  colors: ClothingColor[];
}

export interface AccessoryItem {
    id: number;
    name: string;
    category: 'Spectacles' | 'Watches' | 'Jewelry' | 'Handbags';
    description: string;
}

export interface VisualizationParams {
    fit: 'Slim' | 'Regular' | 'Loose';
    realism: number; // 0-100
    lighting: 'Natural' | 'Studio' | 'Dramatic';
    background: 'Original' | 'Studio Gray' | 'Outdoor City';
    imageStyle: 'Photorealistic' | 'Fashion Magazine' | 'Vintage Film';
    pose: 'As Is' | 'Confident Stance' | 'Relaxed Pose';
}