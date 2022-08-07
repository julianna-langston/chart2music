import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

let counter = 0;
let lastIndex = -1;
let lastCategory = "";

const onFocusCallback = ({
    slice,
    index
}: {
    slice: string;
    index: number;
}) => {
    counter++;
    lastCategory = slice;
    lastIndex = index;
};

beforeEach(() => {
    counter = 0;
    lastIndex = -1;
    lastCategory = "";
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
            onFocusCallback,
            enableSound: false,
            enableSpeech: false
        }
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);

    expect(counter).toBe(1);
    expect(lastCategory).toBe("");
    expect(lastIndex).toBe(1);
});

test("Movement for a grouped chart", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
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
            onFocusCallback,
            enableSound: false
        }
    });
    expect(err).toBe(null);

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
    expect(counter).toBe(1);
    expect(lastCategory).toBe("a");
    expect(lastIndex).toBe(1);

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(counter).toBe(2);
    expect(lastCategory).toBe("b");
    expect(lastIndex).toBe(1);
});
