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
    // Clear dialog, if it's still up
    document.querySelector("dialog")?.close();
});

test("Play notification and respond to announce commands", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5, 6, 7, 8],
        element: mockElement,
        cc: mockElementCC,
        audioEngine,
        options,
        info: {
            annotations: [{ x: 2, label: "My Test" }]
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(1);
    expect(audioEngine.notificationCount).toBe(0);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("0, 1");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(1);
    expect(audioEngine.notificationCount).toBe(1);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("My Test");
});

test("Play All plays notifications (continuous mode)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.SCATTER,
        data: [1, 2, 3, 4, 5, 6, 7, 8],
        element: mockElement,
        cc: mockElementCC,
        audioEngine,
        options,
        info: {
            annotations: [
                { x: 2, label: "My Test 1" },
                { x: 5, label: "My Test 2" },
                { x: 15, label: "My Test 3" }
            ]
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            shiftKey: true,
            key: "End"
        })
    );
    jest.advanceTimersByTime(30000);

    expect(audioEngine.playCount).toBe(8);
    // Plays 2 (x = 2 and x = 5). Doesn't play X = 15 because that's beyond the data range.
    expect(audioEngine.notificationCount).toBe(2);

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            shiftKey: true,
            key: "Home"
        })
    );
    jest.advanceTimersByTime(20000);

    expect(audioEngine.playCount).toBe(8);
    expect(audioEngine.notificationCount).toBe(2);
});

test("Play All plays notifications (non-continuous mode)", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5, 6, 7, 8],
        element: mockElement,
        cc: mockElementCC,
        audioEngine,
        options,
        info: {
            annotations: [
                { x: 2, label: "My Test 1" },
                { x: 5, label: "My Test 2" },
                { x: 15, label: "My Test 3" }
            ]
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            shiftKey: true,
            key: "End"
        })
    );
    jest.advanceTimersByTime(20000);

    expect(audioEngine.playCount).toBe(8);
    expect(audioEngine.notificationCount).toBe(2);

    audioEngine.reset();

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            shiftKey: true,
            key: "Home"
        })
    );
    jest.advanceTimersByTime(20000);

    expect(audioEngine.playCount).toBe(8);
    expect(audioEngine.notificationCount).toBe(2);
});
