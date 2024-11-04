import { c2mChart } from "../src/c2mChart";

const defaultFrontMatter =
    "You can use the below keyboard shortcuts to navigate this chart more quickly. Please note, on some computers, the keys that you need to press may be called something else than what is listed below or may be emulated by a combination of keys. For example, on Apple keyboards without a physical home key, you can press the function key and the left arrow key at the same time to perform the same action. When possible, common alternate keyboard shortcuts will be provided in the below table.";
const defaultHeading = "Keyboard Manager";
const defaultTableHeadings = [
    "Keyboard Shortcut",
    "Description",
    "Common Alternate Keyboard Shortcut"
];
const defaultFirstRowValues = ["Move to next point", "Right arrow", ""];

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    // Clear dialog, if it's still up
    document.querySelector("dialog")?.remove();
});

test("Open Help dialog and confirm content", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "h"
        })
    );

    const helpDialog = document.querySelector("dialog");
    expect(helpDialog?.open).toBe(true);

    expect(helpDialog?.querySelector("h1")?.textContent).toBe(defaultHeading);

    expect(helpDialog?.querySelector("p")?.textContent).toBe(
        defaultFrontMatter
    );

    expect(
        Array.from(helpDialog?.querySelectorAll("th") ?? []).map(
            (th) => th.textContent
        )
    ).toEqual(defaultTableHeadings);

    expect(
        Array.from(
            helpDialog?.querySelectorAll("tbody tr:nth-child(1) td") ?? []
        ).map((th) => th.textContent)
    ).toEqual(defaultFirstRowValues);
    expect(
        Array.from(
            helpDialog?.querySelectorAll("tbody tr:nth-child(6) td") ?? []
        ).map((th) => th.textContent)
    ).toEqual([
        "Play to left edge of chart",
        "Shift + Home",
        "Shift + Function + Left arrow"
    ]);
});

test("Use the modifyHelpDialogText callback", () => {
    const customFrontMatter = "Testing Testing 1 2 3";
    const mockCallback = jest.fn(() => customFrontMatter);

    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            modifyHelpDialogText: mockCallback
        }
    });
    expect(err).toBe(null);

    expect(mockCallback).toHaveBeenCalledTimes(0);
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "h"
        })
    );

    const helpDialog = document.querySelector("dialog");
    expect(helpDialog?.open).toBe(true);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenLastCalledWith("en", defaultFrontMatter);

    expect(helpDialog?.querySelector("h1")?.textContent).toBe(defaultHeading);

    expect(helpDialog?.querySelector("p")?.textContent).toBe(customFrontMatter);

    expect(
        Array.from(helpDialog?.querySelectorAll("th") ?? []).map(
            (th) => th.textContent
        )
    ).toEqual(defaultTableHeadings);

    expect(
        Array.from(
            helpDialog?.querySelectorAll("tbody tr:nth-child(1) td") ?? []
        ).map((th) => th.textContent)
    ).toEqual(defaultFirstRowValues);
});

test("Use the modifyHelpDialogKeyboardListing callback", () => {
    const customListing = [
        ["A", "B", "C"],
        ["D", "E", "F"]
    ];
    const mockCallback = jest.fn(() => customListing);

    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            modifyHelpDialogKeyboardListing: mockCallback
        }
    });
    expect(err).toBe(null);

    expect(mockCallback).toHaveBeenCalledTimes(0);
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "h"
        })
    );

    const helpDialog = document.querySelector("dialog");
    expect(helpDialog?.open).toBe(true);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    expect(helpDialog?.querySelector("h1")?.textContent).toBe(defaultHeading);

    expect(
        Array.from(helpDialog?.querySelectorAll("th") ?? []).map(
            (th) => th.textContent
        )
    ).toEqual(customListing.at(0));

    expect(helpDialog?.querySelectorAll("tbody tr")).toHaveLength(1);

    expect(
        Array.from(
            helpDialog?.querySelectorAll("tbody tr:nth-child(1) td") ?? []
        ).map((th) => th.textContent)
    ).toEqual(customListing.at(1));
});

test("Handle empty array for the modifyHelpDialogKeyboardListing callback", () => {
    const customListing: string[][] = [];
    const mockCallback = jest.fn(() => customListing);

    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            modifyHelpDialogKeyboardListing: mockCallback
        }
    });
    expect(err).toBe(null);

    expect(mockCallback).toHaveBeenCalledTimes(0);
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "h"
        })
    );

    const helpDialog = document.querySelector("dialog");
    expect(helpDialog?.open).toBe(true);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    expect(helpDialog?.querySelector("h1")?.textContent).toBe(defaultHeading);

    expect(helpDialog?.querySelectorAll("th")).toHaveLength(0);
    expect(helpDialog?.querySelectorAll("tbody tr")).toHaveLength(0);
});

test("Handle only headings returned in the modifyHelpDialogKeyboardListing callback", () => {
    const mockCallback = jest.fn((lang, headers: string[]) => [headers]);

    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
        data: [1, 2, 3, 0, 4, 5, 4, 3],
        element: mockElement,
        cc: mockElementCC,
        options: {
            modifyHelpDialogKeyboardListing: mockCallback
        }
    });
    expect(err).toBe(null);

    expect(mockCallback).toHaveBeenCalledTimes(0);
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "h"
        })
    );

    const helpDialog = document.querySelector("dialog");
    expect(helpDialog?.open).toBe(true);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    expect(helpDialog?.querySelector("h1")?.textContent).toBe(defaultHeading);

    expect(helpDialog?.querySelectorAll("th")).toHaveLength(3);
    expect(helpDialog?.querySelectorAll("tbody tr")).toHaveLength(0);
});
