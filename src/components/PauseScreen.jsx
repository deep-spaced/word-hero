import styles from "../styles.js";

export default function PauseScreen({ score, lives, streak, onResume, onRestart }) {
  return (
    <div style={styles.titleWrap}>
      <div style={styles.eyebrow}>PAUSED</div>
      <h1 style={styles.title}>Take a breath.</h1>
      <p style={styles.tagline}>Your progress is saved. Jump back in whenever you're ready.</p>

      <div style={styles.pauseStats}>
        <div style={styles.pauseStatItem}>
          <div style={styles.pauseStatLabel}>SCORE</div>
          <div style={styles.pauseStatValue}>{score}</div>
        </div>
        <div style={styles.pauseStatItem}>
          <div style={styles.pauseStatLabel}>LIVES</div>
          <div style={styles.pauseStatValue}>
            {"●".repeat(Math.max(lives, 0))}
            <span style={{ opacity: 0.25 }}>{"●".repeat(Math.max(3 - lives, 0))}</span>
          </div>
        </div>
        <div style={styles.pauseStatItem}>
          <div style={styles.pauseStatLabel}>STREAK</div>
          <div style={styles.pauseStatValue}>{streak}</div>
        </div>
      </div>

      <button style={styles.bigButton} onClick={onResume}>
        Resume
      </button>
      <button style={styles.secondaryButton} onClick={onRestart}>
        Restart
      </button>
    </div>
  );
}
