import { c2mChart } from "../src/c2mChart";
import { MockAudioEngine } from "./_mockAudioEngine";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

const audioEngine = new MockAudioEngine();

const title = "Example hierarchy";

const valueLabels = ["a", "b", "c", "aa", "ba", "ca"];

const data = {
    root: [
        { x: 0, y: 1, children: "a" },
        { x: 1, y: 2, children: "b" },
        { x: 2, y: 3, children: "c" }
    ],
    a: [{ x: 3, y: 10 }],
    b: [{ x: 4, y: 10 }],
    c: [{ x: 5, y: 10 }]
};

test("Basic treemap example", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type: "treemap",
        title,
        data,
        axes: {
            x: {
                valueLabels
            }
        },
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
    expect(mockElementCC.textContent).toContain(
        `Sonified hierarchical chart with 4 groups titled "Example hierarchy". Treemap chart showing "root". X is "" from a to c. Y is "" from 0 to 3. Use arrow keys to navigate. Use Alt + Up and Down to navigate between levels. Press H for more hotkeys.`
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

    // Try to drill down to children that don't exist. Should handle the error condition.
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", { altKey: true, key: "ArrowDown" })
    );
    jest.advanceTimersByTime(250);
    expect(audioEngine.playCount).toBe(0);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.lastElementChild?.textContent?.trim()).toEqual(
        `Sonified hierarchical chart with 4 groups titled "${title}". Treemap chart showing "b". X is "" from ba to ba. Y is "" from 0 to 10. Use arrow keys to navigate. Use Alt + Up and Down to navigate between levels. Press H for more hotkeys.`
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

    const lastText = "root, c, 3, has children";

    // Keystrokes that should be ignored
    [
        { key: "PageDown" },
        { key: "PageUp" },
        { key: "PageUp", altKey: true },
        { key: "ArrowUp", altKey: true }
    ].forEach((press) => {
        mockElement.dispatchEvent(new KeyboardEvent("keydown", press));
        jest.advanceTimersByTime(250);
        expect(mockElementCC.lastElementChild?.textContent?.trim()).toBe(
            lastText
        );
        expect(audioEngine.playCount).toBe(0);
        audioEngine.reset();
    });

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", { altKey: true, key: "ArrowDown" })
    );
    jest.advanceTimersByTime(250);
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", { altKey: true, key: "ArrowDown" })
    );
    jest.advanceTimersByTime(250);
});
