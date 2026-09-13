const MARATHI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Converts standard numbers/strings to Marathi numerals (e.g. 12 -> १२, 1.5 -> १.५)
 */
export function toMarathiNumber(val: number | string): string {
  if (val === undefined || val === null) return '';
  const str = String(val);
  return str.replace(/[0-9]/g, (digit) => MARATHI_DIGITS[parseInt(digit, 10)]);
}

/**
 * Converts index (1-based) to Marathi ordinal representation:
 * 1 -> १ले दर्शन
 * 2 -> २रे दर्शन
 * 3 -> ३रे दर्शन
 * 4 -> ४थे दर्शन
 * 5 -> ५वे दर्शन
 * ...
 */
export function toMarathiOrdinal(num: number): string {
  const marathiNum = toMarathiNumber(num);
  switch (num) {
    case 1:
      return `${marathiNum}ले`;
    case 2:
      return `${marathiNum}रे`;
    case 3:
      return `${marathiNum}रे`;
    case 4:
      return `${marathiNum}थे`;
    default:
      return `${marathiNum}वे`;
  }
}

/**
 * Converts Manache Ganpati rank (1 to 5) to Marathi title
 * 1 -> १ला मानाचा गणपती
 * 2 -> २रा मानाचा गणपती
 * 3 -> ३रा मानाचा गणपती
 * 4 -> ४था मानाचा गणपती
 * 5 -> ५वा मानाचा गणपती
 */
export function toMarathiManacheRank(rank: number): string {
  const mNum = toMarathiNumber(rank);
  switch (rank) {
    case 1:
      return `${mNum}ला मानाचा गणपती`;
    case 2:
      return `${mNum}रा मानाचा गणपती`;
    case 3:
      return `${mNum}रा मानाचा गणपती`;
    case 4:
      return `${mNum}था मानाचा गणपती`;
    case 5:
      return `${mNum}वा मानाचा गणपती`;
    default:
      return `${mNum}वा मानाचा गणपती`;
  }
}
