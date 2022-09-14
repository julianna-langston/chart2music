import type { AudioEngine } from "../src/audio/";
import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

const options = {
    hertzes: [
        55,
        58.27047,
        61.73541, // octave 1
        65.40639,
        69.29566,
        73.41619,
        77.78175,
        82.40689,
        87.30706,
        92.49861,
        97.99886,
        103.8262,
        110,
        116.5409,
        123.4708, // octave 2
        130.8128,
        138.5913,
        146.8324,
        155.5635,
        164.8138,
        174.6141,
        184.9972,
        195.9977,
        207.6523,
        220,
        233.0819,
        246.9417, // octave 3
        261.6256,
        277.1826,
        293.6648,
        311.127,
        329.6276,
        349.2282,
        369.9944,
        391.9954,
        415.3047,
        440,
        466.1638,
        493.8833, // octave 4
        523.2511,
        554.3653,
        587.3295,
        622.254,
        659.2551,
        698.4565,
        739.9888,
        783.9909,
        830.6094,
        880,
        932.3275,
        987.7666, // octave 5
        1046.502,
        1108.731,
        1174.659,
        1244.508,
        1318.51,
        1396.913,
        1479.978,
        1567.982,
        1661.219,
        1760,
        1864.655,
        1975.533, // octave 6
        2093.005,
        2217.461,
        2349.318,
        2489.016,
        2637.02,
        2793.826,
        2959.955,
        3135.963,
        3322.438,
        3520,
        3729.31,
        3951.066, // octave 7
        4186.009
    ]
};

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
        audioEngine: new MockAudioEngine(),
        options
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    [
        {
            key: " ",
            frequency: 123,
            panning: -0.98
        },
        {
            key: "ArrowRight",
            frequency: 294,
            panning: -0.7
        },
        {
            key: "End",
            frequency: 698,
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
        audioEngine: new MockAudioEngine(),
        options
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
    expect(lastFrequency).toBe(293.6648);
    jest.advanceTimersByTime(250);
    expect(lastPanning).toBe(-0.98);
    expect(lastFrequency).toBe(55);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowDown"
        })
    );
    expect(setTimeout).toHaveBeenCalledTimes(4);
    jest.advanceTimersByTime(50);
    expect(lastPanning).toBe(-0.98);
    expect(lastFrequency).toBe(293.6648);
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
        audioEngine: new MockAudioEngine(),
        options
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    [
        {
            key: " ",
            frequency: 123,
            panning: -0.98
        },
        {
            key: "ArrowRight",
            frequency: 294,
            panning: -0.7
        },
        {
            key: "End",
            frequency: 698,
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
        audioEngine: new MockAudioEngine(),
        options
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
    expect(lastFrequency).toBe(55);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    expect(setTimeout).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(50);
    expect(lastPanning).toBe(-0.98);
    expect(lastFrequency).toBe(55);
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
        audioEngine: new MockAudioEngine(),
        options
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
    expect(lastFrequency).toBe(55);
});

test("Check play", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine(),
        options
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
        audioEngine: new MockAudioEngine(),
        options
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
