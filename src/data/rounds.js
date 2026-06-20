// mode: "rhyme" | "sound" | "sight"

const earlyReader1Rounds = [
  // Rhyme
  { mode: "rhyme", prompt: "cat",  answer: "hat",  decoys: ["dog", "sun", "hop"] },
  { mode: "rhyme", prompt: "dog",  answer: "log",  decoys: ["cat", "hat", "sit"] },
  { mode: "rhyme", prompt: "bug",  answer: "mug",  decoys: ["top", "hen", "rat"] },
  { mode: "rhyme", prompt: "pen",  answer: "hen",  decoys: ["dog", "rat", "cup"] },
  { mode: "rhyme", prompt: "bed",  answer: "red",  decoys: ["top", "cup", "bat"] },
  { mode: "rhyme", prompt: "sit",  answer: "bit",  decoys: ["map", "sun", "hop"] },
  { mode: "rhyme", prompt: "cup",  answer: "pup",  decoys: ["bat", "hen", "log"] },
  { mode: "rhyme", prompt: "top",  answer: "hop",  decoys: ["sun", "bit", "rat"] },
  { mode: "rhyme", prompt: "fan",  answer: "ran",  decoys: ["log", "tip", "bed"] },
  { mode: "rhyme", prompt: "big",  answer: "pig",  decoys: ["hen", "top", "map"] },
  // Sound — initial
  { mode: "sound", prompt: "Starts with /b/", answer: "ball", decoys: ["mat", "sun", "dig"] },
  { mode: "sound", prompt: "Starts with /s/", answer: "sit",  decoys: ["hat", "man", "dog"] },
  { mode: "sound", prompt: "Starts with /m/", answer: "map",  decoys: ["bat", "sun", "cup"] },
  { mode: "sound", prompt: "Starts with /h/", answer: "hop",  decoys: ["cat", "run", "big"] },
  { mode: "sound", prompt: "Starts with /p/", answer: "pot",  decoys: ["cat", "hen", "sun"] },
  { mode: "sound", prompt: "Starts with /t/", answer: "tap",  decoys: ["sun", "big", "hop"] },
  { mode: "sound", prompt: "Starts with /d/", answer: "dip",  decoys: ["bat", "hen", "cup"] },
  { mode: "sound", prompt: "Starts with /f/", answer: "fat",  decoys: ["sit", "log", "mug"] },
  // Sound — final
  { mode: "sound", prompt: "Ends with /at/",  answer: "bat",  decoys: ["sun", "log", "pig"] },
  { mode: "sound", prompt: "Ends with /og/",  answer: "dog",  decoys: ["cat", "pin", "mug"] },
  { mode: "sound", prompt: "Ends with /ip/",  answer: "dip",  decoys: ["bat", "run", "log"] },
  // Sight
  { mode: "sight", prompt: "Find the sight word", answer: "the",  decoys: ["teh", "hte", "eth"] },
  { mode: "sight", prompt: "Find the sight word", answer: "is",   decoys: ["si",  "iz",  "iss"] },
  { mode: "sight", prompt: "Find the sight word", answer: "it",   decoys: ["ti",  "ett", "iit"] },
  { mode: "sight", prompt: "Find the sight word", answer: "and",  decoys: ["adn", "nad", "und"] },
  { mode: "sight", prompt: "Find the sight word", answer: "in",   decoys: ["ni",  "inn", "iin"] },
  { mode: "sight", prompt: "Find the sight word", answer: "on",   decoys: ["no",  "onn", "un"] },
];

const earlyReader2Rounds = [
  // Rhyme
  { mode: "rhyme", prompt: "frog",  answer: "log",   decoys: ["fish", "tree", "bee"] },
  { mode: "rhyme", prompt: "star",  answer: "car",   decoys: ["moon", "ship", "kite"] },
  { mode: "rhyme", prompt: "moon",  answer: "spoon", decoys: ["sock", "leaf", "bug"] },
  { mode: "rhyme", prompt: "king",  answer: "ring",  decoys: ["box", "lamp", "owl"] },
  { mode: "rhyme", prompt: "chair", answer: "bear",  decoys: ["hook", "lamp", "drum"] },
  { mode: "rhyme", prompt: "cake",  answer: "lake",  decoys: ["ship", "frog", "drum"] },
  { mode: "rhyme", prompt: "rain",  answer: "train", decoys: ["clock", "frog", "snap"] },
  { mode: "rhyme", prompt: "bite",  answer: "kite",  decoys: ["drum", "frog", "lamp"] },
  { mode: "rhyme", prompt: "coat",  answer: "boat",  decoys: ["frog", "chip", "ring"] },
  { mode: "rhyme", prompt: "fun",   answer: "run",   decoys: ["cake", "drum", "kite"] },
  // Sound — blends & digraphs
  { mode: "sound", prompt: "Starts with /sh/",  answer: "ship",  decoys: ["can", "red", "top"] },
  { mode: "sound", prompt: "Starts with /tr/",  answer: "tree",  decoys: ["bee", "cat", "fox"] },
  { mode: "sound", prompt: "Starts with /bl/",  answer: "blue",  decoys: ["red", "hat", "cup"] },
  { mode: "sound", prompt: "Starts with /ch/",  answer: "chip",  decoys: ["top", "frog", "drum"] },
  { mode: "sound", prompt: "Starts with /fl/",  answer: "flag",  decoys: ["snap", "drum", "kite"] },
  { mode: "sound", prompt: "Starts with /gr/",  answer: "grab",  decoys: ["frog", "ship", "lamp"] },
  { mode: "sound", prompt: "Starts with /st/",  answer: "step",  decoys: ["drum", "kite", "frog"] },
  { mode: "sound", prompt: "Starts with /sw/",  answer: "swim",  decoys: ["lamp", "frog", "chip"] },
  // Sound — final
  { mode: "sound", prompt: "Ends with /ight/",  answer: "night", decoys: ["moon", "star", "sun"] },
  { mode: "sound", prompt: "Ends with /ong/",   answer: "song",  decoys: ["tree", "ship", "frog"] },
  { mode: "sound", prompt: "Ends with /ack/",   answer: "black", decoys: ["frog", "drum", "kite"] },
  // Sight
  { mode: "sight", prompt: "Find the sight word", answer: "said", decoys: ["sayd", "siad", "sed"] },
  { mode: "sight", prompt: "Find the sight word", answer: "they", decoys: ["thay", "tehy", "thye"] },
  { mode: "sight", prompt: "Find the sight word", answer: "here", decoys: ["heer", "hare", "hear"] },
  { mode: "sight", prompt: "Find the sight word", answer: "was",  decoys: ["waz", "wuz", "whas"] },
  { mode: "sight", prompt: "Find the sight word", answer: "have", decoys: ["haev", "hav", "heav"] },
  { mode: "sight", prompt: "Find the sight word", answer: "come", decoys: ["cum", "kom", "coam"] },
  { mode: "sight", prompt: "Find the sight word", answer: "what", decoys: ["wut", "wat", "waht"] },
  { mode: "sight", prompt: "Find the sight word", answer: "your", decoys: ["yore", "yor", "yoer"] },
];

const wordExplorerRounds = [
  // Rhyme
  { mode: "rhyme", prompt: "breeze",  answer: "freeze",  decoys: ["bright", "cloud", "storm"] },
  { mode: "rhyme", prompt: "glance",  answer: "prance",  decoys: ["shadow", "whisper", "branch"] },
  { mode: "rhyme", prompt: "thought", answer: "brought", decoys: ["through", "though", "trough"] },
  { mode: "rhyme", prompt: "gnome",   answer: "chrome",  decoys: ["plume", "groan", "gloom"] },
  { mode: "rhyme", prompt: "choir",   answer: "fire",    decoys: ["wire", "hire", "mire"] },
  { mode: "rhyme", prompt: "sleigh",  answer: "weigh",   decoys: ["eight", "neigh", "feign"] },
  { mode: "rhyme", prompt: "kneel",   answer: "zeal",    decoys: ["veal", "seal", "feel"] },
  { mode: "rhyme", prompt: "tongue",  answer: "lung",    decoys: ["rung", "sung", "hung"] },
  { mode: "rhyme", prompt: "sword",   answer: "bored",   decoys: ["floored", "poured", "snored"] },
  { mode: "rhyme", prompt: "colonel", answer: "kernel",  decoys: ["channel", "funnel", "tunnel"] },
  // Sound — silent letters & digraphs
  { mode: "sound", prompt: "Starts with /kn/ (silent k)", answer: "knight",   decoys: ["nibble", "nectar", "napkin"] },
  { mode: "sound", prompt: "Starts with /wr/ (silent w)", answer: "wrench",   decoys: ["ranch", "rustle", "ribbon"] },
  { mode: "sound", prompt: "Starts with /ph/ = /f/",      answer: "phantom",  decoys: ["fountain", "feather", "furnace"] },
  { mode: "sound", prompt: "Starts with /ps/ (silent p)", answer: "psyche",   decoys: ["cycle", "siren", "cipher"] },
  { mode: "sound", prompt: "Starts with /gn/ (silent g)", answer: "gnarly",   decoys: ["narrow", "nifty", "noble"] },
  { mode: "sound", prompt: "Starts with /sch/ = /sk/",    answer: "school",   decoys: ["shout", "scone", "scroll"] },
  // Sound — endings
  { mode: "sound", prompt: "Ends with /tion/",   answer: "potion",    decoys: ["pebble", "puzzle", "plunder"] },
  { mode: "sound", prompt: "Ends with /ough/ = /oo/", answer: "through", decoys: ["thorough", "trough", "though"] },
  { mode: "sound", prompt: "Ends with /que/ = /k/",   answer: "unique",  decoys: ["opaque", "antique", "oblique"] },
  { mode: "sound", prompt: "Ends with /mb/ (silent b)", answer: "thumb",  decoys: ["thump", "thud", "thunk"] },
  // Sight / spelling
  { mode: "sight", prompt: "Find the correct spelling", answer: "rhythm",    decoys: ["rythm", "rythym", "rhythym"] },
  { mode: "sight", prompt: "Find the correct spelling", answer: "biscuit",   decoys: ["biscit", "bisquit", "biskit"] },
  { mode: "sight", prompt: "Find the correct spelling", answer: "leopard",   decoys: ["lepard", "leperd", "leoperd"] },
  { mode: "sight", prompt: "Find the correct spelling", answer: "squirrel",  decoys: ["squirel", "squirrell", "skwirrel"] },
  { mode: "sight", prompt: "Find the correct spelling", answer: "necessary", decoys: ["necesary", "neccessary", "nessecary"] },
  { mode: "sight", prompt: "Find the correct spelling", answer: "queue",     decoys: ["que", "kew", "cue"] },
  { mode: "sight", prompt: "Find the correct spelling", answer: "conscience", decoys: ["consience", "conscence", "consscience"] },
  { mode: "sight", prompt: "Find the correct spelling", answer: "guarantee", decoys: ["garantee", "guarentee", "gaurantee"] },
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
