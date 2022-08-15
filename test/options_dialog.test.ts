import type { AudioEngine } from "../src/audio";
import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

beforeEach(() => {
    jest.clearAllMocks();
});

/**
 * Info for play history
 */
type playHistoryType = {
    frequency: number;
    panning: number;
    duration: number;
};

let lastFrequency = 0;
let playHistory: playHistoryType[] = [];

/**
 * Mock audio engine. Built for testing purposes.
 */
class MockAudioEngine implements AudioEngine {
    masterGain: number;

    /**
     * Constructor
     */
    constructor() {
        lastFrequency = -10;
    }

    /**
     * The instructions to play a data point. The details are being recorded for the test system.
     *
     * @param frequency - hertz to play
     * @param panning - panning (-1 to 1) to play at
     * @param duration - how long to play
     */
    playDataPoint(frequency: number, panning: number, duration: number): void {
        lastFrequency = frequency;
        playHistory.push({ frequency, panning, duration });
    }
}

beforeEach(() => {
    playHistory = [];
    lastFrequency = -10;
});

test("Open Options dialog and modify a value", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine()
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    expect(Math.round(lastFrequency)).toBe(123);

    expect(document.querySelectorAll("[role='dialog']").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "o"
        })
    );
    expect(document.querySelectorAll("[role='dialog']").length).toBe(1);

    const lowerRange = document.getElementById(
        "lowerRange"
    ) as HTMLInputElement;
    expect(lowerRange).toHaveProperty("value", "21");
    lowerRange.value = "0";

    document.getElementById("save")?.click();

    expect(document.querySelectorAll("[role='dialog']").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    expect(Math.round(lastFrequency)).toBe(49);
});

test("Open Options dialog, modify a value, but esc", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine()
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    expect(Math.round(lastFrequency)).toBe(123);

    expect(document.querySelectorAll("[role='dialog']").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "o"
        })
    );
    expect(document.querySelectorAll("[role='dialog']").length).toBe(1);

    const lowerRange = document.getElementById(
        "lowerRange"
    ) as HTMLInputElement;
    expect(lowerRange).toHaveProperty("value", "21");
    lowerRange.value = "0";

    document.querySelector("[role='dialog']")?.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Escape"
        })
    );

    expect(document.querySelectorAll("[role='dialog']").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    expect(Math.round(lastFrequency)).toBe(123);
});

test("In the Options dialog, the ranges play sounds onChange", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine()
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    expect(playHistory.length).toBe(1);
    expect(lastFrequency).toBeCloseTo(123.47);

    expect(document.querySelectorAll("[role='dialog']").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "o"
        })
    );
    expect(document.querySelectorAll("[role='dialog']").length).toBe(1);

    const lowerRange = document.getElementById(
        "lowerRange"
    ) as HTMLInputElement;
    expect(lowerRange).toHaveProperty("value", "21");
    lowerRange.value = "0";
    lowerRange.dispatchEvent(new Event("change"));
    expect(playHistory.length).toBe(2);
    expect(lastFrequency).toBeCloseTo(16.35);

    const upperRange = document.getElementById(
        "upperRange"
    ) as HTMLInputElement;
    expect(upperRange).toHaveProperty("value", "96");
    upperRange.value = "80";
    upperRange.dispatchEvent(new Event("change"));
    expect(playHistory.length).toBe(3);
    expect(lastFrequency).toBeCloseTo(1661.219);
});
