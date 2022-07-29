import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import type { AudioEngine } from "../src/audio/";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
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
        playHistory.push({ frequency, panning, duration });
    }
}

beforeEach(() => {
    jest.clearAllMocks();
    playHistory = [];
});

test("C2M: plays sound in monitoring mode (appended: numbers)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        axes: {
            y: {
                minimum: 0
            }
        },
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine(),
        options: {
            live: true
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`Sonified live line chart`);
    expect(mockElementCC.textContent).toContain(`Press M`);

    chart?.appendData(4);
    jest.advanceTimersByTime(250);

    expect(playHistory.length).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "m"
        })
    );
    expect(mockElementCC.textContent).toContain(`Monitoring on`);
    chart?.appendData(6);
    jest.advanceTimersByTime(250);

    expect(playHistory.length).toBe(1);
});

test("C2M provides details for live mixed charts", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: [SUPPORTED_CHART_TYPES.BAND, SUPPORTED_CHART_TYPES.LINE],
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
        axes: {
            y: {
                minimum: 0
            }
        },
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine(),
        options: {
            live: true
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(
        `Sonified live band-line chart`
    );
    expect(mockElementCC.textContent).toContain(`Press M`);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "m"
        })
    );
    expect(mockElementCC.textContent).toContain(`Monitoring on`);

    chart?.appendData({ x: 4, high: 14, low: 7 }, "a");
    jest.advanceTimersByTime(250);

    expect(playHistory.length).toBe(2);

    chart?.appendData({ x: 4, y: 12 }, "b");
    jest.advanceTimersByTime(250);

    expect(playHistory.length).toBe(3);
    expect(lastPanning).toBe(0.98);
    expect(lastFrequency).toBe(1975.533);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "m"
        })
    );
    expect(mockElementCC.textContent).toContain(`Monitoring off`);

    playHistory = [];
    chart?.appendData({ x: 5, y: 12 }, "b");
    jest.advanceTimersByTime(250);

    expect(playHistory.length).toBe(0);
});
