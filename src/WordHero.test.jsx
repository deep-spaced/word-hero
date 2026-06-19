import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within, act, waitFor, fireEvent } from "@testing-library/react";
import WordHero from "./WordHero.jsx";

// rAF/cAF are permanently stubbed in src/test/setup.js so effect teardown
// never throws during component unmount.
// Fake timers here let us skip the 2 s countdown in zero real time.
// fireEvent (sync) is used instead of userEvent to avoid deadlocking
// user-event's internal microtask scheduling under fake timers.
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ── Timer helpers ─────────────────────────────────────────────────────────────
//
// Each countdown step creates the NEXT setTimeout inside a React effect that
// only fires after a re-render. Wrapping each advance in its own `act` call
// flushes React effects between advances so each new timer is registered
// before the next advance runs.

function skipCountdown() {
  act(() => vi.advanceTimersByTime(1000)); // countdown 2 → 1
  act(() => vi.advanceTimersByTime(1000)); // countdown 1 → "GO!"
  act(() => vi.advanceTimersByTime(700));  // "GO!" → null (600 ms + buffer)
}

// After a correct answer: 450 ms delay fires advanceRound, then a new
// countdown begins.
function skipRoundTransition() {
  act(() => vi.advanceTimersByTime(500));  // fire advanceRound (450 ms timeout)
  act(() => vi.advanceTimersByTime(1000)); // countdown 2 → 1
  act(() => vi.advanceTimersByTime(1000)); // countdown 1 → "GO!"
  act(() => vi.advanceTimersByTime(700));  // "GO!" → null
}

// After 3 wrong clicks, skip the 400 ms delay before the game-over screen.
function skipGameOver() {
  act(() => vi.advanceTimersByTime(500));
}

// ── Game helpers ──────────────────────────────────────────────────────────────

function startGame(difficultyLabel = /Early Reader 1/i) {
  render(<WordHero />);
  fireEvent.click(screen.getByText(difficultyLabel).closest("button"));
  fireEvent.click(screen.getByRole("button", { name: /start playing/i }));
  skipCountdown();
}

function clickDecoy() {
  fireEvent.click(screen.getAllByTestId("decoy-word")[0]);
}

// ── Title screen ─────────────────────────────────────────────────────────────

describe("WordHero — title screen", () => {
  it("shows the title screen on mount", () => {
    render(<WordHero />);
    expect(screen.getByText("Word")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start playing/i })).toBeInTheDocument();
  });
});

// ── Screen transitions ────────────────────────────────────────────────────────

describe("WordHero — screen transitions", () => {
  it("transitions to the play screen after starting", () => {
    startGame();
    expect(screen.getByText("SCORE")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /start playing/i })).not.toBeInTheDocument();
  });

  it("transitions to game over after three wrong clicks", () => {
    startGame();
    clickDecoy(); clickDecoy(); clickDecoy();
    skipGameOver();
    expect(screen.getByText("RUN COMPLETE")).toBeInTheDocument();
  });

  it("returns to title screen from game over", () => {
    startGame();
    clickDecoy(); clickDecoy(); clickDecoy();
    skipGameOver();
    fireEvent.click(screen.getByRole("button", { name: /play again/i }));
    expect(screen.getByRole("button", { name: /start playing/i })).toBeInTheDocument();
  });
});

// ── Countdown ─────────────────────────────────────────────────────────────────

describe("WordHero — countdown", () => {
  it("shows 2 immediately after a round starts", () => {
    render(<WordHero />);
    fireEvent.click(screen.getByText(/Early Reader 1/i).closest("button"));
    fireEvent.click(screen.getByRole("button", { name: /start playing/i }));
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("advances to 1 after one second", () => {
    render(<WordHero />);
    fireEvent.click(screen.getByText(/Early Reader 1/i).closest("button"));
    fireEvent.click(screen.getByRole("button", { name: /start playing/i }));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows GO! at 2 seconds", () => {
    render(<WordHero />);
    fireEvent.click(screen.getByText(/Early Reader 1/i).closest("button"));
    fireEvent.click(screen.getByRole("button", { name: /start playing/i }));
    // Two separate acts so each new setTimeout is registered before the next advance.
    act(() => vi.advanceTimersByTime(1000)); // 2 → 1
    act(() => vi.advanceTimersByTime(1000)); // 1 → "GO!"
    expect(screen.getByText("GO!")).toBeInTheDocument();
  });

  it("clears the overlay after 2.6 s", () => {
    render(<WordHero />);
    fireEvent.click(screen.getByText(/Early Reader 1/i).closest("button"));
    fireEvent.click(screen.getByRole("button", { name: /start playing/i }));
    skipCountdown();
    expect(screen.queryByText("GO!")).not.toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });
});

// ── Pause ─────────────────────────────────────────────────────────────────────

describe("WordHero — pause", () => {
  it("shows the pause screen when the pause button is clicked", () => {
    startGame();
    fireEvent.click(screen.getByRole("button", { name: /pause game/i }));
    expect(screen.getByText("PAUSED")).toBeInTheDocument();
  });

  it("shows current score on the pause screen", () => {
    startGame();
    fireEvent.click(screen.getByRole("button", { name: /pause game/i }));
    expect(screen.getByText("SCORE")).toBeInTheDocument();
  });

  it("resumes to the play screen when Resume is clicked", () => {
    startGame();
    fireEvent.click(screen.getByRole("button", { name: /pause game/i }));
    fireEvent.click(screen.getByRole("button", { name: /resume/i }));
    expect(screen.getByRole("button", { name: /pause game/i })).toBeInTheDocument();
    expect(screen.queryByText("PAUSED")).not.toBeInTheDocument();
  });

  it("restarts from the pause screen (score resets to 0)", () => {
    startGame();
    fireEvent.click(screen.getByTestId("answer-word"));
    skipRoundTransition();
    const scoreLabel = screen.getByText("SCORE");
    expect(within(scoreLabel.parentElement).getByText("10")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /pause game/i }));
    fireEvent.click(screen.getByRole("button", { name: /restart/i }));
    skipCountdown();

    const updatedLabel = screen.getByText("SCORE");
    expect(within(updatedLabel.parentElement).getByText("0")).toBeInTheDocument();
  });
});

// ── Restart button in HUD ─────────────────────────────────────────────────────

describe("WordHero — HUD restart button", () => {
  it("resets the score when clicked during play", () => {
    startGame();
    fireEvent.click(screen.getByTestId("answer-word"));
    skipRoundTransition();
    expect(within(screen.getByText("SCORE").parentElement).getByText("10")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /restart game/i }));
    skipCountdown();
    expect(within(screen.getByText("SCORE").parentElement).getByText("0")).toBeInTheDocument();
  });
});

// ── Scoring ───────────────────────────────────────────────────────────────────

describe("WordHero — scoring", () => {
  it("score starts at 0", () => {
    startGame();
    expect(within(screen.getByText("SCORE").parentElement).getByText("0")).toBeInTheDocument();
  });

  it("increments score by 10 when the answer word is clicked", () => {
    startGame();
    fireEvent.click(screen.getByTestId("answer-word"));
    skipRoundTransition();
    expect(within(screen.getByText("SCORE").parentElement).getByText("10")).toBeInTheDocument();
  });
});

// ── Lives (bug regression) ────────────────────────────────────────────────────

describe("WordHero — lives", () => {
  it("starts with 3 lives", () => {
    startGame();
    const values = screen.getAllByText(/●/);
    expect(values.some((el) => el.textContent.startsWith("●●●"))).toBe(true);
  });

  it("decrements to 2 lives after one wrong click", () => {
    startGame();
    clickDecoy();
    // The hudValue div renders: text-node(filled ●s) + <span>(faded ●s).
    // textContent merges both, so we inspect the first child text node directly.
    const livesVal = screen.getByText("LIVES").nextElementSibling;
    expect(livesVal.firstChild.textContent).toBe("●●");
  });

  it("reaches game over after exactly 3 wrong clicks", () => {
    startGame();
    clickDecoy(); clickDecoy(); clickDecoy();
    skipGameOver();
    expect(screen.getByText("RUN COMPLETE")).toBeInTheDocument();
  });

  it("does NOT reach game over after only 2 wrong clicks", () => {
    startGame();
    clickDecoy(); clickDecoy();
    expect(screen.queryByText("RUN COMPLETE")).not.toBeInTheDocument();
    expect(screen.getByText("SCORE")).toBeInTheDocument();
  });
});

// ── Difficulty selection ──────────────────────────────────────────────────────

describe("WordHero — difficulty selection", () => {
  it("can start a game with Early Reader 2", () => {
    startGame(/Early Reader 2/i);
    expect(screen.getByText("SCORE")).toBeInTheDocument();
  });

  it("can start a game with Word Explorer", () => {
    startGame(/Word Explorer/i);
    expect(screen.getByText("SCORE")).toBeInTheDocument();
  });
});
