import { describe, it, expect } from "vitest";
import { DIFFICULTY_LEVELS, DIFFICULTY_IDS } from "./rounds.js";

describe("DIFFICULTY_IDS", () => {
  it("includes early-1, early-2, and explorer", () => {
    expect(DIFFICULTY_IDS).toContain("early-1");
    expect(DIFFICULTY_IDS).toContain("early-2");
    expect(DIFFICULTY_IDS).toContain("explorer");
  });
});

describe("DIFFICULTY_LEVELS", () => {
  it.each(DIFFICULTY_IDS)("%s has required metadata fields", (id) => {
    const level = DIFFICULTY_LEVELS[id];
    expect(level).toHaveProperty("id", id);
    expect(level).toHaveProperty("label");
    expect(level).toHaveProperty("description");
    expect(typeof level.startSpeed).toBe("number");
    expect(typeof level.speedStep).toBe("number");
    expect(level.startSpeed).toBeGreaterThan(0);
    expect(level.speedStep).toBeGreaterThan(0);
  });

  it.each(DIFFICULTY_IDS)("%s has at least one round", (id) => {
    expect(DIFFICULTY_LEVELS[id].rounds.length).toBeGreaterThan(0);
  });

  describe("individual round integrity", () => {
    for (const id of DIFFICULTY_IDS) {
      const { rounds } = DIFFICULTY_LEVELS[id];
      rounds.forEach((round, idx) => {
        const label = `${id} round[${idx}] ("${round.answer}")`;

        it(`${label} has a valid mode`, () => {
          expect(["rhyme", "sound", "sight"]).toContain(round.mode);
        });

        it(`${label} has a non-empty prompt`, () => {
          expect(typeof round.prompt).toBe("string");
          expect(round.prompt.length).toBeGreaterThan(0);
        });

        it(`${label} has a non-empty answer`, () => {
          expect(typeof round.answer).toBe("string");
          expect(round.answer.length).toBeGreaterThan(0);
        });

        it(`${label} has exactly 3 decoys`, () => {
          expect(round.decoys).toHaveLength(3);
        });

        it(`${label} answer is not duplicated in decoys`, () => {
          expect(round.decoys).not.toContain(round.answer);
        });

        it(`${label} decoys are all unique`, () => {
          expect(new Set(round.decoys).size).toBe(round.decoys.length);
        });
      });
    }
  });
});
