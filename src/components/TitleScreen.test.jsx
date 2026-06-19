import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TitleScreen from "./TitleScreen.jsx";
import { DIFFICULTY_LEVELS, DIFFICULTY_IDS } from "../data/rounds.js";

describe("TitleScreen", () => {
  it("renders the game title", () => {
    render(<TitleScreen onStart={vi.fn()} />);
    expect(screen.getByText("Word")).toBeInTheDocument();
    expect(screen.getByText("Hero")).toBeInTheDocument();
  });

  it("renders a card for every difficulty level", () => {
    render(<TitleScreen onStart={vi.fn()} />);
    for (const id of DIFFICULTY_IDS) {
      expect(
        screen.getByText(DIFFICULTY_LEVELS[id].label)
      ).toBeInTheDocument();
    }
  });

  it("renders the start button", () => {
    render(<TitleScreen onStart={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /start playing/i })
    ).toBeInTheDocument();
  });

  it("defaults to the first difficulty", async () => {
    const onStart = vi.fn();
    render(<TitleScreen onStart={onStart} />);
    await userEvent.click(screen.getByRole("button", { name: /start playing/i }));
    expect(onStart).toHaveBeenCalledWith(DIFFICULTY_IDS[0]);
  });

  it("passes the selected difficulty id to onStart", async () => {
    const onStart = vi.fn();
    render(<TitleScreen onStart={onStart} />);

    // Pick the second difficulty
    const secondId = DIFFICULTY_IDS[1];
    await userEvent.click(
      screen.getByText(DIFFICULTY_LEVELS[secondId].label)
    );
    await userEvent.click(screen.getByRole("button", { name: /start playing/i }));

    expect(onStart).toHaveBeenCalledWith(secondId);
  });

  it("renders the how-to instructions", () => {
    render(<TitleScreen onStart={vi.fn()} />);
    expect(screen.getByText(/Read the prompt/i)).toBeInTheDocument();
    expect(screen.getByText(/Click the falling word/i)).toBeInTheDocument();
    expect(screen.getByText(/Miss three times/i)).toBeInTheDocument();
  });
});
