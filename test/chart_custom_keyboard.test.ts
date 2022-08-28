import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

let lastIndex: number | null = null;
let lastSlice: string | null = null;

beforeEach(() => {
    lastIndex = null;
    lastSlice = null;
});

test("Use a custom hotkey", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false,
            customHotkeys: [
                {
                    key: {
                        altKey: true,
                        key: "m"
                    },
                    title: "Extra info",
                    callback: ({ slice, index }) => {
                        lastIndex = index;
                        lastSlice = slice;
                    }
                }
            ]
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "m",
            altKey: true
        })
    );
    expect(lastIndex).toBe(0);
    expect(lastSlice).toBe("");

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "h"
        })
    );
    const helpDialog = document.querySelector("[role='dialog']");
    expect(helpDialog?.querySelector("tr:last-child th")?.textContent).toBe(
        "Extra info"
    );
    expect(helpDialog?.querySelector("tr:last-child td")?.textContent).toBe(
        "Alt+m"
    );
    helpDialog?.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Escape"
        })
    );
    helpDialog?.dispatchEvent(new Event("blur"));
    expect(document.querySelectorAll("[role='dialog']").length).toBe(0);
});

test("Overwrite a hotkey", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false,
            customHotkeys: [
                {
                    key: {
                        key: "Home",
                        shiftKey: true
                    },
                    force: true,
                    title: "Extra info",
                    callback: ({ slice, index }) => {
                        lastIndex = index;
                        lastSlice = slice;
                    }
                }
            ]
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home",
            shiftKey: true
        })
    );
    expect(lastIndex).toBe(0);
    expect(lastSlice).toBe("");
});

test("Fail to overwrite a hotkey", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false,
            customHotkeys: [
                {
                    key: {
                        key: "Home",
                        shiftKey: true
                    },
                    title: "Extra info",
                    callback: ({ slice, index }) => {
                        lastIndex = index;
                        lastSlice = slice;
                    }
                }
            ]
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Home",
            shiftKey: true
        })
    );
    expect(lastIndex).toBe(null);
    expect(lastSlice).toBe(null);
});
