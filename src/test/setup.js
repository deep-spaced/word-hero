import "@testing-library/jest-dom";

// jsdom doesn't provide rAF/cAF. Define them globally so components that use
// the animation loop don't throw during mount or effect teardown in any test.
// The no-op implementation means the loop registers but never ticks — tests
// control time explicitly via vi.advanceTimersByTime instead.
global.requestAnimationFrame = () => 0;
global.cancelAnimationFrame = () => {};
