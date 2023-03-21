import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import { MockAudioEngine } from "./_mockAudioEngine";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});
const audioEngine = new MockAudioEngine();

beforeEach(() => {
    jest.clearAllMocks();
    audioEngine.reset();
});

test("Check missing data - simple data point", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, NaN, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        audioEngine
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
    expect(audioEngine.playHistory.length).toBe(1);
    expect(mockElementCC.textContent).toContain("0, 1");

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(audioEngine.playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("1, missing");
});

test("Check missing data - with y2", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: {
            a: [
                { x: 1, y2: 2 },
                { x: 2, y2: NaN },
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
        audioEngine
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
    expect(audioEngine.playHistory.length).toBe(1);
    expect(mockElementCC.textContent).toContain("1, 2");

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(audioEngine.playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("2, missing");
});

test("Check missing data - with HighLow", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: {
            a: [
                { x: 1, high: 10, low: 8 },
                { x: 2, high: NaN, low: 9 },
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
        audioEngine
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
    expect(audioEngine.playHistory.length).toBe(2);
    expect(mockElementCC.textContent).toContain("a, All, 1, 10 - 8");

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(audioEngine.playHistory.length).toBe(1);
    expect(mockElementCC.textContent).toContain("2, missing");

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(audioEngine.playHistory.length).toBe(0);
    expect(mockElementCC.textContent).toContain("High, 2, missing");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(audioEngine.playHistory.length).toBe(1);
    expect(mockElementCC.textContent).toContain("Low, 2, 9");
});
