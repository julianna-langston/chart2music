import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import type { AudioEngine } from "../src/audio/";

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

test("Move around by single events", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    // Move right
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 400,
                    clientY: 100
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(300);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 2");

    // Move left
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 1,
                    clientX: 400,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 1,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(350);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("0, 1");
});

test("Movement for a grouped chart", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err, data: chart } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: {
            a: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ],
            b: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    // Move right
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 400,
                    clientY: 100
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(350);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("2, 2");

    // Next category
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 1,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 150,
                    clientY: 400
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 1,
                    clientX: 150,
                    clientY: 400
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(350);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "b, 2, 12"
    );

    // Move right
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 400,
                    clientY: 100
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(350);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3, 13");
    expect(chart?.getCurrent()).toStrictEqual({
        group: "b",
        stat: "",
        point: {
            x: 3,
            y: 13
        }
    });

    // Previous category
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 400
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 1,
                    clientX: 100,
                    clientY: 400
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 150,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 1,
                    clientX: 150,
                    clientY: 100
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(350);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("a, 3, 3");
    expect(chart?.getCurrent()).toStrictEqual({
        group: "a",
        stat: "",
        point: {
            x: 3,
            y: 3
        }
    });
});

test("Movement for a chart with stats", () => {
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
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toBe(
        `Sonified band-line chart "", contains 2 categories, x is "" from 1 to 3, y is "" from 8 to 13. Use arrow keys to navigate. Press H for more hotkeys.`
    );

    // Move right
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 400,
                    clientY: 100
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(350);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "2, 11 - 9"
    );

    // Move down
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 150,
                    clientY: 400
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(350);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "High, 2, 11"
    );

    // Move right
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 400,
                    clientY: 100
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(350);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3, 12");

    // Previous stat
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 400
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(350);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "All, 3, 12 - 10"
    );
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
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 150
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 1,
                    clientX: 100,
                    clientY: 150
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 400,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 1,
                    clientX: 400,
                    clientY: 100
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(2200);
    // All points were played
    expect(playHistory.length).toBe(8);
    expect(playHistory[0].panning).toBe(-0.98);
    expect(playHistory[playHistory.length - 1].panning).toBe(0.98);

    playHistory = [];
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 400,
                    clientY: 150
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 1,
                    clientX: 400,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 150
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 1,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(700);
    // Only 3 points were played (at 0ms, 250ms, and 500ms)
    expect(playHistory.length).toBe(3);
    expect(playHistory[0].panning).toBe(0.98);
    expect(playHistory[1].panning).toBeCloseTo(0.699);
    expect(playHistory[2].panning).toBeCloseTo(0.42);

    playHistory = [];
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 400,
                    clientY: 150
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 400,
                    clientY: 150
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(2200);
    // No more points were played
    expect(playHistory.length).toBe(0);

    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 0,
                    clientX: 400,
                    clientY: 150
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchstart", {
            targetTouches: [
                {
                    identifier: 1,
                    clientX: 400,
                    clientY: 100
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 0,
                    clientX: 100,
                    clientY: 150
                } as Touch
            ]
        })
    );
    mockElement.dispatchEvent(
        new TouchEvent("touchend", {
            changedTouches: [
                {
                    identifier: 1,
                    clientX: 100,
                    clientY: 100
                } as Touch
            ]
        })
    );
    jest.advanceTimersByTime(2000);
    expect(playHistory.length).toBe(6);
    expect(playHistory[0].panning).toBeCloseTo(0.42);
    expect(playHistory[playHistory.length - 1].panning).toBe(-0.98);
});
