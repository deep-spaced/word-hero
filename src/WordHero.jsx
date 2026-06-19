import { useState, useEffect, useRef, useCallback } from "react";
import TitleScreen from "./components/TitleScreen.jsx";
import PlayScreen from "./components/PlayScreen.jsx";
import PauseScreen from "./components/PauseScreen.jsx";
import GameOverScreen from "./components/GameOverScreen.jsx";
import { DIFFICULTY_LEVELS } from "./data/rounds.js";
import { buildLane } from "./utils/game.js";
import styles from "./styles.js";

// screen: "title" | "playing" | "gameOver"
// paused: boolean — only meaningful when screen === "playing"

export default function WordHero() {
  const [screen, setScreen] = useState("title");
  const [paused, setPaused] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [roundIdx, setRoundIdx] = useState(0);
  // roundKey increments whenever a genuinely new round begins (not on pause/resume).
  // This separates "start round" from "restart RAF after resume".
  const [roundKey, setRoundKey] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [falling, setFalling] = useState([]);
  const [feedback, setFeedback] = useState(null); // { id, kind }
  const [speed, setSpeed] = useState(0.18);
  const [countdown, setCountdown] = useState(null); // null | 2 | 1 | "GO!"

  const rafRef = useRef(null);
  const resolvedRef = useRef(false);
  const countdownActiveRef = useRef(false);

  // Refs that mirror state so RAF / event-handler closures never read stale values.
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const fallingRef = useRef([]);
  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;

  const round = difficulty
    ? difficulty.rounds[roundIdx % difficulty.rounds.length]
    : null;

  // ── Start round ──────────────────────────────────────────────────────────
  const startRound = useCallback(() => {
    resolvedRef.current = false;
    countdownActiveRef.current = true;
    const items = buildLane(round);
    fallingRef.current = items;
    setFalling(items);
    setFeedback(null);
    setCountdown(2);
  }, [round]);

  // Fires whenever a new round genuinely begins (not on pause/resume).
  useEffect(() => {
    if (roundKey === 0) return;
    startRound();
  }, [roundKey, startRound]);

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === "GO!") {
      const t = setTimeout(() => {
        setCountdown(null);
        countdownActiveRef.current = false;
      }, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setCountdown((c) => (c === 1 ? "GO!" : c - 1)),
      1000
    );
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Animation loop ────────────────────────────────────────────────────────
  // Bug fix: miss detection runs *outside* a setFalling updater so that
  // setLives and setScreen are never called as side-effects of an updater
  // (React silently drops state updates called from inside another updater).
  useEffect(() => {
    if (screen !== "playing" || paused) return;
    let last = performance.now();

    const tick = (t) => {
      if (!resolvedRef.current && !countdownActiveRef.current) {
        const dt = t - last;
        last = t;
        const next = fallingRef.current.map((w) => ({
          ...w,
          y: w.y + speedRef.current * (dt / 16),
        }));
        fallingRef.current = next;
        setFalling(next);

        // Detect miss here — outside any setState updater.
        if (next.find((w) => w.y >= 100 && w.isAnswer)) {
          resolvedRef.current = true;
          handleMiss();
        }
      } else {
        last = t; // keep last fresh during countdown / resolved states
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);

    // handleMiss is defined below but stable within a given game start;
    // difficulty / lives never change identity mid-game.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, roundKey, paused]);

  // ── Game logic ────────────────────────────────────────────────────────────
  function handleMiss() {
    // Read current lives from ref (not stale closure value).
    const newLives = livesRef.current - 1;
    livesRef.current = newLives;
    setLives(newLives);
    setStreak(0);
    if (newLives <= 0) {
      setTimeout(() => setScreen("gameOver"), 400);
    } else {
      setTimeout(() => advanceRound(), 500);
    }
  }

  function advanceRound() {
    setRoundIdx((i) => i + 1);
    setRoundKey((k) => k + 1);
    setSpeed((s) => {
      const next = Math.min(s + difficultyRef.current.speedStep, 0.5);
      speedRef.current = next;
      return next;
    });
  }

  function handleClick(item) {
    if (resolvedRef.current || countdownActiveRef.current) return;
    if (item.isAnswer) {
      resolvedRef.current = true;
      setFeedback({ id: item.id, kind: "hit" });
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
      setTimeout(() => advanceRound(), 450);
    } else {
      setFeedback({ id: item.id, kind: "wrong" });
      setStreak(0);
      const newLives = livesRef.current - 1;
      livesRef.current = newLives;
      setLives(newLives);
      if (newLives <= 0) {
        resolvedRef.current = true;
        setTimeout(() => setScreen("gameOver"), 400);
      }
    }
  }

  function startGame(difficultyId) {
    const level = DIFFICULTY_LEVELS[difficultyId];
    setDifficulty(level);
    difficultyRef.current = level;
    setScore(0);
    setLives(3);
    livesRef.current = 3;
    setStreak(0);
    setSpeed(level.startSpeed);
    speedRef.current = level.startSpeed;
    setRoundIdx(0);
    setRoundKey((k) => k + 1);
    setPaused(false);
    setScreen("playing");
  }

  function restart() {
    setScore(0);
    setLives(3);
    livesRef.current = 3;
    setStreak(0);
    setRoundIdx(0);
    setRoundKey((k) => k + 1);
    setSpeed(difficultyRef.current.startSpeed);
    speedRef.current = difficultyRef.current.startSpeed;
    setPaused(false);
    setScreen("playing");
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.frame}>
        {screen === "title" && <TitleScreen onStart={startGame} />}

        {screen === "playing" && paused && (
          <PauseScreen
            score={score}
            lives={lives}
            streak={streak}
            onResume={() => setPaused(false)}
            onRestart={restart}
          />
        )}

        {screen === "playing" && !paused && round && (
          <PlayScreen
            round={round}
            falling={falling}
            score={score}
            lives={lives}
            streak={streak}
            feedback={feedback}
            countdown={countdown}
            onClick={handleClick}
            onPause={() => setPaused(true)}
            onRestart={restart}
          />
        )}

        {screen === "gameOver" && (
          <GameOverScreen
            score={score}
            onRestart={() => setScreen("title")}
          />
        )}
      </div>
    </div>
  );
}
