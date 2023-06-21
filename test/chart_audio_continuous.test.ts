import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import { MockAudioEngine } from "./_mockAudioEngine";
import { hertzes } from "./_constants";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

const audioEngine = new MockAudioEngine();
const options = { hertzes };

beforeEach(() => {
    jest.clearAllMocks();
    audioEngine.reset();
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
        audioEngine,
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
    expect(audioEngine.lastPanning).toBe(-0.98);
    expect(audioEngine.playCount).toBe(1);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(100);
    expect(audioEngine.playCount).toBe(2);

    jest.advanceTimersByTime(800);
    expect(audioEngine.playCount).toBe(3);

    jest.advanceTimersByTime(500);
    expect(audioEngine.playCount).toBe(6);

    // Middle of the pause between x=5 and x=10. Shouldn't play anything
    jest.advanceTimersByTime(500);
    expect(audioEngine.playCount).toBe(6);

    jest.advanceTimersByTime(2000);
    expect(audioEngine.playCount).toBe(7);

    audioEngine.reset();
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(100);
    expect(audioEngine.playCount).toBe(1);

    jest.advanceTimersByTime(500);
    expect(audioEngine.playCount).toBe(1);

    jest.advanceTimersByTime(2000);
    expect(audioEngine.playCount).toBe(6);

    audioEngine.reset();
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(100);
    expect(audioEngine.playCount).toBe(1);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Control",
            ctrlKey: true
        })
    );
    jest.advanceTimersByTime(5000);
    expect(audioEngine.playCount).toBe(1);
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
        audioEngine,
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
    expect(audioEngine.playCount).toBe(1);

    jest.advanceTimersByTime(800);
    expect(audioEngine.playCount).toBe(2);

    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(2);

    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(3);

    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(3);

    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(4);

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(1);

    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(2);

    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(2);

    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(2);

    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(2);

    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(3);

    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(3);

    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(4);
});
