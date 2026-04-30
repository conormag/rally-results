const CAR_IMAGES = {
  FORD_ESCORT_MK2: '/cars/ford-escort-mk2.webp',
  VW_POLO_GTI_R5: '/cars/VW-Polo-GTI-R5.webp',
  HYUNDAI_I20_N: '/cars/hyundai-i20-n.webp',
  // Your Default/Fallback Image
  DEFAULT: '/cars/default.webp'
};

// This dictionary maps the asset to the scraped text options
const carMatches: Record<string, string[]> = {
  [CAR_IMAGES.FORD_ESCORT_MK2]: [
    'ford escort mk 2',
    'ford escort mk2',
    'escort mk2',
    'escort mk ii',
    'ford escort rs1800'
  ],
  [CAR_IMAGES.VW_POLO_GTI_R5]: [
    'vw polo gti r5',
    'volkswagen polo r5',
    'vw polo r5',
    'polo r5'
  ],
  [CAR_IMAGES.HYUNDAI_I20_N]: [
    'hyundai i20 n rally2',
    'hyundai i20 r5',
    'hyundai i20 rally2',
    'i20 rally2'
  ]
};

/**
 * Takes the raw scraped string, sanitizes it, and looks for a match.
 */
export function getCarImageUrl(scrapedMakeText: string): string {
  if (!scrapedMakeText) return CAR_IMAGES.DEFAULT;
  const sanitizedInput = scrapedMakeText.trim().toLowerCase();
  const matchedEntry = Object.entries(carMatches).find(([_, matches]) =>
    matches.includes(sanitizedInput)
  );
  return matchedEntry ? matchedEntry[0] : CAR_IMAGES.DEFAULT;
}