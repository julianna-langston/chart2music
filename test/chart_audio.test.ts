import type { AudioEngine } from "../src/audio/AudioEngine";
import { c2mChart } from "../src/sonify";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

let lastDuration = 0;
let lastFrequency = 0;
let lastPanning = 0;

/**
 * Mock audio engine. Built for testing purposes.
 */
class MockAudioEngine implements AudioEngine {
    masterGain: number;

    /**
     * Constructor
     *
     * @param context - the AudioContext
     */
    constructor(context: AudioContext) {
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
    }
}

test("Move around by single events - single line plot", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    new c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        audioEngine: MockAudioEngine
    });

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    [
        {
            key: " ",
            frequency: 55,
            panning: -0.98
        },
        {
            key: "ArrowRight",
            frequency: 185,
            panning: -0.7
        },
        {
            key: "End",
            frequency: 659.25,
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
        expect(lastFrequency).toBe(frequency);
    });
    expect(lastDuration).toBe(0.25);
});

test("Move around by single events - plot with stats", () => {
    jest.spyOn(global, "setTimeout");
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    new c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: {
            a: [
                { x: 1, y: { high: 10, low: 8 } },
                { x: 2, y: { high: 11, low: 9 } },
                { x: 3, y: { high: 12, low: 10 } }
            ],
            b: [
                { x: 1, y: 11 },
                { x: 2, y: 12 },
                { x: 3, y: 13 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        audioEngine: MockAudioEngine
    });

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
    expect(lastFrequency).toBe(185);
    jest.advanceTimersByTime(250);
    expect(lastPanning).toBe(-0.98);
    expect(lastFrequency).toBe(16.35);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowDown"
        })
    );
    expect(setTimeout).toHaveBeenCalledTimes(4);
    jest.advanceTimersByTime(50);
    expect(lastPanning).toBe(-0.98);
    expect(lastFrequency).toBe(185);
    jest.advanceTimersByTime(250);
});
