/**
 * Pure TypeScript Generator Utilities
 * Cryptographic Random Integer, Diceware Passphrases, SKU Generator, and Invoice Codes.
 */

// Diceware standard wordlist sample for client-side secure passphrases
const DICEWARE_WORDS = [
  'ability', 'account', 'actor', 'adapter', 'advance', 'airport', 'almanac', 'alphabet', 'anchor',
  'ancient', 'antenna', 'apricot', 'arcade', 'archway', 'arrival', 'athlete', 'avocado', 'balance',
  'bamboo', 'banner', 'beacon', 'breeze', 'bridge', 'bronze', 'bulletin', 'cabin', 'cabinet',
  'cactus', 'camera', 'canyon', 'capital', 'caramel', 'castle', 'catalyst', 'cedar', 'celestial',
  'channel', 'chapter', 'charter', 'chimney', 'circuit', 'citadel', 'clarity', 'classic', 'climate',
  'cobalt', 'coffee', 'colony', 'compass', 'concert', 'conduit', 'contour', 'cortex', 'cosmic',
  'courage', 'crescent', 'crystal', 'curator', 'cylinder', 'dashboard', 'database', 'daybreak',
  'decoder', 'defense', 'delight', 'density', 'desktop', 'diamond', 'digital', 'diploma', 'disco',
  'distance', 'dolphin', 'domino', 'dynamic', 'eclipse', 'ecology', 'edition', 'element', 'emerald',
  'empire', 'endless', 'engine', 'episode', 'epoch', 'equation', 'equinox', 'essence', 'eternal',
  'evergreen', 'evident', 'evolution', 'example', 'explorer', 'express', 'fabric', 'factor',
  'falcon', 'feather', 'festival', 'fidelity', 'filament', 'finance', 'firmware', 'fissure',
  'flame', 'flexible', 'florence', 'forecast', 'forest', 'formula', 'fortress', 'fountain',
  'fraction', 'frontier', 'galaxy', 'gateway', 'glacier', 'glimmer', 'goddess', 'granite',
  'gravity', 'habitat', 'harmony', 'harvest', 'haven', 'header', 'horizon', 'hybrid', 'hydra',
  'iconic', 'ignite', 'illumine', 'impact', 'impulse', 'infinity', 'ingress', 'insight', 'integer',
  'isotope', 'ivory', 'javelin', 'journey', 'jupiter', 'kinetic', 'kingdom', 'lantern', 'lattice',
  'legacy', 'legend', 'liberty', 'lightning', 'limestone', 'linear', 'logic', 'lunar', 'magnet'
];

export function generateCryptoRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const cutoff = Math.floor((256 ** bytesNeeded) / range) * range;
  const byteArray = new Uint8Array(bytesNeeded);

  while (true) {
    crypto.getRandomValues(byteArray);
    let val = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      val = (val << 8) + byteArray[i];
    }
    if (val < cutoff) {
      return min + (val % range);
    }
  }
}

export function generatePassword(
  length = 16,
  options = { upper: true, lower: true, digits: true, symbols: true, avoidAmbiguous: false }
): string {
  let chars = '';
  if (options.lower) chars += options.avoidAmbiguous ? 'abcdefghijkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  if (options.upper) chars += options.avoidAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.digits) chars += options.avoidAmbiguous ? '23456789' : '0123456789';
  if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  let result = '';
  for (let i = 0; i < length; i++) {
    const idx = generateCryptoRandomInt(0, chars.length - 1);
    result += chars[idx];
  }
  return result;
}

export function generatePassphrase(wordCount = 4, separator = '-'): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const idx = generateCryptoRandomInt(0, DICEWARE_WORDS.length - 1);
    words.push(DICEWARE_WORDS[idx]);
  }
  return words.join(separator);
}

export function generateInvoiceNumber(prefix = 'INV', startNum = 1001, padLength = 4, suffix = ''): string {
  const formattedNum = String(startNum).padStart(padLength, '0');
  return `${prefix}${prefix ? '-' : ''}${formattedNum}${suffix ? '-' : ''}${suffix}`;
}

export function generateSku(categoryCode: string, nameCode: string, attributeCode?: string, sizeCode?: string): string {
  const parts = [
    categoryCode.trim().toUpperCase().substring(0, 3),
    nameCode.trim().toUpperCase().substring(0, 4),
    attributeCode ? attributeCode.trim().toUpperCase().substring(0, 3) : '',
    sizeCode ? sizeCode.trim().toUpperCase() : '',
  ].filter(Boolean);

  return parts.join('-');
}
