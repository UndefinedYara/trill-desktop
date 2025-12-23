export function scoreChord(playedChord: number[], chordFormula: number[]) {
  const playedChordSet = new Set(playedChord);
  const chordFormulaSet = new Set(chordFormula);
  let score = 0;

  //what the formula and the played chord both have
  const matching = [...chordFormulaSet].filter((i) => playedChordSet.has(i));
  //what the formula has but the played chord doesn't have
  const missing = [...chordFormulaSet].filter((i) => !playedChordSet.has(i));
  //what the played chord has that the formula doesn't have
  const extra = [...playedChordSet].filter((i) => !chordFormulaSet.has(i));

  score += matching.length * 10;
  score -= missing.length * 15;
  score -= extra.length * 2;

  //exact match, no missing notes and no extra notes
  if (missing.length === 0 && extra.length === 0) {
    score += 20;
  }

  return score;
}
