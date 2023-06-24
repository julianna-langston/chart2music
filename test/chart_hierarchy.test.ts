import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import { MockAudioEngine } from "./_mockAudioEngine";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

const audioEngine = new MockAudioEngine();

const title = "Example hierarchy";

const data = {
    root: [
        { x: 0, xLabel: "a", y: 1, children: "a" },
        { x: 1, xLabel: "b", y: 2, children: "b" },
        { x: 2, xLabel: "c", y: 3, children: "c" }
    ],
    a: [{ x: 0, xLabel: "aa", y: 10 }],
    b: [{ x: 0, xLabel: "ba", y: 10 }],
    c: [{ x: 0, xLabel: "ca", y: 10 }]
};

test("Basic treemap example", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type: SUPPORTED_CHART_TYPES.TREEMAP,
        title,
        data,
        element: mockElement,
        cc: mockElementCC,
        audioEngine,
        options: {
            root: "root"
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toEqual(
        `Sonified hierarchical treemap chart "${title}", on root level, x is "" from 0 to 2, y is "" from 0 to 3. Use arrow keys to navigate. Use Alt + Up and Down to navigate between levels. Press H for more hotkeys.`
    );

    [
        {
            press: { key: " " },
            text: "root, a, 1, has children",
            frequency: 220,
            panning: -0.98
        },
        {
            press: { key: "ArrowRight" },
            text: "b, 2, has children",
            frequency: 932,
            panning: 0
        },
        {
            press: { altKey: true, key: "ArrowDown" },
            text: "b, ba, 10",
            frequency: 3951,
            panning: 0
        }
    ].forEach(({ press, text, frequency, panning }) => {
        mockElement.dispatchEvent(new KeyboardEvent("keydown", press));
        jest.advanceTimersByTime(250);
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(text);
        expect(audioEngine.lastFrequency).toBeCloseTo(frequency, 0);
        expect(audioEngine.lastPanning).toBeCloseTo(panning);
        audioEngine.reset();
    });

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toEqual(
        `Sonified hierarchical treemap chart "${title}", on level 1, x is "" from 0 to 0, y is "" from 0 to 10. Use arrow keys to navigate. Use Alt + Up and Down to navigate between levels. Press H for more hotkeys.`
    );

    [
        {
            press: { key: "ArrowUp", altKey: true },
            // Confirmed that going up returns to previous pointIndex
            text: "root, b, 2, has children",
            frequency: 932,
            panning: 0
        },
        {
            press: { key: "ArrowRight" },
            text: "c, 3, has children",
            frequency: 3951,
            panning: 0.98
        },
        {
            press: { key: "ArrowDown", altKey: true },
            text: "c, ca, 10",
            frequency: 3951,
            panning: 0
        },
        {
            press: { key: "PageUp", altKey: true },
            text: "root, c, 3, has children",
            frequency: 3951,
            panning: 0.98
        }
    ].forEach(({ press, text, frequency, panning }) => {
        mockElement.dispatchEvent(new KeyboardEvent("keydown", press));
        jest.advanceTimersByTime(250);
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(text);
        expect(audioEngine.lastFrequency).toBeCloseTo(frequency, 0);
        expect(audioEngine.lastPanning).toBeCloseTo(panning);
        audioEngine.reset();
    });
});
