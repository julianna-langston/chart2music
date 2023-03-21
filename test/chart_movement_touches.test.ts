import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import { MockAudioEngine } from "./_mockAudioEngine";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});
const audioEngine = new MockAudioEngine();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - jsdom weirdness
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
window.navigator.__defineGetter__("userAgent", function () {
    return "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Mobile Safari/537.36";
});

beforeEach(() => {
    jest.clearAllMocks();
    audioEngine.reset();
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
    expect(mockElementCC.textContent).toBe(
        `Sonified line chart "", x is "" from 0 to 7, y is "" from 0 to 5. Swipe left or right to navigate. 2 finger swipe left or right to play the rest of the group.`
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
        index: 2,
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
        index: 2,
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
    const { err } = c2mChart({
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
        `Sonified band-line chart "", contains 2 groups, x is "" from 1 to 3, y is "" from 8 to 13. Swipe left or right to navigate. 2 finger swipe left or right to play the rest of the group.`
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
        audioEngine
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    audioEngine.reset();

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
    expect(audioEngine.playCount).toBe(8);
    expect(audioEngine.playHistory[0].panning).toBe(-0.98);
    expect(audioEngine.lastPanning).toBe(0.98);

    audioEngine.reset();
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
    expect(audioEngine.playCount).toBe(3);
    expect(audioEngine.playHistory[0].panning).toBe(0.98);
    expect(audioEngine.playHistory[1].panning).toBeCloseTo(0.699);
    expect(audioEngine.playHistory[2].panning).toBeCloseTo(0.42);

    audioEngine.reset();
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
    expect(audioEngine.playCount).toBe(0);

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
    expect(audioEngine.playCount).toBe(6);
    expect(audioEngine.playHistory[0].panning).toBeCloseTo(0.42);
    expect(audioEngine.lastPanning).toBe(-0.98);
});
