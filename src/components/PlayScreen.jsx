import styles from "../styles.js";
import { kindLabel } from "../utils/game.js";

export default function PlayScreen({
  round,
  falling,
  score,
  lives,
  streak,
  feedback,
  countdown,
  onClick,
  onPause,
  onRestart,
}) {
  return (
    <div style={styles.playWrap}>
      {/* ── HUD ── */}
      <div style={styles.hud}>
        <div style={styles.hudStats}>
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

        <div style={styles.hudActions}>
          <button
            aria-label="Restart game"
            style={styles.hudIconBtn}
            onClick={onRestart}
          >
            ↺
          </button>
          <button
            aria-label="Pause game"
            style={styles.hudIconBtn}
            onClick={onPause}
          >
            ⏸
          </button>
        </div>
      </div>

      {/* ── Prompt bar ── */}
      <div style={styles.promptBar}>
        <span style={styles.promptKind}>{kindLabel(round.mode)}</span>
        <span style={styles.promptText}>
          {round.mode === "sight"
            ? round.prompt
            : `Rhymes / matches: "${round.prompt}"`}
        </span>
      </div>

      {/* ── Sky ── */}
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
              data-testid={item.isAnswer ? "answer-word" : "decoy-word"}
              onClick={() => onClick(item)}
              style={{
                ...styles.fallingWord,
                left: `${item.x}%`,
                top: `${item.y}%`,
                background: bg,
                color,
              }}
            >
              {item.word}
            </button>
          );
        })}

        {countdown !== null && (
          <div style={styles.countdownOverlay}>
            <span style={styles.countdownNum}>{countdown}</span>
          </div>
        )}

        <div style={styles.groundLine} />
      </div>
    </div>
  );
}
