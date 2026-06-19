import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameOverScreen from "./GameOverScreen.jsx";

describe("GameOverScreen", () => {
  it("renders the RUN COMPLETE eyebrow", () => {
    render(<GameOverScreen score={0} onRestart={vi.fn()} />);
    expect(screen.getByText("RUN COMPLETE")).toBeInTheDocument();
  });

  it("displays the final score", () => {
    render(<GameOverScreen score={42} onRestart={vi.fn()} />);
    expect(screen.getByText(/42/)).toBeInTheDocument();
  });

  it("renders a play again button", () => {
    render(<GameOverScreen score={0} onRestart={vi.fn()} />);
    expect(screen.getByRole("button", { name: /play again/i })).toBeInTheDocument();
  });

  it("calls onRestart when play again is clicked", async () => {
    const onRestart = vi.fn();
    render(<GameOverScreen score={10} onRestart={onRestart} />);
    await userEvent.click(screen.getByRole("button", { name: /play again/i }));
    expect(onRestart).toHaveBeenCalledOnce();
  });
});
