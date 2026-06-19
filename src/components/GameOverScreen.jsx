import styles from "../styles.js";

export default function GameOverScreen({ score, onRestart }) {
  return (
    <div style={styles.titleWrap}>
      <div style={styles.eyebrow}>RUN COMPLETE</div>
      <h1 style={styles.title}>Final score: {score}</h1>
      <p style={styles.tagline}>Every round read sharpens the next catch.</p>
      <button style={styles.bigButton} onClick={onRestart}>
        Play again
      </button>
    </div>
  );
}
