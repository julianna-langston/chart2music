import { c2mChart } from "../src/c2mChart";

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

let counter = 0;
let lastIndex = -1;
let lastCategory = "";
let lastPoint: unknown = {};

const onFocusCallback = ({
    slice,
    index,
    point
}: {
    slice: string;
    index: number;
    point: unknown;
}) => {
    counter++;
    lastCategory = slice;
    lastIndex = index;
    lastPoint = point;
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
        type: "line",
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
    expect(counter).toBe(1);

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);

    expect(counter).toBe(2);
    expect(lastCategory).toBe("");
    expect(lastIndex).toBe(1);
    expect(lastPoint).toEqual({
        x: 1,
        y: 2
    });
});

test("Movement for a grouped chart", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: "line",
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
    expect(counter).toBe(1);

    // Confirm that a summary was generated
    expect(mockElementCC.textContent?.length).toBeGreaterThan(10);

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    jest.advanceTimersByTime(250);
    expect(counter).toBe(2);
    expect(lastCategory).toBe("a");
    expect(lastIndex).toBe(1);
    expect(lastPoint).toEqual({
        x: 2,
        y: 2
    });

    // Move right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "PageDown"
        })
    );
    jest.advanceTimersByTime(250);
    expect(counter).toBe(3);

    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: " "
        })
    );
    jest.advanceTimersByTime(250);
    expect(counter).toBe(4);
    expect(lastCategory).toBe("b");
    expect(lastIndex).toBe(1);
    expect(lastPoint).toEqual({
        x: 2,
        y: 12
    });
});
