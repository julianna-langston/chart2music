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

test("Play notification and respond to the 'a' key", () => {
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
            markers: [{ x: 2, label: "My Test" }]
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    expect(audioEngine.playCount).toBe(1);
    expect(audioEngine.notificationCount).toBe(0);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    expect(audioEngine.playCount).toBe(2);
    expect(audioEngine.notificationCount).toBe(1);

    expect(document.querySelectorAll("dialog")).toHaveLength(0);
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "a"
        })
    );
    expect(document.querySelectorAll("dialog")).toHaveLength(1);

    const focusedItem = document.querySelector("dialog li[tabIndex='0']");
    expect(focusedItem).not.toBeUndefined();
    expect(focusedItem?.textContent).toContain("My Test");
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
            markers: [
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
    expect(audioEngine.notificationCount).toBe(3);
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
            markers: [
                { x: 2, label: "My Test 1" },
                { x: 5, label: "My Test 2" },
                { x: 15, label: "My Test 3" }
            ]
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    console.log("start test");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            shiftKey: true,
            key: "End"
        })
    );
    jest.advanceTimersByTime(20000);

    expect(audioEngine.playCount).toBe(8);
    expect(audioEngine.notificationCount).toBe(2);
});
