import { useState } from "react";
import styles from "../styles.js";
import { DIFFICULTY_LEVELS, DIFFICULTY_IDS } from "../data/rounds.js";

const DIFFICULTY_ICONS = {
  "early-1": "⭐",
  "early-2": "🌟",
  "explorer": "🚀",
};

export default function TitleScreen({ onStart }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_IDS[0]);

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
        <div style={styles.howToRow}>
          <span style={styles.howToNum}>1</span> Read the prompt at the top.
        </div>
        <div style={styles.howToRow}>
          <span style={styles.howToNum}>2</span> Click the falling word that matches.
        </div>
        <div style={styles.howToRow}>
          <span style={styles.howToNum}>3</span> Miss three times and the run ends.
        </div>
      </div>

      <div style={styles.difficultySection}>
        <div style={styles.difficultyLabel}>CHOOSE YOUR LEVEL</div>
        <div style={styles.difficultyGrid}>
          {DIFFICULTY_IDS.map((id) => {
            const level = DIFFICULTY_LEVELS[id];
            const isSelected = selectedDifficulty === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedDifficulty(id)}
                style={{
                  ...styles.difficultyCard,
                  ...(isSelected ? styles.difficultyCardSelected : {}),
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: isSelected ? "#16213A" : "#C8C0B0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 16,
                    transition: "background 0.15s",
                  }}
                >
                  {DIFFICULTY_ICONS[id] ?? "⭐"}
                </div>
                <div>
                  <span style={styles.difficultyCardTitle}>{level.label}</span>
                  <span style={styles.difficultyCardDesc}>{level.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button style={styles.bigButton} onClick={() => onStart(selectedDifficulty)}>
        Start playing
      </button>
    </div>
  );
}
