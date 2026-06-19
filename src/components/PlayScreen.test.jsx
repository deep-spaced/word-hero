import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayScreen from "./PlayScreen.jsx";

const baseRound = { mode: "rhyme", prompt: "cat", answer: "hat", decoys: ["dog", "sun", "hop"] };

// Items now use x (% horizontal centre) instead of lane.
const baseItems = [
  { id: "a1", word: "hat", isAnswer: true,  x: 10, y: -10 },
  { id: "a2", word: "dog", isAnswer: false, x: 31, y: -16 },
  { id: "a3", word: "sun", isAnswer: false, x: 52, y: -22 },
  { id: "a4", word: "hop", isAnswer: false, x: 73, y: -28 },
];

function renderPlay(overrides = {}) {
  const props = {
    round: baseRound,
    falling: baseItems,
    score: 0,
    lives: 3,
    streak: 0,
    feedback: null,
    countdown: null,
    onClick: vi.fn(),
    onPause: vi.fn(),
    onRestart: vi.fn(),
    ...overrides,
  };
  return { ...render(<PlayScreen {...props} />), onClick: props.onClick, onPause: props.onPause, onRestart: props.onRestart };
}

describe("PlayScreen HUD", () => {
  it("renders the score", () => {
    renderPlay({ score: 42 });
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders the streak", () => {
    renderPlay({ streak: 5 });
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders lives as filled circles", () => {
    renderPlay({ lives: 3 });
    const hudValue = screen.getAllByText(/●/);
    expect(hudValue.length).toBeGreaterThan(0);
  });

  it("renders a pause button", () => {
    renderPlay();
    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
  });

  it("renders a restart button", () => {
    renderPlay();
    expect(screen.getByRole("button", { name: /restart/i })).toBeInTheDocument();
  });

  it("calls onPause when the pause button is clicked", async () => {
    const { onPause } = renderPlay();
    await userEvent.click(screen.getByRole("button", { name: /pause/i }));
    expect(onPause).toHaveBeenCalledOnce();
  });

  it("calls onRestart when the restart button is clicked", async () => {
    const { onRestart } = renderPlay();
    await userEvent.click(screen.getByRole("button", { name: /restart/i }));
    expect(onRestart).toHaveBeenCalledOnce();
  });
});

describe("PlayScreen prompt bar", () => {
  it("shows RHYME label for rhyme mode", () => {
    renderPlay({ round: { ...baseRound, mode: "rhyme" } });
    expect(screen.getByText("RHYME")).toBeInTheDocument();
  });

  it("shows SOUND label for sound mode", () => {
    renderPlay({ round: { ...baseRound, mode: "sound", prompt: "Starts with /b/" } });
    expect(screen.getByText("SOUND")).toBeInTheDocument();
  });

  it("shows SIGHT WORD label for sight mode", () => {
    renderPlay({
      round: { mode: "sight", prompt: "Find the sight word", answer: "the", decoys: ["teh", "hte", "eth"] },
    });
    expect(screen.getByText("SIGHT WORD")).toBeInTheDocument();
  });

  it("renders the prompt text for non-sight mode", () => {
    renderPlay();
    expect(screen.getByText(/Rhymes \/ matches: "cat"/)).toBeInTheDocument();
  });

  it("renders the raw prompt for sight mode", () => {
    renderPlay({
      round: { mode: "sight", prompt: "Find the sight word", answer: "the", decoys: ["teh", "hte", "eth"] },
    });
    expect(screen.getByText("Find the sight word")).toBeInTheDocument();
  });
});

describe("PlayScreen countdown overlay", () => {
  it("shows nothing when countdown is null", () => {
    renderPlay({ countdown: null });
    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.queryByText("GO!")).not.toBeInTheDocument();
  });

  it("shows the countdown number when counting down", () => {
    renderPlay({ countdown: 2 });
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows GO! at the end of the countdown", () => {
    renderPlay({ countdown: "GO!" });
    expect(screen.getByText("GO!")).toBeInTheDocument();
  });
});

describe("PlayScreen falling words", () => {
  it("renders a button for each falling item", () => {
    renderPlay();
    expect(screen.getByRole("button", { name: "hat" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "dog" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "sun" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "hop" })).toBeInTheDocument();
  });

  it("uses item.x for positioning", () => {
    renderPlay();
    const btn = screen.getByRole("button", { name: "hat" });
    expect(btn.style.left).toBe("10%");
  });

  it("calls onClick with the item when a word is clicked", async () => {
    const { onClick } = renderPlay();
    await userEvent.click(screen.getByRole("button", { name: "hat" }));
    expect(onClick).toHaveBeenCalledWith(baseItems[0]);
  });

  it("applies hit feedback colour to the matched item", () => {
    renderPlay({ feedback: { id: "a1", kind: "hit" } });
    const btn = screen.getByRole("button", { name: "hat" });
    expect(btn.style.background).toBe("rgb(46, 125, 79)");
  });

  it("applies wrong feedback colour to the matched item", () => {
    renderPlay({ feedback: { id: "a2", kind: "wrong" } });
    const btn = screen.getByRole("button", { name: "dog" });
    expect(btn.style.background).toBe("rgb(193, 59, 42)");
  });

  it("non-feedback items keep their default white background", () => {
    renderPlay({ feedback: { id: "a1", kind: "hit" } });
    const btn = screen.getByRole("button", { name: "dog" });
    expect(btn.style.background).toBe("rgb(255, 255, 255)");
  });
});
