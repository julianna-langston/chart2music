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
    jest.clearAllMocks();
    playHistory = [];
    lastDuration = -10;
    lastFrequency = -10;
    lastPanning = -10;
});

describe("Check panning/frequency/timing", () => {
    describe("Y axis traverses magnitudes", () => {
        test("X: linear, Y: linear", () => {
            const data = [1, 10, 100, 1000, 10000].map((y, x) => {
                return { x, y };
            });
            const mockElement = document.createElement("div");
            const mockElementCC = document.createElement("div");
            const { err, data: chart } = c2mChart({
                type: SUPPORTED_CHART_TYPES.LINE,
                data,
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
                    key: "End",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(50);
            expect(lastPanning).toBe(-0.98);
            expect(Math.round(lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                x: 0,
                y: 1
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(-0.49);
            expect(Math.round(lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                x: 1,
                y: 10
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(0);
            expect(Math.round(lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                x: 2,
                y: 100
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(0.49);
            expect(Math.round(lastFrequency)).toBe(82);
            expect(chart?.currentPoint).toEqual({
                x: 3,
                y: 1000
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(0.98);
            expect(Math.round(lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                x: 4,
                y: 10000
            });
        });

        test("X: linear, Y: log", () => {
            const data = [1, 10, 100, 1000, 10000].map((y, x) => {
                return { x, y };
            });
            const mockElement = document.createElement("div");
            const mockElementCC = document.createElement("div");
            const { err, data: chart } = c2mChart({
                type: SUPPORTED_CHART_TYPES.LINE,
                data,
                axes: {
                    y: {
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
            expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

            mockElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "End",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(50);
            expect(lastPanning).toBe(-0.98);
            expect(Math.round(lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                x: 0,
                y: 1
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(-0.49);
            expect(Math.round(lastFrequency)).toBe(156);
            expect(chart?.currentPoint).toEqual({
                x: 1,
                y: 10
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(0);
            expect(Math.round(lastFrequency)).toBe(466);
            expect(chart?.currentPoint).toEqual({
                x: 2,
                y: 100
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(0.49);
            expect(Math.round(lastFrequency)).toBe(1319);
            expect(chart?.currentPoint).toEqual({
                x: 3,
                y: 1000
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(0.98);
            expect(Math.round(lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                x: 4,
                y: 10000
            });
        });
    });

    describe("X axis traverses magnitudes", () => {
        test("X: linear, Y: linear", () => {
            const data = [1, 10, 100, 1000, 10000].map((x, y) => {
                return { x, y };
            });
            const mockElement = document.createElement("div");
            const mockElementCC = document.createElement("div");
            const { err, data: chart } = c2mChart({
                type: SUPPORTED_CHART_TYPES.LINE,
                data,
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
                    key: "End",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(50);
            expect(lastPanning).toBe(-0.98);
            expect(Math.round(lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                y: 0,
                x: 1
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBeCloseTo(-0.978);
            expect(Math.round(lastFrequency)).toBe(156);
            expect(chart?.currentPoint).toEqual({
                y: 1,
                x: 10
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBeCloseTo(-0.96);
            expect(Math.round(lastFrequency)).toBe(466);
            expect(chart?.currentPoint).toEqual({
                y: 2,
                x: 100
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBeCloseTo(-0.784);
            expect(Math.round(lastFrequency)).toBe(1319);
            expect(chart?.currentPoint).toEqual({
                y: 3,
                x: 1000
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(0.98);
            expect(Math.round(lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                y: 4,
                x: 10000
            });
        });
        test("X: log, Y: linear", () => {
            const data = [1, 10, 100, 1000, 10000].map((x, y) => {
                return { x, y };
            });
            const mockElement = document.createElement("div");
            const mockElementCC = document.createElement("div");
            const { err, data: chart } = c2mChart({
                type: SUPPORTED_CHART_TYPES.LINE,
                data,
                axes: {
                    x: {
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
            expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

            mockElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "End",
                    shiftKey: true
                })
            );
            jest.advanceTimersByTime(50);
            expect(lastPanning).toBe(-0.98);
            expect(Math.round(lastFrequency)).toBe(55);
            expect(chart?.currentPoint).toEqual({
                y: 0,
                x: 1
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(-0.49);
            expect(Math.round(lastFrequency)).toBe(156);
            expect(chart?.currentPoint).toEqual({
                y: 1,
                x: 10
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(0);
            expect(Math.round(lastFrequency)).toBe(466);
            expect(chart?.currentPoint).toEqual({
                y: 2,
                x: 100
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(0.49);
            expect(Math.round(lastFrequency)).toBe(1319);
            expect(chart?.currentPoint).toEqual({
                y: 3,
                x: 1000
            });

            jest.advanceTimersByTime(250);
            expect(lastPanning).toBe(0.98);
            expect(Math.round(lastFrequency)).toBe(3951);
            expect(chart?.currentPoint).toEqual({
                y: 4,
                x: 10000
            });
        });
    });
});
