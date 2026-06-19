import { useState, useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// Word Hero — a phonics-catching arcade game
// Mechanic: a target prompt (rhyme / sound / sight word) is shown at the top.
// Words fall from the sky. The player clicks the falling word that matches
// the prompt before it reaches the ground. Speed increases with level.
// ---------------------------------------------------------------------------

const ROUNDS = [
  // mode: "rhyme" | "sound" | "sight"
  { mode: "rhyme", prompt: "cat", answer: "hat", decoys: ["dog", "sun", "hop"] },
  { mode: "rhyme", prompt: "frog", answer: "log", decoys: ["fish", "tree", "bee"] },
  { mode: "rhyme", prompt: "star", answer: "car", decoys: ["moon", "ship", "kite"] },
  { mode: "sound", prompt: "Starts with /b/", answer: "ball", decoys: ["mat", "sun", "dig"] },
  { mode: "sound", prompt: "Starts with /sh/", answer: "ship", decoys: ["can", "red", "top"] },
  { mode: "sound", prompt: "Ends with /at/", answer: "bat", decoys: ["sun", "log", "pig"] },
  { mode: "sight", prompt: "Find the sight word", answer: "the", decoys: ["teh", "hte", "eth"] },
  { mode: "sight", prompt: "Find the sight word", answer: "said", decoys: ["sayd", "siad", "sed"] },
  { mode: "rhyme", prompt: "moon", answer: "spoon", decoys: ["sock", "leaf", "bug"] },
  { mode: "sound", prompt: "Starts with /tr/", answer: "tree", decoys: ["bee", "cat", "fox"] },
  { mode: "sight", prompt: "Find the sight word", answer: "they", decoys: ["thay", "tehy", "thye"] },
  { mode: "rhyme", prompt: "king", answer: "ring", decoys: ["box", "lamp", "owl"] },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildLane(round) {
  const words = shuffle([round.answer, ...round.decoys]);
  return words.map((w, i) => ({
    id: `${round.answer}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    word: w,
    isAnswer: w === round.answer,
    lane: i,
    y: -10 - i * 6,
  }));
}

const LANES = 4;

export default function WordHero() {
  const [screen, setScreen] = useState("title"); // title | playing | roundClear | gameOver
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [falling, setFalling] = useState([]);
  const [feedback, setFeedback] = useState(null); // {id, kind}
  const [speed, setSpeed] = useState(0.18);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const resolvedRef = useRef(false);

  const round = ROUNDS[roundIdx % ROUNDS.length];

  const startRound = useCallback(() => {
    resolvedRef.current = false;
    setFalling(buildLane(round));
    setFeedback(null);
  }, [round]);

  useEffect(() => {
    if (screen === "playing") startRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, roundIdx]);

  // animation loop
  useEffect(() => {
    if (screen !== "playing") return;
    let last = performance.now();
    const tick = (t) => {
      const dt = t - last;
      last = t;
      setFalling((prev) => {
        if (resolvedRef.current) return prev;
        const next = prev.map((w) => ({ ...w, y: w.y + speed * (dt / 16) }));
        const hitGround = next.find((w) => w.y >= 92 && w.isAnswer);
        const missedAnswer = next.find((w) => w.y >= 100 && w.isAnswer);
        if (missedAnswer && !resolvedRef.current) {
          resolvedRef.current = true;
          handleMiss();
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, speed, roundIdx]);

  function handleMiss() {
    setLives((l) => {
      const nl = l - 1;
      if (nl <= 0) {
        setTimeout(() => setScreen("gameOver"), 400);
      } else {
        setTimeout(() => nextRound(), 500);
      }
      return nl;
    });
    setStreak(0);
  }

  function nextRound() {
    setRoundIdx((i) => i + 1);
    setSpeed((s) => Math.min(s + 0.012, 0.5));
  }

  function handleClick(item) {
    if (resolvedRef.current) return;
    if (item.isAnswer) {
      resolvedRef.current = true;
      setFeedback({ id: item.id, kind: "hit" });
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
      setTimeout(() => nextRound(), 450);
    } else {
      setFeedback({ id: item.id, kind: "wrong" });
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) {
          resolvedRef.current = true;
          setTimeout(() => setScreen("gameOver"), 400);
        }
        return nl;
      });
      setStreak(0);
    }
  }

  function restart() {
    setScore(0);
    setLives(3);
    setStreak(0);
    setSpeed(0.18);
    setRoundIdx(0);
    setScreen("playing");
  }

  return (
    <div style={styles.page}>
      <div style={styles.frame}>
        {screen === "title" && <TitleScreen onStart={() => restart()} />}
        {screen === "playing" && (
          <PlayScreen
            round={round}
            falling={falling}
            score={score}
            lives={lives}
            streak={streak}
            feedback={feedback}
            onClick={handleClick}
          />
        )}
        {screen === "gameOver" && (
          <GameOverScreen score={score} onRestart={restart} />
        )}
      </div>
    </div>
  );
}

function TitleScreen({ onStart }) {
  return (
    <div style={styles.titleWrap}>
      <div style={styles.eyebrow}>A PHONICS CATCHING GAME</div>
      <h1 style={styles.title}>
        Word<span style={{ color: "#E8552E" }}>Hero</span>
      </h1>
      <p style={styles.tagline}>
        Letters fall. You catch the right one. Reading gets faster every round.
      </p>
      <div style={styles.howTo}>
        <div style={styles.howToRow}><span style={styles.howToNum}>1</span> Read the prompt at the top.</div>
        <div style={styles.howToRow}><span style={styles.howToNum}>2</span> Click the falling word that matches.</div>
        <div style={styles.howToRow}><span style={styles.howToNum}>3</span> Miss three times and the run ends.</div>
      </div>
      <button style={styles.bigButton} onClick={onStart}>Start playing</button>
    </div>
  );
}

function PlayScreen({ round, falling, score, lives, streak, feedback, onClick }) {
  return (
    <div style={styles.playWrap}>
      <div style={styles.hud}>
        <div style={styles.hudItem}>
          <div style={styles.hudLabel}>SCORE</div>
          <div style={styles.hudValue}>{score}</div>
        </div>
        <div style={styles.hudItem}>
          <div style={styles.hudLabel}>STREAK</div>
          <div style={styles.hudValue}>{streak}</div>
        </div>
        <div style={styles.hudItem}>
          <div style={styles.hudLabel}>LIVES</div>
          <div style={styles.hudValue}>
            {"●".repeat(Math.max(lives, 0))}
            <span style={{ opacity: 0.25 }}>{"●".repeat(Math.max(3 - lives, 0))}</span>
          </div>
        </div>
      </div>

      <div style={styles.promptBar}>
        <span style={styles.promptKind}>{kindLabel(round.mode)}</span>
        <span style={styles.promptText}>
          {round.mode === "sight" ? round.prompt : `Rhymes / matches: “${round.prompt}”`}
        </span>
      </div>

      <div style={styles.sky}>
        {falling.map((item) => {
          const isFeedback = feedback && feedback.id === item.id;
          const bg = isFeedback
            ? feedback.kind === "hit" ? "#2E7D4F" : "#C13B2A"
            : "#FFFFFF";
          const color = isFeedback ? "#FFF8EC" : "#16213A";
          return (
            <button
              key={item.id}
              onClick={() => onClick(item)}
              style={{
                ...styles.fallingWord,
                left: `${(item.lane / LANES) * 100 + 6}%`,
                top: `${item.y}%`,
                background: bg,
                color,
              }}
            >
              {item.word}
            </button>
          );
        })}
        <div style={styles.groundLine} />
      </div>
    </div>
  );
}

function kindLabel(mode) {
  if (mode === "rhyme") return "RHYME";
  if (mode === "sound") return "SOUND";
  return "SIGHT WORD";
}

function GameOverScreen({ score, onRestart }) {
  return (
    <div style={styles.titleWrap}>
      <div style={styles.eyebrow}>RUN COMPLETE</div>
      <h1 style={styles.title}>Final score: {score}</h1>
      <p style={styles.tagline}>Every round read sharpens the next catch.</p>
      <button style={styles.bigButton} onClick={onRestart}>Play again</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles — ink-on-paper palette: cream page, navy ink, coral accent, leaf green
// for success, brick red for miss. Display face: a bold rounded sans for the
// game's voice; body face: a clean humanist sans for instructions.
// ---------------------------------------------------------------------------

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F4F1EA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Verdana', 'Trebuchet MS', sans-serif",
    padding: 16,
  },
  frame: {
    width: "100%",
    maxWidth: 480,
    height: 720,
    background: "#FFF8EC",
    borderRadius: 24,
    boxShadow: "0 20px 60px rgba(22,33,58,0.18)",
    border: "1px solid #E7DFCD",
    overflow: "hidden",
    position: "relative",
  },
  titleWrap: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 32px",
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.18em",
    color: "#8A7F68",
    fontWeight: 700,
    marginBottom: 12,
  },
  title: {
    fontSize: 44,
    fontWeight: 900,
    color: "#16213A",
    margin: 0,
    lineHeight: 1.05,
  },
  tagline: {
    color: "#5B5546",
    fontSize: 15,
    marginTop: 14,
    maxWidth: 320,
    lineHeight: 1.5,
  },
  howTo: {
    marginTop: 26,
    width: "100%",
    maxWidth: 320,
    textAlign: "left",
  },
  howToRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    color: "#16213A",
    marginBottom: 8,
  },
  howToNum: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#16213A",
    color: "#FFF8EC",
    fontSize: 11,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bigButton: {
    marginTop: 30,
    background: "#E8552E",
    color: "#FFF8EC",
    border: "none",
    borderRadius: 14,
    padding: "14px 32px",
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(232,85,46,0.35)",
  },
  playWrap: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  hud: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 20px 8px",
  },
  hudItem: { textAlign: "center" },
  hudLabel: {
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "#8A7F68",
    fontWeight: 700,
  },
  hudValue: {
    fontSize: 18,
    fontWeight: 800,
    color: "#16213A",
    letterSpacing: 2,
  },
  promptBar: {
    margin: "4px 20px 12px",
    background: "#16213A",
    borderRadius: 12,
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  promptKind: {
    fontSize: 10,
    letterSpacing: "0.14em",
    color: "#E8552E",
    fontWeight: 800,
  },
  promptText: {
    color: "#FFF8EC",
    fontSize: 17,
    fontWeight: 700,
  },
  sky: {
    position: "relative",
    flex: 1,
    margin: "0 12px 12px",
    background:
      "linear-gradient(180deg, #DCEBEF 0%, #EFEAD9 70%, #E7DFCD 100%)",
    borderRadius: 16,
    overflow: "hidden",
  },
  fallingWord: {
    position: "absolute",
    transform: "translateX(-50%)",
    border: "2px solid #16213A",
    borderRadius: 10,
    padding: "8px 14px",
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 4px 0 rgba(22,33,58,0.25)",
    transition: "background 0.15s, color 0.15s",
    minWidth: 64,
  },
  groundLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    background: "#16213A",
  },
};
