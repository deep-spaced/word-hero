import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PauseScreen from "./PauseScreen.jsx";

function renderPause(overrides = {}) {
  const props = {
    score: 0,
    lives: 3,
    streak: 0,
    onResume: vi.fn(),
    onRestart: vi.fn(),
    ...overrides,
  };
  return { ...render(<PauseScreen {...props} />), onResume: props.onResume, onRestart: props.onRestart };
}

describe("PauseScreen", () => {
  it("renders the PAUSED eyebrow", () => {
    renderPause();
    expect(screen.getByText("PAUSED")).toBeInTheDocument();
  });

  it("displays the current score", () => {
    renderPause({ score: 42 });
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("displays the current streak", () => {
    renderPause({ streak: 7 });
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("displays lives as filled circles", () => {
    renderPause({ lives: 2 });
    const el = screen.getAllByText(/●/);
    expect(el.length).toBeGreaterThan(0);
  });

  it("renders a Resume button", () => {
    renderPause();
    expect(screen.getByRole("button", { name: /resume/i })).toBeInTheDocument();
  });

  it("renders a Restart button", () => {
    renderPause();
    expect(screen.getByRole("button", { name: /restart/i })).toBeInTheDocument();
  });

  it("calls onResume when Resume is clicked", async () => {
    const { onResume } = renderPause();
    await userEvent.click(screen.getByRole("button", { name: /resume/i }));
    expect(onResume).toHaveBeenCalledOnce();
  });

  it("calls onRestart when Restart is clicked", async () => {
    const { onRestart } = renderPause();
    await userEvent.click(screen.getByRole("button", { name: /restart/i }));
    expect(onRestart).toHaveBeenCalledOnce();
  });
});
