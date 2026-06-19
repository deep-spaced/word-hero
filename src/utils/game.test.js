import { describe, it, expect } from "vitest";
import { shuffle, buildLane, kindLabel, LANES } from "./game.js";

describe("LANES", () => {
  it("is 4", () => {
    expect(LANES).toBe(4);
  });
});

describe("shuffle", () => {
  it("returns an array with the same elements", () => {
    const input = ["a", "b", "c", "d"];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual([...input].sort());
  });

  it("does not mutate the original array", () => {
    const input = ["a", "b", "c"];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it("produces different orderings across many runs", () => {
    const input = [1, 2, 3, 4, 5, 6];
    const results = new Set(
      Array.from({ length: 40 }, () => shuffle(input).join(","))
    );
    expect(results.size).toBeGreaterThan(1);
  });
});

describe("buildLane", () => {
  const round = { answer: "hat", decoys: ["dog", "sun", "hop"] };

  it("returns one item per word (answer + decoys)", () => {
    const items = buildLane(round);
    expect(items).toHaveLength(4);
  });

  it("includes all words from the round", () => {
    const items = buildLane(round);
    const words = items.map((i) => i.word);
    expect(words).toContain("hat");
    expect(words).toContain("dog");
    expect(words).toContain("sun");
    expect(words).toContain("hop");
  });

  it("marks only the answer with isAnswer=true", () => {
    const items = buildLane(round);
    const answers = items.filter((i) => i.isAnswer);
    expect(answers).toHaveLength(1);
    expect(answers[0].word).toBe("hat");
  });

  it("assigns unique IDs to every item", () => {
    const items = buildLane(round);
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps all x positions within the visible sky (8–92 %)", () => {
    // Run multiple times to cover random variation.
    for (let run = 0; run < 20; run++) {
      buildLane(round).forEach((item) => {
        expect(item.x).toBeGreaterThanOrEqual(8);
        expect(item.x).toBeLessThanOrEqual(92);
      });
    }
  });

  it("places words in distinct horizontal columns so they don't overlap", () => {
    // Each of the 4 columns spans USABLE/4 = 21 %; words sit within the inner
    // 80 % of their column, so adjacent words can come as close as ~4.2 %.
    // Assert a gap that is always satisfied by the geometry but still proves
    // the words occupy separate columns.
    for (let run = 0; run < 50; run++) {
      const items = buildLane(round);
      const xs = items.map((i) => i.x).sort((a, b) => a - b);
      for (let i = 1; i < xs.length; i++) {
        expect(xs[i] - xs[i - 1]).toBeGreaterThan(4);
      }
    }
  });

  it("starts all words above the visible sky (y < 0)", () => {
    buildLane(round).forEach((item) => expect(item.y).toBeLessThan(0));
  });

  it("staggers starting y positions (not all identical)", () => {
    for (let run = 0; run < 10; run++) {
      const ys = new Set(buildLane(round).map((i) => i.y));
      expect(ys.size).toBeGreaterThan(1);
    }
  });

  it("no longer produces a lane property", () => {
    buildLane(round).forEach((item) => {
      expect(item).not.toHaveProperty("lane");
    });
  });
});

describe("kindLabel", () => {
  it("returns RHYME for rhyme mode", () => {
    expect(kindLabel("rhyme")).toBe("RHYME");
  });

  it("returns SOUND for sound mode", () => {
    expect(kindLabel("sound")).toBe("SOUND");
  });

  it("returns SIGHT WORD for sight mode", () => {
    expect(kindLabel("sight")).toBe("SIGHT WORD");
  });

  it("returns SIGHT WORD for any unknown mode", () => {
    expect(kindLabel("other")).toBe("SIGHT WORD");
  });
});
