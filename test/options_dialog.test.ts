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
    // Clear play history
    playHistory = [];
    // Clear frequency
    lastFrequency = -10;
    // Clear global options
    delete window.__chart2music_options__;
    // Clear dialog, if it's still up
    document.querySelector("dialog")?.close();
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

    expect(document.querySelectorAll("dialog").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "o"
        })
    );
    expect(document.querySelectorAll("dialog").length).toBe(1);

    const lowerRange = document.getElementById(
        "lowerRange"
    ) as HTMLInputElement;
    expect(lowerRange).toHaveProperty("value", "21");
    lowerRange.value = "0";

    document.getElementById("save")?.click();

    expect(document.querySelectorAll("dialog").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    expect(Math.round(lastFrequency)).toBe(49);
});

test("Open Options dialog with custom hertz range and modify a value", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine(),
        options: {
            hertzes: [400, 410, 420, 430, 440, 450, 460]
        }
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
    expect(lastFrequency).toBe(410);

    expect(document.querySelectorAll("dialog").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "o"
        })
    );
    expect(document.querySelectorAll("dialog").length).toBe(1);

    const lowerRange = document.getElementById(
        "lowerRange"
    ) as HTMLInputElement;
    expect(lowerRange).toHaveProperty("value", "0");
    lowerRange.value = "2";

    document.getElementById("save")?.click();

    expect(document.querySelectorAll("dialog").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    expect(Math.round(lastFrequency)).toBe(420);
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

    expect(document.querySelectorAll("dialog").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "o"
        })
    );
    expect(document.querySelectorAll("dialog").length).toBe(1);

    const lowerRange = document.getElementById(
        "lowerRange"
    ) as HTMLInputElement;
    expect(lowerRange).toHaveProperty("value", "21");
    lowerRange.value = "0";

    document.querySelector("dialog")?.dispatchEvent(new Event("blur"));

    expect(document.querySelectorAll("dialog").length).toBe(0);

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

    expect(document.querySelectorAll("dialog").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "o"
        })
    );
    expect(document.querySelectorAll("dialog").length).toBe(1);

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

test("In the Options dialog, modifying one range changes the limits of the other", () => {
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

    expect(document.querySelectorAll("dialog").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "o"
        })
    );
    expect(document.querySelectorAll("dialog").length).toBe(1);

    const lowerRange = document.getElementById(
        "lowerRange"
    ) as HTMLInputElement;
    expect(lowerRange).toHaveProperty("value", "21");
    expect(lowerRange).toHaveProperty("min", "0");
    expect(lowerRange).toHaveProperty("max", "95");
    const upperRange = document.getElementById(
        "upperRange"
    ) as HTMLInputElement;
    expect(upperRange).toHaveProperty("value", "96");
    expect(upperRange).toHaveProperty("min", "22");
    expect(upperRange).toHaveProperty("max", "107");

    lowerRange.value = "30";
    lowerRange.dispatchEvent(new Event("change"));
    expect(upperRange).toHaveProperty("min", "31");

    upperRange.value = "80";
    upperRange.dispatchEvent(new Event("change"));
    expect(lowerRange).toHaveProperty("max", "79");

    document.querySelector("form")?.dispatchEvent(new Event("submit"));

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    expect(lastFrequency).toBeCloseTo(155.56);
});

test("Modifying limits globally impacts other charts", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err: err1, data: chart1 } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine()
    });
    expect(err1).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    expect(Math.round(lastFrequency)).toBe(123);

    expect(document.querySelectorAll("dialog").length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "o"
        })
    );
    expect(document.querySelectorAll("dialog").length).toBe(1);

    const lowerRange = document.getElementById(
        "lowerRange"
    ) as HTMLInputElement;
    expect(lowerRange).toHaveProperty("value", "21");
    lowerRange.value = "0";

    document.getElementById("save")?.click();

    expect(document.querySelectorAll("dialog").length).toBe(0);

    expect(chart1._hertzClamps.lower).toBe(0);

    const mockElement2 = document.createElement("div");
    const { err: err2, data: chart2 } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement2,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine()
    });
    expect(err2).toBe(null);

    mockElement2.dispatchEvent(new Event("focus"));
    expect(chart2._hertzClamps.lower).toBe(0);
});
