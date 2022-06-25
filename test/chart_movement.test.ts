import { c2mChart } from "../src/sonify";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Move around by single events", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const chart = new c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC
    });
    chart.setOptions({ enableSound: false });

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("1, 2");
    expect(chart.getCurrent()).toStrictEqual({
        group: "",
        point: {
            x: 1,
            y: 2
        }
    });

    // Move left
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowLeft"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("0, 1");

    // Move to end
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("7, 3");

    // Move to home
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("0, 1");

    // Move to max value
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "]"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("5, 5");

    // Move to min value
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "["
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3, 0");
});

test("Movement for a grouped chart", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const chart = new c2mChart({
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
        cc: mockElementCC
    });
    chart.setOptions({ enableSound: false });

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("2, 2");
    expect(chart.getCurrent()).toStrictEqual({
        group: "a",
        point: {
            x: 2,
            y: 2
        }
    });

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "b, 2, 12"
    );
    expect(chart.getCurrent()).toStrictEqual({
        group: "b",
        point: {
            x: 2,
            y: 12
        }
    });

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3, 13");
    expect(chart.getCurrent()).toStrictEqual({
        group: "b",
        point: {
            x: 3,
            y: 13
        }
    });

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageUp"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("a, 3, 3");
    expect(chart.getCurrent()).toStrictEqual({
        group: "a",
        point: {
            x: 3,
            y: 3
        }
    });
});

test("Movement for a chart with stats", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const chart = new c2mChart({
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
        cc: mockElementCC
    });
    chart.setOptions({ enableSound: false });

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "2, 11 - 9"
    );
    expect(chart.getCurrent()).toStrictEqual({
        group: "a",
        point: { x: 2, y: { high: 11, low: 9 } }
    });

    // Move down
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "High, 2, 11"
    );
    expect(chart.getCurrent()).toStrictEqual({
        group: "a",
        point: { x: 2, y: { high: 11, low: 9 } }
    });

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe("3, 12");

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowUp"
        })
    );
    jest.advanceTimersByTime(250);
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
        "All, 3, 12 - 10"
    );
});

// with y2
// with formatting
// enough data to test moveByTenths
