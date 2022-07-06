import { c2mChart } from "../src/c2mChart";
import { SUPPORTED_CHART_TYPES } from "../src/types";

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Move at boundaries - single line plot", () => {
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

    expect(setTimeout).toHaveBeenCalledTimes(0);

    // Move left while at far left
    ["ArrowLeft", "ArrowUp", "ArrowDown", "PageUp", "PageDown"].forEach(
        (key) => {
            mockElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key
                })
            );
            expect(chart.getCurrent()).toStrictEqual({
                group: "",
                stat: "",
                point: {
                    x: 0,
                    y: 1
                }
            });

            expect(setTimeout).toHaveBeenCalledTimes(0);
        }
    );

    // Go to end
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "End"
        })
    );
    expect(chart.getCurrent()).toStrictEqual({
        group: "",
        stat: "",
        point: {
            x: 7,
            y: 3
        }
    });
    jest.advanceTimersByTime(250);
    expect(setTimeout).toHaveBeenCalledTimes(1);

    // Move right while at far right
    mockElement.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "ArrowRight"
        })
    );
    expect(chart.getCurrent()).toStrictEqual({
        group: "",
        stat: "",
        point: {
            x: 7,
            y: 3
        }
    });
    jest.advanceTimersByTime(250);
    expect(setTimeout).toHaveBeenCalledTimes(1);
});

test("Move at boundaries - grouped and stat'd", () => {
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
    expect(setTimeout).toHaveBeenCalledTimes(1);

    [
        {
            key: "ArrowLeft",
            point: {
                group: "a",
                stat: "",
                point: { x: 1, y: { high: 10, low: 8 } }
            },
            timer: 1
        },
        {
            key: "ArrowUp",
            point: {
                group: "a",
                stat: "",
                point: { x: 1, y: { high: 10, low: 8 } }
            },
            timer: 1
        },
        {
            // High
            key: "ArrowDown",
            point: {
                group: "a",
                stat: "high",
                point: { x: 1, y: { high: 10, low: 8 } }
            },
            timer: 2
        },
        {
            // Low
            key: "ArrowDown",
            point: {
                group: "a",
                stat: "low",
                point: { x: 1, y: { high: 10, low: 8 } }
            },
            timer: 3
        },
        {
            // Can't move
            key: "ArrowDown",
            point: {
                group: "a",
                stat: "low",
                point: { x: 1, y: { high: 10, low: 8 } }
            },
            timer: 3
        },
        {
            // Can't move
            key: "PageUp",
            point: {
                group: "a",
                stat: "low",
                point: { x: 1, y: { high: 10, low: 8 } }
            },
            timer: 3
        },
        {
            // Change to group B
            key: "PageDown",
            point: { group: "b", stat: "", point: { x: 1, y: 11 } },
            timer: 4
        },
        {
            // Can't move
            key: "PageDown",
            point: { group: "b", stat: "", point: { x: 1, y: 11 } },
            timer: 4
        }
    ].forEach(({ key, point, timer }) => {
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", {
                key
            })
        );
        expect(chart.getCurrent()).toStrictEqual(point);
        jest.advanceTimersByTime(250);
        expect(setTimeout).toHaveBeenCalledTimes(timer);
    });
});
