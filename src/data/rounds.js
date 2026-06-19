// mode: "rhyme" | "sound" | "sight"

const earlyReader1Rounds = [
  { mode: "rhyme",  prompt: "cat",  answer: "hat",  decoys: ["dog", "sun", "hop"] },
  { mode: "rhyme",  prompt: "dog",  answer: "log",  decoys: ["cat", "hat", "sit"] },
  { mode: "rhyme",  prompt: "bug",  answer: "mug",  decoys: ["top", "hen", "rat"] },
  { mode: "sound",  prompt: "Starts with /b/",  answer: "ball", decoys: ["mat", "sun", "dig"] },
  { mode: "sound",  prompt: "Starts with /s/",  answer: "sit",  decoys: ["hat", "man", "dog"] },
  { mode: "sound",  prompt: "Starts with /m/",  answer: "map",  decoys: ["bat", "sun", "cup"] },
  { mode: "sound",  prompt: "Ends with /at/",   answer: "bat",  decoys: ["sun", "log", "pig"] },
  { mode: "sight",  prompt: "Find the sight word", answer: "the",  decoys: ["teh", "hte", "eth"] },
  { mode: "sight",  prompt: "Find the sight word", answer: "is",   decoys: ["si",  "iz",  "iss"] },
  { mode: "sight",  prompt: "Find the sight word", answer: "it",   decoys: ["ti",  "ett", "iit"] },
  { mode: "rhyme",  prompt: "pen",  answer: "hen",  decoys: ["dog", "rat", "cup"] },
  { mode: "sound",  prompt: "Starts with /h/",  answer: "hop",  decoys: ["cat", "run", "big"] },
];

const earlyReader2Rounds = [
  { mode: "rhyme",  prompt: "frog",  answer: "log",   decoys: ["fish", "tree", "bee"] },
  { mode: "rhyme",  prompt: "star",  answer: "car",   decoys: ["moon", "ship", "kite"] },
  { mode: "rhyme",  prompt: "moon",  answer: "spoon", decoys: ["sock", "leaf", "bug"] },
  { mode: "rhyme",  prompt: "king",  answer: "ring",  decoys: ["box", "lamp", "owl"] },
  { mode: "sound",  prompt: "Starts with /sh/",  answer: "ship",  decoys: ["can", "red", "top"] },
  { mode: "sound",  prompt: "Starts with /tr/",  answer: "tree",  decoys: ["bee", "cat", "fox"] },
  { mode: "sound",  prompt: "Starts with /bl/",  answer: "blue",  decoys: ["red", "hat", "cup"] },
  { mode: "sound",  prompt: "Ends with /ight/",  answer: "night", decoys: ["moon", "star", "sun"] },
  { mode: "sight",  prompt: "Find the sight word", answer: "said", decoys: ["sayd", "siad", "sed"] },
  { mode: "sight",  prompt: "Find the sight word", answer: "they", decoys: ["thay", "tehy", "thye"] },
  { mode: "sight",  prompt: "Find the sight word", answer: "here", decoys: ["heer", "hare", "hear"] },
  { mode: "sight",  prompt: "Find the sight word", answer: "was",  decoys: ["waz", "wuz", "whas"] },
];

const wordExplorerRounds = [
  { mode: "rhyme",  prompt: "breeze",  answer: "freeze",  decoys: ["bright", "cloud", "storm"] },
  { mode: "rhyme",  prompt: "glance",  answer: "prance",  decoys: ["shadow", "whisper", "branch"] },
  { mode: "rhyme",  prompt: "thought", answer: "brought", decoys: ["through", "though", "trough"] },
  { mode: "rhyme",  prompt: "gnome",   answer: "chrome",  decoys: ["plume", "groan", "gloom"] },
  { mode: "sound",  prompt: "Starts with /kn/ (silent k)",  answer: "knight",  decoys: ["nibble", "nectar", "napkin"] },
  { mode: "sound",  prompt: "Starts with /wr/ (silent w)",  answer: "wrench",  decoys: ["ranch", "rustle", "ribbon"] },
  { mode: "sound",  prompt: "Starts with /ph/ = /f/",       answer: "phantom", decoys: ["fountain", "feather", "furnace"] },
  { mode: "sound",  prompt: "Ends with /tion/",             answer: "potion",  decoys: ["pebble", "puzzle", "plunder"] },
  { mode: "sight",  prompt: "Find the correct spelling", answer: "rhythm",   decoys: ["rythm", "rythym", "rhythym"] },
  { mode: "sight",  prompt: "Find the correct spelling", answer: "biscuit",  decoys: ["biscit", "bisquit", "biskit"] },
  { mode: "sight",  prompt: "Find the correct spelling", answer: "leopard",  decoys: ["lepard", "leperd", "leoperd"] },
  { mode: "sight",  prompt: "Find the correct spelling", answer: "squirrel", decoys: ["squirel", "squirrell", "skwirrel"] },
];

export const DIFFICULTY_LEVELS = {
  "early-1": {
    id: "early-1",
    label: "Early Reader 1",
    description: "Short words, simple sounds, 3 sight words",
    startSpeed: 0.12,
    speedStep: 0.008,
    rounds: earlyReader1Rounds,
  },
  "early-2": {
    id: "early-2",
    label: "Early Reader 2",
    description: "Blends, longer words, tricky sight words",
    startSpeed: 0.18,
    speedStep: 0.012,
    rounds: earlyReader2Rounds,
  },
  "explorer": {
    id: "explorer",
    label: "Word Explorer",
    description: "Rare words, silent letters, tricky spellings",
    startSpeed: 0.24,
    speedStep: 0.016,
    rounds: wordExplorerRounds,
  },
};

export const DIFFICULTY_IDS = Object.keys(DIFFICULTY_LEVELS);
