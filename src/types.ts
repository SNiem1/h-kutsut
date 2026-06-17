export interface RSVPResponse {
  id: string;
  name: string;
  lactoseFree: boolean;
  glutenFree: boolean;
  noAllergies?: boolean;
  otherAllergies: string;
  message?: string;
  timestamp: string;
}

export interface CustomizableImage {
  id: string;
  label: string;
  url: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
}
