/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";
import type { c2mCrosshairType } from "../src/types";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

let counter = 0;
let lastIndex = -1;
let lastCategory = "";
let lastX = -1;
let lastY: number | number[] | undefined = -1;
let lastY2: number | undefined = -1;

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

const onCrosshairCallback = ({ x, y, y2 }: c2mCrosshairType) => {
    lastX = x;
    lastY = y;
    lastY2 = y2;
};

beforeEach(() => {
    counter = 0;
    lastIndex = -1;
    lastCategory = "";
    lastX = -1;
    lastY = -1;
    lastY2 = -1;
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
            onCrosshairCallback,
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
    expect(lastX).toBe(1);
    expect(lastY).toBe(2);
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
            onCrosshairCallback,
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
    expect(lastX).toBe(2);
    expect(lastY).toBe(2);

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
    expect(lastX).toBe(2);
    expect(lastY).toBe(12);
});

test("Move around for weird data", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: {
            a: [
                { x: 1, high: 10, low: 8 },
                { x: 2, high: 11, low: 9 },
                { x: 3, high: 12, low: 10 }
            ],
            b: [
                { x: 1, y2: 11 },
                { x: 2, y2: 12 },
                { x: 3, y2: 13 }
            ]
        },
        element: mockElement,
        cc: mockElementCC,
        options: {
            onFocusCallback,
            onCrosshairCallback,
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
    expect(lastCategory).toBe("a");
    expect(lastIndex).toBe(1);
    expect(lastX).toBe(2);
    expect(lastY).toEqual([11, 9]);
    expect(lastY2).toBeUndefined();

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
    expect(lastX).toBe(2);
    expect(lastY).toBeUndefined();
    expect(lastY2).toBe(12);
});
