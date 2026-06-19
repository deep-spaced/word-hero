export const LANES = 4;

// Margin (%) kept on each side of the sky so centred words stay in view.
const EDGE_MARGIN = 8;
const USABLE = 100 - 2 * EDGE_MARGIN;

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildLane(round) {
  const words = shuffle([round.answer, ...round.decoys]);
  const colW = USABLE / words.length;
  return words.map((w, i) => {
    // Random horizontal centre within each column, padded 10 % inside the column.
    const colStart = EDGE_MARGIN + i * colW;
    const x = colStart + colW * 0.1 + Math.random() * colW * 0.8;
    // Random vertical start so all words enter from different heights above sky.
    const y = -(8 + Math.random() * 22);
    return {
      id: `${round.answer}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      word: w,
      isAnswer: w === round.answer,
      x,
      y,
    };
  });
}

export function kindLabel(mode) {
  if (mode === "rhyme") return "RHYME";
  if (mode === "sound") return "SOUND";
  return "SIGHT WORD";
}
