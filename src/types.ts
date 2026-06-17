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

export interface Web3FormsConfig {
  accessKey: string; // e.g. 1234abcd-1234-abcd-1234-abcd1234abcd
}

export interface CustomizableImage {
  id: string;
  label: string;
  url: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
}
