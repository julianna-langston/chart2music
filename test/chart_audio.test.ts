import { c2mChart } from "../src/c2mChart";
import { hertzes } from "./_constants";
import { MockAudioEngine } from "./_mockAudioEngine";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

const options = { hertzes };
const audioEngine = new MockAudioEngine();

beforeEach(() => {
    jest.clearAllMocks();
    audioEngine.reset();
});

test("Move around by single events - single line plot", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        audioEngine,
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
        expect(audioEngine.lastPanning).toBe(panning);
        expect(Math.round(audioEngine.lastFrequency)).toBe(frequency);
    });
    expect(audioEngine.lastDuration).toBe(0.25);
});

test("Move around by single events - plot with stats", () => {
    jest.spyOn(global, "setTimeout");
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
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
        audioEngine,
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
    expect(audioEngine.lastPanning).toBe(-0.98);
    expect(audioEngine.lastFrequency).toBe(293.6648);
    jest.advanceTimersByTime(250);
    expect(audioEngine.lastPanning).toBe(-0.98);
    expect(audioEngine.lastFrequency).toBe(55);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowDown"
        })
    );
    expect(setTimeout).toHaveBeenCalledTimes(4);
    jest.advanceTimersByTime(50);
    expect(audioEngine.lastPanning).toBe(-0.98);
    expect(audioEngine.lastFrequency).toBe(293.6648);
    jest.advanceTimersByTime(250);
});

test("Move around by single events - single line plot", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        audioEngine,
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
        expect(audioEngine.lastPanning).toBe(panning);
        expect(Math.round(audioEngine.lastFrequency)).toBe(frequency);
    });
    expect(audioEngine.lastDuration).toBe(0.25);
});

test("Move around by single events - plot with y and y2", () => {
    jest.spyOn(global, "setTimeout");
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
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
        audioEngine,
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
    expect(audioEngine.lastPanning).toBe(-0.98);
    expect(audioEngine.lastFrequency).toBe(55);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    expect(setTimeout).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(50);
    expect(audioEngine.lastPanning).toBe(-0.98);
    expect(audioEngine.lastFrequency).toBe(55);
});

test("Move around by single events - candlestick", () => {
    jest.spyOn(global, "setTimeout");
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [
            { x: 1, high: 10, open: 5, close: 5, low: 8 },
            { x: 2, high: 11, open: 5, close: 5, low: 9 },
            { x: 3, high: 12, open: 5, close: 5, low: 10 }
        ],
        element: mockElement,
        cc: mockElementCC,
        audioEngine,
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
    expect(audioEngine.lastPanning).toBe(-0.98);
    expect(audioEngine.lastFrequency).toBe(55);
});

test("Check play", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        audioEngine,
        options
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(2200);
    // All points were played
    expect(audioEngine.playCount).toBe(8);
    expect(audioEngine.playHistory[0].panning).toBe(-0.98);
    expect(audioEngine.lastPanning).toBe(0.98);

    audioEngine.reset();

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
    expect(audioEngine.playCount).toBe(3);
    expect(audioEngine.playHistory[0].panning).toBe(0.98);
    expect(audioEngine.playHistory[1].panning).toBeCloseTo(0.699);
    expect(audioEngine.playHistory[2].panning).toBeCloseTo(0.42);

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Control",
            ctrlKey: true
        })
    );
    jest.advanceTimersByTime(2200);
    // No more points were played
    expect(audioEngine.playHistory.length).toBe(0);

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
    expect(audioEngine.playCount).toBe(6);
    expect(audioEngine.playHistory[0].panning).toBeCloseTo(0.42);
    expect(audioEngine.lastPanning).toBe(-0.98);
});

test("Check play through categories", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
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
            ],
            c: [
                { x: 1, y: 7 },
                { x: 2, y: 8 },
                { x: 3, y: 9 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        audioEngine,
        options
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(2200);
    // All points were played
    expect(audioEngine.playCount).toBe(3);
    expect(audioEngine.playHistory[0].panning).toBe(-0.98);
    expect(audioEngine.playHistory[1].panning).toBe(-0.98);
    expect(audioEngine.playHistory[2].panning).toBe(-0.98);
    expect(audioEngine.playHistory[0].frequency).toBe(55);
    expect(audioEngine.playHistory[1].frequency).toBeCloseTo(1864.65);
    expect(audioEngine.playHistory[2].frequency).toBeCloseTo(466.16);

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageUp",
            shiftKey: true
        })
    );
    jest.advanceTimersByTime(2200);
    // All points were played
    expect(audioEngine.playCount).toBe(3);
    expect(audioEngine.playHistory[0].panning).toBe(-0.98);
    expect(audioEngine.playHistory[1].panning).toBe(-0.98);
    expect(audioEngine.playHistory[2].panning).toBe(-0.98);
    expect(audioEngine.playHistory[0].frequency).toBeCloseTo(466.16);
    expect(audioEngine.playHistory[1].frequency).toBeCloseTo(1864.65);
    expect(audioEngine.playHistory[2].frequency).toBe(55);
});

test("Out of bounds data", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
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
    expect(audioEngine.playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("too low, too low");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(audioEngine.playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("1, too low");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(audioEngine.playHistory.length).toBe(1);
    expect(mockElementCC.textContent).toContain("2, 2");

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End"
        })
    );
    jest.advanceTimersByTime(1250);
    expect(audioEngine.playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("too high, too high");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowLeft"
        })
    );
    jest.advanceTimersByTime(1250);
    expect(audioEngine.playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("6, too high");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowLeft"
        })
    );
    jest.advanceTimersByTime(1250);
    expect(audioEngine.playHistory.length).toBe(1);
    expect(mockElementCC.textContent).toContain("5, 5");
});
