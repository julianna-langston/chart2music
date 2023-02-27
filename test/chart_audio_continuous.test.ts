import type { AudioEngine } from "../src/audio";
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

test("Continuous-mode: Move around by single events - single line plot", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [
            {
                x: 0, // ms: 0
                y: 1
            },
            {
                x: 3, // ms: 750
                y: 2
            },
            {
                x: 4, // ms: 1000
                y: 3
            },
            {
                x: 4.5, // ms: 1125
                y: 0
            },
            {
                x: 5, // ms: 1250
                y: 4
            },
            {
                x: 10, // ms: 2500
                y: 5
            }
        ],
        axes: {
            x: {
                continuous: true,
                minimum: 0,
                maximum: 10
            }
        },
        element: mockElement,
        cc: mockElementCC,
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
    expect(lastPanning).toBe(-0.98);
    expect(playHistory).toHaveLength(1);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(100);
    expect(playHistory).toHaveLength(2);

    jest.advanceTimersByTime(800);
    expect(playHistory).toHaveLength(3);

    jest.advanceTimersByTime(500);
    expect(playHistory).toHaveLength(6);

    // Middle of the pause between x=5 and x=10. Shouldn't play anything
    jest.advanceTimersByTime(500);
    expect(playHistory).toHaveLength(6);

    jest.advanceTimersByTime(2000);
    expect(playHistory).toHaveLength(7);

    playHistory = [];
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(100);
    expect(playHistory).toHaveLength(1);

    jest.advanceTimersByTime(500);
    expect(playHistory).toHaveLength(1);

    jest.advanceTimersByTime(2000);
    expect(playHistory).toHaveLength(6);

    playHistory = [];
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(100);
    expect(playHistory).toHaveLength(1);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Control",
            ctrlKey: true
        })
    );
    jest.advanceTimersByTime(5000);
    expect(playHistory).toHaveLength(1);
});

// grouped line plot
// line plot with time

// band plot
// boxplot
// candlestick

test("C2M sorts out-of-order scatter plot data", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.SCATTER,
        data: [
            {
                x: 123, // ms: 1000
                y: 5
            },
            {
                x: 12, // ms: 0
                y: 10
            },
            {
                x: 123456, // ms: 5000
                y: 8
            },
            {
                x: 12345, // ms: 4000
                y: 9
            }
        ],
        axes: {
            x: {
                continuous: true,
                type: "log10"
            }
        },
        element: mockElement,
        cc: mockElementCC,
        audioEngine: new MockAudioEngine(),
        options
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(
        `x is "" from 12 to 123456 logarithmic continuously`
    );

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(1);

    jest.advanceTimersByTime(800);
    expect(playHistory).toHaveLength(2);

    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(2);

    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(3);

    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(3);

    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(4);

    playHistory = [];

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(1);

    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(2);

    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(2);

    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(2);

    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(2);

    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(3);

    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(3);

    jest.advanceTimersByTime(250);
    expect(playHistory).toHaveLength(4);
});
