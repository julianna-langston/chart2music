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

    mockElement.dispatchEvent(new Event("blur"));
    chart?.appendData(5);
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

test("Test axes min/max adjustment - numbers, no clamps", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: [SUPPORTED_CHART_TYPES.LINE],
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine(),
        options: {
            live: true
        }
    });
    expect(err).toBe(null);

    expect(chart._yAxis.minimum).toBe(1);
    expect(chart._yAxis.maximum).toBe(5);

    chart?.appendData(9);
    expect(chart._yAxis.minimum).toBe(1);
    expect(chart._yAxis.maximum).toBe(9);

    chart?.appendData(3);
    expect(chart._yAxis.minimum).toBe(1);
    expect(chart._yAxis.maximum).toBe(9);

    expect(chart._data[0].length).toBe(7);
    const result1 = chart?.appendData(0);
    expect(chart._data[0].length).toBe(8);
    expect(chart._yAxis.minimum).toBe(0);
    expect(chart._yAxis.maximum).toBe(9);
    expect(result1).not.toBeUndefined();
    expect(result1?.err).toBeNull();

    const result = chart?.appendData(5, "c");
    expect(chart._data[0].length).toBe(8);
    expect(result).not.toBeUndefined();
    expect(result?.err).not.toBeNull();
    expect(result?.err).toContain(`unknown group name "c"`);
    expect(result?.err).toContain(`There are no group names`);
});

test("Test axes min/max adjustment - high/low, no clamps", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: [SUPPORTED_CHART_TYPES.LINE],
        data: [
            {
                x: 1,
                high: 10,
                low: 5
            },
            {
                x: 2,
                high: 11,
                low: 6
            }
        ],
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine(),
        options: {
            live: true
        }
    });
    expect(err).toBe(null);

    expect(chart._yAxis.minimum).toBe(5);
    expect(chart._yAxis.maximum).toBe(11);

    chart?.appendData({
        x: 3,
        high: 12,
        low: 2
    });
    expect(chart._yAxis.minimum).toBe(2);
    expect(chart._yAxis.maximum).toBe(12);
});

test("Test axes min/max adjustment - OHLC, no clamps", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: [SUPPORTED_CHART_TYPES.LINE],
        data: [
            {
                x: 1,
                open: 8,
                close: 8,
                high: 10,
                low: 5
            },
            {
                x: 2,
                high: 11,
                low: 6,
                open: 8,
                close: 8
            }
        ],
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine(),
        options: {
            live: true
        }
    });
    expect(err).toBe(null);

    expect(chart._yAxis.minimum).toBe(5);
    expect(chart._yAxis.maximum).toBe(11);

    chart?.appendData({
        x: 3,
        high: 12,
        low: 2,
        open: 8,
        close: 2
    });
    expect(chart._yAxis.minimum).toBe(2);
    expect(chart._yAxis.maximum).toBe(12);
});

test("Test appending data to a group that doesn't exist", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: [SUPPORTED_CHART_TYPES.LINE],
        data: {
            a: [1, 2, 3, 4],
            b: [1, 2, 3, 4]
        },
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine(),
        options: {
            live: true
        }
    });
    expect(err).toBe(null);
    expect(chart._data[0].length).toBe(4);
    expect(chart._data[1].length).toBe(4);

    const result1 = chart?.appendData(5, "a");
    expect(chart._data[0].length).toBe(5);
    expect(chart._data[1].length).toBe(4);
    expect(result1).not.toBeUndefined();
    expect(result1?.err).toBeNull();

    const result2 = chart?.appendData(5, "b");
    expect(chart._data[0].length).toBe(5);
    expect(chart._data[1].length).toBe(5);
    expect(result2).not.toBeUndefined();
    expect(result2?.err).toBeNull();

    const result3 = chart?.appendData(5, "c");
    expect(chart._data[0].length).toBe(5);
    expect(chart._data[1].length).toBe(5);
    expect(result3).not.toBeUndefined();
    expect(result3?.err).not.toBeNull();
    expect(result3?.err).toContain(`unknown group name "c"`);
    expect(result3?.err).toContain(`Valid groups: a, b`);
});

test("Test appending mismatched data", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: [SUPPORTED_CHART_TYPES.LINE],
        data: {
            a: [1, 2],
            b: [
                {
                    x: 1,
                    open: 8,
                    close: 8,
                    high: 10,
                    low: 5
                },
                {
                    x: 2,
                    high: 11,
                    low: 6,
                    open: 8,
                    close: 8
                }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine(),
        options: {
            live: true
        }
    });
    expect(err).toBe(null);

    const result = chart?.appendData(3, "b");
    expect(result?.err).not.toBeNull();
    expect(result?.err).toBe(
        "Mismatched type error. Trying to add data of type SimpleDataPoint to target data of type OHLCDataPoint."
    );
});
