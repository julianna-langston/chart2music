import type { AudioEngine } from "../src/audio/";
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

let lastDuration = 0;
let lastFrequency = 0;
let lastPanning = 0;
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
        lastDuration = -10;
        lastFrequency = -10;
        lastPanning = -10;
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
        lastPanning = panning;
        lastDuration = duration;
        playHistory.push({ frequency, panning, duration });
    }
}

beforeEach(() => {
    playHistory = [];
    lastDuration = -10;
    lastFrequency = -10;
    lastPanning = -10;
});

test("Move around by single events - single line plot", () => {
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

    [
        {
            key: " ",
            frequency: 82,
            panning: -0.98
        },
        {
            key: "ArrowRight",
            frequency: 220,
            panning: -0.7
        },
        {
            key: "End",
            frequency: 554,
            panning: 0.98
        }
    ].forEach(({ frequency, panning, key }) => {
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key
            })
        );
        jest.advanceTimersByTime(250);
        expect(lastPanning).toBe(panning);
        expect(Math.round(lastFrequency)).toBe(frequency);
    });
    expect(lastDuration).toBe(0.25);
});

test("Move around by single events - plot with stats", () => {
    jest.spyOn(global, "setTimeout");
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: {
            a: [
                { x: 1, high: 10, low: 8 },
                { x: 2, high: 11, low: 9 },
                { x: 3, high: 12, low: 10 }
            ],
            b: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine()
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));
    expect(setTimeout).toHaveBeenCalledTimes(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    // 1 timeout for high, 1 timeout for low, 1 timeout for speech
    expect(setTimeout).toHaveBeenCalledTimes(3);
    jest.advanceTimersByTime(50);
    expect(lastPanning).toBe(-0.98);
    expect(lastFrequency).toBe(220);
    jest.advanceTimersByTime(250);
    expect(lastPanning).toBe(-0.98);
    expect(lastFrequency).toBe(32.7032);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowDown"
        })
    );
    expect(setTimeout).toHaveBeenCalledTimes(4);
    jest.advanceTimersByTime(50);
    expect(lastPanning).toBe(-0.98);
    expect(lastFrequency).toBe(220);
    jest.advanceTimersByTime(250);
});

test("Move around by single events - single line plot", () => {
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

    [
        {
            key: " ",
            frequency: 82,
            panning: -0.98
        },
        {
            key: "ArrowRight",
            frequency: 220,
            panning: -0.7
        },
        {
            key: "End",
            frequency: 554,
            panning: 0.98
        }
    ].forEach(({ frequency, panning, key }) => {
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key
            })
        );
        jest.advanceTimersByTime(250);
        expect(lastPanning).toBe(panning);
        expect(Math.round(lastFrequency)).toBe(frequency);
    });
    expect(lastDuration).toBe(0.25);
});

test("Move around by single events - plot with y and y2", () => {
    jest.spyOn(global, "setTimeout");
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: {
            a: [
                { x: 1, y2: 5 },
                { x: 2, y2: 10 },
                { x: 3, y2: 15 }
            ],
            b: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine()
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));
    expect(setTimeout).toHaveBeenCalledTimes(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    // 1 timeout for high, 1 timeout for low, 1 timeout for speech
    expect(setTimeout).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(250);
    expect(lastPanning).toBe(-0.98);
    expect(lastFrequency).toBe(32.7032);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    expect(setTimeout).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(50);
    expect(lastPanning).toBe(-0.98);
    expect(lastFrequency).toBe(32.7032);
});

test("Move around by single events - candlestick", () => {
    jest.spyOn(global, "setTimeout");
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [
            { x: 1, high: 10, open: 5, close: 5, low: 8 },
            { x: 2, high: 11, open: 5, close: 5, low: 9 },
            { x: 3, high: 12, open: 5, close: 5, low: 10 }
        ],
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine()
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));
    expect(setTimeout).toHaveBeenCalledTimes(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    expect(setTimeout).toHaveBeenCalledTimes(5);
    jest.advanceTimersByTime(250);
    expect(lastPanning).toBe(-0.98);
    expect(lastFrequency).toBe(32.7032);
});

test("Check play", () => {
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

    playHistory = [];

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(2200);
    // All points were played
    expect(playHistory.length).toBe(8);
    expect(playHistory[0].panning).toBe(-0.98);
    expect(playHistory[playHistory.length - 1].panning).toBe(0.98);

    playHistory = [];

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "e"
        })
    );
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Speed, 1000"
    );

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(2200);
    // Only 3 points were played (at 0ms, 1,000ms, and 2,000ms)
    expect(playHistory.length).toBe(3);
    expect(playHistory[0].panning).toBe(0.98);
    expect(playHistory[1].panning).toBeCloseTo(0.699);
    expect(playHistory[2].panning).toBeCloseTo(0.42);

    playHistory = [];

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Control",
            ctrlKey: true
        })
    );
    jest.advanceTimersByTime(2200);
    // No more points were played
    expect(playHistory.length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "q"
        })
    );
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "Speed, 250"
    );
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(2000);
    expect(playHistory.length).toBe(6);
    expect(playHistory[0].panning).toBeCloseTo(0.42);
    expect(playHistory[playHistory.length - 1].panning).toBe(-0.98);
});

test("Check missing data", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, NaN, 3, 0, 4, 5, 4, 3],
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
    jest.advanceTimersByTime(250);
    expect(playHistory.length).toBe(1);
    expect(mockElementCC.textContent).toContain("0, 1");

    playHistory = [];

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("1, missing");
});

test("Out of bounds data", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [0, 1, 2, 3, 4, 5, 6, 7],
        element: mockElement,
        cc: mockElementCC,
        axes: {
            x: {
                minimum: 1,
                maximum: 6
            },
            y: {
                minimum: 2,
                maximum: 5
            }
        },
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
    jest.advanceTimersByTime(250);
    expect(playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("too low, too low");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("1, too low");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(playHistory.length).toBe(1);
    expect(mockElementCC.textContent).toContain("2, 2");

    playHistory = [];

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End"
        })
    );
    jest.advanceTimersByTime(1250);
    expect(playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("too high, too high");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowLeft"
        })
    );
    jest.advanceTimersByTime(1250);
    expect(playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("6, too high");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowLeft"
        })
    );
    jest.advanceTimersByTime(1250);
    expect(playHistory.length).toBe(1);
    expect(mockElementCC.textContent).toContain("5, 5");
});
