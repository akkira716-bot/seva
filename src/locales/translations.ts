// Comprehensive Multilingual Translation Dictionaries for SEVA & MaatruSetu
// Supported Languages:
// English ('en'), Hindi ('hi'), Telugu ('te'), Bengali ('bn'), Marathi ('mr'),
// Tamil ('ta'), Gujarati ('gu'), Urdu ('ur'), Kannada ('kn'), Odia ('or'),
// Malayalam ('ml'), Spanish ('es')

import { en } from './languages/en';
import { hi } from './languages/hi';
import { te } from './languages/te';
import { bn } from './languages/bn';
import { mr } from './languages/mr';
import { ta } from './languages/ta';
import { gu } from './languages/gu';
import { ur } from './languages/ur';
import { kn } from './languages/kn';
import { or } from './languages/or';
import { ml } from './languages/ml';
import { es } from './languages/es';

export type SupportedLanguage = 
  | 'en' 
  | 'hi' 
  | 'te' 
  | 'bn' 
  | 'mr' 
  | 'ta' 
  | 'gu' 
  | 'ur' 
  | 'kn' 
  | 'or' 
  | 'ml' 
  | 'es';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export const translations = {
  en,
  hi,
  te,
  bn,
  mr,
  ta,
  gu,
  ur,
  kn,
  or,
  ml,
  es
};

export type TranslationKey = keyof typeof translations.en;
