import { c2mChart } from "../src/c2mChart";

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
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            enableSound: false,
            customHotkeys: [
                {
                    key: {
                        key: "p"
                    },
                    order: 8,
                    callback: ({ slice, index }) => {
                        lastIndex = index;
                        lastSlice = slice;
                    }
                },
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
    const helpDialog = document.querySelector("dialog");
    expect(helpDialog?.querySelector("tbody tr:last-child td:nth-child(1)")?.textContent).toBe(
        "Extra info"
    );
    expect(helpDialog?.querySelector("tbody tr:last-child td:nth-child(2)")?.textContent).toBe(
        "Alt+m"
    );

    expect(helpDialog?.open).toBe(true);
    const closeButton = helpDialog?.querySelector("button");
    closeButton?.click();
    expect(helpDialog?.open).toBe(false);
});

test("Overwrite a hotkey", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
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
        type: "line",
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
